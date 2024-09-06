import { useCallback, useEffect, useState } from "react";
import { NoteType, PositionType } from "../../utils/typescript/types";

interface IGhostNoteProps {
  data: NoteType;
  boundsRef: React.RefObject<HTMLElement>;
  onCommit: (e: React.MouseEvent<HTMLElement>, position: PositionType) => void;
}

const GhostNote = ({ data, boundsRef, onCommit }: IGhostNoteProps) => {
  const { title, size, color, position: initialPosition } = data;
  const [position, setPosition] = useState(initialPosition);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (boundsRef.current) {
        const whiteBoardRect = boundsRef.current.getBoundingClientRect();
        const ghostNoteWidth = size.width;
        const ghostNoteHeight = size.height;

        let newX = e.clientX - ghostNoteWidth;
        let newY = e.clientY - ghostNoteHeight;

        const minX = whiteBoardRect.left;
        const maxX = whiteBoardRect.right - ghostNoteWidth - 48;
        const minY = whiteBoardRect.top;
        const maxY = whiteBoardRect.bottom - ghostNoteHeight - 64;

        newX = Math.max(minX, Math.min(newX, maxX));
        newY = Math.max(minY, Math.min(newY, maxY));

        setPosition({ x: newX, y: newY });
      }
    },
    [boundsRef, size.width, size.height]
  );

  const handleCommit = (e: React.MouseEvent<HTMLElement>) => {
    onCommit(e, position);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <article
      className={"note"}
      style={{
        position: "absolute",
        opacity: 0.5,
        zIndex: 999,
        width: size.width,
        height: size.height,
        left: position.x,
        top: position.y,
        backgroundColor: color,
      }}
      onClick={handleCommit}
    >
      <input name={"title"} disabled value={title} />
    </article>
  );
};

export default GhostNote;
