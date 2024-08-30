import React, { useCallback, useRef } from "react";
import { NoteType } from "../../utils/types";
import Note from "../Note";
import DeleteZone from "../NotesBoard/DeleteZone";
import GhostNote from "../Note/GhostNote";

interface IWhiteBoardProps {
  notes: NoteType[];
  ghostNote: { isActive: boolean; note?: NoteType };
}

const WhiteBoard = ({ notes, ghostNote }: IWhiteBoardProps) => {
  const whiteBoardRef = useRef<HTMLElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const renderNotes = () =>
    notes.map((data) => (
      <Note key={`note-${data.id}`} data={data} boundsRef={whiteBoardRef} />
    ));

  return (
    <section
      ref={whiteBoardRef}
      onDragOver={handleDragOver}
      className="whiteboard"
    >
      <DeleteZone />
      {renderNotes()}
      {ghostNote.isActive && ghostNote.note && (
        <GhostNote data={ghostNote.note} />
      )}
    </section>
  );
};

export default React.memo(WhiteBoard);
