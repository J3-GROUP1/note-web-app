import NoteCard from "../../components/cards/NoteCard";
import Navbar from "../../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <div className="container mx-auto">
        <NoteCard />
      </div>
    </>
  );
}