import { useCallback } from "react";
import { useNotes } from "../../utils/hooks/useNotes";
import { NoteType, PositionType, SizeType } from "../../utils/types";
import LoadingSpinner from "../UI/LoadingSpinner";
import { debounce, isInDeleteZone } from "../../utils";

export const useNote = (data: NoteType) => {
  const { title, content } = data;
  const { state, editNote, deleteNote, saveNotePosition, saveNoteSize } =
    useNotes();

  const handleEdit = (e: React.ChangeEvent<HTMLFormElement>) => {
    const targetName = e.target.name;
    const value = e.target.value;
    const newNote = {
      ...data,
      [targetName]: value,
    };
    editNote(newNote);
  };

  const debouncedHandleEdit = useCallback(debounce(handleEdit, 500), [
    data,
    editNote,
  ]);

  const handleEditNote = (note: NoteType) => editNote(note);

  const handleDragEnd = (e: React.MouseEvent, position: PositionType) => {
    if (isInDeleteZone(e.clientX, e.clientY)) {
      deleteNote(data.id);
    } else {
      saveNotePosition(data.id, position);
    }
  };

  const handleResizeEnd = (size: SizeType) => {
    saveNoteSize(data.id, size);
  };

  const renderNoteContent = () => {
    return (
      <>
        {state.isLoading && state.id === data.id ? <LoadingSpinner /> : null}
        <form onChange={debouncedHandleEdit}>
          <input name="title" defaultValue={title} />
          <textarea name="content" defaultValue={content} />
        </form>
      </>
    );
  };

  return {
    renderNoteContent,
    handleEditNote,
    handleResizeEnd,
    handleDragEnd,
  };
};
