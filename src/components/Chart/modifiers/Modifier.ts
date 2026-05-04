interface ModifierProps<T> {
  data: T[];
  svg: d3.Selection<SVGSVGElement, undefined, null, undefined>;
  xScale: d3.ScaleTime<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  dimensions: {
    width: number;
    height: number;
    innerHeight: number;
    innerWidth: number;
  };
  margins: { left: number; right: number; top: number; bottom: number };
  colorSchema: Record<string, string>;
  mode: "default" | "return";
}

export type Modifier<T> = (props: ModifierProps<T>) => void;
