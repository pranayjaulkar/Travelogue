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
import { ErrorComponent } from "../";
import toast from "react-hot-toast";
import "./Navbar.css";

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
    toast.success("Logout Successfull");
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
    return <ErrorComponent error={error} />;
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
              <div
                // to="/posts/create"
                onClick={() => {
                  if (user) {
                    setToggleMenu(false);
                    navigate("/posts/create");
                  } else toast.error("You are not Logged in");
                }}
                className="px-2 py-4 rounded font-semibold no-underline text-[#33A9D4] hover:cursor-pointer hover:text-[#f50057] transition-colors duration-300 ease-in-out"
              >
                Create Post
              </div>

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
