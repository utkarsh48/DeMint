import React from "react";
import { CardList, FileEarmarkText, Upload } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const links = [
    {
      icon: <CardList />,
      to: "/",
      name: "NFTs",
    },
    {
      icon: <Upload />,
      to: "/mint",
      name: "Mint",
    },
    {
      icon: <FileEarmarkText />,
      to: "/docs",
      name: "Docs",
    },
  ];
  return (
    <aside
      style={{ top: "56px", left: 0, bottom: 0, width: "5rem", zIndex: 1 }}
      className="bg-white shadow position-fixed"
    >
      {links.map((link) => (
        <NavLink
          key={link.to}
          className="btn btn-outline-primary text-center border-0 rounded-0 p-2 py-3 w-100 shadow-none"
          to={link.to}
        >
          {link.icon}
          <div style={{ fontSize: "0.8rem" }}>{link.name}</div>
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
