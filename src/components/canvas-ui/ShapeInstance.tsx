import { IShapeInstance } from "@/interfaces/ShapeInstance.interface";
import { KonvaEventObject } from "konva/lib/Node";
import { Box } from "konva/lib/shapes/Transformer";
import { useEffect, useRef } from "react";
import { Transformer } from "react-konva";

const LIMIT_SCALE_RESIZE = 5;

export const ShapeInstance = ({
  id,
  isSelected,
  onChange,
  onSelect,
  shape,
  onCompletedDragEnd,
  onTransformDragMove,
  ...props
}: IShapeInstance) => {
  const shapeRef = useRef<any>(null);
  const transformRef = useRef<any>(null);

  /*
   * useEffect that shows if the ShapeInstance is selected or not to show the Transformer
   */
  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      transformRef.current!.nodes([shapeRef.current]);
      transformRef.current!.getLayer().batchDraw();
    }
  }, [isSelected]);

  /*
   * Function that updates the x and y coordinates of the shape without alter the other props, also these values are emitted
   */
  const onHandleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    onChange({
      ...props,
      x: e.target.x(),
      y: e.target.y(),
    });

    onCompletedDragEnd(e);
  };

  /*
   * Function that transform (scale and rotate) a shape instance
   * and NOT its width or height but in the store we only
   * have width and height to match the date better
   * we will reset scale on transform end
   * Also will emit these new values
   */
  const onHandleTransformEnd = (e: KonvaEventObject<Event>) => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    //* We will reset it back
    node.scaleX(1);
    node.scaleY(1);

    onChange({
      ...props,
      x: node.x(),
      y: node.y(),
      //* We'll set minimal value
      width: Math.max(LIMIT_SCALE_RESIZE, node.width() * scaleX),
      height: Math.max(node.height() * scaleY),
    });
  };

  /*
   * Function that handle the Transform bound box actions
   */
  const onHandleBoundBoxFunc = (oldBox: Box, newBox: Box) => {
    //* We'll establish a limit resize scale of 5
    if (
      newBox.width < LIMIT_SCALE_RESIZE ||
      newBox.height < LIMIT_SCALE_RESIZE
    ) {
      return oldBox;
    }

    return newBox;
  };

  //* Create a new variable with JSX rules for Component from shape
  const CustomShape = shape;

  return (
    <>
      <CustomShape
        id={id}
        ref={shapeRef}
        onClick={onSelect}
        onTap={onSelect}
        draggable
        name="shape"
        onDragEnd={onHandleDragEnd}
        onTransformEnd={onHandleTransformEnd}
        {...props}
      />
      {isSelected && (
        //* Component imported from Konva that
        //* handle the transform actions into the
        //* shape instance
        <Transformer
          ref={transformRef}
          boundBoxFunc={onHandleBoundBoxFunc}
          onDragMove={() => onTransformDragMove(id, transformRef)}
        />
      )}
    </>
  );
};
