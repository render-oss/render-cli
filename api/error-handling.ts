import { Log } from "../deps.ts";
import { getPaths } from "../util/paths.ts";

export async function handleApiErrors<T>(logger: Log.Logger, fn: () => Promise<T>): Promise<T> {
  try {
    // for clarity: you almost never do `return await` but if we don't, the try-catch won't fire
    return await fn();
  } catch (err) {
    const configFile = (await getPaths()).configFile;

    if (err instanceof DOMException) {
      // TODO:  can this be better?
      //        DOMException.code is deprecated and not very useful. I assume these are relatively safe.
      if (err.message.includes("404")) {
          logger.error('Command received a 404 Not Found. This usually means that')
          logger.error('no resource could be found with a given name or ID. If you')
          logger.error('used a resource ID directly, e.g. `srv-12345678`, please check')
          logger.error('it for correctness. If you used a resource name or slug, it\'s')
          logger.error('likely that we couldn\'t find a resource so named.');
      } else if (err.message.includes("401")) {
          logger.error('Command received a 401 Unauthorized. This usually means that')
          logger.error('you haven\'t provided credentials to the Render API or the credentials')
          logger.error('are incorrect. Please check your API key in your config file,')
          logger.error(`stored at '${configFile}', and refresh it or add it if need be.`)
      } else if (err.message.includes("403")) {
          logger.error('Command received a 403 Forbidden. This usually means that while')
          logger.error('you have made a request with valid Render credentials, the API')
          logger.error('doesn\'t think you have access to that resource. Check to make sure')
          logger.error('you\'re using the right profile and that your user account is a member')
          logger.error('of the correct team.');
      }
    } else {
      logger.error("Unrecognized error: " + JSON.stringify(err, null, 2));
    }

    throw err;
  }
}
