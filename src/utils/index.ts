import { NoteType } from "./types";

export const setZIndex = (selectedNote: HTMLElement) => {
  selectedNote.style.zIndex = "1000";

  const notes = Array.from(document.getElementsByClassName("note"));

  notes.forEach((note) => {
    if (note !== selectedNote && note instanceof HTMLElement) {
      note.style.zIndex = String(Number(selectedNote.style.zIndex) - 1);
    }
  });
};

export const simulateApiCall = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), 1000));

const STORAGE_KEY = "sticky_notes";

export const saveToLocalStorage = (notes: NoteType[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

export const loadFromLocalStorage = (): NoteType[] => {
  const storedNotes = localStorage.getItem(STORAGE_KEY);
  return storedNotes ? JSON.parse(storedNotes) : [];
};
