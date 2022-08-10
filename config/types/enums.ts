import {
  Static,
  Type
} from '../../deps.ts';
import { ajv } from "../../util/ajv.ts";

export const Region = Type.Union([
  Type.Literal('singapore'),
  Type.Literal('oregon'),
  Type.Literal('ohio'),
  Type.Literal('frankfurt'),
]);
export type Region = Static<typeof Region>;
export const ALL_REGIONS = Region.anyOf.map(i => i.const);

export function assertValidRegion(s: string): asserts s is Region {
  if (!ajv.validate<Region>(Region, s)) {
    throw new Error(`Region '${s}' is not one of: ${ALL_REGIONS.join(' ')}`);
  }
}
