import { apiHost, apiKeyOrThrow } from "../commands/_helpers.ts";
import { RuntimeConfiguration } from "../config/types/index.ts";
import { APIClient } from "./client.ts";
export * from './client.ts';

export function withAPIClient<T>(cfg: RuntimeConfiguration, fn: (api: APIClient) => T | Promise<T>): T | Promise<T> {
  const host = apiHost(cfg);
  const key = apiKeyOrThrow(cfg);
    
  const api = new APIClient(key, host);

  return fn(api);
}
