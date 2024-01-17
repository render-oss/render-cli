import { Type } from "../../deps.ts";
import { ConfigV1 } from './v1.ts';
import { ConfigV2, ProfileV2 } from "./v2.ts";

export type ConfigAny =
  | ConfigV1
  | ConfigV2;
export const ConfigAny = Type.Union([
  ConfigV1,
  ConfigV2,
]);

export type ConfigLatest = ConfigV2;
export const ConfigLatest = ConfigV2;

export type ProfileLatest = ProfileV2;
export const ProfileLatest = ProfileV2;

export type UpgradeFn<T> = (cfg: T) => ConfigLatest;

export type RuntimeProfile =
  & Omit<ProfileLatest, 'apiKey'>
  & { apiKey: string };

export type RuntimeConfiguration = {
  fullConfig: ConfigLatest;
  profileName: string;
  profile: RuntimeProfile;
}
