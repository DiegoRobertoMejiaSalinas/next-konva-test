import { Shape } from "konva/lib/Shape";
import { IShape } from "./Shape.interface";
import { KonvaNodeEvents } from "react-konva";

export interface IShapeInstance extends IShape, KonvaNodeEvents {
  isSelected: boolean;
  onSelect: (event: any) => void;
  onChange: (event: any) => void;
  onTransformDragMove: (shapeId: string, transformRef: any) => void;
  onCompletedDragEnd: (e: any) => void;
}
