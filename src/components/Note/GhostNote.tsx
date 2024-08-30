import { NoteType } from "../../utils/types";
import { useNote } from "./useNote";

interface INoteProps {
  data: NoteType;
}

const Note = ({ data }: INoteProps) => {
  const { color, position, size } = data;
  const { renderNoteContent } = useNote(data);
  return (
    <article
      className={`note `}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
        opacity: 0.5,
        backgroundColor: color,
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      {renderNoteContent()}
    </article>
  );
};

export default Note;
