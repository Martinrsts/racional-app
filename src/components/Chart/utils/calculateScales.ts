import { DataModified } from "..";
import * as d3 from "d3";

export const calculateScales = (
  data: DataModified[],
  dimensions: { width: number; height: number },
  margins: { left: number; right: number; top: number; bottom: number },
  mode: "default" | "return",
) => {
  const xScale = d3
    .scaleTime()
    .range([margins.left, dimensions.width - margins.right])
    .domain(d3.extent(data, (d) => d.date.toDate()) as [Date, Date]);

  const [ymin, ymax] = d3.extent(data, (d) =>
    mode === "return" ? d.accReturn : d.portfolioValue,
  ) as [number, number];
  const padding = (ymax - ymin) * 0.14;

  const yScale = d3
    .scaleLinear()
    .range([dimensions.height - margins.bottom, margins.top])
    .domain([ymin - padding, ymax + padding]);

  return { xScale, yScale };
};
