import React, { useState, useEffect, useContext } from 'react';
import UserContext from './UserDetails';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const Navbar = (props) => {
  const user = useContext(UserContext).user;
  const setUser = useContext(UserContext).setUser;
  let navigate = useNavigate();

  const handleLogout = () => {
    ``;
    user = setUser(undefined);
    navigate('/');
  };
  const handleDelete = () => {

    navigate('/deleteUser');
  };
  const handleFavorites = () => {
    ``;
    navigate('/favorites');
  };

  return (
    <>
      <header>
        <div className='brand nav'>FindMyBrews&#127867;</div>
        {/*Leaving this as a UL/LI so that we want to add more navbar options */}
        <ul className='nav_links'>
          {user && (
            <select className='accountOptions-Btn' >
              <option disabled selected>Account Options</option>
              <option className='favorite-Btn' onClick={handleFavorites} >
                Favorites
              </option>
              <option className='logout-Btn' onClick={handleLogout} >
                Logout
              </option>
              <option className='delete-Btn' onClick={handleDelete}>
                Delete Account
              </option>
            </select>
          )}
        </ul>
      </header>
    </>
  );
};

export default Navbar;
