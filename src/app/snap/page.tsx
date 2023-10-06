"use client";

import { useRef, useState } from "react";
import { Circle, Layer, Line, Rect, Stage, Transformer } from "react-konva";

const SHAPES = [
  {
    id: "1",
    x: 0,
    y: 0,
    height: 100,
    width: 100,
    fill: "red",
    shape: Rect,
  },
  {
    id: "2",
    x: 170,
    y: 150,
    height: 100,
    width: 100,
    fill: "blue",
    shape: Rect,
  },
  {
    id: "3",
    x: 200,
    y: 350,
    height: 100,
    width: 100,
    fill: "black",
    shape: Circle,
  },
  {
    id: "4",
    x: 450,
    y: 250,
    height: 100,
    width: 100,
    fill: "green",
    shape: Circle,
  },
];

const SNAP_THRESHOLD = 5;

export default function Page() {
  const [shapes, setShapes] = useState(SHAPES);
  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const [hLines, setHLines] = useState([]);
  const [vLines, setVLines] = useState([]);

  const onDragMove = () => {
    const target = transformerRef.current;
    const [selectedNode] = target.getNodes();

    if (!selectedNode) return;

    const possibleSnappingLines = getSnapLines(selectedNode);
    const selectedShapeSnappingEdges = getShapeSnappingEdges();

    const closestSnapLines = getClosestSnapLines(
      possibleSnappingLines,
      selectedShapeSnappingEdges
    );

    // Do nothing if no snapping lines
    if (closestSnapLines.length === 0) {
      setHLines([]);
      setVLines([]);

      return;
    }

    // draw the lines
    drawLines(closestSnapLines);

    const orgAbsPos = target.absolutePosition();
    const absPos = target.absolutePosition();

    // Find new position
    closestSnapLines.forEach((l) => {
      const position = l.snapLine + l.offset;
      if (l.orientation === "V") {
        absPos.x = position;
      } else if (l.orientation === "H") {
        absPos.y = position;
      }
    });

    // calculate the difference between original and new position
    const vecDiff = {
      x: orgAbsPos.x - absPos.x,
      y: orgAbsPos.y - absPos.y,
    };

    // apply the difference to the selected shape.
    const nodeAbsPos = selectedNode.getAbsolutePosition();
    const newPos = {
      x: nodeAbsPos.x - vecDiff.x,
      y: nodeAbsPos.y - vecDiff.y,
    };

    selectedNode.setAbsolutePosition(newPos);
  };

  const drawLines = (lines: any[] = []) => {
    if (lines.length > 0) {
      const lineStyle = {
        stroke: "rgb(0, 161, 255)",
        strokeWidth: 1,
        name: "guid-line",
        dash: [4, 6],
      };
      const hLines: any = [];
      const vLines: any = [];
      lines.forEach((l: any) => {
        if (l.orientation === "H") {
          const line = {
            points: [-6000, 0, 6000, 0],
            x: 0,
            y: l.snapLine,
            ...lineStyle,
          };
          hLines.push(line);
        } else if (l.orientation === "V") {
          const line = {
            points: [0, -6000, 0, 6000],
            x: l.snapLine,
            y: 0,
            ...lineStyle,
          };
          vLines.push(line);
        }
      });

      // Set state
      setHLines(hLines);
      setVLines(vLines);
    }
  };

  interface getClosestSnapLinesProps {
    possibleSnapLines: any;
    shapeSnappingEdges: any;
  }

  const getClosestSnapLines = (
    possibleSnapLines: any,
    shapeSnappingEdges: any
  ) => {
    const getAllSnapLines = (direction: any) => {
      const result: any[] = [];
      possibleSnapLines[direction].forEach((snapLine: any) => {
        shapeSnappingEdges[direction].forEach((snappingEdge: any) => {
          const diff = Math.abs(snapLine - snappingEdge.guide);
          // If the distance between the line and the shape is less than the threshold, we will consider it a snapping point.
          if (diff > SNAP_THRESHOLD) return;

          const { snap, offset } = snappingEdge;
          result.push({ snapLine, diff, snap, offset });
        });
      });
      return result;
    };

    const resultV = getAllSnapLines("vertical");
    const resultH = getAllSnapLines("horizontal");

    const closestSnapLines = [];

    interface getSnapLineProps {
      snapLine: any;
      offset: any;
      snap: any;
    }

    const getSnapLine = (
      { snapLine, offset, snap }: getSnapLineProps,
      orientation: any
    ) => {
      return { snapLine, offset, orientation, snap };
    };

    // find closest vertical and horizontal snappping lines
    const [minV] = resultV.sort((a, b) => a.diff - b.diff);
    const [minH] = resultH.sort((a, b) => a.diff - b.diff);
    if (minV) closestSnapLines.push(getSnapLine(minV, "V"));
    if (minH) closestSnapLines.push(getSnapLine(minH, "H"));

    return closestSnapLines;
  };

  const getSnapLines = (excludedShape: any) => {
    const stage = stageRef.current;
    if (!stage) return;

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

  const getShapeSnappingEdges = () => {
    const stage = stageRef.current;
    const tr = transformerRef.current;

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

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Stage
        onClick={(e) =>
          e.target === stageRef.current && transformerRef.current.nodes([])
        }
        ref={stageRef}
        width={1000}
        height={1000}
      >
        <Layer>
          {shapes.map(({ shape: Shape, ...props }, index) => (
            <Shape
              key={String(props.id)}
              draggable
              name="shape"
              onMouseDown={(e) =>
                transformerRef.current.nodes([e.currentTarget])
              }
              {...props}
            />
          ))}
          <Transformer ref={transformerRef} onDragMove={onDragMove} />
          {hLines.map((item: any, i) => (
            <Line key={i} {...item} />
          ))}
          {vLines.map((item: any, i) => (
            <Line key={i} {...item} />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
