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

const chart = (data: D3ChartProps["data"]) => {
  const width = 500;
  const height = 200;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 40;

  const xScale = d3
    .scaleTime()
    .range([marginLeft, width - marginRight])
    .domain(d3.extent(data, (d) => d.date.toDate()) as [Date, Date]);

  const [ymin, ymax] = d3.extent(data, (d) => d.portfolioValue) as [
    number,
    number,
  ];

  const padding = (ymax - ymin) * 0.1;

  const yScale = d3
    .scaleLinear()
    .range([height - marginBottom, marginTop])
    .domain([ymin - padding, ymax + padding]);

  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

  const segments = data.slice(0, -1).map((d, i) => ({
    start: d,
    end: data[i + 1],
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
      d.end.contributions != d.start.contributions
        ? "blue"
        : d.end.portfolioValue > d.start.portfolioValue
          ? "green"
          : "red",
    )
    .attr("stroke-width", 0.5);

  const xAxis = d3
    .axisBottom<Date>(xScale)
    .ticks(10)
    .tickFormat((date) => d3.timeFormat("%d %b")(date));

  const yAxis = d3
    .axisLeft(yScale)
    .ticks(5)
    .tickFormat((d) => `$${d3.format(",.2s")(d as number)}`);

  svg.append("g").call(yAxis).attr("transform", `translate(${marginLeft},0)`);

  svg
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0,${height - marginBottom})`);

  return svg.node();
};

export function D3Chart({ data }: D3ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";
    const chartNode = chart(data);
    if (chartNode) {
      container.appendChild(chartNode);
    }
  }, [data]);

  return <div ref={containerRef} />;
}
