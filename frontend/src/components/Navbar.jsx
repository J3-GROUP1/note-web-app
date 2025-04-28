import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "./cards/ProfileInfo";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const onLogut = () => {
    navigate("/login");
  };

  const handleSearch = () => {};

  const onClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="bg-white flex items-center justify-between px-7 py-3 drop-shadow">
      <h2 className="text-2xl font-medium text-black py-2">Notes</h2>

      <SearchBar
        value={searchQuery}
        onchange={({ target }) => {
          setSearchQuery(target.value);
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <ProfileInfo onLogout={onLogut} />
    </div>
  );
}
