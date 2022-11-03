import { ALL_REGIONS, Region } from "../../config/types/enums.ts";
import { ProfileLatest } from "../../config/types/index.ts";
import { Cliffy } from "../../deps.ts";

export async function requestProfileInfo(): Promise<ProfileLatest> {
  const resp = await Cliffy.prompt([
    {
      name: 'region',
      message: "What is this profile's default region?",
      type: Cliffy.Select,
      options: ALL_REGIONS,
      default: 'oregon',
    },
    {
      name: 'apiKey',
      message: 'Optionally, provide an API key from the Dashboard:',
      hint: '(leave blank to skip)',
      type: Cliffy.Secret,
    } 
  ]);

  return {
    defaultRegion: (resp.region ?? 'oregon') as Region,
    apiKey: resp.apiKey,
  };
}
