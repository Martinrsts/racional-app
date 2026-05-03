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

const dimensions = {
  width: 800,
  height: 780,
  innerWidth: 800 - 72 - 24,
  innerHeight: 780 - 32 - 48,
};
const margins = { left: 72, right: 24, top: 32, bottom: 48 };

export function Chart({ data }: D3ChartProps) {
  const mainRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const zoomEnabledRef = useRef(false);
  const zoomDomainRef = useRef<[Date, Date] | null>(null);

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
      createAddZoom(detailSvg, {
        initiallyEnabled: zoomEnabledRef.current,
        initialDomain: zoomDomainRef.current ?? undefined,
        onToggle: (enabled) => { zoomEnabledRef.current = enabled; },
        onDomainChange: (domain) => { zoomDomainRef.current = domain; },
      }),
    ];
    for (const modifier of modifiers) {
      modifier({ svg, xScale, yScale, dimensions, margins, colorSchema, data });
    }
  }, [data]);

  return (
    <div className="h-full flex items-start justify-center">
      {/* relative wrapper so detail can be absolutely positioned to its right */}
      <div className="relative h-full w-full max-w-[860px]">
        <div
          ref={mainRef}
          className="h-full bg-white rounded-2xl border border-slate-200 shadow-sm p-1 overflow-hidden flex items-center justify-center"
        />
        <div
          ref={detailRef}
          className="absolute top-0 left-[calc(100%+16px)]  w-[380px] bg-white rounded-2xl border border-slate-200 shadow-sm p-1 overflow-hidden flex items-center justify-center"
          style={{ visibility: "hidden" }}
        />
      </div>
    </div>
  );
}
