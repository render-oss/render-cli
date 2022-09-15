export async function listRemotes(args: { cwd?: string, https?: boolean }): Promise<Record<string, string>> {
  const process = await Deno.run({
    cmd: ['git', 'remote', '-v'],
    cwd: args.cwd ?? Deno.cwd(),
    stdin: 'null',
    stdout: 'piped',
  });

  const decoder = new TextDecoder();
  const lines = decoder.decode(await process.output()).split("\n");

  const ret: Record<string, string> = {};

  for (const line of lines) {
    console.log("> ", line)
    const [name, ...rest] = line.split(" ").map(s => s.trim());
    console.log(rest);
    const url = rest[0];

    ret[name] =
      args.https
        ? gitUrlToHttpsUrl(url)
        : url;
  }

  return ret;
}

export function gitUrlToHttpsUrl(gitUrl: string) {
  if (gitUrl.startsWith('https://')) {
    return gitUrl;
  }

  const [sshPart, urlPart] = gitUrl.replace("git+ssh://", "").split(':');

  switch (sshPart) {
    case 'git@github.com':
      return `https://github.com/${urlPart}`;
    case 'git@gitlab.com':
      return `https://gitlab.com/${urlPart}`;
    default:
      throw new Error('Unrecognized SSH URL: ' + gitUrl);
  }
}
