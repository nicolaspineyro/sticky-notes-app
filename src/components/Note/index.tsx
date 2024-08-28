import { NoteType } from "../../utils/types";
import { useDragAndStick } from "../../utils/types/hooks/useDragAndStick";

interface INoteProps {
  data: NoteType;
  boundsRef: React.RefObject<HTMLElement>;
}

const Note = ({ data, boundsRef }: INoteProps) => {
  const { id, title, content, color } = data;
  const { dragRef, stickyStyles, handleDrag, handleDragStart } =
    useDragAndStick(id, boundsRef);

  return (
    <article
      ref={dragRef}
      className={"note"}
      style={{
        ...stickyStyles,
        backgroundColor: color,
      }}
      draggable={true}
      onDrag={handleDrag}
      onDragStart={handleDragStart}
    >
      <h4>{title}</h4>
      <p>{content}</p>
    </article>
  );
};

export default Note;
