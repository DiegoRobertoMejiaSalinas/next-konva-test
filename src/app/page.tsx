"use client";

import { CanvaContainer } from "@/components/CanvaContainer";
import Ruler from "@/components/Ruler";
import { initialShapes } from "@/constants/initialShapes.cst";

export default function Page() {
  return (
    <div>
      <Ruler>
        <CanvaContainer initialShapes={initialShapes}></CanvaContainer>
      </Ruler>
    </div>
  );
}
