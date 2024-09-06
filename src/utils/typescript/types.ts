import { NOTES_COLORS } from "./enums";

export type NotesActions =
  | { type: "FETCH_NOTES_SUCCESS"; payload: NoteType[] }
  | { type: "FETCH_NOTES_ERROR"; payload: string }
  | { type: "ADD_NOTE_START"; payload: number }
  | { type: "ADD_NOTE_SUCCESS"; payload: NoteType }
  | { type: "ADD_NOTE_ERROR"; payload: string }
  | {
      type: "SAVE_NOTE_POSITION";
      payload: { id: number; position: PositionType };
    }
  | {
      type: "SAVE_NOTE_SIZE";
      payload: { id: number; size: SizeType };
    }
  | { type: "UPDATE_NOTE_START"; payload: number }
  | { type: "UPDATE_NOTE_SUCCESS"; payload: NoteType }
  | { type: "UPDATE_NOTE_ERROR"; payload: string }
  | { type: "DELETE_NOTE_START"; payload: number }
  | { type: "DELETE_NOTE_SUCCESS"; payload: number }
  | { type: "DELETE_NOTE_ERROR"; payload: string };

export type NoteType = {
  id: number;
  title: string;
  content: string;
  color: NOTES_COLORS;
  created_at: Date;
  position: PositionType;
  size: {
    width: number;
    height: number;
  };
};

export type PositionType = {
  x: number;
  y: number;
};

export type SizeType = {
  width: number;
  height: number;
};
