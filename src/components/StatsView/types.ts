import { TooltipItem } from "chart.js";

export interface ChartTooltipItem extends TooltipItem<"pie" | "bar"> {
  raw: number;
  dataset: {
    data: number[];
  };
}
