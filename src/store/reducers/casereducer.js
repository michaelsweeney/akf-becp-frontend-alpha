const initialState = {
  case_inputs: [
    {
      name: "Electric Resistance",
      state: "MA",
      climate_zone: "5A",
      projection_case: "MidCase",
      design_areas: [
        {
          type: "MediumOffice",
          area: 200000,
          heating_fuel: "Electricity",
          dhw_fuel: "Electricity",
          heating_cop: 1,
          dhw_cop: 1,
          ashrae_standard: "90.1-2016",
        },
        {
          type: "MediumOffice",
          area: 10000,
          heating_fuel: "Electricity",
          dhw_fuel: "Electricity",
          heating_cop: 1,
          dhw_cop: 1,
          ashrae_standard: "90.1-2016",
        },
      ],
    },
    {
      name: "Electric HP",
      state: "MA",
      climate_zone: "5A",
      projection_case: "MidCase",
      design_areas: [
        {
          type: "MediumOffice",
          area: 200000,
          heating_fuel: "Electricity",
          dhw_fuel: "Electricity",
          heating_cop: 3,
          dhw_cop: 3,
          ashrae_standard: "90.1-2016",
        },
        {
          type: "MediumOffice",
          area: 10000,
          heating_fuel: "Electricity",
          dhw_fuel: "Electricity",
          heating_cop: 3,
          dhw_cop: 3,
          ashrae_standard: "90.1-2016",
        },
      ],
    },
    {
      name: "Gas Boilers",
      state: "MA",
      climate_zone: "5A",
      projection_case: "MidCase",
      design_areas: [
        {
          type: "MediumOffice",
          area: 200000,
          heating_fuel: "Natural Gas",
          dhw_fuel: "Natural Gas",
          heating_cop: 0.8,
          dhw_cop: 0.8,
          ashrae_standard: "90.1-2016",
        },
        {
          type: "MediumOffice",
          area: 10000,
          heating_fuel: "Natural Gas",
          dhw_fuel: "Natural Gas",
          heating_cop: 0.8,
          dhw_cop: 0.8,
          ashrae_standard: "90.1-2016",
        },
      ],
    },
  ],

  case_results: [],
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
        case_results: action.payload,
      };
    }

    default:
      return state;
  }
}
