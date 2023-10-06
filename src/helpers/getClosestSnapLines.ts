import { SNAP_THRESHOLD } from "@/constants/snap";
import {
  IGetShapeSnappingEdgesResult,
  IGetSnapLinesResult,
} from "@/interfaces/SnapLine.interface";

const getAllSnapLines = (
  direction: "vertical" | "horizontal",
  possibleSnapLines: IGetSnapLinesResult,
  shapeSnappingEdges: IGetShapeSnappingEdgesResult
) => {
  const result: any[] = [];
  possibleSnapLines[direction].forEach((snapLine: any) => {
    shapeSnappingEdges[direction].forEach((snappingEdge: any) => {
      const diff = Math.abs(snapLine - snappingEdge.guide);
      //* If the distance between the line and the shape is less than the threshold, we will consider it a snapping point.
      if (diff > SNAP_THRESHOLD) return;

      const { snap, offset } = snappingEdge;
      result.push({ snapLine, diff, snap, offset });
    });
  });
  return result;
};

export const getClosestSnapLines = (
  possibleSnapLines: IGetSnapLinesResult | null,
  shapeSnappingEdges: IGetShapeSnappingEdgesResult
) => {
if(!possibleSnapLines) return []

  const resultV = getAllSnapLines(
    "vertical",
    possibleSnapLines,
    shapeSnappingEdges
  );
  const resultH = getAllSnapLines(
    "horizontal",
    possibleSnapLines,
    shapeSnappingEdges
  );

  const closestSnapLines = [];

  interface getSnapLineProps {
    snapLine: any;
    offset: any;
    snap: any;
  }

  const getSnapLine = (
    { snapLine, offset, snap }: getSnapLineProps,
    orientation: "V" | "H"
  ) => {
    return { snapLine, offset, orientation, snap };
  };

  //* find closest vertical and horizontal snappping lines
  const [minV] = resultV.sort((a, b) => a.diff - b.diff);
  const [minH] = resultH.sort((a, b) => a.diff - b.diff);
  if (minV) closestSnapLines.push(getSnapLine(minV, "V"));
  if (minH) closestSnapLines.push(getSnapLine(minH, "H"));

  return closestSnapLines;
};
