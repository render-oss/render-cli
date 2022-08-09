import { Ajv, AjvFormats, Log } from "../deps.ts";

// deno-lint-ignore no-explicit-any
export const ajv = AjvFormats(new Ajv({
  allErrors: true,
}) as any, [
  'date-time',
  'time',
  'date',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'uri',
  'uri-reference',
  'uuid',
  'uri-template',
  'json-pointer',
  'relative-json-pointer',
  'regex',
])
  .addKeyword("kind")
  .addKeyword("modifier");

export function logAjvErrors(logger: Log.Logger, errors: typeof ajv.errors) {
  if (!errors) {
    return;
  }

  for (const error of errors) {
    // TODO: ajv default errors aren't great
    logger.error(ajv.errorsText([error]));
  }
}
