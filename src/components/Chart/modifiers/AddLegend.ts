import { D3ChartProps } from "..";
import { Modifier } from "./Modifier";

const legendItems = [
  { color: "gain", label: "Ganancia" },
  { color: "loss", label: "Pérdida" },
  { color: "deposit", label: "Depósito" },
];

export const addLegend: Modifier<D3ChartProps["data"][number]> = ({
  svg,
  margins,
  colorSchema,
}) => {
  const legend = svg
    .append("g")
    .attr("transform", `translate(${margins.left + 8}, ${margins.top - 18})`);
  legendItems.forEach((item, i) => {
    const g = legend.append("g").attr("transform", `translate(${i * 120}, 0)`);
    g.append("line")
      .attr("x1", 0)
      .attr("y1", 10)
      .attr("x2", 18)
      .attr("y2", 10)
      .attr("stroke", colorSchema[item.color])
      .attr("stroke-width", 2.5)
      .attr("stroke-linecap", "round");
    g.append("text")
      .attr("x", 26)
      .attr("y", 15)
      .attr("fill", colorSchema.text)
      .attr("font-size", "20px")
      .text(item.label);
  });
};
