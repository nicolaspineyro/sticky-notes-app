import WhiteBoard from "../WhiteBoard";
import { useNotes } from "../../utils/hooks/useNotes";
import LoadingSpinner from "../UI/LoadingSpinner";

const NotesBoard = () => {
  const { state, addNote } = useNotes();
  const { notes, isLoading, error } = state;

  if (error) return <div>Error: {error}</div>;

  return (
    <section className="notes-board">
      <div className="header">
        <div className="header-title">
          <h1>DreamNotes</h1>
          <button onClick={addNote} disabled={isLoading}>
            <i className="fa-solid fa-plus"></i>
          </button>
          {isLoading && <LoadingSpinner />}
        </div>
      </div>
      <WhiteBoard notes={notes} />
    </section>
  );
};

export default NotesBoard;
