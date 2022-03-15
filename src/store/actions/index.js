/* building actions */
export function setCaseResults(data) {
  return {
    type: "SET_CASE_RESULTS",
    payload: data,
  };
}

export function setBerdoResults(payload) {
  return {
    type: "SET_BERDO_RESULTS",
    payload: payload,
  };
}

export function setLL97Results(payload) {
  return {
    type: "SET_LL97_RESULTS",
    payload: payload,
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

