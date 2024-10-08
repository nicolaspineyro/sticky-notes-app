import { useEffect, useRef, useState } from "react";
import { isInDeleteZone, setZIndex } from "..";
import { PositionType } from "../typescript/types";

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export const useDragAndStick = (
  initialPosition: PositionType,
  boundsRef: React.RefObject<HTMLElement>,
  elementRef: React.RefObject<HTMLElement>
) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isOverDeleteZone, setIsOverDeleteZone] = useState(false);
  const [bounds, setBounds] = useState<Bounds>({
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
  });

  const dragStartPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updateBounds = () => {
      if (boundsRef.current && elementRef.current) {
        const whiteBoardRect = boundsRef.current.getBoundingClientRect();
        const noteRect = elementRef.current.getBoundingClientRect();

        setBounds({
          minX: whiteBoardRect.left,
          maxX: whiteBoardRect.right - noteRect.width,
          minY: whiteBoardRect.top,
          maxY: whiteBoardRect.bottom - noteRect.height,
        });
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateBounds();
    });

    if (elementRef.current) {
      resizeObserver.observe(elementRef.current);
    }

    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => {
      window.removeEventListener("resize", updateBounds);
      resizeObserver.disconnect();
    };
  }, [boundsRef, elementRef]);

  const dragAndStickMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartPosRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    setZIndex(elementRef.current);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    let newX = e.clientX - dragStartPosRef.current.x;
    let newY = e.clientY - dragStartPosRef.current.y;

    newX = Math.max(bounds.minX, Math.min(newX, bounds.maxX));
    newY = Math.max(bounds.minY, Math.min(newY, bounds.maxY));

    const isCurrentlyOverDeleteZone = isInDeleteZone(e.clientX, e.clientY);

    setIsOverDeleteZone(isCurrentlyOverDeleteZone);
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    setIsDragging(false);
  };

  const stickyStyles = {
    position: "absolute",
    top: position.y,
    left: position.x,
  } as React.CSSProperties;

  return {
    isDragging,
    isOverDeleteZone,
    position,
    stickyStyles,
    dragAndStickMouseDown,
  };
};
