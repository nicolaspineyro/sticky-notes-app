import { NoteType } from "../../utils/types";
import { useResize } from "../../utils/hooks/useResize";
import { useDragAndStick } from "../../utils/hooks/useDragAndStick";
import { useNote } from "./useNote";

interface INoteProps {
  data: NoteType;
  boundsRef: React.RefObject<HTMLElement>;
}

const Note = ({ data, boundsRef }: INoteProps) => {
  const { id, color } = data;
  const { renderNoteContent } = useNote(data);
  const { resizeStyles, isResizing, resizeMouseDown } = useResize();
  const { dragRef, stickyStyles, handleDrag, handleDragStart } =
    useDragAndStick(id, boundsRef);

  return (
    <article
      ref={dragRef}
      className={"note"}
      style={{
        ...stickyStyles,
        ...resizeStyles,
        backgroundColor: color,
      }}
      draggable={!isResizing}
      onDrag={handleDrag}
      onDragStart={handleDragStart}
    >
      {renderNoteContent()}
      <div className="resize-border" onMouseDown={resizeMouseDown} />
    </article>
  );
};

export default Note;
