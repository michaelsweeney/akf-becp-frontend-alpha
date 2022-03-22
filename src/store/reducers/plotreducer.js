const initialState = {
  /* 
  activePlot enduse options:
    - stacked
    - multiline
  */
  activePlot: "multiline",
  stackedAreaIndex: 0,
  thresholdView: "none",
};

export default function plotReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_PLOT_CONFIG": {
      return {
        ...action.payload,
      };
    }

    case "SET_ACTIVE_PLOT": {
      return {
        ...state,
        activePlot: action.payload,
      };
    }
    case "SET_STACKED_AREA_INDEX": {
      return {
        ...state,
        stackedAreaIndex: action.payload,
      };
    }
    case "SET_THRESHOLD_VIEW": {
      return {
        ...state,
        thresholdView: action.payload,
      };
    }

    default:
      return state;
  }
}
