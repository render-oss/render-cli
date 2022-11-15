import {
  Static,
  Type
} from '../../deps.ts';
import { Region } from "./enums.ts";

export const APIKeyV1 = Type.String({
  pattern: 'rnd_[0-9a-zA-Z\_]+',
  description: "Your Render API key. Will begin with 'rnd_'.",
});
export type APIKeyV1 = Static<typeof APIKeyV1>;

export const ProfileV1 = Type.Object({
  apiKey: APIKeyV1,
  apiHost: Type.Optional(Type.String()),
  defaultRegion: Region,
});
export type ProfileV1 = Static<typeof ProfileV1>;

export const ConfigV1 = Type.Object({
  version: Type.Literal(1),
  sshPreserveHosts: Type.Optional(Type.Boolean({
    description: "If true, render-cli will not keep ~/.ssh/known_hosts up to date with current public keys.",
  })),
  profiles: Type.Record(Type.String(), ProfileV1),
});
export type ConfigV1 = Static<typeof ConfigV1>;
