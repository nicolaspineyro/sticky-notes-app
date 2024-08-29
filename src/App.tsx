import "./App.css";
import NotesBoard from "./components/NotesBoard";
import { NotesProvider } from "./utils/context/NotesContext";

function App() {
  return (
    <NotesProvider>
      <NotesBoard />
    </NotesProvider>
  );
}

export default App;
