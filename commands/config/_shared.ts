import { ALL_REGIONS, Region } from "../../config/types/enums.ts";
import { ConfigLatest, ProfileLatest } from "../../config/types/index.ts";
import { Cliffy, Log, YAML } from "../../deps.ts";
import { RenderCLIError } from "../../errors.ts";

export async function requestProfileInfo(): Promise<ProfileLatest> {
  const resp = await Cliffy.prompt([
    {
      name: 'region',
      message: "What is this profile's default region?",
      type: Cliffy.Select,
      options: ALL_REGIONS,
      default: 'oregon',
      hint: "You can access any region with the CLI; this'll just save you some typing."
    },
    {
      name: 'apiKey',
      message: 'Provide your API key from the Dashboard:',
      label: "API key",
      type: Cliffy.Secret,
      minLength: 32,
      hint: "This will begin with `rnd_` and be 32 characters long."
    } 
  ]);

  // should never be hit, but Cliffy doesn't have a way to specify that apiKey
  // won't be falsy or zero-length.
  if (!resp.apiKey) {
    throw new RenderCLIError("No api key provided; exiting.");
  }

  return {
    defaultRegion: (resp.region ?? 'oregon') as Region,
    apiKey: resp.apiKey,
  };
}

export async function writeProfile(logger: Log.Logger, configFile: string, cfg: ConfigLatest) {
  logger.debug(`writing config to '${configFile}'`);
  await Deno.writeTextFile(configFile, YAML.dump(cfg));
  await chmodConfigIfPossible(logger, configFile);
}

export async function chmodConfigIfPossible(logger: Log.Logger, configFile: string) {
  if (Deno.build.os === 'windows') {
    logger.warning(`Deno does not currently support file permissions on Windows. As such,`);
    logger.warning(`'${configFile}' has user-level default permissions. On single-user`);
    logger.warning(`systems, this is fine. On multi-user systems, you may wish to further`);
    logger.warning(`secure your Render credentials.`)
    logger.warning('');
    logger.warning('See https://rndr.in/windows-file-acl for potential solutions.');
  } else {
    logger.debug(`chmod '${configFile}' to 600`);
    await Deno.chmod(configFile, 0o600);
  }
}
