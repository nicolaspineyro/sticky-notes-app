import { NoteType } from "../../utils/types";
import { useResize } from "../../utils/hooks/useResize";
import { useDragAndStick } from "../../utils/hooks/useDragAndStick";
import { useNote } from "./useNote";
import { useRef } from "react";

export interface INoteProps {
  data: NoteType;
  boundsRef: React.RefObject<HTMLElement>;
}

const Note = ({ data, boundsRef }: INoteProps) => {
  const { color, position: initialPosition, size: initialSize } = data;
  const noteRef = useRef<HTMLElement>(null);
  const { renderNoteContent, handleDragEnd, handleResizeEnd } = useNote(data);
  const { currentSize, isResizing, resizeMouseDown } = useResize(
    initialSize,
    boundsRef
  );
  const {
    position: currentPosition,
    isDragging,
    isOverDeleteZone,
    stickyStyles,
    handleMouseDown,
  } = useDragAndStick(initialPosition, boundsRef, noteRef);

  return (
    <article
      ref={noteRef}
      className={`note ${isResizing || isDragging ? "no-select" : ""} ${
        isOverDeleteZone ? "note-delete-zone" : ""
      } `}
      style={{
        ...stickyStyles,
        ...currentSize,
        backgroundColor: color,
      }}
      onMouseUp={(e) => handleDragEnd(e, currentPosition)}
      onMouseDown={handleMouseDown}
    >
      {renderNoteContent()}
      <div
        className="resize-border"
        onMouseDown={resizeMouseDown}
        onMouseUp={() => handleResizeEnd(currentSize)}
      />
    </article>
  );
};

export default Note;
