export type AppPaths = {
  renderDir: string,
  configFile: string,
  cacheDir: string,
  sshDir: string,
};

export function getPaths(): AppPaths {
  const defaultHome = Deno.env.get("HOME");
  if (!defaultHome) {
    throw new Error("No $HOME env var set.");
  }

  const renderDir = `${defaultHome}/.render`;

  return {
    renderDir,
    configFile: Deno.env.get("RENDERCLI_CONFIG_FILE") ?? `${renderDir}/config.yaml`,
    cacheDir: Deno.env.get("RENDERCLI_CACHE_DIR") ?? `${renderDir}/cache`,
    sshDir: Deno.env.get("RENDERCLI_SSH_DIR") ?? `${defaultHome}/.ssh`,
  };
}


export async function pathExists(
  path: string,
): Promise<Deno.FileInfo | false> {
  try {
    const ret = await Deno.stat(path);
    return ret;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false;
    }

    throw err;
  }
}
