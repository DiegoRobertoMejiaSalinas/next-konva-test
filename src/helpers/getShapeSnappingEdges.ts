import { IGetShapeSnappingEdgesResult } from "@/interfaces/SnapLine.interface";

export const getShapeSnappingEdges = (
  selectedTransformRef: any,
  stageRef: any,
): IGetShapeSnappingEdgesResult => {
  const stage = stageRef.current;
  const tr = selectedTransformRef.current;

  const box = tr.findOne(".back").getClientRect({ relativeTo: stage });
  const absPos = tr.findOne(".back").absolutePosition();

  return {
    vertical: [
      // Left vertical edge
      {
        guide: box.x,
        offset: absPos.x - box.x,
        snap: "start",
      },
      // Center vertical edge
      {
        guide: box.x + box.width / 2,
        offset: absPos.x - box.x - box.width / 2,
        snap: "center",
      },
      // Right vertical edge
      {
        guide: box.x + box.width,
        offset: absPos.x - box.x - box.width,
        snap: "end",
      },
    ],
    horizontal: [
      // Top horizontal edge
      {
        guide: box.y,
        offset: absPos.y - box.y,
        snap: "start",
      },
      // Center horizontal edge
      {
        guide: box.y + box.height / 2,
        offset: absPos.y - box.y - box.height / 2,
        snap: "center",
      },
      // Bottom horizontal edge
      {
        guide: box.y + box.height,
        offset: absPos.y - box.y - box.height,
        snap: "end",
      },
    ],
  };
};
