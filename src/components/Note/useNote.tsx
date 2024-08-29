import { FormEvent, useState } from "react";
import { useNotes } from "../../utils/hooks/useNotes";
import { NoteType } from "../../utils/types";

export const useNote = (data: NoteType) => {
  const { title, content } = data;
  const [edit, setEdit] = useState(false);
  const { state, editNote } = useNotes();

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

  const renderNoteContent = () => {
    return (
      <>
        {!edit && (
          <button
            disabled={state.isLoading}
            className="edit-button"
            onClick={handleEditState}
          >
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
      </>
    );
  };

  return {
    edit,
    renderNoteContent,
    handleEditNote,
    handleEditState,
    handleSubmit,
  };
};
