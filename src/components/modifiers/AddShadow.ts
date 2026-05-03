import { D3ChartProps } from "../D3Chart";
import { Modifier } from "./Modifier";
import * as d3 from "d3";

export const addShadow: Modifier<D3ChartProps["data"][number]> = ({
  svg,
  dimensions,
  margins,
  xScale,
  yScale,
  data,
}) => {
  const area = d3
    .area<D3ChartProps["data"][number]>()
    .x((d) => xScale(d.date.toDate()))
    .y0(dimensions.height - margins.bottom)
    .y1((d) => yScale(d.portfolioValue))
    .curve(d3.curveMonotoneX);

  svg
    .append("path")
    .datum(data)
    .attr("fill", "url(#area-gradient)")
    .attr("clip-path", "url(#chart-clip)")
    .attr("d", area);
};
