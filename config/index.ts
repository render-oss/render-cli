import { Log, YAML, } from "../deps.ts";
import { ajv } from "../util/ajv.ts";
import { getPaths } from "../util/paths.ts";
import { APIKeyRequired, RenderCLIError } from '../errors.ts';

import { ALL_REGIONS, Region } from "./types/enums.ts";
import { assertValidRegion } from "./types/enums.ts";
import { ConfigAny, ConfigLatest, ProfileLatest, RuntimeConfiguration, RuntimeProfile } from "./types/index.ts";
import { getLogger, NON_INTERACTIVE } from "../util/logging.ts";

const CONFIG_VERSION_WARN_ENV_VAR = "RENDERCLI_CONFIG_IGNORE_UPGRADE";

let config: RuntimeConfiguration | null = null;

function upgradeConfigs(cfg: ConfigAny): ConfigLatest {
  switch (cfg.version) {
    case 1:
      return {
        ...cfg,
        version: 2,
      };
    case 2: // == ConfigLatest
      return cfg;
  }
}

const FALLBACK_PROFILE: Partial<ProfileLatest> = {
  defaultRegion: 'oregon', // mimics dashboard behavior
};

export const FALLBACK_CONFIG: ConfigLatest = {
  version: 2,
  profiles: {},
}

export async function getConfig(): Promise<RuntimeConfiguration> {
  if (config === null) {
    const cfg = await fetchAndParseConfig();

    const runtimeProfile = await buildRuntimeProfile(cfg);
    const ret: RuntimeConfiguration = {
      fullConfig: cfg,
      ...runtimeProfile,
    }

    config = ret;
  }

  return config;
}

export async function withConfig<T>(fn: (cfg: RuntimeConfiguration) => T | Promise<T>): Promise<T> {
  const cfg = await getConfig();

  return fn(cfg);
}

async function parseConfig(content: string): Promise<ConfigLatest> {
  const data = await YAML.load(content);
  const ret = {
    ...FALLBACK_CONFIG,
    // deno-lint-ignore no-explicit-any
    ...(data as any),
  };

  await ajv.validate(ConfigAny, ret);
  if (!ajv.errors) {
    const upgraded = upgradeConfigs(ret as ConfigAny);

    if (ret.version !== upgraded.version) {
      const warnOnUpgrade = await Deno.env.get(CONFIG_VERSION_WARN_ENV_VAR);
      if (warnOnUpgrade !== '1') {
        const logger = await getLogger();
        logger.warning('Your Render CLI configuration file appears to be out of date. We don\'t upgrade your');
        logger.warning('configuration file automatically in case you need to revert to an older version, but');
        logger.warning('we also can\'t guarantee permanent forward compatibility for old configuration files.');
        logger.warning('');
        logger.warning('Please run `render config upgrade` to update it automatically to the most recent');
        logger.warning('configuration file format.');
        logger.warning('');
        logger.warning('If you don\'t want to upgrade and don\'t want to see this message, you can set the');
        logger.warning(`${CONFIG_VERSION_WARN_ENV_VAR} environment variable to "1".`);
      }
    }

    return upgraded;
  }

  throw new Error(`Config validation error: ${Deno.inspect(ajv.errors)}`);
}

async function fetchAndParseConfig(): Promise<ConfigLatest> {
  const path = getPaths().configFile;

  try {
    const decoder = new TextDecoder();
    const content = decoder.decode(await Deno.readFile(path));
    return parseConfig(content);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return FALLBACK_CONFIG;
    }

    throw err;
  }
}

async function getProfileCredentials(profile: ProfileLatest): Promise<string> {
  const apiKeyOverride = await Deno.env.get("RENDERCLI_APIKEY");

  if (apiKeyOverride) {
    return apiKeyOverride;
  }

  if (typeof(profile.apiKey) === 'string') {
    return profile.apiKey;
  }

  const cmd = profile.apiKey.run;

  const process = Deno.run({
    cmd,
    stdout: 'piped',
    stderr: 'inherit',
    stdin: NON_INTERACTIVE ? 'null' : 'inherit',
  });

  const { code } = await process.status();
  if (code != 0) {
    throw new RenderCLIError(`CLI credentials runner failed. \`${cmd.join(' ')}\` exit code: ${code}`);
  }

  const output = await process.output();
  const decoder = new TextDecoder();
  const apiKey = decoder.decode(output).trim();

  return apiKey;
}

async function buildRuntimeProfile(
  cfg: ConfigLatest,
): Promise<{ profile: RuntimeProfile, profileName: string }> {
  const logger = await getLogger();
  const profileFromEnv = await Deno.env.get("RENDERCLI_PROFILE");
  const profileName = profileFromEnv ?? 'default';
  logger.debug(`Using profile '${profileName}' (env: ${profileFromEnv})`);
  const profile = cfg.profiles[profileName] ?? {};

  const ret: RuntimeProfile = {
    ...FALLBACK_PROFILE,
    ...profile,
    apiKey: await getProfileCredentials(profile),
    apiHost: await Deno.env.get("RENDERCLI_APIHOST") ?? profile.apiHost,
  };

  const actualRegion = await Deno.env.get("RENDERCLI_REGION") ?? ret.defaultRegion;
  assertValidRegion(actualRegion);
  // TODO: clean this up - the assertion should be making the cast unnecessary, but TS disagrees
  ret.defaultRegion = actualRegion as Region;

  if (!ret.apiKey) {
    throw new APIKeyRequired();
  }

  return { profile: ret, profileName };
}

export function validateRegion(s: string): Region {
  if (!ajv.validate(Region, s)) {
    throw new Error(`Invalid region '${s}'. Valid regions: ${ALL_REGIONS.join(' ')}`);
  }

  return s as Region;
}
