import { NOTES_COLORS } from "../enums";

export type NoteType = {
  id: number;
  title: string;
  content: string;
  color: NOTES_COLORS;
  created_at: Date;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
};
