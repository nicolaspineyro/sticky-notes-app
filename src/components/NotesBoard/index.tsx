import { useState } from "react";
import WhiteBoard from "../WhiteBoard";
import { NOTES_COLORS } from "../../utils/enums";
import DeleteZone from "./DeleteZone";
import { NoteType } from "../../utils/types";

const NotesBoard = () => {
  const [notes, setNotes] = useState([
    {
      id: 0,
      title: "Meeting Notes",
      content: "Discuss project roadmap and deliverables.",
      color: Object.values(NOTES_COLORS)[Math.floor(Math.random() * 10)],
      created_at: new Date(),
    },
  ]);

  const addNote = () => {
    const newNote: NoteType = {
      id: Math.floor(Math.random() * 100),
      title: "New Note",
      content: "New Note Content",
      color: Object.values(NOTES_COLORS)[Math.floor(Math.random() * 10)],
      created_at: new Date(),
    };
    setNotes((p) => [...p, newNote]);
  };

  const deleteNote = (id: number) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const noteId = e.dataTransfer.getData("text/plain");
    if (noteId) {
      deleteNote(Number(noteId));
    }
  };

  return (
    <section className="notes-board">
      <div className="header">
        <div className="header-title">
          <h1>Sticky Notes</h1>
          <button onClick={addNote}>+ Add Note</button>
        </div>
        <DeleteZone onDrop={handleDrop} />
      </div>
      <WhiteBoard notes={notes} />
    </section>
  );
};

export default NotesBoard;
