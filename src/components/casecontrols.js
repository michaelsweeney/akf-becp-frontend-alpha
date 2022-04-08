import { conn } from "../store/connect";

import {
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Input,
  Checkbox,
} from "@mui/material";

import { makeStyles } from "@material-ui/styles";
import { useEffect, useState } from "react";
import * as api from "../apicalls";
import { SingleSelect } from "./singleselect";
import { FocusInput } from "./focusinput";
import { SettingsBluetoothRounded } from "@mui/icons-material";

const useStyles = makeStyles({
  root: {},

  selectContainer: {
    // margin: 15,
    // width: 200,
  },
  table: {
    "&&& td": {
      //   paddingTop: 5,
      padding: 5,
    },
  },
});

const templates = [
  {
    tag: "elec_ashp",
    name: "Air Source HP",
    heating_fuel: "Electricity",
    heating_cop: 3,
  },
  {
    tag: "elec_resistance",
    name: "Electric Resistance",
    heating_fuel: "Electricity",
    heating_cop: 1,
  },
  {
    tag: "ng_furnace",
    name: "NG Heating",
    heating_fuel: "Natural Gas",
    heating_cop: 0.8,
  },
];

const CaseControls = (props) => {
  const classes = useStyles();
  const { cases, plot_config } = props;
  const updateResults = () => {
    api.getProjectionFromReferenceBuildings(
      props.cases.case_inputs,
      props.actions.setCaseResults,
      props.actions.setIsLoading
    );
  };
  const handleChangeHeatingAndDomesticCOP = (idx, cop) => {
    props.actions.setCaseHeatingAndDomesticCOP({
      idx,
      cop,
    });
    updateResults();
  };

  const handleChangeHeatingAndDomesticFuelSource = (idx, source) => {
    props.actions.setCaseHeatingAndDomesticFuelSource({ idx, source });
    updateResults();
  };

  const handleChangeName = (idx, name) => {
    props.actions.setCaseName({ idx, name });
    updateResults();
  };

  const handleChangeHeatingTemplate = (idx, template) => {
    let template_values = templates.find((d) => d.tag === template);

    let { name, heating_fuel, heating_cop } = template_values;
    console.log(idx, name, heating_fuel, heating_cop);
    props.actions.setCaseHeatingTemplate({ idx, template });
    props.actions.setCaseName({ idx, name });
    props.actions.setCaseHeatingAndDomesticFuelSource({
      idx: idx,
      source: heating_fuel,
    });
    props.actions.setCaseHeatingAndDomesticCOP({
      idx: idx,
      cop: heating_cop,
    });

    updateResults();
  };

  const handleChangeIsDisplayed = (idx, bool) => {
    props.actions.setCaseIsDisplayed({ idx, bool });
    updateResults();
  };

  return (
    <div>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Display Case</TableCell>
            <TableCell>Case Name</TableCell>
            <TableCell>Template</TableCell>
            <TableCell>Heating Fuel</TableCell>
            <TableCell>Heating COP</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cases.case_inputs.map((c, i) => {
            return (
              <TableRow key={`tablerow-${i}`}>
                <TableCell sx={{ textAlign: "center" }}>
                  <FormControl size="small">
                    <Checkbox
                      onChange={() =>
                        handleChangeIsDisplayed(i, !c.is_displayed)
                      }
                      checked={c.is_displayed}
                    />
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl size="small" fullWidth>
                    <FocusInput
                      callback={(e) => handleChangeName(i, e)}
                      value={c.name}
                      inputType="text"
                    />
                  </FormControl>
                </TableCell>

                <TableCell>
                  <FormControl size="small" fullWidth>
                    <Select
                      onChange={(e) => {
                        handleChangeHeatingTemplate(i, e.target.value);
                      }}
                      value={c.starting_template}
                      //   label="template"
                    >
                      {templates.map((e, i) => {
                        return (
                          <MenuItem key={`template-${i}`} value={e.tag}>
                            {e.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </TableCell>

                <TableCell>
                  <FormControl size="small" fullWidth>
                    <Select
                      onChange={(e) =>
                        handleChangeHeatingAndDomesticFuelSource(
                          i,
                          e.target.value
                        )
                      }
                      value={c.design_areas[0].heating_fuel}
                    >
                      <MenuItem value="Electricity">Electricity</MenuItem>
                      <MenuItem value="Natural Gas">Natural Gas</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl size="small" fullWidth>
                    <FocusInput
                      callback={(e) => handleChangeHeatingAndDomesticCOP(i, e)}
                      value={c.design_areas[0].heating_cop}
                      inputType="number"
                    />
                  </FormControl>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
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

export default conn(mapStateToProps)(CaseControls);
