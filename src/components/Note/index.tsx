import { NoteType } from "../../utils/types";
import { useResize } from "../../utils/hooks/useResize";
import { useDragAndStick } from "../../utils/hooks/useDragAndStick";
import { FormEvent, useState } from "react";
import { useNotes } from "../../utils/hooks/useNotes";

interface INoteProps {
  data: NoteType;
  boundsRef: React.RefObject<HTMLElement>;
}

const Note = ({ data, boundsRef }: INoteProps) => {
  const { id, title, content, color } = data;
  const [edit, setEdit] = useState(false);
  const { resizeStyles, isResizing, resizeMouseDown } = useResize();
  const { dragRef, stickyStyles, handleDrag, handleDragStart } =
    useDragAndStick(id, boundsRef);
  const { editNote } = useNotes();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newNote = {
      ...data,
      title: formData.get("title") as string,
      content: formData.get("content") as string,
    };
    handleEditNote(newNote);
    setEdit(false);
  };

  const handleEditNote = (note: NoteType) => editNote(note);
  const handleEditState = () => setEdit((p) => !p);

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
      {!edit && (
        <button className="edit-button" onClick={handleEditState}>
          <i className="fas fa-edit"></i>
        </button>
      )}
      {edit ? (
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input name="title" defaultValue={title} />
          </div>

          <div className="field">
            <label htmlFor="content">Content</label>
            <textarea name="content" defaultValue={content} />
          </div>
          <button type="submit">Save</button>
        </form>
      ) : (
        <>
          <h4>{title}</h4>
          <p>{content}</p>
        </>
      )}
      <div className="resize-border" onMouseDown={resizeMouseDown} />
    </article>
  );
};

export default Note;
