import { Typography } from "@mui/material";
import memoriesText from "../../assets/images/memories-Text.png";
import memoriesLogo from "../../assets/images/memories-Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { refreshAccessToken, logout } from "../../actions/auth";
import {
  CLEAR_EDIT_POST,
  SOMETHING_WENT_WRONG,
} from "../../constants/actionTypes";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import MenuIcon from "@mui/icons-material/Menu";
import SmallDevicesAccountMenu from "./components/SmallDevicesAccountMenu";

export default function Navbar() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.error);
  const [toggleMenu, setToggleMenu] = useState(false);
  const logoutHandler = () => {
    setToggleMenu(false);
    dispatch(logout());
    navigate("/");
  };
  const handleToggleMenu = () => {
    setToggleMenu((previousState) => !previousState);
  };
  const handleCreatePost = () => {
    dispatch({ type: CLEAR_EDIT_POST });
    setToggleMenu((previousState) => !previousState);
  };
  useEffect(() => {
    dispatch(refreshAccessToken(navigate));
  }, [dispatch, navigate]);
  if (error.type === SOMETHING_WENT_WRONG) {
    return (
      <div className="fixed w-[100vw] h-[100vh] bg-white z-10 ">
        <div className=" flex flex-col w-full h-full pt-24 items-center">
          <span className="text-red text-5xl font-semibold mb-16">
            Something went wrong
          </span>
          <span>{error.statusCode}</span>
          <span>
            {error.message}. Go back to{" "}
            <Link className="text-[#33A9D4]" to="/">
              Home Page
            </Link>
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center w-full">
      <div
        className="w-full m-4  rounded-lg shadow-none p-0 md:px-8 md:py-4 md:m-0"
        style={{ boxShadow: "var(--lg-radius)" }}
      >
        <div className=" rounded-lg flex shadow-lg flex-row justify-between items-center px-4 py-4 sm:px-4 sm:py-4">
          <Link to="/" className="flex items-center h-[45px] sm:h-[30px]">
            <img
              className="ml-4 h-full"
              src={memoriesText}
              alt="memories-text"
              height="45px"
            />
            <img
              className="ml-4 h-full"
              src={memoriesLogo}
              alt="memories-logo"
              height="40px"
            />
          </Link>
          <div
            className="lg:hidden flex cursor-pointer"
            onClick={handleToggleMenu}
          >
            <MenuIcon />
          </div>
          {toggleMenu ? (
            <SmallDevicesAccountMenu
              user={user}
              toggleMenu={toggleMenu}
              handleToggleMenu={handleToggleMenu}
              logoutHandler={logoutHandler}
              handleCreatePost={handleCreatePost}
            />
          ) : (
            <nav className="lg:flex justify-end items-center hidden">
              <Link
                to="/"
                className="px-2 py-4 rounded font-semibold no-underline text-[#33A9D4] hover:cursor-pointer hover:text-[#f50057] transition-colors duration-300 ease-in-out"
              >
                Home
              </Link>
              <Link
                to="/posts/create"
                onClick={() => {
                  setToggleMenu(false);
                }}
                className="px-2 py-4 rounded font-semibold no-underline text-[#33A9D4] hover:cursor-pointer hover:text-[#f50057] transition-colors duration-300 ease-in-out"
              >
                Create Post
              </Link>

              {user ? (
                <>
                  <span
                    className="px-2 py-4 rounded font-semibold no-underline text-[#33A9D4] hover:cursor-pointer hover:text-[#f50057] transition-colors duration-300 ease-in-out mr-4"
                    onClick={logoutHandler}
                  >
                    Logout
                  </span>
                  <AccountCircleSharpIcon />
                  <Typography
                    className="flex items-center text-center px-2 py-4"
                    variant="h6"
                  >
                    {user.name}
                  </Typography>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="px-2 py-4 rounded font-semibold no-underline text-[#33A9D4] hover:cursor-pointer hover:text-[#f50057] transition-colors duration-300 ease-in-out"
                >
                  Login / Sign Up
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
