import { Typebox } from "./deps.ts";
import { ajv } from './util/ajv.ts';

export class RenderCLIError extends Error {

}

export class InitRequiredError extends RenderCLIError {
  constructor(msg: string) {
    super(`${msg}; run 'render config init' to create a config file.`);
  }
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

export class APIKeyRequired extends RenderCLIError {
  constructor() {
    super(
      'No API key found. Please set the RENDERCLI_APIKEY environment variable or run `render config init`.',
    );
  }
}

export class ValidationFailed extends RenderCLIError {
  constructor(schema: Typebox.TSchema, errors: typeof ajv.errors) {
    super(
      `Error validating object of type ${schema.title ?? schema.$id ?? 'unknown'}: ` +
      "\n\n" + 
      (errors ?? []).map(error => ajv.errorsText([error])).join("\n")
    );
  }
}
