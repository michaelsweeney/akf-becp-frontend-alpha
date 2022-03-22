const initialState = {
  case_inputs: [
    {
      name: "Electric HP",
      state: "NY",
      climate_zone: "5A",
      projection_case: "MidCase",
      design_areas: [
        {
          type: "HighriseApartment",
          area: 200000,
          heating_fuel: "Electricity",
          dhw_fuel: "Electricity",
          heating_cop: 3,
          dhw_cop: 3,
          ashrae_standard: "90.1-2016",
        },
      ],
    },
    {
      name: "Electric Res",
      state: "NY",
      climate_zone: "5A",
      projection_case: "MidCase",
      design_areas: [
        {
          type: "HighriseApartment",
          area: 200000,
          heating_fuel: "Electricity",
          dhw_fuel: "Electricity",
          heating_cop: 1,
          dhw_cop: 1,
          ashrae_standard: "90.1-2016",
        },
      ],
    },
    {
      name: "Gas Boilers",
      state: "NY",
      climate_zone: "5A",
      projection_case: "MidCase",
      design_areas: [
        {
          type: "HighriseApartment",
          area: 200000,
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

    case 'SET_GLOBAL_CASE_PARAMETERS': {

      let key = action.payload[0]
      let val = action.payload[1]

      let modified_inputs = [...state.case_inputs]
      state.case_inputs.forEach((c, i) => {

        if (key == 'building_type') {
          modified_inputs[i]['design_areas'][0]['type'] = val
        }

        else if (key == 'ashrae_standard') {
          modified_inputs[i]['design_areas'][0]['ashrae_standard'] = val
        }
        else {
          modified_inputs[i][key] = val
        }
      })

      console.log(modified_inputs)
      return {
        ...state,
        modified_inputs
      }
    }

    default:
      return state;
  }
}
