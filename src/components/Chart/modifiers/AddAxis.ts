import { DataModified } from "..";
import { Modifier } from "./Modifier";
import * as d3 from "d3";

export const addAxis: Modifier<DataModified> = ({
  svg,
  margins,
  dimensions,
  xScale,
  yScale,
  colorSchema,
  mode,
}) => {
  svg
    .append("g")
    .attr("class", "y-grid")
    .attr("transform", `translate(${margins.left},0)`)
    .call(d3.axisLeft(yScale).ticks(5).tickSize(-dimensions.innerWidth))
    .call((g) => g.select(".domain").remove())
    .call((g) => g.selectAll(".tick text").remove())
    .call((g) =>
      g
        .selectAll(".tick line")
        .attr("stroke", colorSchema.grid)
        .attr("stroke-opacity", 1),
    );

  svg
    .append("g")
    .attr("class", "y-labels")
    .attr("transform", `translate(${margins.left},0)`)
    .call(
      d3
        .axisLeft(yScale)
        .ticks(5)
        .tickFormat(
          (d) =>
            `$${d3.format(mode === "return" ? ".1%" : ",.2s")(d as number)}`,
        ),
    )
    .call((g) => g.select(".domain").remove())
    .call((g) => g.selectAll(".tick line").remove())
    .call((g) =>
      g
        .selectAll(".tick text")
        .attr("fill", colorSchema.text)
        .attr("font-size", "15px"),
    );

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${dimensions.height - margins.bottom})`)
    .call(
      d3
        .axisBottom<Date>(xScale)
        .ticks(8)
        .tickFormat((date) => d3.timeFormat("%d %b")(date)),
    )
    .call((g) => g.select(".domain").attr("stroke", colorSchema.grid))
    .call((g) => g.selectAll(".tick line").attr("stroke", colorSchema.grid))
    .call((g) =>
      g
        .selectAll(".tick text")
        .attr("fill", colorSchema.text)
        .attr("font-size", "15px")
        .attr("dy", "1.4em"),
    );
};
