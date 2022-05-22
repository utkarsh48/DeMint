import React from 'react';
import { CardList, Upload } from 'react-bootstrap-icons';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const links = [
    {
      icon: <CardList />,
      to: '/',
      name: 'NFTs'
    },
    {
      icon: <Upload />,
      to: '/mint',
      name: 'Mint'
    },
  ];
  return (
    <aside
      style={{ height: 'calc(100vh - 56px)', width: '5rem' }}
      className="bg-white shadow-sm"
    >
      {links.map(link=>(<NavLink key={link.to}
        className="btn btn-outline-primary text-center border-0 rounded-0 p-2 py-3 w-100 shadow-none"
        to={link.to}
      >
        {link.icon}
        <div style={{fontSize: '0.8rem'}}>{link.name}</div>
      </NavLink>))}
    </aside>
  );
};

export default Sidebar;
