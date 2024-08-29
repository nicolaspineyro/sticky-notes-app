import React, { useCallback, useRef } from "react";
import { NoteType } from "../../utils/types";
import Note from "../Note";
import DeleteZone from "../NotesBoard/DeleteZone";

interface IWhiteBoardProps {
  notes: NoteType[];
}

const WhiteBoard = ({ notes }: IWhiteBoardProps) => {
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
    </section>
  );
};

export default React.memo(WhiteBoard);
