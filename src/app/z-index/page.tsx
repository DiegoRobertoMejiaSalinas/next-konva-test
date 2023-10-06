"use client";

import { Component, useState } from "react";
import Konva from "konva";
import { createRoot } from "react-dom/client";
import { Stage, Layer, Circle } from "react-konva";

const generateItems = () => {
  const items = [];
  for (let i = 0; i < 10; i++) {
    items.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      id: "node-" + i,
      color: Konva.Util.getRandomColor(),
    });
  }
  return items;
};

export default function Page() {
  const internalItems = generateItems();

  const [state, setState] = useState(internalItems);

  const handleDragStart = (e) => {
    const id = e.target.name();
    const items = state.slice();
    const item = items.find((i) => i.id === id);
    const index = items.indexOf(item);
    // remove from the list:
    items.splice(index, 1);
    // add to the top
    items.push(item);
    setState(items);
  };
  const handleDragEnd = (e) => {
    const id = e.target.name();
    const items = state.slice();
    const item = state.find((i) => i.id === id);
    const index = state.indexOf(item);
    // update item position
    items[index] = {
      ...item,
      x: e.target.x(),
      y: e.target.y(),
    };
    setState(items);
  };
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {state.map((item) => (
          <Circle
            key={item.id}
            name={item.id}
            draggable
            x={item.x}
            y={item.y}
            fill={item.color}
            radius={50}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
      </Layer>
    </Stage>
  );
}
