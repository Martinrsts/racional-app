import { DataModified } from "..";
import { Modifier } from "./Modifier";
import * as d3 from "d3";

export const addShadow: Modifier<DataModified> = ({
  svg,
  dimensions,
  margins,
  xScale,
  yScale,
  data,
  mode,
}) => {
  const getYValue = (d: DataModified) => {
    return mode === "return" ? yScale(d.accReturn) : yScale(d.portfolioValue);
  };

  const area = d3
    .area<DataModified>()
    .x((d) => xScale(d.date.toDate()))
    .y0(dimensions.height - margins.bottom)
    .y1((d) => getYValue(d))
    .curve(d3.curveMonotoneX);

  svg
    .append("path")
    .attr("class", "shadow-path")
    .datum(data)
    .attr("fill", "url(#area-gradient)")
    .attr("clip-path", "url(#chart-clip)")
    .attr("d", area);
};
