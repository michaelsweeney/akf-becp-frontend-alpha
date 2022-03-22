import { conn } from "../store/connect";

import {
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

import { makeStyles } from "@material-ui/styles";
import { useEffect, useState } from "react";
import * as api from '../apicalls'
import { SingleSelect } from "./singleselect";

const useStyles = makeStyles({

  root: {},

  selectContainer: {
    margin: 15,
    width: 200,
  },
});




const ApiControls = (props) => {


  let { case_inputs } = props.cases


  let state = case_inputs[0]['state']
  let climate_zone = case_inputs[0]['climate_zone']
  let projection_case = case_inputs[0]['projection_case']
  let building_type = case_inputs[0]['design_areas'][0]['type']
  let ashrae_standard = case_inputs[0]['design_areas'][0]['ashrae_standard']


  const {
    states,
    climate_zones,
    cambium_cases,
    ashrae_standards,
    building_types
  } = api

  const classes = useStyles();

  const updateResults = () => {
    api.getProjectionFromReferenceBuildings(props.cases.case_inputs, props.actions.setCaseResults, props.actions.setIsLoading);

  }

  const handleStateCallback = (e) => {
    props.actions.setGlobalCaseParameters(['state', e.target.value])
    updateResults()
  }

  const handleBuildingTypeCallback = (e) => {
    props.actions.setGlobalCaseParameters(['building_type', e.target.value])
    updateResults()
  }

  const handleClimateZoneCallback = (e) => {
    props.actions.setGlobalCaseParameters(['climate_zone', e.target.value])
    updateResults()
  }


  const handleCambiumCaseCallback = (e) => {
    props.actions.setGlobalCaseParameters(['projection_case', e.target.value])
    updateResults()
  }

  const handleASHRAEStandardCallback = (e) => {
    props.actions.setGlobalCaseParameters(['ashrae_standard', e.target.value])
    updateResults()
  }


  return (
    <div>
      <SingleSelect
        optionvalues={building_types}
        id='building-type-selector'
        value={building_type}
        label="Reference Building Type"
        callback={handleBuildingTypeCallback}
      />
      <SingleSelect
        optionvalues={states}
        id='state-selector'
        value={state}
        label="State"
        callback={handleStateCallback}
      />

      <SingleSelect
        optionvalues={climate_zones}
        id='climate-zone-case-selector'
        value={climate_zone}
        label="Climate Zone"
        callback={handleClimateZoneCallback}
      />
      <SingleSelect
        optionvalues={ashrae_standards}
        id='ashrae-standard-case-selector'
        value={ashrae_standard}
        label="ASHRAE Standards"
        callback={handleASHRAEStandardCallback}
      />

      <SingleSelect
        optionvalues={cambium_cases}
        id='cambium-case-selector'
        value={projection_case}
        label="Cambium Case"
        callback={handleCambiumCaseCallback}
      />
    </div>
  );
};

const mapStateToProps = (store) => {
  return {
    actions: { ...store.actions },
    cases: { ...store.cases },
    plot_config: { ...store.plot_config },
  };
};

export default conn(mapStateToProps)(ApiControls);
