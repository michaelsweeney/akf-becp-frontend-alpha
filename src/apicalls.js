const url = "https://akf-becp-pyapi.herokuapp.com/";




export const ref_bldg_to_berdo_type = {
  "SecondarySchool": 'education',
  "MediumOffice": 'office',
  "PrimarySchool": 'education',
  "RetailStripmall": 'retail',
  "QuickServiceRestaurant": 'food_sales_service',
  "SmallHotel": 'lodging',
  "MidriseApartment": 'multifamily_housing',
  "Warehouse": 'storage',
  "RetailStandalone": 'retail',
  "SmallOffice": 'office',
  "FullServiceRestaurant": 'food_sales_service',
  "LargeOffice": 'office',
  "LargeHotel": 'lodging',
  "Hospital": 'healthcare',
  "Outpatient": 'healthcare',
  "HighriseApartment": 'multifamily_housing'
};


export const ref_bldg_to_ll97_type = {
  "SecondarySchool": "E",
  "MediumOffice": "B_norm",
  "PrimarySchool": "E",
  "RetailStripmall": "B_norm",
  "QuickServiceRestaurant": "B_norm",
  "SmallHotel": "R1",
  "MidriseApartment": "R2",
  "Warehouse": "S",
  "RetailStandalone": "B_norm",
  "SmallOffice": "B_norm",
  "FullServiceRestaurant": "B_norm",
  "LargeOffice": "B_norm",
  "LargeHotel": "B_norm",
  "Hospital": "B_health",
  "Outpatient": "B_health",
  "HighriseApartment": "R2"
};


async function getProjectionFromReferenceBuildings(alternates, callback) {


  // take first element design_areas, convert for ll97 & berdo thresholds
  let berdo_types = alternates[0]['design_areas'].map(e => {
    return {
      type: ref_bldg_to_berdo_type[e['type']], area: e['area']
    }
  })


  let ll97_types = alternates[0]['design_areas'].map(e => {
    return {
      type: ref_bldg_to_ll97_type[e['type']], area: e['area']
    }
  })

  // dummy utilities for now (should move this entire thing out of this function and pull fuels based on actual refbuilding results)
  let berdo_parameters = {
    types: berdo_types,
    utilities: [
      { type: 'electricity', val: 0 }
    ]
  }
  let ll97_parameters = {
    types: ll97_types,
    utilities: [
      { type: 'electricity', val: 100000 }
    ]
  }

  let projection_results = [];

  async function getQueryResults(params, subdirectory) {
    let endpoint = `${url}/${subdirectory}?params=${JSON.stringify(params)}`;
    let response = await fetch(endpoint, {})
    let resjson = await response.json()
    return resjson
  }

  for (const alt of alternates) {
    let r = await getQueryResults(alt, 'get_projection_from_reference_buildings')
    projection_results.push(r)
  }

  let berdo_results = await getQueryResults(berdo_parameters, '/compliance/compile_berdo_summary')
  let ll97_results = await getQueryResults(ll97_parameters, '/compliance/compile_ll97_summary')

  let compiled_results = {
    case_results: projection_results,
    ll97_results: ll97_results,
    berdo_results: berdo_results
  }

  console.log(compiled_results)
  callback(compiled_results)
}


async function getQueryNoParameters(sub) {
  let endpoint = `${url}/${sub}`;
  let response = await fetch(endpoint, {})
  let resjson = await response.json()
  return resjson
}




export { getQueryNoParameters, getProjectionFromReferenceBuildings };
