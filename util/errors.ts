// any here lets us use `funcError` in a ternary tree
// deno-lint-ignore no-explicit-any
export function funcError<T = any>(err: Error): T {
  throw err;
}
