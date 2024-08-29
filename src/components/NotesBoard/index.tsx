import WhiteBoard from "../WhiteBoard";
import DeleteZone from "./DeleteZone";
import { useNotes } from "../../utils/hooks/useNotes";
import LoadingSpinner from "../UI/LoadingSpinner";

const NotesBoard = () => {
  const { state, addNote, handleDrop } = useNotes();
  const { notes, isLoading, error } = state;

  if (error) return <div>Error: {error}</div>;

  return (
    <section className="notes-board">
      <div className="header">
        <div className="header-title">
          <h1>Sticky Notes</h1>
          <button onClick={addNote} disabled={isLoading}>
            + Add Note
          </button>
          {isLoading && <LoadingSpinner />}
        </div>
        <DeleteZone onDrop={handleDrop} />
      </div>
      <WhiteBoard notes={notes} />
    </section>
  );
};

export default NotesBoard;
