import { Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/VpnKey";
import LogoutIcon from "@mui/icons-material/ExitToApp";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function SmallDevicesAccountMenu({
  toggleMenu,
  handleToggleMenu,
  user,
  logoutHandler,
  handleCreatePost,
}) {
  return (
    <div
      style={{
        transform: `${toggleMenu ? "translate(0%)" : "translate(150%)"}`,
      }}
      className="w-screen h-screen fixed right-0 top-0 z-10 flex justify-center items-center lg:hidden"
    >
      <div className="w-[40%] h-full" onClick={handleToggleMenu}></div>
      <div className="flex w-[60%] h-full bg-white flex-col justify-start items-center">
        <div className="flex justify-start items-center w-full p-4 mb-4">
          <AccountCircleSharpIcon className="h-full w-full" />
          {user ? (
            <div className="flex flex-col justify-center items-start ml-4 overflow-hidden">
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="subtitle2">{user.email}</Typography>
            </div>
          ) : null}
        </div>
        <div className="flex w-full flex-col justify-center items-center text-base">
          <Link
            className="px-2 py-4 m-0 w-full text-black flex justify-start items-center"
            to="/"
            onClick={handleToggleMenu}
          >
            <HomeIcon />
            <p className="ml-4">Home</p>
          </Link>
          <Link
            className="px-2 py-4 m-0 w-full text-black  flex justify-start items-center"
            onClick={handleCreatePost}
            to="/posts/create"
          >
            <AddIcon />
            <p className="ml-4">Create Post</p>
          </Link>
          {user ? (
            <Link
              className="px-2 py-4 m-0 w-full text-black  flex justify-start items-center"
              to="/"
              onClick={logoutHandler}
            >
              <LogoutIcon />
              <p className="ml-4">Logout</p>
            </Link>
          ) : (
            <Link
              className="px-2 py-4 m-0 w-full text-black  flex justify-start items-center"
              to="/auth"
              onClick={handleToggleMenu}
            >
              <LoginIcon />
              <p className="ml-4">Login / Sign Up</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

SmallDevicesAccountMenu.propTypes = {
  toggleMenu: PropTypes.boolean,
  handleToggleMenu: PropTypes.func,
  user: PropTypes.object,
  logoutHandler: PropTypes.func,
  handleCreatePost: PropTypes.func,
};
