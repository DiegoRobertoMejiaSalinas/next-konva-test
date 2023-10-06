"use client";

import { useRuler } from "@/hooks/useRuler";
import Script from "next/script";
import React, { FC, useEffect, useRef } from "react";

interface RulerProps {
  width: number;
  height: number;
  unit: "px" | "cm" | "mm" | "in" | "pt";
  children?: React.ReactNode;
}

const RULER_PADDING = 30;

const Ruler: FC<RulerProps> = ({ children, height, width, unit }) => {
  const unique_id = new Date().getTime();

  const rulerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { renderRuler } = useRuler({ rulerRef, containerRef });

  return (
    <>
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: `calc(${width}${unit} + ${RULER_PADDING}px)`,
          height: `calc(${height}${unit} + ${RULER_PADDING}px)`,
        }}
        className="border-gray border-2 overflow-hidden mx-auto"
      >
        <div
          id="ruler"
          style={{
            position: "sticky",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
          }}
          ref={rulerRef}
        >
          <div
            className="content"
            style={{
              left: RULER_PADDING,
              top: RULER_PADDING,
              position: "absolute",
              zIndex: 10,
            }}
          >
            {children}
          </div>
        </div>
      </div>

      <Script
        src={`/rulerjs/ruler.min.js?v=${unique_id}`}
        onLoad={renderRuler}
      />
    </>
  );
};

export default Ruler;
