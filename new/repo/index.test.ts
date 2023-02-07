import { assertEquals } from "https://deno.land/std@0.151.0/testing/asserts.ts";
import { verboseLogging } from "../../util/logging.ts";
import { pathExists } from "../../util/paths.ts";
import { templateNewProject, writeExampleBlueprint } from "./index.ts";

// TODO: tests DO pass, but currently leak resources from the `tgz` dep and we should remove it
//       uncomment once fixed (n.b.: this is not a problem in the CLI itself, just the tests)
//       Also be aware of GitHub API rate limiting when running tests.

// TODO: add tests for 'resolveTemplateIdentifier' when not just github
// TODO: add tests for `force` option
// Deno.test("repo from-template", async (t) => {
//   const root = await Deno.makeTempDir();
//   const outputDir = `${root}/output`;

//   await templateNewProject({
//     identifier: "sveltekit",
//     outputDir,
//   });

//   assertEquals(true, !!(await pathExists(`${outputDir}/render.yaml`)));

//   await Deno.remove(root, { recursive: true });

// });

// Deno.test("blueprint from-template", async (t) => {
//   const root = Deno.makeTempDirSync();
//   const repoDir = `${root}/output`;

//   await Deno.mkdir(repoDir);
//   const proc = Deno.run({
//     cmd: [ 'git', 'init' ],
//     cwd: repoDir,
//   });
//   const success = (await proc.status()).success;
//   assertEquals(true, success);

//   await writeExampleBlueprint({
//     identifier: "sveltekit",
//     repoDir,
//   });

//   assertEquals(true, !!(await pathExists(`${repoDir}/render.yaml`)));

//   await Deno.remove(root, { recursive: true });
// });
