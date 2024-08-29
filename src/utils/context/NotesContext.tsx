import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { NoteType } from "../types";

interface NotesState {
  notes: NoteType[];
  isLoading: boolean;
  error: string | null;
}

type NotesAction =
  | { type: "FETCH_NOTES_SUCCESS"; payload: NoteType[] }
  | { type: "FETCH_NOTES_ERROR"; payload: string }
  | { type: "ADD_NOTE_START" }
  | { type: "ADD_NOTE_SUCCESS"; payload: NoteType }
  | { type: "ADD_NOTE_ERROR"; payload: string }
  | { type: "UPDATE_NOTE_START" }
  | { type: "UPDATE_NOTE_SUCCESS"; payload: NoteType }
  | { type: "UPDATE_NOTE_ERROR"; payload: string }
  | { type: "DELETE_NOTE_START" }
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
      newState = { ...state, isLoading: true, error: null };
      break;
    case "ADD_NOTE_SUCCESS":
      newState = {
        ...state,
        notes: [...state.notes, action.payload],
        isLoading: false,
      };
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

const STORAGE_KEY = "sticky_notes";

const saveToLocalStorage = (notes: NoteType[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

const loadFromLocalStorage = (): NoteType[] => {
  const storedNotes = localStorage.getItem(STORAGE_KEY);
  return storedNotes ? JSON.parse(storedNotes) : [];
};

export const NotesProvider = ({ children }: { children: ReactElement }) => {
  const [state, dispatch] = useReducer(notesReducer, {
    notes: [],
    isLoading: false,
    error: null,
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
