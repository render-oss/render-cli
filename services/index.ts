import { APIClient } from "../api/index.ts";
import { Log } from "../deps.ts";
import { APIError } from "../errors.ts";
import { Service } from "../_openapi/generated/index.ts";

export type UnresolvedLocator = 
  | {
    name: string,
    teamId: string,
  } 
  // TODO: enable locate-by-slug
  // | {
  //   slug: string,
  // }
  | {
    id: string,
  };

export async function resolveLocatorToService(
  api: APIClient,
  locator: UnresolvedLocator,
): Promise<Service> {
  let service: Service | null = null;

  if ('id' in locator) {
    const resp = await api.services.getServiceRaw({ serviceId: locator.id });
    if (resp.raw.ok) {
      service = await resp.value();
    }
  } else if ('name' in locator) {
    const resp = await api.services.getServices({
      name: [locator.name],
    });

    const validService = resp.find(svc => svc.service.)
  }
}
