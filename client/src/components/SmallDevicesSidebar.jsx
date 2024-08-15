import { CircleUserRound, Home, Plus, LogOut, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";

export default function SmallDevicesSidebar({ setToggleMenu, toggleMenu, handleToggleMenu, user, logoutHandler }) {
  const handleOnClick = () => {
    setToggleMenu((prev) => !prev);
  };
  const links = [
    { url: "/", icon: Home, name: "Home", action: handleOnClick },
    { url: "/posts/create", icon: Plus, name: "Create", action: handleOnClick },
    {
      url: user ? "/" : "/auth",
      icon: user ? LogOut : KeyRound,
      name: user ? "Logout" : "Login / Sign Up",
      action: user ? logoutHandler : handleToggleMenu,
    },
  ];

  return (
    <div
      style={{
        transform: `${toggleMenu ? "translate(0%)" : "translate(150%)"}`,
      }}
      className="lg:tw-hidden tw-w-screen tw-h-screen tw-fixed tw-right-0 tw-top-0 tw-z-10 tw-flex tw-justify-center tw-items-center"
    >
      <div className="tw-w-[40%] tw-h-full" onClick={handleToggleMenu}></div>
      <div className="tw-flex tw-w-[60%] tw-h-full tw-bg-white tw-flex-col tw-space-y-8">
        <div className="tw-flex tw-items-center tw-w-full tw-px-6 tw-py-4 tw-border-b-2">
          <CircleUserRound className="tw-h-10 tw-w-10" />
          {user ? (
            <div className="tw-flex tw-flex-col tw-justify-center tw-items-start tw-ml-4 tw-overflow-hidden">
              <span className="tw-text-xl tw-font-medium">{user.name}</span>
              <span className="tw-text-sm">{user.email}</span>
            </div>
          ) : null}
        </div>
        <div className="tw-flex tw-w-full tw-flex-col tw-space-y-3 tw-text-black tw-px-8">
          {links.map((link, i) => (
            <Link
              className="tw-w-full tw-flex tw-space-x-4 tw-items-center"
              key={i}
              to={link.url}
              onClick={link.action}
            >
              <link.icon />
              <span>{link.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
