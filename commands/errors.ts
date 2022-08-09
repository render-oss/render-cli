export class CLINotFound extends Error {
  constructor (
    path: string,
    cause: Deno.errors.NotFound,
  ) {
    super(`path '${path}' not found or not readable.`, { cause });
  }
}
