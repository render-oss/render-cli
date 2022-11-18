// we are deep in "dealing with untyped data" territory here. hopefully
// we can get riud of stuff like this once we have a typed API client.
//
// deno-lint-ignore-file no-explicit-any
export function getAtPath(path: string | Array<string>, obj: Record<string, any>): any {
  const p =
    typeof(path) === 'string'
      ? path.split('.')
      : path;

  let curr = obj;
  while (p.length > 0) {
    curr = curr[p.shift()!];
  }

  return curr;
}
