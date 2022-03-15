const initialState = {
  case_inputs: {
    state: "NY",
    climate_zone: "4A",
    projection_case: "MidCase",
    design_areas: [
      {
        type: "SmallOffice",
        area: 200000,
        heating_fuel: "Electricity",
        dhw_fuel: "Electricity",
        heating_cop: 2.5,
        dhw_cop: 2.5,
        ashrae_standard: "90.1-2013",
      },
      {
        type: "MediumOffice",
        area: 10000,
        heating_fuel: "Natural Gas",
        dhw_fuel: "Natural Gas",
        heating_cop: 0.8,
        dhw_cop: 0.8,
        ashrae_standard: "90.1-2007",
      },
    ],
  },
  case_outputs: {},
};

export default function buildingReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_CASE_INPUTS": {
      return {
        ...state,
        case_inputs: action.payload,
      };
    }
    case "SET_CASE_RESULTS": {
      return {
        ...state,
        case_outputs: action.payload,
      };
    }

    default:
      return state;
  }
}
