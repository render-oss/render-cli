// deno-lint-ignore-file no-explicit-any
import { Log, QueryString } from "../deps.ts";

import { RuntimeConfiguration } from "../config/types/index.ts";
import { VERSION } from "../version.ts";
import { apiHost, apiKeyOrThrow } from "./config.ts";
import { handleApiErrors } from "./error-handling.ts";

function queryStringify(query: Record<string, any>) {
  return QueryString.stringify(query, {
    arrayFormat: 'comma',
  });
}

let apiReqCount = 0;

export function getRequestRaw(
  logger: Log.Logger,
  cfg: RuntimeConfiguration,
  path: string,
  query: Record<string, any> = {},
): Promise<Response> {
  return handleApiErrors(logger, async () => {
    const reqNumber = apiReqCount++;
    const authorization = `Bearer ${apiKeyOrThrow(cfg)}`;

    if (!path.startsWith("/")) {
      path = "/" + path;
    }

    const url = `https://${apiHost(cfg)}/v1${path}?${queryStringify(query)}`;

    logger.debug(`api dispatch: ${reqNumber}: url ${url} (query: ${JSON.stringify(query)})`);

    const response = await fetch(url, {
      headers: {
        authorization,
        'user-agent': `Render CLI/${VERSION}`,
        accept: 'application/json',
      },
    });
    if (!response.ok) {
      // this kind of has to be a DOMException because it encapsulates the notion of NetworkError
      // and we don't want to special-case WebSocketStream errors separately. Deno "is a browser",
      // in its mind, so this makes some sense.
      logger.error(`api error ${reqNumber}: ${JSON.stringify(response.json())}`);
      throw new DOMException(`Error calling ${url}: ${response.status} ${response.statusText}`);
    }

    return response;
  });
}

export async function getRequestJSON<T = unknown>(
  logger: Log.Logger,
  cfg: RuntimeConfiguration,
  path: string,
  query: Record<string, any> = {},
): Promise<T> {
  const resp = await getRequestRaw(logger, cfg, path, query);

  return resp.json();
}

export async function getRequestJSONList<T = unknown>(
  logger: Log.Logger,
  cfg: RuntimeConfiguration,
  dataKey: string,
  path: string,
  query: Record<string, any> = {},
): Promise<Array<T>> {
  let cursor: string | null = null;
  const limit = Deno.env.get("RENDERCLI_LIST_LIMIT") ?? 100;
  
  let acc: Array<T> = [];

  let iter = 0;
  while (true) {
    iter += 1;
    const q: typeof query = {
      limit,
      ...query,
    };

    logger.debug(`Query #${iter} with cursor: ${cursor}`);

    if (cursor) {
      q.cursor = cursor;
    }

    // without using `dataKey` as a unique symbol (not reasonable here) we're kind of
    // stuck with an 'any', since we're pretty far out of type-safety land right now.
    const list = await getRequestJSON<Array<any>>(logger, cfg, path, q);
    const items = list.map(i => i[dataKey]);

    acc = [
      ...acc,
      ...items,
    ];
    logger.debug(`Query #${iter} returned ${list.length} items. Acc now ${acc.length} items.`);

    if (list.length === 0) {
      break;
    }

    cursor = list[list.length - 1].cursor;
  }

  return acc;
}
