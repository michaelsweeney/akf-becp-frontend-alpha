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

/* general ui actions */
export function setWindowDimensions(dims) {
  return {
    type: "SET_WINDOW_DIMENSIONS",
    payload: dims,
  };
}

export function setIsLoading(bool) {
  return {
    type: "SET_IS_LOADING",
    payload: bool,
  };
}

/* plot config options */
export function setPlotConfig(config) {
  return {
    type: "SET_PLOT_CONFIG",
    payload: config,
  };
}

export function setActivePlot(val) {
  return {
    type: "SET_ACTIVE_PLOT",
    payload: val,
  };
}

export function setStackedAreaIndex(val) {
  return {
    type: "SET_STACKED_AREA_INDEX",
    payload: val,
  };
}

export function setThresholdView(val) {
  return {
    type: "SET_THRESHOLD_VIEW",
    payload: val,
  };
}


export function setGlobalCaseParameters(obj) {
  return {
    type: 'SET_GLOBAL_CASE_PARAMETERS',
    payload: obj
  }
}



