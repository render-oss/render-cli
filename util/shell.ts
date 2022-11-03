import { RenderCLIError } from "../errors.ts";

export async function simpleRun(cmd: Array<string>, msgOnFail?: string): Promise<string> {
    const process = Deno.run({
      cmd,
      stderr: 'null',
      stdout: 'piped',
    });
    const code = (await process.status()).code;
    if (code != 0) {
      throw new RenderCLIError(
        `${msgOnFail ?? 'Command failed.'} \`${cmd.join(' ')}\` exit code: ${code}`
      )
    }

    const arr = await process.output();
    return (new TextDecoder()).decode(arr);
}
