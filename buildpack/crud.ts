import { ForceRequiredError } from "../errors.ts";
import { pathExists } from "../util/paths.ts";
import { DOCKERFILE_TEMPLATE } from "./templates/dockerfile_template.ts";
import { RenderBuildpackFile } from "./types.ts";

export async function initDockerfile(path: string, force: boolean) {
  const f = `${path}/Dockerfile.render`;
  if (await pathExists(f) && !force) {
    throw new ForceRequiredError('Dockerfile.render already exists and no --skip-dockerfile');
  }

  await Deno.writeTextFile(f, DOCKERFILE_TEMPLATE);
}

export async function initBuildpacksFile(path: string, buildpacks: Array<string>, force: boolean) {
  const f = `${path}/.render-buildpacks.json`;
  if (await pathExists(f) && !force) {
    throw new ForceRequiredError('.render-buildpacks.json already exists');
  }

  const bpFile: RenderBuildpackFile = {
    version: 'v4',
    buildpacks,
  };

  const json = JSON.stringify(bpFile, null, 2);
  await Deno.writeTextFile(f, json);
}
