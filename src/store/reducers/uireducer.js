const initialState = {
  dims: {
    height: window.innerHeight,
    width: window.innerWidth,
  },
  isLoading: false,
};

export default function uiReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_WINDOW_DIMENSIONS": {
      return {
        ...state,
        dims: action.payload,
      };
    }

    case "SET_IS_LOADING": {
      return {
        ...state,
        isLoading: action.payload
      }
    }
    default:
      return state;
  }
}