import { YAML,  } from "../deps.ts";
import { ajv } from "../util/ajv.ts";
import { identity } from "../util/fn.ts";
import { getPaths } from "../util/paths.ts";
import { ALL_REGIONS, Region } from "./types/enums.ts";
import { assertValidRegion } from "./types/enums.ts";
import { ConfigAny, ConfigLatest, ProfileLatest, RuntimeConfiguration } from "./types/index.ts";

let config: RuntimeConfiguration | null = null;

// TODO: smarten this up with type checks
const CONFIG_UPGRADE_MAPS = {
  1: identity,
}
const FALLBACK_PROFILE: ProfileLatest = {
  defaultRegion: 'oregon', // mimics dashboard behavior
};

const FALLBACK_CONFIG: ConfigLatest = {
  version: 1,
  profiles: {},
}

export async function getConfig(): Promise<RuntimeConfiguration> {
  if (config === null) {
    const cfg = await fetchAndParseConfig();

    const runtimeProfile = buildRuntimeProfile(cfg);
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

function upgradeConfigFile(config: ConfigAny): ConfigLatest {
  const upgradePath = CONFIG_UPGRADE_MAPS[config.version];

  if (!upgradePath) {
    throw new Error(`Unrecognized version, cannot upgrade (is render-cli too old?): ${config.version}`);
  }

  return upgradePath(config);
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
    return upgradeConfigFile(ret as ConfigAny);
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

function buildRuntimeProfile(cfg: ConfigLatest): { profile: ProfileLatest, profileName: string } {
  const profileName = Deno.env.get("RENDERCLI_PROFILE") ?? 'default';
  const profile = cfg.profiles[profileName] ?? {};

  const ret = {
    ...FALLBACK_PROFILE,
    ...profile,
  }

  const actualRegion = Deno.env.get("RENDERCLI_REGION") ?? ret.defaultRegion;
  assertValidRegion(actualRegion);
  // TODO: clean this up - the assertion should be making the cast unnecessary
  ret.defaultRegion = actualRegion as Region;

  ret.apiKey = Deno.env.get("RENDERCLI_APIKEY") ?? ret.apiKey;
  ret.apiHost = Deno.env.get("RENDERCLI_APIHOST") ?? ret.apiHost;

  return { profile: ret, profileName };
}

export function validateRegion(s: string): Region {
  if (!ajv.validate<Region>(Region, s)) {
    throw new Error(`Invalid region '${s}'. Valid regions: ${ALL_REGIONS.join(' ')}`);
  }

  return s;
}
