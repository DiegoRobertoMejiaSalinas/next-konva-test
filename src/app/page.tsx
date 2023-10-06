"use client";

import Ruler from "@/components/Ruler";
import Konva from "konva";
import { useRef, useState } from "react";
import { Stage, Layer, Circle } from "react-konva";

const generateItems = () => {
  const items = [];
  for (let i = 0; i < 10; i++) {
    items.push({
      x: Math.random() * 10000,
      y: Math.random() * 1000,
      id: "node-" + i,
      color: Konva.Util.getRandomColor(),
    });
  }
  return items;
};

export default function Page() {
  const internalItems = generateItems();

  const [state, setState] = useState(internalItems);

  const handleDragStart = (e: any) => {
    const id = e.target.name();
    const items = state.slice();
    const item = items.find((i) => i.id === id);
    const index = items.indexOf(item!);
    // remove from the list:
    items.splice(index, 1);
    // add to the top
    items.push(item!);
    setState(items);
  };
  const handleDragEnd = (e: any) => {
    const id = e.target.name();
    const items = state.slice();
    const item = state.find((i) => i.id === id)!;
    const index = state.indexOf(item!);
    // update item position
    items[index] = {
      ...item,
      x: e.target.x(),
      y: e.target.y(),
    };
    setState(items);
  };

  return (
    <div>
      <Ruler>
        <Stage width={1000} height={1000}>
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
      </Ruler>
    </div>
  );
}
