import { useState } from "react";
import WhiteBoard from "../WhiteBoard";
import { NOTES_COLORS } from "../../utils/enums";

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

  return (
    <section className="notes-board">
      <div className="header">
        <h1>Sticky Notes</h1>
      </div>
      <WhiteBoard notes={notes} />
    </section>
  );
};

export default NotesBoard;
