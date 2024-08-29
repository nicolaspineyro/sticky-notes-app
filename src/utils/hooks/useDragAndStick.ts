import { useEffect, useRef, useState } from "react";
import { setZIndex } from "..";

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export const useDragAndStick = (
  id: number,
  boundsRef: React.RefObject<HTMLElement>
) => {
  const [position, setPosition] = useState({ x: 350, y: 350 });
  const [bounds, setBounds] = useState<Bounds>({
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
  });
  const dragRef = useRef<HTMLElement | null>(null);
  const dragStartPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updateBounds = () => {
      if (boundsRef.current && dragRef.current) {
        const whiteBoardRect = boundsRef.current.getBoundingClientRect();
        const noteRect = dragRef.current.getBoundingClientRect();

        setBounds({
          minX: 0,
          maxX: whiteBoardRect.width - noteRect.width,
          minY: whiteBoardRect.top,
          maxY: whiteBoardRect.height - noteRect.height,
        });
      }
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, [boundsRef]);

  const handleDragStart = (e: React.DragEvent) => {
    dragStartPosRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };

    if (e.dataTransfer) {
      e.dataTransfer.setData("text/plain", id.toString());
      e.dataTransfer.effectAllowed = "move";
    }

    dragRef.current = e.currentTarget as HTMLElement;
    setZIndex(dragRef.current);
  };

  const handleDrag = (e: React.DragEvent) => {
    if (e.clientX <= 0 && e.clientY <= 0) {
      return;
    }
    let newX = e.clientX - dragStartPosRef.current.x;
    let newY = e.clientY - dragStartPosRef.current.y;

    newX = Math.max(bounds.minX, Math.min(newX, bounds.maxX));
    newY = Math.max(bounds.minY, Math.min(newY, bounds.maxY));

    setPosition({ x: newX, y: newY });
  };

  const stickyStyles = {
    position: "absolute",
    top: position.y,
    left: position.x,
  } as React.CSSProperties;

  return { dragRef, stickyStyles, handleDragStart, handleDrag };
};
