import { NOTES_COLORS } from "../enums";

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
