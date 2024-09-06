import { useCallback, useState } from "react";
import { isInDeleteZone, simulateApiCall } from "..";
import { useNotesContext } from "../context/NotesContext";
import { NOTES_COLORS } from "../typescript/enums";
import { PositionType, NoteType, SizeType } from "../typescript/types";

export const useNotesManager = () => {
  const { state, dispatch } = useNotesContext();

  const [draftNote, setDraftNote] = useState<{
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

  const deleteNote = useCallback(
    async (id: number) => {
      dispatch({ type: "DELETE_NOTE_START", payload: id });
      try {
        await simulateApiCall(id);
        dispatch({ type: "DELETE_NOTE_SUCCESS", payload: id });
      } catch (error) {
        console.error(error);
        dispatch({
          type: "DELETE_NOTE_ERROR",
          payload: "Failed to delete note",
        });
      }
    },
    [dispatch]
  );

  const saveNotePosition = useCallback(
    (id: number, position: PositionType) => {
      dispatch({ type: "SAVE_NOTE_POSITION", payload: { id, position } });
    },
    [dispatch]
  );

  const saveNoteSize = useCallback(
    (id: number, size: SizeType) => {
      dispatch({ type: "SAVE_NOTE_SIZE", payload: { id, size } });
    },
    [dispatch]
  );

  const editNote = useCallback(
    async (updatedNote: NoteType) => {
      dispatch({ type: "UPDATE_NOTE_START", payload: updatedNote.id });
      try {
        const editedNote = await simulateApiCall(updatedNote);
        dispatch({ type: "UPDATE_NOTE_SUCCESS", payload: editedNote });
      } catch (error) {
        console.error(error);
        dispatch({ type: "UPDATE_NOTE_ERROR", payload: "Failed to edit note" });
      }
    },
    [dispatch]
  );

  const commitNote = useCallback(
    (e: React.MouseEvent<HTMLElement>, position: PositionType) => {
      if (isInDeleteZone(e.clientX, e.clientY)) {
        setDraftNote({ isActive: false, note: undefined });
        return;
      }
      if (draftNote.isActive && draftNote.note !== undefined) {
        addNote({ ...draftNote.note, position });
        setDraftNote({ isActive: false, note: undefined });
      }
    },
    [addNote, draftNote.isActive, draftNote.note]
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
      setDraftNote({ isActive: true, note: newNote });
    },
    []
  );

  return {
    draftNote,
    isLoading: state.isLoading,
    loadingId: state.id,
    addNote,
    deleteNote,
    editNote,
    saveNotePosition,
    saveNoteSize,
    commitNote,
    initAddNote,
  };
};
