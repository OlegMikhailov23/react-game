import { NavLink, useHistory } from 'react-router-dom';
import React, { useContext, useEffect } from 'react';
import M from 'materialize-css/dist/js/materialize.min';
import AuthContext from '../../context/AuthContext';
import './navbar.scss';

const Navbar = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const logoutHandler = (e) => {
    e.preventDefault();
    auth.logout();
    history.push('/');
  };

  useEffect(() => {
    const sidenav = document.querySelector('#mobile-demo');
    M.Sidenav.init(sidenav, {
      edge: 'left',
      draggable: true,
    });
  }, []);

  return (
    <>
      <nav>
        <div className="nav-wrapper grey darken-3">
          <div className='main-logo'>Logo</div>
          <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
          <ul className="right hide-on-med-and-down">
            <li><NavLink to="/game">Play</NavLink></li>
            <li><NavLink to="/statistic">Statistic</NavLink></li>
            <li><a href="/" onClick={logoutHandler}>Logout</a></li>
          </ul>
        </div>
      </nav>

      <ul className="sidenav grey darken-3 white-text" id="mobile-demo">
        <li><NavLink to="/game" className="white-text">Play</NavLink></li>
        <li><NavLink to="/statistic" className="white-text">Statistic</NavLink></li>
        <li><a href="/" onClick={logoutHandler} className="white-text">Logout</a></li>
      </ul>
    </>
  );
};

export default Navbar;
