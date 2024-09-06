import { useCallback, useEffect, useRef, useState } from "react";
import { SizeType } from "../typescript/types";

export const useResize = (
  initialSize: SizeType,
  boundsRef: React.RefObject<HTMLElement>
) => {
  const [size, setSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updateBounds = () => {
      if (boundsRef.current) {
        const boundsRect = boundsRef.current.getBoundingClientRect();
        setBounds({
          width: boundsRect.width,
          height: boundsRect.height,
        });
      }
    };
    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, [boundsRef]);

  const resizeMouseMove = useCallback(
    (e: MouseEvent) => {
      const newWidth = Math.min(
        Math.max(e.clientX - resizeStartPos.current.x, 100),
        bounds.width - resizeStartPos.current.x
      );
      const newHeight = Math.min(
        Math.max(e.clientY - resizeStartPos.current.y, 100),
        bounds.height - resizeStartPos.current.y
      );
      setSize({ width: newWidth, height: newHeight });
    },
    [bounds.height, bounds.width]
  );

  const resizeMouseup = useCallback(() => {
    document.removeEventListener("mousemove", resizeMouseMove);
    document.removeEventListener("mouseup", resizeMouseup);
    setIsResizing(false);
  }, [resizeMouseMove]);

  const resizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsResizing(true);

      resizeStartPos.current.x = e.clientX - size.width;
      resizeStartPos.current.y = e.clientY - size.height;

      document.addEventListener("mousemove", resizeMouseMove);
      document.addEventListener("mouseup", resizeMouseup);
    },
    [resizeMouseMove, resizeMouseup, size.height, size.width]
  );

  const currentSize = {
    width: size.width,
    height: size.height,
  };

  return {
    currentSize,
    isResizing,
    resizeMouseDown,
  };
};
