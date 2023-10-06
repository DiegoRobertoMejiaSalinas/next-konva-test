import { nanoid } from "nanoid";
import { IShape } from "@/interfaces/Shape.interface";
import { Rect } from "react-konva";

export const initialShapes: IShape[] = [
    {
      x: 30,
      y: 50,
      width: 200,
      height: 300,
      fill: "green",
      id: nanoid(),
      shape: Rect,
    },
    {
      x: 100,
      y: 20,
      width: 300,
      height: 100,
      fill: "black",
      id: nanoid(),
      shape: Rect,
    },
  ];
