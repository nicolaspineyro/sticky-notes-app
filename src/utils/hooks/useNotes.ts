import { simulateApiCall } from "..";
import { useNotesContext } from "../context/NotesContext";
import { NOTES_COLORS } from "../enums";
import { NoteType } from "../types";

export const useNotes = () => {
  const { state, dispatch } = useNotesContext();

  const addNote = async () => {
    dispatch({ type: "ADD_NOTE_START" });
    const newNote = {
      id: Math.floor(Math.random() * 100),
      title: "New Note",
      content: "New Note Content",
      color: Object.values(NOTES_COLORS)[Math.floor(Math.random() * 10)],
      created_at: new Date(),
    };
    try {
      const addedNote = await simulateApiCall(newNote);
      dispatch({ type: "ADD_NOTE_SUCCESS", payload: addedNote });
    } catch (error) {
      console.error(error);
      dispatch({ type: "ADD_NOTE_ERROR", payload: "Failed to add note" });
    }
  };

  const deleteNote = async (id: number) => {
    dispatch({ type: "DELETE_NOTE_START" });
    try {
      await simulateApiCall(id);
      dispatch({ type: "DELETE_NOTE_SUCCESS", payload: id });
    } catch (error) {
      console.error(error);
      dispatch({ type: "DELETE_NOTE_ERROR", payload: "Failed to delete note" });
    }
  };

  const editNote = async (updatedNote: NoteType) => {
    dispatch({ type: "UPDATE_NOTE_START" });
    try {
      const editedNote = await simulateApiCall(updatedNote);
      dispatch({ type: "UPDATE_NOTE_SUCCESS", payload: editedNote });
    } catch (error) {
      console.error(error);
      dispatch({ type: "UPDATE_NOTE_ERROR", payload: "Failed to edit note" });
    }
  };

  return {
    state,
    addNote,
    deleteNote,
    editNote,
  };
};
