import React from 'react';
import NotificationIcon from './NotificationIcon';

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <h1 className="text-xl font-bold">WTT App</h1>
      <NotificationIcon />
    </header>
  );
};

export default Header;