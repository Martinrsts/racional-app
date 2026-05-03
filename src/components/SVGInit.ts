import * as d3 from "d3";

export const SVGInit = (
  dimensions: { width: number; height: number },
  margins: { left: number; right: number; top: number; bottom: number },
  colorSchema: Record<string, string>,
) => {
  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, dimensions.width, dimensions.height])
    .style("width", "100%")
    .style("height", "auto")
    .style("font-family", "system-ui, -apple-system, sans-serif");

  svg
    .append("rect")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
    .attr("fill", colorSchema.bg);

  const defs = svg.append("defs");

  const gradient = defs
    .append("linearGradient")
    .attr("id", "area-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0)
    .attr("y1", margins.top)
    .attr("x2", 0)
    .attr("y2", dimensions.height - margins.bottom);
  gradient
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", colorSchema.area)
    .attr("stop-opacity", 0.12);
  gradient
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", colorSchema.area)
    .attr("stop-opacity", 0);

  defs
    .append("clipPath")
    .attr("id", "chart-clip")
    .append("rect")
    .attr("x", margins.left)
    .attr("y", margins.top)
    .attr("width", dimensions.width - margins.left - margins.right)
    .attr("height", dimensions.height - margins.top - margins.bottom);

  return svg;
};
