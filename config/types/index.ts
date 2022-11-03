import { Type } from "../../deps.ts";
import { ConfigV1, ProfileV1 } from './v1.ts';

export type ConfigAny =
  | ConfigV1;
export const ConfigAny = Type.Union([
  ConfigV1,
]);

export type ConfigLatest = ConfigV1;
export const ConfigLatest = ConfigV1;

export type ProfileLatest = ProfileV1;
export const ProfileLatest = ProfileV1;

export type UpgradeFn<T> = (cfg: T) => ConfigLatest;

export type RuntimeConfiguration = {
  fullConfig: ConfigLatest;
  profileName: string;
  profile: ProfileLatest;
}
