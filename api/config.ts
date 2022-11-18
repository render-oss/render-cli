import { RuntimeConfiguration } from "../config/types/index.ts";
import { APIKeyRequired } from "../errors.ts";

export function apiKeyOrThrow(cfg: RuntimeConfiguration): string {
  if (!cfg.profile.apiKey) {
    throw new APIKeyRequired();
  }

  return cfg.profile.apiKey;
}

export function apiHost(cfg: RuntimeConfiguration) {
  return cfg.profile.apiHost ?? "api.render.com";
}
