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

const useStyles = makeStyles({
  root: {},

  selectContainer: {
    // margin: 15,
    // width: 200,
  },
});

const handleChangeHeatingAndDomesticCOP = (idx, cop) => {
  console.log(idx, cop);
};

const handleChangeHeatingAndDomesticFuelSource = (idx, source) => {
  console.log(idx, source);
};

const handleChangeName = (idx, name) => {
  console.log(idx, name);
};

const handleChangeHeatingTemplate = (idx, template) => {
  console.log(idx, template);
};

const handleChangeIsDisplayed = (idx, bool) => {
  console.log(idx, bool);
};

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

  console.log(cases);
  console.log(plot_config);

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Display Case</TableCell>
            <TableCell>Case Name</TableCell>
            <TableCell>Template</TableCell>
            <TableCell>Heating COP</TableCell>
            <TableCell>Heating Fuel</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cases.case_inputs.map((c, i) => {
            return (
              <TableRow>
                <TableCell>
                  <Checkbox
                    onChange={() => handleChangeIsDisplayed(i, !c.is_displayed)}
                    checked={c.is_displayed}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    onChange={(e) => handleChangeName(i, e.target.value)}
                    value={c.name}
                  />
                </TableCell>

                <TableCell>
                  <FormControl fullWidth>
                    <Select
                      onChange={(e) => {
                        handleChangeHeatingTemplate(i, e.target.value);
                      }}
                      value={c.starting_template}
                      label="template"
                    >
                      {templates.map((e) => {
                        return <MenuItem value={e.tag}>{e.name}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <Input
                    width="50"
                    onChange={(e) =>
                      handleChangeHeatingAndDomesticCOP(i, e.target.value)
                    }
                    value={c.design_areas[0].heating_cop}
                  />
                </TableCell>
                <TableCell>
                  <FormControl fullWidth>
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
