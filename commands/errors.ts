export class RenderCLIError extends Error {

}

export class ForceRequiredError extends RenderCLIError {
  constructor(msg: string) {
    super(`${msg}; pass --force to do this anyway.`);
  }
}

export class PathNotFound extends RenderCLIError {
  constructor (
    path: string,
    cause: Deno.errors.NotFound,
  ) {
    super(`path '${path}' not found or not readable.`, { cause });
  }
}

export class RepoNotFound extends RenderCLIError {
  constructor (
    name: string,
  ) {
    super(`Repo '${name}' not found.`);
  }
}
