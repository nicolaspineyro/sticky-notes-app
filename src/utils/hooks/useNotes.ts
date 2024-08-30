import { useCallback, useState } from "react";
import { isInDeleteZone, simulateApiCall } from "..";
import { useNotesContext } from "../context/NotesContext";
import { NOTES_COLORS } from "../enums";
import { PositionType, NoteType, SizeType } from "../types";

export const useNotes = () => {
  const { state, dispatch } = useNotesContext();
  const [ghostNote, setGhostNote] = useState<{
    isActive: boolean;
    note?: NoteType;
  }>({
    isActive: false,
    note: undefined,
  });

  const addNote = useCallback(
    async (newNote: NoteType) => {
      dispatch({ type: "ADD_NOTE_START", payload: newNote.id });
      dispatch({ type: "ADD_NOTE_SUCCESS", payload: newNote });
      try {
        const addedNote = await simulateApiCall(newNote);
        if (JSON.stringify(addedNote) !== JSON.stringify(newNote)) {
          dispatch({ type: "UPDATE_NOTE_SUCCESS", payload: addedNote });
        }
      } catch (error) {
        console.error(error);
        dispatch({ type: "ADD_NOTE_ERROR", payload: "Failed to add note" });
      }
    },
    [dispatch]
  );

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

  const saveNotePosition = (id: number, position: PositionType) => {
    dispatch({ type: "SAVE_NOTE_POSITION", payload: { id, position } });
  };

  const saveNoteSize = (id: number, size: SizeType) => {
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

  const commitNote = useCallback(
    (e: React.MouseEvent<HTMLElement>, position: PositionType) => {
      if (isInDeleteZone(e.clientX, e.clientY)) {
        setGhostNote({ isActive: false, note: undefined });
        return;
      }
      if (ghostNote.isActive && ghostNote.note !== undefined) {
        addNote({ ...ghostNote.note, position });
        setGhostNote({ isActive: false, note: undefined });
      }
    },
    [addNote, ghostNote.isActive, ghostNote.note]
  );

  const initAddNote = useCallback(
    (e: React.MouseEvent<HTMLElement>, color?: NOTES_COLORS) => {
      const newNote = {
        id: Date.now(),
        title: "New Note",
        content: "",
        color: color
          ? color
          : Object.values(NOTES_COLORS)[Math.floor(Math.random() * 6)],
        created_at: new Date(),
        position: { x: e.clientX - 90, y: e.clientY - 90 },
        size: {
          width: 90,
          height: 90,
        },
      };
      setGhostNote({ isActive: true, note: newNote });
    },
    []
  );

  return {
    state,
    ghostNote,
    addNote,
    deleteNote,
    editNote,
    saveNotePosition,
    saveNoteSize,
    commitNote,
    initAddNote,
  };
};
