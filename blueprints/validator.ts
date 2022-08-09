import { ajv } from "../util/ajv.ts";

import RenderYAMLSchema from '../_data/render.schema.json' assert { type: 'json' };
import { AjvErrorObject, YAML } from "../deps.ts";


export type ValidateSchemaArgs =
  | { path: string }
  | { content: string }
  | { object: unknown }
  ;

export type ValidateSchemaRetDetails = {
  jsonSchema?: Array<AjvErrorObject>,
}
  
export type ValidateSchemaRet =
  | [false, ValidateSchemaRetDetails]
  | [true, null]
  ;

export async function validateSchema(args: ValidateSchemaArgs): Promise<ValidateSchemaRet> {
  if ('path' in args) {
    const decoder = new TextDecoder();
    const content = decoder.decode(await Deno.readFile(args.path));
    return validateSchema({ content });
  }

  if ('content' in args) {
    const object = YAML.load(args.content);
    return validateSchema({ object });
  }

  const isValid = ajv.validate(RenderYAMLSchema, args.object);
  if (isValid) {
    return [true, null];
  }

  return [false, { jsonSchema: ajv.errors ?? [] }];
}
