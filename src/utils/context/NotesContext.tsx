import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { NoteType } from "../types";
import { loadFromLocalStorage, saveToLocalStorage } from "..";

interface NotesState {
  notes: NoteType[];
  isLoading: boolean;
  id: number | null;
  error: string | null;
}

type NotesAction =
  | { type: "FETCH_NOTES_SUCCESS"; payload: NoteType[] }
  | { type: "FETCH_NOTES_ERROR"; payload: string }
  | { type: "ADD_NOTE_START"; payload: number }
  | { type: "ADD_NOTE_SUCCESS"; payload: NoteType }
  | { type: "ADD_NOTE_ERROR"; payload: string }
  | {
      type: "SAVE_NOTE_POSITION";
      payload: { id: number; position: { x: number; y: number } };
    }
  | {
      type: "SAVE_NOTE_SIZE";
      payload: { id: number; size: { width: number; height: number } };
    }
  | { type: "UPDATE_NOTE_START"; payload: number }
  | { type: "UPDATE_NOTE_SUCCESS"; payload: NoteType }
  | { type: "UPDATE_NOTE_ERROR"; payload: string }
  | { type: "DELETE_NOTE_START"; payload: number }
  | { type: "DELETE_NOTE_SUCCESS"; payload: number }
  | { type: "DELETE_NOTE_ERROR"; payload: string };

const NotesContext = createContext<
  | {
      state: NotesState;
      dispatch: React.Dispatch<NotesAction>;
    }
  | undefined
>(undefined);

const notesReducer = (state: NotesState, action: NotesAction): NotesState => {
  let newState: NotesState;

  switch (action.type) {
    case "FETCH_NOTES_SUCCESS":
      newState = { ...state, notes: action.payload, isLoading: false };
      saveToLocalStorage(newState.notes);
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
      saveToLocalStorage(newState.notes);
      break;
    case "UPDATE_NOTE_SUCCESS":
      newState = {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id ? action.payload : note
        ),
        isLoading: false,
      };
      saveToLocalStorage(newState.notes);
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
      saveToLocalStorage(newState.notes);
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
      saveToLocalStorage(newState.notes);
      break;
    case "DELETE_NOTE_SUCCESS":
      newState = {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
        isLoading: false,
      };
      saveToLocalStorage(newState.notes);
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
      const storedNotes = loadFromLocalStorage();
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
