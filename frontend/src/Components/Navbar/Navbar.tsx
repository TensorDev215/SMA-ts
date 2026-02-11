import React from 'react';
import { Link } from 'react-router-dom';

import './Navbar.css';


const Navbar: React.FC = () => {
  return (
    <nav className='navbar'>
      <ul className='navbar-list'>
        <li className='navbar-item'><Link to="/explore" className='navbar-link'>Explore</Link></li>
        <li className='navbar-item'><Link to="/feed" className='navbar-link'>Feed</Link></li>
        <li className='navbar-item'><Link to="/create" className='navbar-link'>Create Post</Link></li>
        <li className='navbar-item'><Link to="/user/:userId" className='navbar-link'>Profile</Link></li>
        <li className='navbar-item'><Link to="/login" className='navbar-link'>Login</Link></li>
        <li className='navbar-item'><Link to="/register" className='navbar-link'>Register</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar