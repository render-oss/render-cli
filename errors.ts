import { RuntimeConfiguration } from "./config/types/index.ts";
import { Typebox } from "./deps.ts";
import { ajv } from './util/ajv.ts';

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

export class APIKeyRequired extends RenderCLIError {
  constructor(cfg: RuntimeConfiguration) {
    super(`Config profile '${cfg.profileName}' does not have an API key set.`);
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

export class APIError extends RenderCLIError {}
