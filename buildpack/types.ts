import { type Static, Type } from "../deps.ts";

// `v4` is the assumed value of any buildpack until we change it.
export const RenderBuildpackFile = Type.Object({
  version: Type.Optional(Type.Literal('v4')),
  buildpacks: Type.Array(Type.String(), { minItems: 1 }),
});
export type RenderBuildpackFile = Static<typeof RenderBuildpackFile>;
