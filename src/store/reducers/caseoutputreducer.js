const initialState = {
  case_results: [],
  isLoadingError: false,
};

export default function buildingReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_CASE_RESULTS": {
      if (action.payload === false) {
        return {
          ...state,
          isLoadingError: true,
        };
      } else {
        return {
          ...state,
          case_results: action.payload,
          isLoadingError: false,
        };
      }
    }
    default:
      return state;
  }
}
