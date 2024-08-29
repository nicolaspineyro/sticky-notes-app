import { NoteType } from "../../utils/types";
import { useDragAndStick } from "../../utils/types/hooks/useDragAndStick";
import { useResize } from "../../utils/types/hooks/useResize";

interface INoteProps {
  data: NoteType;
  boundsRef: React.RefObject<HTMLElement>;
}

const Note = ({ data, boundsRef }: INoteProps) => {
  const { id, title, content, color } = data;
  const { dragRef, stickyStyles, handleDrag, handleDragStart } =
    useDragAndStick(id, boundsRef);
  const { resizeStyles, isResizing, resizeMouseDown } = useResize();

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
      <h4>{title}</h4>
      <p>{content}</p>
      <div className="resize-border" onMouseDown={resizeMouseDown} />
    </article>
  );
};

export default Note;
