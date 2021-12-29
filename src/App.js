import React, { useEffect } from "react";
import "./App.css";
import { conn } from "./store/connect";

import { makeStyles } from "@material-ui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import InputTable from "./components/inputtable";
import { Input } from "@material-ui/core";

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
  app: {
    // height: "100vh",
    // width: "100vw",
    // minWidth: 900,
    // boxSizing: "border-box",
    // overflow: "hidden",
  },
});

const App = (props) => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.app}>
        <InputTable />
      </div>
    </ThemeProvider>
  );
};

const mapStateToProps = (store) => {
  return {
    actions: { ...store.actions },
  };
};

export default conn(mapStateToProps)(App);
