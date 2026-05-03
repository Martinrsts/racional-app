import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Timestamp } from "firebase/firestore";

interface D3ChartProps {
  data: {
    date: Timestamp;
    contributions: number;
    portfolioValue: number;
    dailyReturn: number;
    portofolioIndex: number;
  }[];
}

const C = {
  gain: "#16a34a",
  loss: "#dc2626",
  deposit: "#6366f1",
  area: "#6366f1",
  grid: "#e2e8f0",
  text: "#64748b",
  textDark: "#0f172a",
  bg: "#ffffff",
  surface: "#ffffff",
  border: "#e2e8f0",
};

const chart = (data: D3ChartProps["data"]) => {
  const width = 800;
  const height = 780;
  const marginTop = 32;
  const marginRight = 24;
  const marginBottom = 48;
  const marginLeft = 72;
  const innerW = width - marginLeft - marginRight;
  const innerH = height - marginTop - marginBottom;

  const xScale = d3
    .scaleTime()
    .range([marginLeft, width - marginRight])
    .domain(d3.extent(data, (d) => d.date.toDate()) as [Date, Date]);

  const [ymin, ymax] = d3.extent(data, (d) => d.portfolioValue) as [
    number,
    number,
  ];
  const padding = (ymax - ymin) * 0.14;

  const yScale = d3
    .scaleLinear()
    .range([height - marginBottom, marginTop])
    .domain([ymin - padding, ymax + padding]);

  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height])
    .style("width", "100%")
    .style("height", "auto")
    .style("font-family", "system-ui, -apple-system, sans-serif");

  svg
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", C.bg);

  const defs = svg.append("defs");

  const gradient = defs
    .append("linearGradient")
    .attr("id", "area-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0)
    .attr("y1", marginTop)
    .attr("x2", 0)
    .attr("y2", height - marginBottom);
  gradient
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", C.area)
    .attr("stop-opacity", 0.12);
  gradient
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", C.area)
    .attr("stop-opacity", 0);

  defs
    .append("clipPath")
    .attr("id", "chart-clip")
    .append("rect")
    .attr("x", marginLeft)
    .attr("y", marginTop)
    .attr("width", innerW)
    .attr("height", innerH);

  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(yScale).ticks(5).tickSize(-innerW))
    .call((g) => g.select(".domain").remove())
    .call((g) => g.selectAll(".tick text").remove())
    .call((g) =>
      g
        .selectAll(".tick line")
        .attr("stroke", C.grid)
        .attr("stroke-opacity", 1),
    );

  const area = d3
    .area<(typeof data)[0]>()
    .x((d) => xScale(d.date.toDate()))
    .y0(height - marginBottom)
    .y1((d) => yScale(d.portfolioValue))
    .curve(d3.curveMonotoneX);

  svg
    .append("path")
    .datum(data)
    .attr("fill", "url(#area-gradient)")
    .attr("clip-path", "url(#chart-clip)")
    .attr("d", area);

  const segments = data
    .slice(0, -1)
    .map((d, i) => ({ start: d, end: data[i + 1] }));

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
        ? C.deposit
        : d.end.portfolioValue >= d.start.portfolioValue
          ? C.gain
          : C.loss,
    )
    .attr("stroke-width", 1.5)
    .attr("stroke-linecap", "round");

  const last = data[data.length - 1];
  svg
    .append("circle")
    .attr("cx", xScale(last.date.toDate()))
    .attr("cy", yScale(last.portfolioValue))
    .attr("r", 4)
    .attr("fill", C.deposit)
    .attr("stroke", C.bg)
    .attr("stroke-width", 2);

  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(
      d3
        .axisLeft(yScale)
        .ticks(5)
        .tickFormat((d) => `$${d3.format(",.2s")(d as number)}`),
    )
    .call((g) => g.select(".domain").remove())
    .call((g) => g.selectAll(".tick line").remove())
    .call((g) =>
      g.selectAll(".tick text").attr("fill", C.text).attr("font-size", "11px"),
    );

  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(
      d3
        .axisBottom<Date>(xScale)
        .ticks(8)
        .tickFormat((date) => d3.timeFormat("%d %b")(date)),
    )
    .call((g) => g.select(".domain").attr("stroke", C.grid))
    .call((g) => g.selectAll(".tick line").attr("stroke", C.grid))
    .call((g) =>
      g
        .selectAll(".tick text")
        .attr("fill", C.text)
        .attr("font-size", "11px")
        .attr("dy", "1.4em"),
    );

  const legendItems = [
    { color: C.gain, label: "Ganancia" },
    { color: C.loss, label: "Pérdida" },
    { color: C.deposit, label: "Depósito" },
  ];
  const legend = svg
    .append("g")
    .attr("transform", `translate(${marginLeft + 8}, ${marginTop - 16})`);
  legendItems.forEach((item, i) => {
    const g = legend.append("g").attr("transform", `translate(${i * 90}, 0)`);
    g.append("line")
      .attr("x1", 0)
      .attr("y1", 5)
      .attr("x2", 14)
      .attr("y2", 5)
      .attr("stroke", item.color)
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round");
    g.append("text")
      .attr("x", 20)
      .attr("y", 9)
      .attr("fill", C.text)
      .attr("font-size", "11px")
      .text(item.label);
  });

  const tooltip = svg
    .append("g")
    .style("pointer-events", "none")
    .style("display", "none");

  tooltip
    .append("line")
    .attr("class", "tip-line")
    .attr("y1", marginTop)
    .attr("y2", height - marginBottom)
    .attr("stroke", C.grid)
    .attr("stroke-width", 1);

  tooltip
    .append("circle")
    .attr("class", "tip-dot")
    .attr("r", 5)
    .attr("stroke", C.bg)
    .attr("stroke-width", 2);

  const tipBox = tooltip.append("g").attr("class", "tip-box");
  tipBox
    .append("rect")
    .attr("rx", 8)
    .attr("fill", C.surface)
    .attr("stroke", C.border)
    .attr("stroke-width", 1)
    .style("filter", "drop-shadow(0 2px 8px rgba(0,0,0,0.08))");
  const tipDate = tipBox
    .append("text")
    .attr("font-size", "10px")
    .attr("fill", C.text);
  const tipValue = tipBox
    .append("text")
    .attr("font-size", "13px")
    .attr("font-weight", "600")
    .attr("fill", C.textDark);
  const tipReturn = tipBox.append("text").attr("font-size", "11px");

  const bisect = d3.bisector((d: D3ChartProps["data"][number]) =>
    d.date.toDate(),
  ).left;

  svg
    .append("rect")
    .attr("x", marginLeft)
    .attr("y", marginTop)
    .attr("width", innerW)
    .attr("height", innerH)
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
        .attr("fill", isGain ? C.gain : C.loss);

      const boxW = 140;
      const boxH = 58;
      const pad = 10;
      const boxX =
        cx + 14 + boxW > width - marginRight ? cx - 14 - boxW : cx + 14;
      const boxY = Math.max(
        marginTop,
        Math.min(cy - boxH / 2, height - marginBottom - boxH),
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
        .attr("fill", isGain ? C.gain : C.loss)
        .text(`${isGain ? "+" : ""}${d3.format(".2%")(d.dailyReturn)}`);
    })
    .on("mouseleave", () => tooltip.style("display", "none"));

  return svg.node();
};

export function D3Chart({ data }: D3ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data?.length || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";
    const chartNode = chart(data);
    if (chartNode) container.appendChild(chartNode);
  }, [data]);

  return (
    <div
      ref={containerRef}
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 12px rgba(15, 23, 42, 0.06)",
        maxWidth: "860px",
        margin: "0 auto",
        padding: "4px",
      }}
    />
  );
}
