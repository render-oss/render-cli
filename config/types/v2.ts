import {
  Static,
  Type
} from '../../deps.ts';
import { Region } from "./enums.ts";

export const APIKeyV2 = Type.String({
  pattern: 'rnd_[0-9a-zA-Z\_]+',
  description: "Your Render API key. Will begin with 'rnd_'.",
});
export type APIKeyV2 = Static<typeof APIKeyV2>;

export const APIKeyGetCommand = Type.Object({
  run: Type.String({
    description: 'A command to execute to get the API key. The command should output the API key to stdout.'
  }),
});
export type APIKeyGetCommand = Static<typeof APIKeyGetCommand>;

export const ProfileV2 = Type.Object({
  apiKey: Type.Union([APIKeyV2, APIKeyGetCommand]),
  apiHost: Type.Optional(Type.String()),
  defaultRegion: Region,
});
export type ProfileV2 = Static<typeof ProfileV2>;

export const ConfigV2 = Type.Object({
  version: Type.Literal(2),
  sshPreserveHosts: Type.Optional(Type.Boolean({
    description: "If true, render-cli will not keep ~/.ssh/known_hosts up to date with current public keys.",
  })),
  profiles: Type.Record(Type.String(), ProfileV2),
});
export type ConfigV2 = Static<typeof ConfigV2>;
