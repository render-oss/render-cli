export async function unwrapAsyncIterator<T>(iter: AsyncIterableIterator<T>): Promise<Array<T>> {
  const ret: Array<T> = [];
  
  // deno-lint-ignore no-explicit-any
  let i: IteratorResult<T, any>;
  do {
    i = await iter.next();
    i.value && ret.push(i.value);
  } while (!i.done);

  return ret;
}
