import { IGetSnapLinesResult } from "@/interfaces/SnapLine.interface";

export const getSnapLines = (excludedShape: any, stageRef: any): IGetSnapLinesResult | null => {
  const stage = stageRef.current;
  if (!stage)
    return null;

  const vertical: any[] = [];
  const horizontal: any[] = [];

  // We snap over edges and center of each object on the canvas
  // We can query and get all the shapes by their name property `shape`.
  stage.find(".shape").forEach((shape: any) => {
    // We don't want to snap to the selected shape, so we will be passing them as `excludedShape`
    if (shape === excludedShape) return;

    const box = shape.getClientRect({ relativeTo: stage });
    vertical.push([box.x, box.x + box.width, box.x + box.width / 2]);
    horizontal.push([box.y, box.y + box.height, box.y + box.height / 2]);
  });

  return {
    vertical: vertical.flat(),
    horizontal: horizontal.flat(),
  };
};
