import { DataModified } from "..";
import { Modifier } from "./Modifier";

export const addSegments: Modifier<DataModified> = ({
  svg,
  xScale,
  yScale,
  colorSchema,
  data,
  mode,
}) => {
  const segments = data.slice(0, -1).map((d, i) => ({
    start: d,
    end: data[i + 1],
    id: data[i].date.toString(),
  }));

  const getYValue = (d: DataModified) => {
    return mode === "return" ? yScale(d.accReturn) : yScale(d.portfolioValue);
  };
  svg
    .selectAll(".segment")
    .data(segments)
    .join("line")
    .attr("class", "segment")
    .attr("x1", (d) => xScale(d.start.date.toDate()))
    .attr("y1", (d) => getYValue(d.start))
    .attr("x2", (d) => xScale(d.end.date.toDate()))
    .attr("y2", (d) => getYValue(d.end))
    .attr("stroke", (d) =>
      d.end.contributions !== d.start.contributions && mode === "default"
        ? colorSchema.deposit
        : d.end.dailyReturn >= 0
          ? colorSchema.gain
          : colorSchema.loss,
    )
    .attr("stroke-width", 1.5)
    .attr("stroke-linecap", "round");
};
