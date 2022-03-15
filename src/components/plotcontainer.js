import * as d3 from "d3";
import { color } from "d3";
import { useRef, useEffect } from "react";

import { conn } from "../store/connect";


const d3Join = (parent, element, classname) => d3.select(parent).selectAll('.' + parent).data([0]).join(element).attr('class', classname)

const PlotContainer = (props) => {
  const container = useRef(null);
  let { case_results } = props.cases;


  useEffect(() => {
    createChart();
  });

  const createChart = () => {
    let node = container.current;
    let colorScale = d3.schemeTableau10;

    /*
       ----------------------------------------------------------------------
       GENERAL DIMENSIONS AND AESTHETICS
       ----------------------------------------------------------------------
       */

    let margins = {
      t: 50,
      b: 50,
      r: 50,
      l: 50,
    };

    let containerdims = {
      width: node
        ? node.getBoundingClientRect()["width"]
        : props.window.dims.width - 200,
      height: node
        ? node.getBoundingClientRect()["height"]
        : props.window.dims.height - 225,
    };

    let chartdims = {
      width: containerdims.width - margins.l - margins.r,
      height: containerdims.height - margins.t - margins.b,
    };

    let svg = d3
      .select(node)
      .selectAll("svg")
      .data([0])
      .join("svg")
      .attr("width", containerdims.width)
      .attr("height", containerdims.height);


    let emissions_projections = case_results.map(d => d['emissions_projection'])

    d3.select(node).selectAll('svg').data([0]).join('svg')

    let plotg = svg.selectAll('.plot-g').data([0]).join('g').attr('class', 'plot-g').attr('transform', `translate(${margins.l},${margins.t})`)

    let annotationg = svg.selectAll('.annotation-g').data([0]).join('g').attr('class', 'annotation-g')
    let xaxisg = svg.selectAll('.x-axis-g').data([0]).join('g').attr('class', 'x-axis-g').attr('transform', `translate(${margins.l},${margins.t + chartdims.height})`)
    let yaxisg = svg.selectAll('.y-axis-g').data([0]).join('g').attr('class', 'y-axis-g').attr('transform', `translate(${margins.l},${margins.t})`)


    let domain_x = [2022, 2050]

    let y_padding = 1.2

    const getMaxYValue = (arr, key) => {
      let max = 0;
      arr.forEach(ar => {
        let vals = ar.map(e => e[key])
        max = d3.max([max, d3.max(vals)])
      })
      return max * y_padding
    }

    let domain_y = [getMaxYValue(emissions_projections, 'kg_co2_per_sf'), 0]

    let xScale = d3.scaleTime().range([0, chartdims.width]).domain(domain_x)
    let yScale = d3.scaleLinear().range([0, chartdims.height]).domain(domain_y)

    let xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"))
    let yAxis = d3.axisLeft().scale(yScale).ticks(5)

    xaxisg.call(xAxis)
    yaxisg.call(yAxis)

    let lineGen = d3.line()
      .x(d => xScale(d['year']))
      .y(d => yScale(d['kg_co2_per_sf']))

    plotg.selectAll('.data-line')
      .data(emissions_projections)
      .join('path')
      .attr('class', 'data-line')
      .attr('d', lineGen)
      .attr('fill', 'none')
      .attr('stroke', (d, i) => colorScale[i])
      .attr('stroke-width', 3)
  };

  return <div style={{
    height: "calc(100vh - 200px)", width: "calc(100vw - 100px)"
  }} ref={container}></div>;
};

const mapStateToProps = (store) => {
  return {
    actions: { ...store.actions },
    cases: { ...store.cases },
  };
};

export default conn(mapStateToProps)(PlotContainer);

