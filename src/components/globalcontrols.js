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
import * as api from "../apicalls";
import { SingleSelect } from "./singleselect";
import { StorefrontRounded } from "@mui/icons-material";

const useStyles = makeStyles({
  root: {},

  selectContainer: {
    margin: 15,
    width: 200,
  },
});

const GlobalControls = (props) => {
  let { case_inputs } = props;

  const plot_config = props.plot_config;

  let state = case_inputs[0]["state"];
  let climate_zone = case_inputs[0]["climate_zone"];
  let projection_case = case_inputs[0]["projection_case"];
  let building_type = case_inputs[0]["design_areas"][0]["type"];
  let ashrae_standard = case_inputs[0]["design_areas"][0]["ashrae_standard"];

  const {
    states,
    climate_zones,
    coefficient_cases,
    ashrae_standards,
    building_types,
  } = api;

  const classes = useStyles();

  const updateResults = () => {
    api.getProjectionFromReferenceBuildings(
      case_inputs,
      props.actions.setCaseResults,
      props.actions.setIsLoading
    );
  };

  useEffect(() => {
    updateResults();
  }, [case_inputs]);

  const handleStateCallback = (e) => {
    props.actions.setGlobalCaseParameters(["state", e.target.value]);
    // updateResults();
  };

  const handleBuildingTypeCallback = (e) => {
    props.actions.setGlobalCaseParameters(["building_type", e.target.value]);
    // updateResults();
  };

  const handleClimateZoneCallback = (e) => {
    props.actions.setGlobalCaseParameters(["climate_zone", e.target.value]);
    // updateResults();
  };

  const handleCambiumCaseCallback = (e) => {
    props.actions.setGlobalCaseParameters(["projection_case", e.target.value]);
    // updateResults();
  };

  const handleASHRAEStandardCallback = (e) => {
    props.actions.setGlobalCaseParameters(["ashrae_standard", e.target.value]);
    // updateResults();
  };
  const handleThresholdTypeSelector = (p) => {
    props.actions.setThresholdView(p.target.value);
  };
  return (
    <div>
      <SingleSelect
        optionvalues={building_types}
        id="building-type-selector"
        value={building_type}
        label="Reference Building Type"
        callback={handleBuildingTypeCallback}
      />
      <SingleSelect
        optionvalues={states}
        id="state-selector"
        value={state}
        label="State"
        callback={handleStateCallback}
      />

      <SingleSelect
        optionvalues={climate_zones}
        id="climate-zone-case-selector"
        value={climate_zone}
        label="Climate Zone"
        callback={handleClimateZoneCallback}
      />
      <SingleSelect
        optionvalues={ashrae_standards}
        id="ashrae-standard-case-selector"
        value={ashrae_standard}
        label="ASHRAE Standards"
        callback={handleASHRAEStandardCallback}
      />

      <SingleSelect
        optionvalues={coefficient_cases}
        id="cambium-case-selector"
        value={projection_case}
        label="Elec-GHG Coefficient Case"
        callback={handleCambiumCaseCallback}
      />
      <SingleSelect
        id="threshold-type-selector"
        label="Threshold Overlay"
        callback={handleThresholdTypeSelector}
        value={plot_config.thresholdView}
        optionvalues={["none", "berdo", "ll97"]}
        optiontitles={["None", "BERDO", "LL97"]}
      />
    </div>
  );
};

const mapStateToProps = (store) => {
  return {
    case_inputs: store.case_inputs.case_inputs,
    plot_config: store.plot_config,
  };
};

export default conn(mapStateToProps)(GlobalControls);
