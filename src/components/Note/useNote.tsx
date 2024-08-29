import { useState } from "react";
import { useNotes } from "../../utils/hooks/useNotes";
import { NoteType } from "../../utils/types";
import LoadingSpinner from "../UI/LoadingSpinner";

export const useNote = (data: NoteType) => {
  const { title, content } = data;
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    title,
    content,
  });
  const { state, editNote, deleteNote, saveNotePosition, saveNoteSize } =
    useNotes();

  const handleBlur = (e: React.FocusEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const newNote = {
      ...data,
      content: formData.get("content") as string,
      title: formData.get("title") as string,
    };
    if (JSON.stringify(newNote) === JSON.stringify(data)) return;
    editNote(newNote);
    setEdit(false);
  };

  const handleChange = (e: {
    currentTarget: { value: string; name: string };
  }) => {
    const value = e.currentTarget.value;
    const name = e.currentTarget.name;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleEditNote = (note: NoteType) => editNote(note);
  const handleEditState = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setEdit((p) => !p);
  };

  const handleDragEnd = (
    e: React.MouseEvent,
    position: { x: number; y: number }
  ) => {
    const deleteZone = document.querySelector(".delete-zone");
    if (deleteZone) {
      const deleteZoneRect = deleteZone.getBoundingClientRect();
      if (
        e.clientX >= deleteZoneRect.left &&
        e.clientX <= deleteZoneRect.right &&
        e.clientY >= deleteZoneRect.top &&
        e.clientY <= deleteZoneRect.bottom
      ) {
        deleteNote(data.id);
      } else {
        saveNotePosition(data.id, position);
      }
    }
  };

  const handleResizeEnd = (size: { width: number; height: number }) => {
    saveNoteSize(data.id, size);
  };

  const renderNoteContent = () => {
    return (
      <>
        {state.isLoading && state.id === data.id ? <LoadingSpinner /> : null}
        {edit ? (
          <form onBlur={handleBlur}>
            <input onChange={handleChange} name="title" value={form.title} />
            <textarea
              onChange={handleChange}
              name="content"
              value={form.content}
            />
          </form>
        ) : (
          <div onClick={handleEditState}>
            <h4>{form.title}</h4>
            <p>{form.content}</p>
          </div>
        )}
      </>
    );
  };

  return {
    edit,
    renderNoteContent,
    handleEditNote,
    handleEditState,
    handleResizeEnd,
    handleDragEnd,
  };
};
