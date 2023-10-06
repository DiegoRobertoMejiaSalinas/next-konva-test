"use client";

import { IShape } from "@/interfaces/Shape.interface";
import { useRef, useState } from "react";
import { Layer, Line, Stage } from "react-konva";
import { ShapeInstance } from "@/components/canvas-ui/ShapeInstance";
import { useWindowDimensions } from "@/hooks/useWindow";
import { drawLines } from "@/helpers/drawSnapLines";
import {
  IGetSnapLinesResult,
  ISnapLineItem,
} from "@/interfaces/SnapLine.interface";
import { getShapeSnappingEdges } from "@/helpers/getShapeSnappingEdges";
import { getClosestSnapLines } from "@/helpers/getClosestSnapLines";
import { getSnapLines } from "@/helpers/getSnapLines";

interface Props {
  initialShapes: IShape[];
}

export const CanvaContainer = ({ initialShapes }: Props) => {
  const [shapes, setShapes] = useState([...initialShapes]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const { height, width } = useWindowDimensions();

  const stageRef = useRef<any>(null);

  const [hLines, setHLines] = useState<ISnapLineItem[]>([]);
  const [vLines, setVLines] = useState<ISnapLineItem[]>([]);

  /*
   * Function that deselects any shape when we click on an empty area
   */
  const checkDeselect = (e: any) => {
    const clickedonEmpty = e.target === e.target.getStage();
    if (clickedonEmpty) {
      setSelectedShapeId(null);
    }
  };

  /*
   * Function that handle the selection of the ShapeInstances
   */
  const onHandleSelect = (id: string) => {
    setSelectedShapeId(id);

    const internalShapes = shapes.slice(); //* Create a copy of the shapes
    const foundShape = internalShapes.find(
      (internalShapeItem) => internalShapeItem.id === id
    ) as IShape;
    const foundIndex = internalShapes.indexOf(foundShape);
    //* Removes the foundShape from the internal list
    internalShapes.splice(foundIndex, 1);
    //* And add it to the top making the Z-index applies
    internalShapes.push(foundShape);

    setShapes(internalShapes);
  };

  /*
   * Function that handle when the Transformer is being Dragging
   */
  const onHandleDragMove = (shapeId: string, selectedTransformRef: any) => {
    setSelectedShapeId(shapeId);

    const target = selectedTransformRef.current;
    const [selectedNode] = target.getNodes();

    if (!selectedNode) return;

    const possibleSnappingLines = getSnapLines(selectedNode, stageRef);
    const selectedShapeSnappingEdges = getShapeSnappingEdges(
      selectedTransformRef,
      stageRef
    );

    const closestSnapLines = getClosestSnapLines(
      possibleSnappingLines,
      selectedShapeSnappingEdges
    );

    //* If doesn't find any snapping line it will do nothing
    if (closestSnapLines.length === 0) {
      setHLines([]);
      setVLines([]);

      return;
    }

    //* If find any snapping it'll draw the lines
    const { hLines, vLines } = drawLines(closestSnapLines);

    setVLines(vLines);
    setHLines(hLines);

    const orgAbsPos = target.absolutePosition();
    const absPos = target.absolutePosition();

    //* Find new position
    closestSnapLines.forEach((l) => {
      const position = l.snapLine + l.offset;
      if (l.orientation === "V") {
        absPos.x = position;
      } else if (l.orientation === "H") {
        absPos.y = position;
      }
    });

    //* Calculate the difference between original and new position
    const vecDiff = {
      x: orgAbsPos.x - absPos.x,
      y: orgAbsPos.y - absPos.y,
    };

    //* apply the difference to the selected shape.
    const nodeAbsPos = selectedNode.getAbsolutePosition();
    const newPos = {
      x: nodeAbsPos.x - vecDiff.x,
      y: nodeAbsPos.y - vecDiff.y,
    };

    //* Set the absolute position
    selectedNode.setAbsolutePosition(newPos);
  };

  return (
    <>
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <Layer>
          {shapes.map(({ id, ...props }, index) => (
            <ShapeInstance
              onTransformDragMove={onHandleDragMove}
              key={index}
              id={id}
              isSelected={id === selectedShapeId}
              onSelect={() => onHandleSelect(id)}
              onDragStart={() => {
                setSelectedShapeId(id);
              }}
              onCompletedDragEnd={() => {
                setVLines([]);
                setHLines([]);
              }}
              onChange={(newAttrs: any) => {
                /*
                 * This function removes the old shape setting and updates it with the new values that we updated
                 */
                const internalShapes = shapes.slice();
                internalShapes[index] = {
                  ...internalShapes[index],
                  ...newAttrs,
                };
                setShapes(internalShapes);
              }}
              {...props}
            />
          ))}

          {hLines.map((item: any, i) => (
            <Line key={i} {...item} />
          ))}
          {vLines.map((item: any, i) => (
            <Line key={i} {...item} />
          ))}
        </Layer>
      </Stage>
    </>
  );
};
