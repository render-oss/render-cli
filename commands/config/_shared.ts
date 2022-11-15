import { ALL_REGIONS, Region } from "../../config/types/enums.ts";
import { ProfileLatest } from "../../config/types/index.ts";
import { Cliffy } from "../../deps.ts";
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
