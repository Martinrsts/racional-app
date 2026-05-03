import { useEffect, useRef } from "react";
import { Timestamp } from "firebase/firestore";
import { addAxis } from "./modifiers/AddAxis";
import { addShadow } from "./modifiers/AddShadow";
import { addSegments } from "./modifiers/AddSegments";
import { addLegend } from "./modifiers/AddLegend";
import { AddTooltip } from "./modifiers/AddTooltip";
import { SVGInit } from "./SVGInit";
import { calculateScales } from "./utils/calculateScales";

export interface D3ChartProps {
  data: {
    date: Timestamp;
    contributions: number;
    portfolioValue: number;
    dailyReturn: number;
    portofolioIndex: number;
  }[];
}

const colorSchema = {
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
  const dimensions = { width: 800, height: 780 };
  const margins = { left: 72, right: 24, top: 32, bottom: 48 };

  const { xScale, yScale } = calculateScales(data, dimensions, margins);

  const svg = SVGInit(dimensions, margins, colorSchema);

  const modifiers = [addAxis, addShadow, addSegments, addLegend, AddTooltip];
  for (const modifier of modifiers) {
    modifier({
      svg,
      xScale,
      yScale,
      dimensions,
      margins,
      colorSchema,
      data,
    });
  }

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
