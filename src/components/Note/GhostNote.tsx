import { useCallback, useEffect, useRef, useState } from "react";
import { NoteType, PositionType } from "../../utils/types";
import { useNote } from "./useNote";

interface IGhostNoteProps {
  data: NoteType;
  boundsRef: React.RefObject<HTMLElement>;
  onCommit: (e: React.MouseEvent<HTMLElement>, position: PositionType) => void;
}

const GhostNote = ({ data, boundsRef, onCommit }: IGhostNoteProps) => {
  const [position, setPosition] = useState(data.position);
  const ghostNoteRef = useRef<HTMLElement>(null);
  const { renderNoteContent } = useNote(data);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!boundsRef.current || !ghostNoteRef.current) return;

      const whiteBoardRect = boundsRef.current.getBoundingClientRect();
      const ghostNoteWidth = data.size.width;
      const ghostNoteHeight = data.size.height;

      let newX = e.clientX - ghostNoteWidth;
      let newY = e.clientY - ghostNoteHeight;

      const minX = whiteBoardRect.left;
      const maxX = whiteBoardRect.right - ghostNoteWidth - 50;
      const minY = whiteBoardRect.top;
      const maxY = whiteBoardRect.bottom - ghostNoteHeight - 65;

      newX = Math.max(minX, Math.min(newX, maxX));
      newY = Math.max(minY, Math.min(newY, maxY));

      setPosition({ x: newX, y: newY });
    },
    [data.size.width, data.size.height, boundsRef]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <article
      ref={ghostNoteRef}
      className={"note"}
      style={{
        width: data.size.width,
        height: data.size.height,
        left: position.x,
        top: position.y,
        opacity: 0.5,
        backgroundColor: data.color,
        position: "absolute",
        zIndex: 999,
      }}
      onClick={(e) => onCommit(e, position)}
    >
      {renderNoteContent()}
    </article>
  );
};

export default GhostNote;
