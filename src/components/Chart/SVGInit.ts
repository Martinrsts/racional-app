import * as d3 from "d3";

const buildSVG = (
  dimensions: {
    width: number;
    height: number;
    innerWidth: number;
    innerHeight: number;
  },
  margins: { left: number; right: number; top: number; bottom: number },
  colorSchema: Record<string, string>,
  ids: { gradient: string; clip: string },
  chartBottom: number,
) => {
  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, dimensions.width, dimensions.height])
    .style("width", "auto")
    .style("height", "auto")
    .style("max-width", "100%")
    .style("max-height", "100%")
    .style("display", "block")
    .style("font-family", "system-ui, -apple-system, sans-serif");

  svg
    .append("rect")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
    .attr("fill", colorSchema.bg);

  const defs = svg.append("defs");

  const gradient = defs
    .append("linearGradient")
    .attr("id", ids.gradient)
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0)
    .attr("y1", margins.top)
    .attr("x2", 0)
    .attr("y2", chartBottom);
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
    .attr("id", ids.clip)
    .append("rect")
    .attr("x", margins.left)
    .attr("y", margins.top)
    .attr("width", dimensions.innerWidth)
    .attr("height", dimensions.innerHeight);

  return svg;
};

export const SVGInit = (
  dimensions: {
    width: number;
    height: number;
    innerWidth: number;
    innerHeight: number;
  },
  margins: { left: number; right: number; top: number; bottom: number },
  colorSchema: Record<string, string>,
) => {
  const chartBottom = dimensions.height - margins.bottom;

  const svg = buildSVG(
    dimensions,
    margins,
    colorSchema,
    { gradient: "area-gradient", clip: "chart-clip" },
    chartBottom,
  );

  const detailSvg = buildSVG(
    dimensions,
    margins,
    colorSchema,
    { gradient: "detail-area-gradient", clip: "detail-clip" },
    chartBottom,
  );

  detailSvg
    .append("text")
    .attr("x", margins.left + 8)
    .attr("y", margins.top - 8)
    .attr("font-size", "15px")
    .attr("fill", colorSchema.text)
    .text("Vista detallada");

  detailSvg.append("g").attr("class", "detail-grid");
  detailSvg.append("g").attr("class", "detail-shadow");
  detailSvg.append("g").attr("class", "detail-segments");
  detailSvg
    .append("g")
    .attr("class", "detail-x-axis")
    .attr("transform", `translate(0,${chartBottom})`);
  detailSvg
    .append("g")
    .attr("class", "detail-y-axis")
    .attr("transform", `translate(${margins.left},0)`);

  return { svg, detailSvg };
};
