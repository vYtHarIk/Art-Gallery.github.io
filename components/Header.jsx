import React from 'react';

const Header = ({ theme, toggleTheme }) => {
  const icon = theme === 'light' ? 'dark_icon.png' : 'icon_btn.png';

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo h1"></h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          <img src={`img/${icon}`} style={{ width: '20px' }} alt="theme toggle" />
        </button>
      </div>
    </header>
  );
};

export default Header;