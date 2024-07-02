import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const quaryString = urlParams.toString();
    navigate(`/search?${quaryString}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  return (
    <header className=" bg-slate-200 shadow-md w-full fixed top-0 left-0 z-50 ">
      <div className="flex justify-between items-center max-w-screen-4xl mx-auto m-1">
        <Link to="/">
          <h1 className="font-extrabold text-sm sm:text-2xl flex ml-2">
            <span className="text-orange-500">Go</span>
            <span className="text-slate-700">Land</span>
          </h1>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 rounded-lg p-2 flex items-center"
        >
          <input
            className="focus:outline-none bg-transparent w-24 sm:w-64"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600"></FaSearch>
          </button>
        </form>
        <ul className=" flex gap-2">
          <Link to="/">
            <li className=" hidden sm:inline  text-slate-700 hover:text-slate-900 text-sm sm:text-lg ">
              Home
            </li>
          </Link>

          <Link to="/about">
            <li className=" hidden sm:inline  text-slate-700 hover:text-slate-900 ease-out text-sm sm:text-lg">
              About
            </li>{" "}
          </Link>

          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="profile"
                className="w-10 h-10 rounded-full  "
              ></img>
            ) : (
              <li className=" sm-inline mr-2 text-sm sm:text-lg text-slate-700 hover:text-slate-900 whitespace-nowrap ">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
