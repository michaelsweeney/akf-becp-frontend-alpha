/* building actions */
export function doSomething(idx) {
  return {
    type: "DO_SOMETHING",
    payload: idx,
  };
}
