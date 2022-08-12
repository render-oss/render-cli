import { NON_INTERACTIVE } from "../../util/logging.ts";

export async function interactivelyEditBlueprint(path: string): Promise<void> {
  if (NON_INTERACTIVE) {
    throw new Error("Not usable in non-interactive mode.");
  }

  throw new Error("TODO: implement");
}