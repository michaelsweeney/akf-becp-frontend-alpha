import { combineReducers } from "redux";

import uiReducer from "./uireducer";
import caseReducer from "./casereducer";
import plotReducer from "./plotreducer";

const rootReducer = combineReducers({
  ui: uiReducer,
  cases: caseReducer,
  plot_config: plotReducer,
});

export default rootReducer;
