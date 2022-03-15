const url = "https://akf-becp-pyapi.herokuapp.com/";

function getProjectionFromReferenceBuildings(params, callback) {
  let endpoint = `${url}/get_projection_from_reference_buildings?params=${JSON.stringify(
    params
  )}`;

  fetch(endpoint, {})
    .then((response) => {
      return response.json();
    })
    .then((d) => {
      callback(d);
    });
}

export { getProjectionFromReferenceBuildings };
