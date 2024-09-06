import React, { useRef } from "react";
import { NoteType } from "../../utils/typescript/types";
import Note from "../Note";
import DeleteZone from "./DeleteZone";
import GhostNote from "./GhostNote";
import ColorMenu from "../UI/ColorMenu";
import { useNotesManager } from "../../utils/hooks/useNotesManager";

interface IWhiteBoardProps {
  notes: NoteType[];
}

const WhiteBoard = ({ notes }: IWhiteBoardProps) => {
  const {
    draftNote,
    isLoading,
    loadingId,
    initAddNote,
    commitNote,
    editNote,
    deleteNote,
    saveNotePosition,
    saveNoteSize,
  } = useNotesManager();
  const whiteBoardRef = useRef<HTMLElement>(null);

  return (
    <section ref={whiteBoardRef} className="whiteboard">
      <ColorMenu handleSelect={initAddNote} />
      <DeleteZone />
      {notes.map((data) => (
        <Note
          key={`note-${data.id}`}
          data={data}
          boundsRef={whiteBoardRef}
          isLoading={isLoading && loadingId === data.id}
          editNote={editNote}
          deleteNote={deleteNote}
          saveNotePosition={saveNotePosition}
          saveNoteSize={saveNoteSize}
        />
      ))}
      {draftNote.isActive && draftNote.note && (
        <GhostNote
          data={draftNote.note}
          boundsRef={whiteBoardRef}
          onCommit={commitNote}
        />
      )}
    </section>
  );
};

export default React.memo(WhiteBoard);
