import { ISnapLineItem } from "@/interfaces/SnapLine.interface";

interface IDrawLinesResult {
  hLines: ISnapLineItem[];
  vLines: ISnapLineItem[];
}

export const drawLines = (lines: any[] = []): IDrawLinesResult => {
  if (lines.length == 0)
    return {
      hLines: [],
      vLines: [],
    };

  const lineStyle = {
    stroke: "rgb(42, 82, 105)",
    strokeWidth: 2,
    name: "guid-line",
    dash: [4, 6],
  };
  const hLines: any = [];
  const vLines: any = [];
  lines.forEach((l: any) => {
    if (l.orientation === "H") {
      const line = {
        points: [-6000, 0, 6000, 0],
        x: 0,
        y: l.snapLine,
        ...lineStyle,
      };
      hLines.push(line);
    } else if (l.orientation === "V") {
      const line = {
        points: [0, -6000, 0, 6000],
        x: l.snapLine,
        y: 0,
        ...lineStyle,
      };
      vLines.push(line);
    }
  });

  return {
    hLines,
    vLines,
  };
};
