import { NOTES_COLORS } from "../enums";

export type NoteType = {
  id: number;
  title: string;
  content: string;
  color: NOTES_COLORS;
  created_at: Date;
  position: IPosition;
  size: {
    width: number;
    height: number;
  };
};

export interface IPosition {
  x: number;
  y: number;
}
