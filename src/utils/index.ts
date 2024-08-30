import { NoteType } from "./types";

export const setZIndex = (selectedNote: HTMLElement | null) => {
  if (!selectedNote) return;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = (callback: (...args: any[]) => void, delay: number) => {
  let timeoutId: number | undefined;
  return (...args: unknown[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export const isInDeleteZone = (x: number, y: number): boolean => {
  const deleteZone = document.querySelector(".delete-zone") as HTMLElement;
  if (!deleteZone) return false;
  const elementRect = deleteZone.getBoundingClientRect();
  return (
    x >= elementRect.left &&
    x <= elementRect.right &&
    y >= elementRect.top &&
    y <= elementRect.bottom
  );
};
