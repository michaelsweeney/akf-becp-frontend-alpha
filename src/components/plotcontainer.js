import * as d3 from "d3";
import { useRef, useEffect } from "react";

import { conn } from "../store/connect";

const PlotContainer = (props) => {
  const container = useRef(null);
  let { case_outputs } = props.cases;

  console.log(case_outputs);
  useEffect(() => {
    createChart();
  });

  const createChart = () => {
    let node = container.current;

    let svg = d3
      .select(node)
      .selectAll("svg")
      .data([0])
      .join("svg")
      .attr("width", 500)
      .attr("height", 500);

    svg
      .selectAll("rect")
      .data([0, 1, 2])
      .join("rect")
      .attr("width", 20)
      .attr("height", 20)
      .attr("x", 1)
      .attr("y", 2)
      .attr("fill", "red");
  };
  return <div style={{ height: "100%", width: "100%" }} ref={container}></div>;
};

const mapStateToProps = (store) => {
  return {
    actions: { ...store.actions },
    cases: { ...store.cases },
  };
};

export default conn(mapStateToProps)(PlotContainer);
