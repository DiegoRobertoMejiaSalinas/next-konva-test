"use client";

import { useRuler } from "@/hooks/useRuler";
import Script from "next/script";
import React, { FC, useRef } from "react";

interface RulerProps {
  children?: React.ReactNode;
}

const RULER_PADDING = 30;

const Ruler: FC<RulerProps> = ({ children }) => {
  const rulerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { renderRuler } = useRuler({ rulerRef, containerRef });

  return (
    <>
      <div
        className="container"
        ref={containerRef}
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
        }}
      >
        <div
          id="ruler"
          style={{
            position: "absolute",
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
              left: 30,
              top: 30,
              position: "absolute",
              zIndex: 10,
            }}
          >
            {children}
          </div>
        </div>
      </div>

      <Script src="/rulerjs/ruler.min.js" onLoad={renderRuler} />
    </>
  );
};

export default Ruler;
