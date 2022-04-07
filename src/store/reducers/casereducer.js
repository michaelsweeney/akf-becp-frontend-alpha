const initialState = {
  case_inputs: [
    {
      id: 0,
      is_displayed: true,
      starting_template: "elec_ashp",
      name: "Air Source HP Heating",
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
          ashrae_standard: "90.1-2010",
        },
      ],
    },
    {
      id: 1,
      is_displayed: true,
      starting_template: "elec_resistance",
      name: "Electric Resistance Heating",
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
          ashrae_standard: "90.1-2010",
        },
      ],
    },
    {
      id: 2,
      is_displayed: true,
      starting_template: "ng_furnace",
      name: "NG Heating",
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
          ashrae_standard: "90.1-2010",
        },
      ],
    },
  ],
  case_results: [],
  isLoadingError: false,
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

    case "SET_GLOBAL_CASE_PARAMETERS": {
      let key = action.payload[0];
      let val = action.payload[1];

      let modified_inputs = [...state.case_inputs];
      state.case_inputs.forEach((c, i) => {
        if (key == "building_type") {
          modified_inputs[i]["design_areas"][0]["type"] = val;
        } else if (key == "ashrae_standard") {
          modified_inputs[i]["design_areas"][0]["ashrae_standard"] = val;
        } else {
          modified_inputs[i][key] = val;
        }
      });

      return {
        ...state,
        modified_inputs,
      };
    }

    case "SET_CASE_HEATING_AND_DOMESTIC_COP": {
      let { idx, cop } = action.payload;
      let new_state = { ...state };
      let selected_case = new_state.case_inputs.find((d) => d.id === idx);
      selected_case.design_areas[0].heating_cop = +cop;
      selected_case.design_areas[0].dhw_cop = +cop;
      return {
        ...new_state,
      };
    }

    case "SET_CASE_HEATING_AND_DOMESTIC_FUEL_SOURCE": {
      let { idx, source } = action.payload;
      let new_state = { ...state };
      let selected_case = new_state.case_inputs.find((d) => d.id === idx);
      selected_case.design_areas[0].heating_fuel = source;
      selected_case.design_areas[0].dhw_fuel = source;

      return {
        ...new_state,
      };
    }

    case "SET_CASE_NAME": {
      let { idx, name } = action.payload;
      let new_state = { ...state };
      let selected_case = new_state.case_inputs.find((d) => d.id === idx);
      selected_case.name = name;
      return {
        ...new_state,
      };
    }

    case "SET_CASE_HEATING_TEMPLATE": {
      let { idx, template } = action.payload;
      let new_state = { ...state };
      let selected_case = new_state.case_inputs.find((d) => d.id === idx);
      selected_case.starting_template = template;
      return {
        ...new_state,
      };
    }

    case "SET_CASE_IS_DISPLAYED": {
      let { idx, bool } = action.payload;
      let new_state = { ...state };
      let selected_case = new_state.case_inputs.find((d) => d.id === idx);
      selected_case.is_displayed = bool;
      return {
        ...new_state,
      };
    }

    default:
      return state;
  }
}
