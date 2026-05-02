import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface D3ChartProps {
  data: unknown;
}

export function D3Chart({ data }: D3ChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    console.log("D3 data:", data);
  }, [data]);

  return <svg ref={svgRef} width={600} height={400} />;
}
