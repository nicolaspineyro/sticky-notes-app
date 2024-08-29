import { useState } from "react";

export const useResize = () => {
  const resizeStartPos = { x: 0, y: 0 };
  const [size, setSize] = useState({ width: 200, height: 200 });
  const [isResizing, setIsResizing] = useState(false);

  const resizeStyles = {
    width: size.width,
    height: size.height,
  };

  const resizeMouseMove = (e: { clientX: number; clientY: number }) => {
    const newWidth = e.clientX - resizeStartPos.x;
    const newHeight = e.clientY - resizeStartPos.y;

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
    resizeStartPos.x = e.clientX - size.width;
    resizeStartPos.y = e.clientY - size.height;
    document.addEventListener("mousemove", resizeMouseMove);
    document.addEventListener("mouseup", resizeMouseup);
  };

  return { resizeStyles, isResizing, resizeMouseDown };
};
