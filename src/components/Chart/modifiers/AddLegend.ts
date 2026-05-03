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
    .attr("transform", `translate(${margins.left + 8}, ${margins.top - 16})`);
  legendItems.forEach((item, i) => {
    const g = legend.append("g").attr("transform", `translate(${i * 90}, 0)`);
    g.append("line")
      .attr("x1", 0)
      .attr("y1", 5)
      .attr("x2", 14)
      .attr("y2", 5)
      .attr("stroke", colorSchema[item.color])
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round");
    g.append("text")
      .attr("x", 20)
      .attr("y", 9)
      .attr("fill", colorSchema.text)
      .attr("font-size", "11px")
      .text(item.label);
  });
};
