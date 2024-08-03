import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { refreshAccessToken, logout } from "../actions/auth";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import SmallDevicesSidebar from "./SmallDevicesSidebar";
import { TextField } from "@mui/material";
import { getPostsBySearch } from "../actions/posts";
import toast from "react-hot-toast";
import { MuiChipsInput } from "mui-chips-input";

export default function Navbar() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const logoutHandler = () => {
    setToggleMenu(false);
    dispatch(logout());
    navigate("/");
    toast.success("Logout Successfull");
  };

  const handleToggleMenu = () => {
    setToggleMenu((prev) => !prev);
  };

  const handleSearch = () => {
    if (search.trim() || tags.length) {
      dispatch(getPostsBySearch({ query: search.trim(), tags }, navigate));
      navigate(`/posts/search?q=${search.trim() || "none"}&tags=${tags.join(",")}`);
    }
  };

  const handleEnterKeyPress = (event) => {
    if (event.keyCode === 13 && search.trim()) {
      dispatch(getPostsBySearch({ query: search.trim(), tags }, navigate));
    }
  };

  useEffect(() => {
    dispatch(refreshAccessToken(navigate));
  }, [dispatch, navigate]);
  return (
    <div
      style={{
        height: showSearchBar ? "16vh" : "8vh",
        transition: "height .5s",
      }}
      className="tw-relative tw-w-full tw-border-b tw-border-gray-300"
    >
      <div
        style={{ height: "8vh" }}
        className="tw-w-full tw-relative tw-z-20 tw-border-b tw-bg-white tw-border-gray-300"
      >
        <div className="tw-w-full md:tw-max-w-[90%] lg:tw-max-w-[85%] tw-mx-auto">
          <div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-px-4 tw-py-2">
            <div className="tw-flex tw-flex-row tw-justify-start tw-items-center tw-space-x-16">
              <Link to="/" className=" tw-h-10 sm:tw-h-8 tw-flex tw-items-center tw-space-x-4">
                <h1 className="tw-text-xl lg:tw-text-2xl tw-font-medium">Travelogue</h1>
              </Link>
              <nav className="tw-hidden lg:tw-flex tw-items-center tw-space-x-32">
                <div className="tw-flex tw-space-x-4 tw-items-center ">
                  <Link
                    to="/"
                    className="tw-px-2 tw-py-4 tw-rounded tw-font-normal tw-no-underline tw-text-black hover:tw-cursor-pointer hover:tw-text-crayola-red "
                  >
                    Home
                  </Link>
                  <Link
                    to="/posts/create"
                    className="tw-px-2 tw-py-4 tw-rounded tw-font-normal tw-no-underline tw-text-black hover:tw-cursor-pointer hover:tw-text-crayola-red"
                  >
                    Create
                  </Link>
                </div>
              </nav>
            </div>
            <div className="lg:tw-hidden tw-flex tw-cursor-pointer" onClick={handleToggleMenu}>
              <MenuIcon />
            </div>
            {toggleMenu ? (
              <SmallDevicesSidebar
                setToggleMenu={setToggleMenu}
                user={user}
                toggleMenu={toggleMenu}
                handleToggleMenu={handleToggleMenu}
                logoutHandler={logoutHandler}
              />
            ) : (
              <div className="tw-hidden lg:tw-flex tw-items-center tw-space-x-32">
                <div className="tw-flex tw-items-center tw-space-x-8 ">
                  <button
                    onClick={() => setShowSearchBar((prev) => !prev)}
                    className="tw-px-6 tw-py-2 tw-rounded-md tw-text-gray-800"
                  >
                    <div className="tw-w-[25px] tw-h-full tw-overflow-hidden tw-flex tw-items-center">
                      <SearchIcon
                        style={{
                          transform: `translateX(${showSearchBar ? -25 : 0}px)`,
                          opacity: showSearchBar ? 0 : 100,
                          transition: "transform .5s, opacity .2s",
                        }}
                      />
                      <CloseIcon
                        style={{
                          transform: `translateX(${showSearchBar ? -25 : 0}px)`,
                          opacity: showSearchBar ? 100 : 0,
                          transition: "transform .5s, opacity .2s",
                        }}
                      />
                    </div>
                  </button>
                  {user ? (
                    <>
                      <button
                        className="tw-px-6 tw-py-2 tw-rounded-md tw-text-white tw-bg-blue-500"
                        onClick={logoutHandler}
                      >
                        Logout
                      </button>
                      <div className="tw-flex tw-items-center tw-space-x-2">
                        <AccountCircleSharpIcon />
                        <span>{user.name}</span>
                      </div>
                    </>
                  ) : (
                    <Link to="/auth">Login / Sign Up</Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Search Section */}
      <div
        style={{
          transform: showSearchBar ? "translateY(8vh)" : "",
          transition: "all .5s",
          height: "8vh",
        }}
        className="tw-absolute tw-top-0 tw-w-full tw-h-full tw-space-y-12"
      >
        <div className="tw-flex tw-w-full tw-h-full tw-items-center tw-justify-center tw-space-x-4">
          <TextField
            name="search"
            label="Search Memories"
            value={search}
            size="small"
            onChange={(e) => setSearch(e.target.value)}
            onKeyUp={handleEnterKeyPress}
            variant="outlined"
          />
          <MuiChipsInput
            style={{ marginTop: "0px", minWidth: "200px", maxWidth: "400px" }}
            label="Search Using Tags"
            size="small"
            value={tags}
            onChange={(tag) => setTags(tag)}
          />

          <button className="tw-px-6 tw-py-2 tw-rounded-md tw-text-white tw-bg-blue-500" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
