import { HEROKU_BUILDPACKS } from "./constants.ts";

export const isHerokuBuildpack = (bp: string) => HEROKU_BUILDPACKS.includes(bp);
export const isGitUrl = (bp: string) => bp.startsWith("https://") && bp.endsWith(".git");
export const isTarball = (bp: string) => bp.startsWith("https://") && (bp.endsWith(".tgz") || bp.endsWith(".tar.gz"));

export function isValidBuildpackEntry(bp: string) {
  return (
    isHerokuBuildpack(bp) ||
    isGitUrl(bp) ||
    isTarball(bp)
  );
}
