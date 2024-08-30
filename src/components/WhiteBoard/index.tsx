import React, { useCallback, useRef } from "react";
import { NoteType } from "../../utils/types";
import Note from "../Note";
import DeleteZone from "../NotesBoard/DeleteZone";
import GhostNote from "../Note/GhostNote";
import ColorMenu from "../UI/ColorMenu";
import { useNotes } from "../../utils/hooks/useNotes";

interface IWhiteBoardProps {
  notes: NoteType[];
}

const WhiteBoard = ({ notes }: IWhiteBoardProps) => {
  const { ghostNote, initAddNote, commitNote } = useNotes();
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
      <ColorMenu handleSelect={initAddNote} />
      <DeleteZone />
      {renderNotes()}
      {ghostNote.isActive && ghostNote.note && (
        <GhostNote
          data={ghostNote.note}
          boundsRef={whiteBoardRef}
          onCommit={commitNote}
        />
      )}
    </section>
  );
};

export default React.memo(WhiteBoard);
