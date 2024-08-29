import { NoteType } from "../../utils/types";
import { useResize } from "../../utils/hooks/useResize";
import { useDragAndStick } from "../../utils/hooks/useDragAndStick";
import { useNote } from "./useNote";
import { useRef } from "react";

interface INoteProps {
  data: NoteType;
  boundsRef: React.RefObject<HTMLElement>;
}

const Note = ({ data, boundsRef }: INoteProps) => {
  const { id, color, position: initialPosition, size: initialSize } = data;
  const noteRef = useRef<HTMLElement>(null);
  const { renderNoteContent, handleDragEnd, handleResizeEnd } = useNote(data);
  const {
    position: currentPosition,
    stickyStyles,
    handleDrag,
    handleDragStart,
  } = useDragAndStick(id, initialPosition, boundsRef, noteRef);
  const { currentSize, isResizing, resizeMouseDown } = useResize(
    boundsRef,
    initialSize
  );

  return (
    <article
      id={`note-${id}`}
      ref={noteRef}
      className={`note ${isResizing ? "no-select" : ""}`}
      style={{
        ...stickyStyles,
        ...currentSize,
        backgroundColor: color,
      }}
      draggable={!isResizing}
      onDrag={handleDrag}
      onDragStart={handleDragStart}
      onDragEnd={(e: React.DragEvent) => handleDragEnd(e, currentPosition)}
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
