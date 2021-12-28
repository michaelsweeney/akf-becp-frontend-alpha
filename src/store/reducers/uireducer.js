const initialState = {};

export default function uiReducer(state = initialState, action) {
  switch (action.type) {
    case "DO_SOMETHING": {
      return {
        ...state,
      };
    }

    default:
      return state;
  }
}
