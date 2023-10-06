"use client";

import { CanvaContainer } from "@/components/CanvaContainer";
import Ruler from "@/components/Ruler";
import { initialShapes } from "@/constants/initialShapes.cst";

export default function Page() {
  return (
    <div>
      <div className="overflow-auto flex flex-col align-center justify-center gap-5 pt-20">
        <div
          style={{ maxHeight: "90vh", maxWidth: "90vw" }}
          className="overflow-auto"
        >
          <Ruler height={30} width={50} unit="cm">
            <CanvaContainer initialShapes={initialShapes}></CanvaContainer>
          </Ruler>
        </div>
      </div>
    </div>
  );
}
