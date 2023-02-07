import { assertEquals } from "../deps.ts";
import {
  findUp,
} from './find-up.ts';

function f(path: string) {
  Deno.writeFileSync(path, new Uint8Array());
}

Deno.test('findUp', async (t) => {
  const root = Deno.makeTempDirSync({
    prefix: 'find-up-test-',
  });

  Deno.mkdirSync(`${root}/a/b/c/d/e/f`, { recursive: true });
  Deno.mkdirSync(`${root}/a/b/c/X/Y/Z`, { recursive: true });
  Deno.mkdirSync(`${root}/1/2/3/4/5/6/abc`, { recursive: true });
  Deno.mkdirSync(`${root}/1/abc`, { recursive: true });

  f(`${root}/a/b/c/d/e/f/package.json`);
  f(`${root}/a/b/c/package.json`);
  f(`${root}/1/2/3/4/abc`);

  await t.step('should find a file in the current directory', async () => {
    const ret = await findUp(`${root}/a/b/c/d/e/f`, 'package.json');
    assertEquals(ret, `${root}/a/b/c/d/e/f/package.json`);
  });

  await t.step('should traverse upwards to find a file', async () => {
    const ret = await findUp(`${root}/a/b/c/d/e`, 'package.json');
    assertEquals(ret, `${root}/a/b/c/package.json`);
  });

  await t.step('should iterate multiple start paths', async () => {
    const ret = await findUp([`${root}/1/2/3/4/5/6`, `${root}/a/b/c/d/e`], 'package.json');
    assertEquals(ret, `${root}/a/b/c/package.json`);
  });

  await t.step('should skip directories when opts.searchFor === "files"', async () => {
    const ret = await findUp(`${root}/1/2/3/4/5/6`, 'abc', { searchFor: 'files' });
    assertEquals(ret, `${root}/1/2/3/4/abc`);
  });

  await t.step('should skip files when opts.searchFor === "directories"', async () => {
    const ret = await findUp(`${root}/1/2/3/4/5`, 'abc', { searchFor: 'directories' });
    assertEquals(ret, `${root}/1/abc`);
  });

  await t.step('should return null when no file is found', async () => {
    const ret = await findUp(`${root}/a/b/c/d/e`, 'does-not-exist');
    assertEquals(ret, null);
  });

  Deno.remove(root, { recursive: true });
});
