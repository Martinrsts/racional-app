import { D3ChartProps } from "../D3Chart";
import { Modifier } from "./Modifier";

export const addSegments: Modifier<D3ChartProps["data"][number]> = ({
  svg,
  xScale,
  yScale,
  colorSchema,
  data,
}) => {
  const segments = data.slice(0, -1).map((d, i) => ({
    start: d,
    end: data[i + 1],
    id: data[i].date.toString(),
  }));

  svg
    .selectAll(".segment")
    .data(segments)
    .join("line")
    .attr("class", "segment")
    .attr("x1", (d) => xScale(d.start.date.toDate()))
    .attr("y1", (d) => yScale(d.start.portfolioValue))
    .attr("x2", (d) => xScale(d.end.date.toDate()))
    .attr("y2", (d) => yScale(d.end.portfolioValue))
    .attr("stroke", (d) =>
      d.end.contributions !== d.start.contributions
        ? colorSchema.deposit
        : d.end.portfolioValue >= d.start.portfolioValue
          ? colorSchema.gain
          : colorSchema.loss,
    )
    .attr("stroke-width", 1.5)
    .attr("stroke-linecap", "round");
};
