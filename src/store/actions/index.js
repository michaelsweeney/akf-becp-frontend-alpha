/* building actions */
export function setCaseResults(data) {
  return {
    type: "SET_CASE_RESULTS",
    payload: data,
  };
}

export function setCaseInputs(data) {
  return {
    type: "SET_CASE_INPUTS",
    payload: data,
  };
}

export function setWindowDimensions(dims) {
  return {
    type: "SET_WINDOW_DIMENSIONS",
    payload: dims,
  };
}
