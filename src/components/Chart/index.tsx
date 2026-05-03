import { useEffect, useRef } from "react";
import { Timestamp } from "firebase/firestore";
import { addAxis } from "./modifiers/AddAxis";
import { addShadow } from "./modifiers/AddShadow";
import { addSegments } from "./modifiers/AddSegments";
import { addLegend } from "./modifiers/AddLegend";
import { AddTooltip } from "./modifiers/AddTooltip";
import { createAddZoom } from "./modifiers/AddZoom";
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

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 2px 12px rgba(15, 23, 42, 0.06)",
  padding: "4px",
  overflow: "hidden",
};

export function Chart({ data }: D3ChartProps) {
  const mainRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const dimensions = {
    width: 800,
    height: 780,
    innerWidth: 800 - 72 - 24,
    innerHeight: 780 - 32 - 48,
    detailWidth: 400,
    detailHeight: 390,
  };
  const margins = { left: 72, right: 24, top: 32, bottom: 48 };

  useEffect(() => {
    if (!data?.length || !mainRef.current || !detailRef.current) return;

    const { xScale, yScale } = calculateScales(data, dimensions, margins);
    const { svg, detailSvg } = SVGInit(dimensions, margins, colorSchema);

    mainRef.current.innerHTML = "";
    detailRef.current.innerHTML = "";
    mainRef.current.appendChild(svg.node()!);
    detailRef.current.appendChild(detailSvg.node()!);

    const modifiers = [
      addAxis,
      addShadow,
      addSegments,
      addLegend,
      AddTooltip,
      createAddZoom(detailSvg),
    ];
    for (const modifier of modifiers) {
      modifier({ svg, xScale, yScale, dimensions, margins, colorSchema, data });
    }
  }, [data]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 16px",
      }}
    >
      <div ref={mainRef} style={{ flex: 2, ...cardStyle }} />
      <div ref={detailRef} style={{ flex: 1, ...cardStyle }} />
    </div>
  );
}
