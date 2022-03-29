import * as d3 from "d3";

import { HeatPumpIconPath, ElectricityIconPath, GasIconPath } from "./svgicons";

export const createMultiLineChart = (config) => {
  let {
    chartdims,
    margins,
    svg,
    title_g,
    xaxis_g,
    yaxis_g,
    plot_g,
    rightborder_g,
    topborder_g,
    annotation_g,
    legend_g,
    case_results,
    plot_config,
    berdo_thresholds,
    ll97_thresholds,
    xScale,
    yScale,
    emissions_projections,
  } = config;

  let colorScale = d3.schemeTableau10;

  let multiline_legend_icon_svg = [
    HeatPumpIconPath,
    ElectricityIconPath,
    GasIconPath,
  ];
  let legend_padding_top = 50;

  let berdo_color = "black";
  let ll97_color = "black";

  let multiline_g = plot_g
    .selectAll(".multiline-g")
    .data([0])
    .join("g")
    .attr("class", "multiline-g");

  let multiline_ll97_g = plot_g
    .selectAll(".ll97-g")
    .data([0])
    .join("g")
    .attr("class", "ll97-g");

  let multiline_berdo_g = plot_g
    .selectAll(".berdo-g")
    .data([0])
    .join("g")
    .attr("class", "berdo-g");

  let xAxis = d3
    .axisBottom()
    .scale(xScale)
    .ticks(5)
    .tickFormat(d3.format("d"))
    .tickSizeOuter(0);
  let yAxis = d3.axisLeft().scale(yScale).ticks(5).tickSizeOuter(0);

  xaxis_g.call(xAxis);
  yaxis_g.call(yAxis);

  rightborder_g.call(d3.axisRight().scale(yScale).ticks(0).tickSizeOuter(0));
  topborder_g.call(d3.axisTop().scale(xScale).ticks(0).tickSizeOuter(0));

  let lineGen = d3
    .line()
    .x((d) => xScale(d["year"]))
    .y((d) => yScale(d["kg_co2_per_sf"]));

  multiline_g
    .selectAll(".data-line")
    .data(emissions_projections)
    .join("path")
    .attr("class", "data-line")
    .attr("d", lineGen)
    .attr("fill", "none")
    .attr("stroke", (d, i) => colorScale[i])
    .attr("stroke-width", 3);

  multiline_berdo_g
    .selectAll(".berdo-threshold-circle")
    .data(berdo_thresholds[0])
    .join("circle")
    .attr("class", "berdo-threshold-circle")
    .attr("cx", (d) => xScale(d["period"].split("-")[0]))
    .attr("cy", (d) => yScale(d["val"]))
    .attr("r", 5)
    .attr("fill", d3.color(berdo_color).brighter(0.5))
    .attr("stroke", berdo_color);

  multiline_berdo_g
    .selectAll(".berdo-threshold-line")
    .data(berdo_thresholds[0])
    .join("line")
    .attr("class", "berdo-threshold-line")
    .attr("x1", (d) => xScale(d["period"].split("-")[0]) + 8)
    .attr("x2", (d) => xScale(2050))
    .attr("y1", (d) => yScale(d["val"]))
    .attr("y2", (d) => yScale(d["val"]))
    .attr("fill", berdo_color)
    .attr("stroke", berdo_color)
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", 4);

  multiline_ll97_g
    .selectAll(".ll97-threshold-circle")
    .data(ll97_thresholds[0])
    .join("circle")
    .attr("class", "ll97-threshold-circle")
    .attr("cx", (d) => xScale(d["period"].split("-")[0]))
    .attr("cy", (d) => yScale(d["val"]))
    .attr("r", 4)
    .attr("fill", ll97_color);

  multiline_ll97_g
    .selectAll(".ll97-threshold-line")
    .data(ll97_thresholds[0])
    .join("line")
    .attr("class", "ll97-threshold-line")
    .attr("x1", (d) => xScale(d["period"].split("-")[0]))
    .attr("x2", (d) => xScale(2050))
    .attr("y1", (d) => yScale(d["val"]))
    .attr("y2", (d) => yScale(d["val"]))
    .attr("fill", ll97_color)
    .attr("stroke", ll97_color)
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", 4);

  let multiline_legend_g = legend_g
    .selectAll(".multiline-legend-g")
    .data([0])
    .join("g")
    .attr("class", "multiline-legend-g")
    .attr("transform", `translate(0, ${legend_padding_top})`);

  let multiline_legend_icons = multiline_legend_g
    .selectAll(".multiline-legend-icon-g")
    .data(multiline_legend_icon_svg)
    .join("path")
    .attr("class", "multiline-legend-icon-g")
    .attr(
      "transform",
      (d, i) => `
        translate(0, ${i * 30 - 15})
        scale(1.25 1.25)
      `
    )
    .attr("d", (d) => d)
    .attr("fill", (d, i) => colorScale[i]);

  multiline_legend_icons
    .data(multiline_legend_icon_svg)
    .selectAll(".multiline-legend-papth");

  let multiline_legend_case_text = multiline_legend_g
    .selectAll(".multiline-legend-case-text")
    .data(case_results)
    .join("text")
    .attr("x", 40)
    .attr("y", (d, i) => 30 * i + 5)
    .attr("class", "multiline-legend-case-text")
    .text((d) => d.name);

  title_g
    .selectAll(".chart-title-text")
    .data([0])
    .join("text")
    .attr("class", "chart-title-text")
    .attr(
      "transform",
      `translate(${margins.l + chartdims.width / 2},${margins.t / 2})`
    )
    .attr("text-anchor", "middle")
    .text("Carbon Intensity over Time")
    .style("font-weight", 600);

  title_g
    .selectAll(".x-axis-title-g")
    .data([0])
    .join("text")
    .attr("class", "x-axis-title-g")
    .attr(
      "transform",
      `translate(${margins.l / 2},${
        margins.t + chartdims.height / 2
      })rotate(-90)`
    )
    .attr("text-anchor", "middle")
    .text("Carbon Intensity (kg/sf/yr)")
    .style("font-weight", 600);

  return {
    multiline_g,
    multiline_ll97_g,
    multiline_berdo_g,
    multiline_legend_g,
  };
};
