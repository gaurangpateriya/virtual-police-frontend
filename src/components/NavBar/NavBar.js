import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { APP_NAME_short } from '../../constants/otherConstants';
import 'tachyons';


import './NavBar.css';
import logo from '../../assets/Images/logo_short.png';
import SideDrawer from './SideDrawer';

const linkList = [
  // {
  // 	name:"Home",
  // 	to: '/',
  // },
  // {
  // 	name:"Register",
  // 	to: '/register',
  // },
  // {
  // 	name:"Login",
  // 	to: '/login',
  // }
];

const BootstrapNavbar = () => {
  const [mobileView, setMobileView] = useState(false);

  const resize = () => {
    setMobileView(window.innerWidth <= 600);
  };
  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
  }, []);

  return (
    <nav className='nav-bar hide-sm'>
      <div className='logo'>
        <img src={logo} alt='logo' />
        <h1>{APP_NAME_short}</h1>
      </div>

      <div className='end-links'>
        {!mobileView && (
          <div className='links'>
            {linkList.map((item) => (
              <Link to={`${item.to}`}>{item.name}</Link>
            ))}
          </div>
        )}

        {mobileView && <SideDrawer linkList={linkList} />}
      </div>
    </nav>
  );
};

export default BootstrapNavbar;
