import React, { useEffect, useState } from "react";
import "./App.css";
import { conn } from "./store/connect";

import { makeStyles } from "@material-ui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import * as api from "./apicalls";
import * as d3 from "d3";
import PlotContainer from "./components/plotcontainer";
import PlotControls from "./components/plotcontrols";

const theme = createTheme({
  palette: {
    secondary: {
      main: "#cf202e",
    },
    primary: {
      main: "#283759",
    },
  },
});

const useStyles = makeStyles({
  app: {},
  main: {
    display: "block",
    height: "calc(100vh)",
    width: "calc(100vw)",
  },
  left: {
    display: "inline-block",
    width: "300px",
    height: "100%",
    verticalAlign: "top",
  },
  right: {
    display: "inline-block",
    width: "calc(100% - 300px)",
    height: "100%",
    verticalAlign: "top",
  },
  rightTop: {
    height: "calc(100% - 200px)",
  },
  rightBottom: { height: "200px", verticalAlign: "top" },
});

const App = (props) => {
  const classes = useStyles();
  let { case_inputs, case_results } = props.cases;

  // handle resize
  useEffect(() => {
    const handleResize = () => {
      props.actions.setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [props.actions]);

  const handleCaseChange = (results) => {
    props.actions.setCaseResults(results);
  };

  const handleRawInputChange = (p) => {
    console.log(p.target.innerHTML);
    let input_obj = JSON.parse(p.target.innerHTML);
    console.log(input_obj);
    props.actions.setCaseInputs(input_obj);
    // api.getProjectionFromReferenceBuildings(input_obj, handleCaseChange);
  };

  useEffect(() => {
    api.getProjectionFromReferenceBuildings(case_inputs, handleCaseChange);
  }, [case_inputs]);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.app}>
        <a
          target="_blank"
          rel="noopener"
          href="https://akf-becp-pyapi.herokuapp.com/"
        >
          api
        </a>

        <div className={classes.main}>
          <div className={classes.left}>
            <pre onBlur={handleRawInputChange} contentEditable="true">
              {JSON.stringify(case_inputs, undefined, 2)}
            </pre>
          </div>
          <div className={classes.right}>
            <div className={classes.rightTop}>
              <PlotContainer />
            </div>
            <div className={classes.rightBottom}>
              <PlotControls />
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </ThemeProvider>
  );
};

const mapStateToProps = (store) => {
  return {
    actions: { ...store.actions },
    cases: { ...store.cases },
  };
};

export default conn(mapStateToProps)(App);
