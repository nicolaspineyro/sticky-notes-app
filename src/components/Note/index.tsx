import { NoteType, PositionType, SizeType } from "../../utils/typescript/types";
import { useResize } from "../../utils/hooks/useResize";
import { useDragAndStick } from "../../utils/hooks/useDragAndStick";
import { useCallback, useRef } from "react";
import LoadingSpinner from "../UI/LoadingSpinner";
import { debounce, isInDeleteZone } from "../../utils";
import React from "react";

export interface INoteProps {
  data: NoteType;
  boundsRef: React.RefObject<HTMLElement>;
  isLoading: boolean;
  editNote: (note: NoteType) => void;
  deleteNote: (id: number) => void;
  saveNotePosition: (id: number, position: PositionType) => void;
  saveNoteSize: (id: number, size: SizeType) => void;
}

const Note = ({
  data,
  boundsRef,
  isLoading,
  editNote,
  deleteNote,
  saveNotePosition,
  saveNoteSize,
}: INoteProps) => {
  const {
    id,
    color,
    title,
    content,
    position: initialPosition,
    size: initialSize,
  } = data;
  const noteRef = useRef<HTMLElement>(null);
  const { currentSize, isResizing, resizeMouseDown } = useResize(
    initialSize,
    boundsRef
  );
  const {
    position: currentPosition,
    isDragging,
    isOverDeleteZone,
    stickyStyles,
    dragAndStickMouseDown,
  } = useDragAndStick(initialPosition, boundsRef, noteRef);

  const handleFormEdit = useCallback(
    (e: React.ChangeEvent<HTMLFormElement>) => {
      const targetName = e.target.name;
      const value = e.target.value;
      const newNote = {
        ...data,
        [targetName]: value,
      };
      editNote(newNote);
    },
    [data, editNote]
  );

  const handleDragEnd = useCallback(
    (e: React.MouseEvent) => {
      if (isInDeleteZone(e.clientX, e.clientY)) {
        deleteNote(id);
      } else {
        saveNotePosition(id, currentPosition);
      }
    },
    [currentPosition, id, deleteNote, saveNotePosition]
  );

  const onResizeEnd = useCallback(() => {
    saveNoteSize(id, currentSize);
  }, [currentSize, id, saveNoteSize]);

  return (
    <article
      ref={noteRef}
      className={`note ${isResizing || isDragging ? "no-select" : ""} ${
        isOverDeleteZone ? "note-delete-zone" : ""
      } `}
      style={{
        ...stickyStyles,
        ...currentSize,
        backgroundColor: color,
      }}
      onMouseUp={handleDragEnd}
      onMouseDown={dragAndStickMouseDown}
    >
      {isLoading ? <LoadingSpinner /> : null}
      <form onChange={debounce(handleFormEdit, 500)}>
        <input name="title" defaultValue={title} />
        <textarea name="content" defaultValue={content} />
      </form>
      <div
        className="resize-border"
        onMouseDown={resizeMouseDown}
        onMouseUp={onResizeEnd}
      />
    </article>
  );
};

export default React.memo(Note);
