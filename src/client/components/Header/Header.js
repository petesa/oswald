import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';

class Header extends Component {
  componentDidMount() {
  }
  render() {
    return (
      <header className="App-header">
        <nav className="App-main-nav">
          <Link to="/">
            <img src={logo} className="App-logo" alt="logo" />
          </Link>
          <ul>
            <li><Link to="/work">Work</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Header;
