import { DataModified } from "..";
import { Modifier } from "./Modifier";

export const createAddModeToggle =
  ({
    onToggle,
  }: {
    onToggle: (mode: "default" | "return") => void;
  }): Modifier<DataModified> =>
  ({ svg, dimensions, margins, colorSchema, mode }) => {
    const btnW = 110;
    const btnH = 26;
    const btnX = dimensions.width - margins.right - 90 - 8 - btnW;
    const btnY = margins.top - 20;

    const isReturn = mode === "return";

    const btn = svg
      .append("g")
      .attr("class", "mode-toggle")
      .style("cursor", "pointer");

    const btnRect = btn
      .append("rect")
      .attr("x", btnX)
      .attr("y", btnY)
      .attr("width", btnW)
      .attr("height", btnH)
      .attr("rx", 6)
      .attr("fill", isReturn ? colorSchema.deposit : colorSchema.surface)
      .attr("stroke", isReturn ? colorSchema.deposit : colorSchema.border)
      .attr("stroke-width", 1);

    btn
      .append("text")
      .attr("x", btnX + btnW / 2)
      .attr("y", btnY + 17)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("fill", isReturn ? "#ffffff" : colorSchema.text)
      .text(isReturn ? "Ver Valor" : "Ver Retorno");

    btn.on("click", () => {
      const next = mode === "default" ? "return" : "default";
      onToggle(next);
    });

    btn.on("mouseenter", () => {
      if (!isReturn) btnRect.attr("fill", "#f1f5f9");
    });

    btn.on("mouseleave", () => {
      if (!isReturn) btnRect.attr("fill", colorSchema.surface);
    });
  };
