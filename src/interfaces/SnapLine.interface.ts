export interface ISnapLineItem {
  stroke: string;
  strokeWidth: 2;
  name: string;
  dash: number[];
  points: number[];
  x: number;
  y: number;
}

export interface IGetSnapLinesResultVerticalHorizontal {
  guide: number;
  offset: number;
  snap: "start" | "center" | "end";
}

export interface IGetSnapLinesResult {
  vertical: IGetSnapLinesResultVerticalHorizontal[];
  horizontal: IGetSnapLinesResultVerticalHorizontal[];
}

export interface IGetShapeSnappingEdgesResultVerticalHorizontal {
  guide: number;
  offset: number;
  snap: "start" | "center" | "end";
}

export interface IGetShapeSnappingEdgesResult {
  vertical: IGetShapeSnappingEdgesResultVerticalHorizontal[];
  horizontal: IGetShapeSnappingEdgesResultVerticalHorizontal[];
}
