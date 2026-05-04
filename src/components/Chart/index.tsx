import { useEffect, useMemo, useRef, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { addAxis } from "./modifiers/AddAxis";
import { addShadow } from "./modifiers/AddShadow";
import { addSegments } from "./modifiers/AddSegments";
import { addLegend } from "./modifiers/AddLegend";
import { AddTooltip } from "./modifiers/AddTooltip";
import { createAddZoom } from "./modifiers/AddZoom";
import { createAddModeToggle } from "./modifiers/AddModeToggle";
import { SVGInit } from "./SVGInit";
import { calculateScales } from "./utils/calculateScales";
import { Skeleton } from "./Skeleton";

export interface D3ChartProps {
  data: DataPoint[];
}

export type DataPoint = {
  date: Timestamp;
  contributions: number;
  portfolioValue: number;
  dailyReturn: number;
  portofolioIndex: number;
};

export interface DataModified extends DataPoint {
  accReturn: number;
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
  const [mode, setMode] = useState<"default" | "return">("default");
  const [isReady, setIsReady] = useState(false);

  const dataWithAccReturn = useMemo(() => {
    return data
      .sort((d) => d.date.toMillis())
      .reduce((acc: DataModified[], dataInstance) => {
        const last = acc.length > 0 ? acc[acc.length - 1] : null;
        const lastReturn = last ? last.accReturn : 1;
        const newReturn = lastReturn * (1 + dataInstance.dailyReturn);
        acc.push({ ...dataInstance, accReturn: newReturn });
        return acc;
      }, []);
  }, [data]);

  useEffect(() => {
    if (!data?.length || !mainRef.current || !detailRef.current) return;

    const { xScale, yScale } = calculateScales(
      dataWithAccReturn,
      dimensions,
      margins,
      mode,
    );
    const { svg, detailSvg } = SVGInit(dimensions, margins, colorSchema);

    mainRef.current.innerHTML = "";
    detailRef.current.innerHTML = "";
    mainRef.current.appendChild(svg.node()!);
    detailRef.current.appendChild(detailSvg.node()!);

    const addZoom = createAddZoom(detailSvg, {
      initiallyEnabled: zoomEnabledRef.current,
      initialDomain: zoomDomainRef.current ?? undefined,
      onToggle: (enabled) => {
        zoomEnabledRef.current = enabled;
      },
      onDomainChange: (domain) => {
        zoomDomainRef.current = domain;
      },
    });

    const addModeToggle = createAddModeToggle({ onToggle: setMode });

    const modifiers = [
      addAxis,
      addShadow,
      addSegments,
      addLegend,
      AddTooltip,
      addZoom,
      addModeToggle,
    ];
    for (const modifier of modifiers) {
      modifier({
        svg,
        xScale,
        yScale,
        dimensions,
        margins,
        colorSchema,
        data: dataWithAccReturn,
        mode,
      });
    }

    setIsReady(true);
  }, [data, mode]);

  return (
    <div className="h-ful w-full flex items-start justify-center">
      <div className="w-full flex justify-space-between gap-6">
        <div
          ref={mainRef}
          className=" max-w-[860px] w-full h-full bg-white rounded-2xl border border-slate-200 shadow-sm p-1 overflow-hidden flex items-center justify-center"
        />
        <Skeleton isReady={isReady} />
        <div
          ref={detailRef}
          className=" max-w-[860px] w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-1 overflow-hidden flex items-center justify-center"
        />
      </div>
    </div>
  );
}
