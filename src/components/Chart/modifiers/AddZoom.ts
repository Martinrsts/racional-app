import { D3ChartProps } from "..";
import { Modifier } from "./Modifier";
import * as d3 from "d3";

type DataPoint = D3ChartProps["data"][number];

export const createAddZoom =
  (
    detailSvg: d3.Selection<SVGSVGElement, undefined, null, undefined>,
    {
      initiallyEnabled = false,
      initialDomain,
      onToggle,
      onDomainChange,
    }: {
      initiallyEnabled?: boolean;
      initialDomain?: [Date, Date];
      onToggle?: (enabled: boolean) => void;
      onDomainChange?: (domain: [Date, Date]) => void;
    } = {},
  ): Modifier<DataPoint> =>
  ({ svg, xScale, dimensions, margins, colorSchema, data }) => {
    const chartLeft = margins.left;
    const chartRight = dimensions.width - margins.right;
    const chartTop = margins.top;
    const chartBottom = dimensions.height - margins.bottom;

    let zoomEnabled = false;

    const handleW = 10;
    const handleH = 38;
    const handleMidY = chartTop + (chartBottom - chartTop) / 2;

    function positionHandles(x0: number, x1: number) {
      brushGroup
        .select<SVGRectElement>(".ch-left")
        .attr("x", x0 - handleW / 2)
        .attr("y", handleMidY - handleH / 2);
      brushGroup
        .select<SVGRectElement>(".ch-right")
        .attr("x", x1 - handleW / 2)
        .attr("y", handleMidY - handleH / 2);
      [-1, 0, 1].forEach((offset, i) => {
        brushGroup
          .select(`.cg-left-${i}`)
          .attr("x1", x0 + offset * 2.5)
          .attr("x2", x0 + offset * 2.5)
          .attr("y1", handleMidY - 7)
          .attr("y2", handleMidY + 7);
        brushGroup
          .select(`.cg-right-${i}`)
          .attr("x1", x1 + offset * 2.5)
          .attr("x2", x1 + offset * 2.5)
          .attr("y1", handleMidY - 7)
          .attr("y2", handleMidY + 7);
      });
    }

    const brush = d3
      .brushX()
      .extent([
        [chartLeft, chartTop],
        [chartRight, chartBottom],
      ])
      .on("brush", (event: d3.D3BrushEvent<unknown>) => {
        if (!event.selection) return;
        const [x0, x1] = event.selection as [number, number];
        positionHandles(x0, x1);
        const d0 = xScale.invert(x0);
        const d1 = xScale.invert(x1);
        onDomainChange?.([d0, d1]);
        updateDetail(d0, d1);
      });

    const brushGroup = svg
      .append("g")
      .attr("class", "zoom-brush")
      .style("display", "none") as unknown as d3.Selection<
      SVGGElement,
      unknown,
      null,
      undefined
    >;

    function updateDetail(d0: Date, d1: Date) {
      const filtered = data.filter((d) => {
        const t = d.date.toDate().getTime();
        return t >= d0.getTime() && t <= d1.getTime();
      });
      if (filtered.length < 2) return;

      const dx = d3.scaleTime().domain([d0, d1]).range([chartLeft, chartRight]);

      const [ymin, ymax] = d3.extent(filtered, (d) => d.portfolioValue) as [
        number,
        number,
      ];
      const pad = (ymax - ymin) * 0.14 || ymax * 0.05;
      const dy = d3
        .scaleLinear()
        .domain([ymin - pad, ymax + pad])
        .range([chartBottom, margins.top]);

      detailSvg
        .select<SVGGElement>(".detail-x-axis")
        .call(
          d3
            .axisBottom<Date>(dx)
            .ticks(6)
            .tickFormat((date) => d3.timeFormat("%d %b")(date)),
        )
        .call((g) => g.select(".domain").attr("stroke", colorSchema.grid))
        .call((g) => g.selectAll(".tick line").attr("stroke", colorSchema.grid))
        .call((g) =>
          g
            .selectAll(".tick text")
            .attr("fill", colorSchema.text)
            .attr("font-size", "20px")
            .attr("dy", "1.4em"),
        );

      detailSvg
        .select<SVGGElement>(".detail-y-axis")
        .call(
          d3
            .axisLeft(dy)
            .ticks(5)
            .tickFormat((d) => `$${d3.format(",.2s")(d as number)}`),
        )
        .call((g) => g.select(".domain").remove())
        .call((g) => g.selectAll(".tick line").remove())
        .call((g) =>
          g
            .selectAll(".tick text")
            .attr("fill", colorSchema.text)
            .attr("font-size", "20px"),
        );

      detailSvg
        .select<SVGGElement>(".detail-grid")
        .attr("transform", `translate(${margins.left},0)`)
        .call(d3.axisLeft(dy).ticks(5).tickSize(-dimensions.innerWidth))
        .call((g) => g.select(".domain").remove())
        .call((g) => g.selectAll(".tick text").remove())
        .call((g) =>
          g
            .selectAll(".tick line")
            .attr("stroke", colorSchema.grid)
            .attr("stroke-opacity", 1),
        );

      const area = d3
        .area<DataPoint>()
        .x((d) => dx(d.date.toDate()))
        .y0(chartBottom)
        .y1((d) => dy(d.portfolioValue))
        .curve(d3.curveMonotoneX);

      detailSvg
        .select(".detail-shadow")
        .selectAll("path")
        .data([filtered])
        .join("path")
        .attr("fill", "url(#detail-area-gradient)")
        .attr("clip-path", "url(#detail-clip)")
        .attr("d", area);

      const segments = filtered.slice(0, -1).map((d, i) => ({
        start: d,
        end: filtered[i + 1],
      }));

      detailSvg
        .select(".detail-segments")
        .selectAll<SVGLineElement, (typeof segments)[number]>("line")
        .data(segments)
        .join("line")
        .attr("clip-path", "url(#detail-clip)")
        .attr("x1", (d) => dx(d.start.date.toDate()))
        .attr("y1", (d) => dy(d.start.portfolioValue))
        .attr("x2", (d) => dx(d.end.date.toDate()))
        .attr("y2", (d) => dy(d.end.portfolioValue))
        .attr("stroke", (d) =>
          d.end.contributions !== d.start.contributions
            ? colorSchema.deposit
            : d.end.portfolioValue >= d.start.portfolioValue
              ? colorSchema.gain
              : colorSchema.loss,
        )
        .attr("stroke-width", 2)
        .attr("stroke-linecap", "round");
    }

    const btnW = 90;
    const btnH = 26;
    const btnX = dimensions.width - btnW - margins.right;
    const btnY = margins.top - 20;

    const btn = svg
      .append("g")
      .attr("class", "zoom-toggle")
      .style("cursor", "pointer");

    const btnRect = btn
      .append("rect")
      .attr("x", btnX)
      .attr("y", btnY)
      .attr("width", btnW)
      .attr("height", btnH)
      .attr("rx", 6)
      .attr("fill", colorSchema.surface)
      .attr("stroke", colorSchema.border)
      .attr("stroke-width", 1);

    const btnLabel = btn
      .append("text")
      .attr("x", btnX + btnW / 2)
      .attr("y", btnY + 17)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("fill", colorSchema.text)
      .text("+ Zoom");

    const detailWrapper = detailSvg.node()!.parentElement as HTMLElement;

    function enableZoom() {
      zoomEnabled = true;
      detailWrapper.style.visibility = "visible";
      brushGroup.style("display", null);
      brushGroup.call(brush);

      brushGroup
        .select(".selection")
        .attr("fill", colorSchema.deposit)
        .attr("fill-opacity", 0.12)
        .attr("stroke", colorSchema.deposit)
        .attr("stroke-width", 1.5);

      brushGroup.selectAll(".handle").style("opacity", "0");

      brushGroup
        .selectAll(
          ".ch-left,.ch-right,.cg-left-0,.cg-left-1,.cg-left-2,.cg-right-0,.cg-right-1,.cg-right-2",
        )
        .remove();

      ["left", "right"].forEach((side) => {
        brushGroup
          .append("rect")
          .attr("class", `ch-${side}`)
          .attr("width", handleW)
          .attr("height", handleH)
          .attr("rx", 4)
          .attr("fill", colorSchema.deposit)
          .attr("fill-opacity", 0.9)
          .style("pointer-events", "none");

        [-1, 0, 1].forEach((_, i) => {
          brushGroup
            .append("line")
            .attr("class", `cg-${side}-${i}`)
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 1.2)
            .attr("stroke-linecap", "round")
            .style("pointer-events", "none");
        });
      });

      let px0: number, px1: number;
      if (initialDomain) {
        px0 = Math.max(chartLeft, Math.min(chartRight, xScale(initialDomain[0])));
        px1 = Math.max(chartLeft, Math.min(chartRight, xScale(initialDomain[1])));
      } else {
        const hw = (chartRight - chartLeft) * 0.1;
        const cx = chartLeft + (chartRight - chartLeft) / 2;
        px0 = cx - hw;
        px1 = cx + hw;
      }
      brushGroup.call(brush.move, [px0, px1]);

      btnRect
        .attr("fill", colorSchema.deposit)
        .attr("stroke", colorSchema.deposit);
      btnLabel.attr("fill", "#ffffff").text("✕ Zoom");
      onToggle?.(true);
    }

    function disableZoom() {
      zoomEnabled = false;
      brushGroup.style("display", "none");
      detailWrapper.style.visibility = "hidden";
      btnRect
        .attr("fill", colorSchema.surface)
        .attr("stroke", colorSchema.border);
      btnLabel.attr("fill", colorSchema.text).text("+ Zoom");
      onToggle?.(false);
    }

    btn.on("click", () => {
      if (zoomEnabled) disableZoom();
      else enableZoom();
    });

    if (initiallyEnabled) enableZoom();
  };
