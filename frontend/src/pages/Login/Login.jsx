import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import PasswordInput from "../../components/PasswordInput";
import { validateEmail } from "../../utils/helper";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    setError("");

    // Login API call
  };

  return (
    <>
      <Navbar />

      <div className="bg-image-2 flex items-center justify-center">
        <div className="w-96 border rounded-[24px] bg-white px-7 py-10 border-dark">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7 text-center text-dark">Login</h4>

            <input
              type="text"
              placeholder="Email"
              className="input-box text-dark"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              Login
            </button>

            <p className="text-sm text-center mt-4 text-dark">
              Not registered yet?{" "}
              <Link to="/signup" className="font-medium underline">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}