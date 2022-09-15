// no good deno git library yet. :(

export async function listRemotes(args: { cwd?: string, https?: boolean }): Promise<Record<string, string>> {
  const process = await Deno.run({
    cmd: ['git', 'remote', '-v'],
    cwd: args.cwd ?? Deno.cwd(),
    stdin: 'null',
    stdout: 'piped',
  });

  const decoder = new TextDecoder();
  const lines =
    decoder.decode(await process.output())
      .split("\n").map(i => i.trim());

  const ret: Record<string, string> = {};

  lines.forEach(line => {
    const [name, url] = line.split(/[\ \t]/).filter(i => i);
    
    if (!name || !url) {
      return;
    }

    ret[name] = gitUrlToHttpsUrl(url);
  });

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
