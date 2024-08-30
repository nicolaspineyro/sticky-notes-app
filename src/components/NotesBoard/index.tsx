import WhiteBoard from "../WhiteBoard";
import { useNotes } from "../../utils/hooks/useNotes";
import ColorMenu from "../UI/ColorMenu";

const NotesBoard = () => {
  const { state, ghostNote, ghostNoteTracker, commitNote, initAddNote } =
    useNotes();
  const { notes } = state;

  return (
    <section
      className="notes-board"
      onMouseMove={ghostNote.isActive ? ghostNoteTracker : undefined}
      onClick={ghostNote.isActive ? commitNote : undefined}
    >
      <h1 className="header-title">DreamNotes</h1>
      <ColorMenu handleSelect={initAddNote} />
      <WhiteBoard notes={notes} ghostNote={ghostNote} />
    </section>
  );
};

export default NotesBoard;
