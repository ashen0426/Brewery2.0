import React, { useState, useEffect, useContext } from 'react';
import UserContext from './UserDetails';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const Navbar = (props) => {
  const user = useContext(UserContext).user;
  const setUser = useContext(UserContext).setUser;

  let navigate = useNavigate();

  const handleLogout = () => {
    console.log('handleLogout');
    setUser(undefined);
    navigate('/');
  };
  return (
    <>
      <header>
        <div className='brand nav'>FindMyBrews&#127867;</div>
        {/*Leaving this as a UL/LI so that we want to add more navbar options */}
        <ul className='nav_links'>
          {user && (
            <li>
              <Link to='/logout' className='logout-Btn' onClick={handleLogout}>
                Logout
              </Link>
            </li>
          )}
        </ul>
      </header>
    </>
  );
};

export default Navbar;
