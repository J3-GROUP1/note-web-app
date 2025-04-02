import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div>
      <div className="bg-[#F5F5F5] flex items-center justify-between px-7 py-3 drop-shadow">
        <h2 className="text-xl font-medium text-black py-2">J3-Note-App</h2>
        <Link to="/login" className="bg-dark text-white px-5 py-3 rounded-md">
          Create Note
        </Link>
      </div>

      <div className="bg-image flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-[48px] max-w-[770px] text-white font-bold mb-5">
            Create Your Notes, Capture Ideas & Stay Organized
          </h1>
          <p className="text-white mt-2 max-w-[500px] mx-auto leading-[1.8]">
            The ultimate note-taking app designed to keep your thoughts, to-dos,
            and ideas in one seamless space.
          </p>
        </div>
      </div>
    </div>
  );
}
