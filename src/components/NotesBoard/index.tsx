import { useNotesContext } from "../../utils/context/NotesContext";
import WhiteBoard from "../WhiteBoard";

const NotesBoard = () => {
  const {
    state: { notes },
  } = useNotesContext();

  return (
    <section className="notes-board">
      <h1 className="header-title">DreamNotes</h1>
      <WhiteBoard notes={notes} />
    </section>
  );
};

export default NotesBoard;
