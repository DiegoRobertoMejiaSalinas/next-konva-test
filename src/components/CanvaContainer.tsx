"use client";

import { IShape } from "@/interfaces/Shape.interface";
import { useState } from "react";
import { Layer, Stage } from "react-konva";
import { ShapeInstance } from "@/components/canvas-ui/ShapeInstance";
import { useWindowDimensions } from "@/hooks/useWindow";

interface Props {
  initialShapes: IShape[];
}

export const CanvaContainer = ({ initialShapes }: Props) => {
  const [shapes, setShapes] = useState([...initialShapes]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const { height, width } = useWindowDimensions();

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

  return (
    <>
      <Stage
        width={width}
        height={height}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <Layer>
          {shapes.map(({ id, ...props }, index) => (
            <ShapeInstance
              key={index}
              {...props}
              id={id}
              isSelected={id === selectedShapeId}
              onSelect={() => onHandleSelect(id)}
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
            />
          ))}
        </Layer>
      </Stage>
    </>
  );
};
