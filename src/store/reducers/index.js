import { combineReducers } from "redux";

import uiReducer from "./uireducer";
import caseReducer from "./casereducer";

const rootReducer = combineReducers({
  ui: uiReducer,
  cases: caseReducer,
});

export default rootReducer;
