"use client";

interface Props {
  rulerRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
}

const RULER_PADDING = 30;

export const useRuler = ({ rulerRef, containerRef }: Props) => {
  const renderRuler = () => {
    const ruler = (window as any).ruler;

    const myRuler = new ruler({
      // reference to DOM element to apply rulers on
      container: rulerRef.current,
      rulerHeight: RULER_PADDING, // thickness of ruler
      fontFamily: "arial", // font for points
      fontSize: "10px",
      strokeStyle: "#CCCCCC",
      lineWidth: 1,
      enableMouseTracking: true,
      enableToolTip: true,
    });

    myRuler.api.setPos({ x: 0, y: 0 });

    for (
      let i = 0;
      i < containerRef.current!.getBoundingClientRect().height;
      i = i + 50
    ) {
      myRuler.api.setGuides([{ dimension: 2, posX: 0, posY: i }]);
    }

    for (
      let i = 0;
      i < containerRef.current!.getBoundingClientRect().width;
      i = i + 50
    ) {
      myRuler.api.setGuides([{ dimension: 1, posX: i, posY: 0 }]);
    }

    myRuler.api.toggleRulerVisibility(true);
    myRuler.api.toggleGuideVisibility(true);
  };

  return {
    renderRuler,
  };
};
