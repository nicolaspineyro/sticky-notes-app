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
  initialPosition: { x: number; y: number },
  boundsRef: React.RefObject<HTMLElement>,
  elementRef: React.RefObject<HTMLElement>
) => {
  const [position, setPosition] = useState(initialPosition);
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
          minX: 0,
          maxX: whiteBoardRect.width - noteRect.width,
          minY: whiteBoardRect.top,
          maxY: whiteBoardRect.height - noteRect.height,
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

  const handleDragStart = (e: React.DragEvent) => {
    dragStartPosRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };

    const emptyImage = document.createElement("img");
    emptyImage.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
    e.dataTransfer.setData("text/plain", id.toString());
    e.dataTransfer.effectAllowed = "move";

    setZIndex(elementRef.current);
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

  return {
    position,
    stickyStyles,
    handleDragStart,
    handleDrag,
  };
};
