import WhiteBoard from "../WhiteBoard";
import { useNotes } from "../../utils/hooks/useNotes";

const NotesBoard = () => {
  const { state, addNote } = useNotes();
  const { notes } = state;

  return (
    <section className="notes-board">
      <h1 className="header-title">DreamNotes</h1>
      <button className="add-button" onClick={addNote}>
        <i className="fa-solid fa-plus"></i>
      </button>
      <WhiteBoard notes={notes} />
    </section>
  );
};

export default NotesBoard;
