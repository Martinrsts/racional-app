import { D3ChartProps } from "..";
import { Modifier } from "./Modifier";
import * as d3 from "d3";

export const AddTooltip: Modifier<D3ChartProps["data"][number]> = ({
  svg,
  xScale,
  yScale,
  dimensions,
  margins,
  colorSchema,
  data,
}) => {
  const tooltip = svg
    .append("g")
    .style("pointer-events", "none")
    .style("display", "none");

  tooltip
    .append("line")
    .attr("class", "tip-line")
    .attr("y1", margins.top)
    .attr("y2", dimensions.height - margins.bottom)
    .attr("stroke", colorSchema.grid)
    .attr("stroke-width", 1);

  tooltip
    .append("circle")
    .attr("class", "tip-dot")
    .attr("r", 5)
    .attr("stroke", colorSchema.bg)
    .attr("stroke-width", 2);

  const tipBox = tooltip.append("g").attr("class", "tip-box");
  tipBox
    .append("rect")
    .attr("rx", 8)
    .attr("fill", colorSchema.surface)
    .attr("stroke", colorSchema.border)
    .attr("stroke-width", 1)
    .style("filter", "drop-shadow(0 2px 8px rgba(0,0,0,0.08))");
  const tipDate = tipBox
    .append("text")
    .attr("font-size", "10px")
    .attr("fill", colorSchema.text);
  const tipValue = tipBox
    .append("text")
    .attr("font-size", "13px")
    .attr("font-weight", "600")
    .attr("fill", colorSchema.textDark);
  const tipReturn = tipBox.append("text").attr("font-size", "11px");

  const bisect = d3.bisector((d: D3ChartProps["data"][number]) =>
    d.date.toDate(),
  ).left;

  svg
    .append("rect")
    .attr("x", margins.left)
    .attr("y", margins.top)
    .attr("width", dimensions.width - margins.left - margins.right)
    .attr("height", dimensions.height - margins.top - margins.bottom)
    .attr("fill", "transparent")
    .on("mousemove", function (event) {
      const [mx] = d3.pointer(event);
      const date = xScale.invert(mx);
      const idx = bisect(data, date, 1);
      const d0 = data[idx - 1];
      const d1 = data[idx];
      const d =
        !d1 ||
        date.getTime() - d0.date.toDate().getTime() <
          d1.date.toDate().getTime() - date.getTime()
          ? d0
          : d1;

      const cx = xScale(d.date.toDate());
      const cy = yScale(d.portfolioValue);
      const isGain = d.dailyReturn >= 0;

      tooltip.style("display", null);
      tooltip.select(".tip-line").attr("x1", cx).attr("x2", cx);
      tooltip
        .select(".tip-dot")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("fill", isGain ? colorSchema.gain : colorSchema.loss);

      const boxW = 140;
      const boxH = 58;
      const pad = 10;
      const boxX =
        cx + 14 + boxW > dimensions.width - margins.right
          ? cx - 14 - boxW
          : cx + 14;
      const boxY = Math.max(
        margins.top,
        Math.min(cy - boxH / 2, dimensions.height - margins.bottom - boxH),
      );

      tipBox
        .select("rect")
        .attr("x", boxX - pad)
        .attr("y", boxY - pad)
        .attr("width", boxW + pad * 2)
        .attr("height", boxH + pad * 2);
      tipDate
        .attr("x", boxX)
        .attr("y", boxY + 10)
        .text(d3.timeFormat("%d %b %Y")(d.date.toDate()));
      tipValue
        .attr("x", boxX)
        .attr("y", boxY + 30)
        .text(`$${d3.format(",.2f")(d.portfolioValue)}`);
      tipReturn
        .attr("x", boxX)
        .attr("y", boxY + 46)
        .attr("fill", isGain ? colorSchema.gain : colorSchema.loss)
        .text(`${isGain ? "+" : ""}${d3.format(".2%")(d.dailyReturn)}`);
    })
    .on("mouseleave", () => tooltip.style("display", "none"));
};
