import { useEffect, useRef, useState } from "react";

export const useResize = (
  boundsRef: React.RefObject<HTMLElement>,
  initialSize: { width: number; height: number }
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

  const resizeMouseMove = (e: { clientX: number; clientY: number }) => {
    const newWidth = Math.min(
      e.clientX - resizeStartPos.current.x,
      bounds.width
    );
    const newHeight = Math.min(
      e.clientY - resizeStartPos.current.y,
      bounds.height
    );

    if (newWidth > 100 && newHeight > 100) {
      setSize({ width: newWidth, height: newHeight });
    }
  };

  const resizeMouseup = () => {
    document.removeEventListener("mousemove", resizeMouseMove);
    document.removeEventListener("mouseup", resizeMouseup);
    setIsResizing(false);
  };

  const resizeMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    resizeStartPos.current.x = e.clientX - size.width;
    resizeStartPos.current.y = e.clientY - size.height;
    document.addEventListener("mousemove", resizeMouseMove);
    document.addEventListener("mouseup", resizeMouseup);
  };

  const currentSize = {
    width: size.width,
    height: size.height,
  };

  return { currentSize, isResizing, resizeMouseDown };
};
