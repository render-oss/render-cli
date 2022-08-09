import { Ajv, AjvFormats, Log } from "../deps.ts";

// @ts-ignore esm.sh compile weirdness; typecheck is correct.
export const ajv = AjvFormats(new Ajv({
  allErrors: true,
}), [
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
