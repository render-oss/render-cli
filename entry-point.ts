import { ROOT_COMMAND } from "./commands/index.ts";

await (ROOT_COMMAND.parse(Deno.args));
