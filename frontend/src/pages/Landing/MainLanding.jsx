import { Link } from "react-router-dom";
import heroImage from "../../assets/images/hero-image.png";
import cloudLeft from "../../assets/images/cloud-left.png";
import cloudRight from "../../assets/images/cloud-right.png";
import ladies from "../../assets/images/ladies.png";

export default function MainLanding() {
  return (
    <>
      <nav className="nav">
        <div>
          <Link to="/" className="hover:text-dark">
            J3 - NoteWeb -App
          </Link>
        </div>
        <ul>
          <li>
            <Link>Home</Link>
          </li>
          <li>
            <Link>Features</Link>
          </li>
          <li>
            <Link>How it works</Link>
          </li>
        </ul>
        <Link
          to="/login"
          className="bg-dark text-white px-5 py-3 rounded-[12px]"
        >
          Get Started
        </Link>
      </nav>
      <div className="hero">
        <h1 className="header">Create Your Notes, Ideas & Stay Organized</h1>
        <p className="description">
          The ultimate note-taking app designed to keep your thoughts, to-dos,
          and ideas in one seamless space.
        </p>
        <img className="hero-image" src={heroImage} alt="hero image" />
      </div>
      <div className="subheader">
        <img className="cloud-left" src={cloudLeft} alt="image of cloud" />
        <h2>The fastest way to share your thoughts & ideas</h2>
        <img className="cloud-left" src={cloudRight} alt="image of cloud" />
      </div>
      <div className="start-section">
        <div className="start-text">
          <h3>Start writing & saving your notes</h3>
          <p>
            Notes don't have to be boring. Write what maters and save it in
            seconds - simple and quick.
          </p>
          <Link
            to="/login"
            className="start-btn bg-white text-dark px-5 py-3 rounded-[12px]"
          >
            Get Started
          </Link>
        </div>
        <img src={ladies} alt="Ladies pressing a phone" />
      </div>
      <footer>
        <p>© 2025 J3 - NoteWeb - App. All rights reserved.</p>
      </footer>
    </>
  );
}
