import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { NotesActions, NoteType } from "../typescript/types";
import { loadNotesFromLocalStorage, saveNotesToLocalStorage } from "..";

interface NotesState {
  notes: NoteType[];
  isLoading: boolean;
  id: number | null;
  error: string | null;
}

const NotesContext = createContext<
  | {
      state: NotesState;
      dispatch: React.Dispatch<NotesActions>;
    }
  | undefined
>(undefined);

const notesReducer = (state: NotesState, action: NotesActions): NotesState => {
  let newState: NotesState;

  switch (action.type) {
    case "FETCH_NOTES_SUCCESS":
      newState = { ...state, notes: action.payload, isLoading: false };
      saveNotesToLocalStorage(newState.notes);
      break;
    case "ADD_NOTE_START":
    case "UPDATE_NOTE_START":
    case "DELETE_NOTE_START":
      newState = {
        ...state,
        isLoading: true,
        error: null,
        id: action.payload,
      };
      break;
    case "ADD_NOTE_SUCCESS":
      newState = {
        ...state,
        notes: [...state.notes, action.payload],
        isLoading: false,
      };
      saveNotesToLocalStorage(newState.notes);
      break;
    case "UPDATE_NOTE_SUCCESS":
      newState = {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id ? action.payload : note
        ),
        isLoading: false,
      };
      saveNotesToLocalStorage(newState.notes);
      break;
    case "SAVE_NOTE_POSITION":
      newState = {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id
            ? { ...note, position: action.payload.position }
            : note
        ),
      };
      saveNotesToLocalStorage(newState.notes);
      break;
    case "SAVE_NOTE_SIZE":
      newState = {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id
            ? { ...note, size: action.payload.size }
            : note
        ),
      };
      saveNotesToLocalStorage(newState.notes);
      break;
    case "DELETE_NOTE_SUCCESS":
      newState = {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
        isLoading: false,
      };
      saveNotesToLocalStorage(newState.notes);
      break;
    case "FETCH_NOTES_ERROR":
    case "ADD_NOTE_ERROR":
    case "UPDATE_NOTE_ERROR":
    case "DELETE_NOTE_ERROR":
      newState = { ...state, isLoading: false, error: action.payload };
      break;
    default:
      return state;
  }

  return newState;
};

export const NotesProvider = ({ children }: { children: ReactElement }) => {
  const [state, dispatch] = useReducer(notesReducer, {
    notes: [],
    isLoading: false,
    error: null,
    id: null,
  });

  useEffect(() => {
    const loadNotes = () => {
      const storedNotes = loadNotesFromLocalStorage();
      dispatch({ type: "FETCH_NOTES_SUCCESS", payload: storedNotes });
    };
    loadNotes();
  }, []);

  return (
    <NotesContext.Provider value={{ state, dispatch }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotesContext = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
