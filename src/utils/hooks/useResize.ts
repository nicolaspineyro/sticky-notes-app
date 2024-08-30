import { useEffect, useRef, useState } from "react";
import { SizeType } from "../types";

export const useResize = (
  initialSize: SizeType,
  boundsRef: React.RefObject<HTMLElement>
) => {
  const [size, setSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0 });
  const elementStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updateBounds = () => {
      if (boundsRef.current) {
        const boundsRect = boundsRef.current.getBoundingClientRect();
        setBounds({
          width: boundsRect.width - 40,
          height: boundsRect.height - 40,
        });
      }
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, [boundsRef]);

  const resizeMouseMove = (e: MouseEvent) => {
    const newWidth = Math.min(
      Math.max(e.clientX - resizeStartPos.current.x, 100),
      bounds.width - elementStartPos.current.x
    );
    const newHeight = Math.min(
      Math.max(e.clientY - resizeStartPos.current.y, 100),
      bounds.height - elementStartPos.current.y
    );

    setSize({ width: newWidth, height: newHeight });
  };

  const resizeMouseup = () => {
    document.removeEventListener("mousemove", resizeMouseMove);
    document.removeEventListener("mouseup", resizeMouseup);
    setIsResizing(false);
  };

  const resizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);

    const element = e.currentTarget.parentElement;
    if (element) {
      const rect = element.getBoundingClientRect();
      elementStartPos.current = { x: rect.left, y: rect.top };
    }

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
