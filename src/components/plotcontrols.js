import { conn } from "../store/connect";

import {
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  root: {},

  selectContainer: {
    margin: 15,
    width: 200,
  },
});

const PlotControls = (props) => {
  const { plot_config, cases } = props;
  const classes = useStyles();

  const handlePlotTypeSelectChange = (p) => {
    props.actions.setActivePlot(p.target.value);
  };

  const handleThresholdTypeSelector = (p) => {
    props.actions.setThresholdView(p.target.value);
  };
  const handleStackedIndexSelector = (p) => {
    props.actions.setStackedAreaIndex(p.target.value);
  };
  return (
    <div>
      <div className={classes.selectContainer}>
        <FormControl fullWidth>
          <InputLabel id="plot-type-selector">Plot Type</InputLabel>
          <Select
            labelId="plot-type-selector"
            value={plot_config.activePlot}
            label="Plot Type"
            onChange={handlePlotTypeSelectChange}
          >
            <MenuItem value="multiline">Multi-Line</MenuItem>
            <MenuItem value="stacked">Stacked by Fuel</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className={classes.selectContainer}>
        <FormControl fullWidth>
          <InputLabel id="threshold-type-selector">
            Threshold Overlay
          </InputLabel>
          <Select
            labelId="threshold-type-selector"
            value={plot_config.thresholdView}
            label="Threshold Type Selector"
            onChange={handleThresholdTypeSelector}
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="berdo">BERDO</MenuItem>
            <MenuItem value="ll97">LL97</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className={classes.selectContainer}>
        <FormControl fullWidth>
          <InputLabel id="stacked-index-selector">
            Stacked Index Selector
          </InputLabel>
          <Select
            labelId="stacked-index-selector"
            value={plot_config.stackedAreaIndex}
            label="Threshold Type Selector"
            onChange={handleStackedIndexSelector}
          >
            {cases.case_inputs.map((e, i) => {
              return (
                <MenuItem key={i} value={i}>
                  {e.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
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

export default conn(mapStateToProps)(PlotControls);
