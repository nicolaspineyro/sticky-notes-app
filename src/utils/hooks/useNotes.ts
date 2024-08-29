import { simulateApiCall } from "..";
import { useNotesContext } from "../context/NotesContext";
import { NOTES_COLORS } from "../enums";
import { NoteType } from "../types";

export const useNotes = () => {
  const { state, dispatch } = useNotesContext();

  const addNote = async () => {
    const id = Math.floor(Math.random() * 999);
    dispatch({ type: "ADD_NOTE_START", payload: id });
    const newNote = {
      id: Math.floor(Math.random() * 999),
      title: "New Note",
      content: "New Note Content",
      color: Object.values(NOTES_COLORS)[Math.floor(Math.random() * 10)],
      created_at: new Date(),
      position: {
        x: 350,
        y: 350,
      },
      size: {
        width: 200,
        height: 200,
      },
    };
    dispatch({ type: "ADD_NOTE_SUCCESS", payload: newNote });
    try {
      const addedNote = await simulateApiCall(newNote);
      if (JSON.stringify(addedNote) !== JSON.stringify(newNote)) {
        dispatch({ type: "UPDATE_NOTE_SUCCESS", payload: addedNote });
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: "DELETE_NOTE_SUCCESS", payload: newNote.id });
      dispatch({ type: "ADD_NOTE_ERROR", payload: "Failed to add note" });
    }
  };

  const deleteNote = async (id: number) => {
    dispatch({ type: "DELETE_NOTE_START", payload: id });
    try {
      await simulateApiCall(id);
      dispatch({ type: "DELETE_NOTE_SUCCESS", payload: id });
    } catch (error) {
      console.error(error);
      dispatch({ type: "DELETE_NOTE_ERROR", payload: "Failed to delete note" });
    }
  };

  const saveNotePosition = (id: number, position: { x: number; y: number }) => {
    dispatch({ type: "SAVE_NOTE_POSITION", payload: { id, position } });
  };

  const saveNoteSize = (
    id: number,
    size: { width: number; height: number }
  ) => {
    dispatch({ type: "SAVE_NOTE_SIZE", payload: { id, size } });
  };

  const editNote = async (updatedNote: NoteType) => {
    dispatch({ type: "UPDATE_NOTE_START", payload: updatedNote.id });
    try {
      const editedNote = await simulateApiCall(updatedNote);
      dispatch({ type: "UPDATE_NOTE_SUCCESS", payload: editedNote });
    } catch (error) {
      console.error(error);
      dispatch({ type: "UPDATE_NOTE_ERROR", payload: "Failed to edit note" });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    deleteNote(Number(id));
  };

  return {
    state,
    addNote,
    deleteNote,
    editNote,
    handleDrop,
    saveNotePosition,
    saveNoteSize,
  };
};
