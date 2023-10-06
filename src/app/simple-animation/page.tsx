"use client";

import { Component, useRef } from "react";
import { Stage, Layer, Rect } from "react-konva";

const MyRect = () => {
  const ref = useRef<any>(null);

  const changeSize = () => {
    // to() is a method of `Konva.Node` instances
    ref.current!.to({
      scaleX: Math.random() + 0.8,
      scaleY: Math.random() + 0.8,
      duration: 0.2,
    });
  };

  return (
    <Rect
      ref={ref}
      width={50}
      height={50}
      fill="green"
      draggable
      onDragEnd={changeSize}
      onDragStart={changeSize}
    />
  );
};

export default function Page() {
  return (
    <Stage width={1000} height={1000}>
      <Layer>
        <MyRect />
      </Layer>
    </Stage>
  );
}
