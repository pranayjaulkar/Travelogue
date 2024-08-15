import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { lazy, Suspense, useEffect, useState } from "react";
import { refreshAccessToken, logout } from "../actions/auth";
import toast from "react-hot-toast";

const SmallDevicesSidebar = lazy(() => import("./SmallDevicesSidebar"));
const SearchBar = lazy(() => import("./SearchBar"));
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [tags, setTags] = useState(query.get("tags") ? query.get("tags").split(",") : []);
  const [search, setSearch] = useState(query.get("q") && query.get("q") !== "none" ? query.get("q") : "");
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(search || tags.length || false);
  const [loading, setLoading] = useState(true);

  const logoutHandler = () => {
    setToggleMenu(false);
    dispatch(logout());
    navigate("/");
    toast.success("Logout Successfull");
  };

  const handleToggleMenu = () => {
    setToggleMenu((prev) => !prev);
  };

  useEffect(() => {
    dispatch(refreshAccessToken(navigate));
  }, [dispatch, navigate]);

  useEffect(() => {
    if (location.pathname !== "/posts/search") {
      setShowSearchBar(false);
      setTags([]);
      setSearch("");
    }
  }, [location]);

  useEffect(() => {
    setLoading(false);
  }, []);

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
              <Suspense fallback="loading...">
                <SmallDevicesSidebar
                  setToggleMenu={setToggleMenu}
                  user={user}
                  toggleMenu={toggleMenu}
                  handleToggleMenu={handleToggleMenu}
                  logoutHandler={logoutHandler}
                />
              </Suspense>
            ) : (
              <div className="tw-hidden lg:tw-flex tw-items-center tw-space-x-32">
                <div className="tw-flex tw-items-center tw-space-x-8 ">
                  <button
                    onClick={() => setShowSearchBar((prev) => !prev)}
                    className="tw-px-6 tw-py-2 tw-rounded-md tw-text-gray-800"
                  >
                    <div
                      className="tw-w-[25px] tw-h-full tw-overflow-hidden tw-flex tw-items-center"
                      onClick={() => {
                        setSearch("");
                        setTags([]);
                      }}
                    >
                      <SearchIcon
                        style={{
                          transform: `translateX(${showSearchBar && !loading ? -25 : 0}px)`,
                          opacity: showSearchBar && !loading ? 0 : 100,
                          transition: "transform .5s, opacity .2s",
                        }}
                      />
                      <CloseIcon
                        style={{
                          transform: `translateX(${showSearchBar && !loading ? -25 : 0}px)`,
                          opacity: showSearchBar && !loading ? 100 : 0,
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
      {/* Search Bar */}
      <SearchBar showSearchBar={showSearchBar} search={search} tags={tags} setSearch={setSearch} setTags={setTags} />
    </div>
  );
}
