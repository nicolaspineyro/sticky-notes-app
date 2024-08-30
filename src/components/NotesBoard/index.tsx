import WhiteBoard from "../WhiteBoard";
import { useNotes } from "../../utils/hooks/useNotes";

const NotesBoard = () => {
  const { state } = useNotes();
  const { notes } = state;

  return (
    <section className="notes-board">
      <h1 className="header-title">DreamNotes</h1>
      <WhiteBoard notes={notes} />
    </section>
  );
};

export default NotesBoard;
