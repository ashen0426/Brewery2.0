import React, { useState, useEffect, useContext } from 'react';
import UserContext from './UserDetails';

const Footer = (props) => {
  // wrr - commented out the below line because we aren't using any usercontext
  // const user = useContext(UserContext); 

  return (
    <div className='footer-container'>
      <footer>
        <h2>Please Drink Responsibly</h2>
      </footer>
    </div>
  );
};

export default Footer;
