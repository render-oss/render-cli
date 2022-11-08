import { ForceRequiredError } from "../errors.ts";
import { ajv, assertType } from "../util/ajv.ts";
import { pathExists } from "../util/paths.ts";
import { DOCKERFILE_TEMPLATE } from "./templates/dockerfile_template.ts";
import { RenderBuildpackFile } from "./types.ts";

const BUILDPACKS_VALIDATOR = ajv.compile<RenderBuildpackFile>(RenderBuildpackFile);

export async function initDockerfile(dir: string, force: boolean) {
  const f = `${dir}/Dockerfile.render`;
  if (await pathExists(f) && !force) {
    throw new ForceRequiredError('Dockerfile.render already exists and no --skip-dockerfile');
  }

  await Deno.writeTextFile(f, DOCKERFILE_TEMPLATE);
}

export async function initBuildpacksFile(dir: string, buildpacks: Array<string>, force: boolean) {
  const f = `${dir}/.render-buildpacks.json`;
  if (await pathExists(f) && !force) {
    throw new ForceRequiredError('.render-buildpacks.json already exists');
  }

  return writeBuildpacksFile(dir, {
    version: 'v4',
    buildpacks,
  });
}

export async function readBuildpacksFile(dir: string): Promise<RenderBuildpackFile> {
  const f = `${dir}/.render-buildpacks.json`;

  const content = JSON.parse(await Deno.readTextFile(f));
  assertType(RenderBuildpackFile, content);

  return content;
}

export async function writeBuildpacksFile(dir: string, content: RenderBuildpackFile) {
  assertType(RenderBuildpackFile, content);

  const f = `${dir}/.render-buildpacks.json`;

  const json = JSON.stringify(content, null, 2);
  await Deno.writeTextFile(f, json);
}
