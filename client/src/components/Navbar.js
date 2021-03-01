import { NavLink, useHistory } from 'react-router-dom';
import React, { useContext, useEffect } from 'react';
import M from 'materialize-css/dist/js/materialize.min';
import AuthContext from '../context/AuthContext';

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
    M.Sidenav.init(sidenav, {});
  }, []);

  return (
    <>
      <nav>
        <div className="nav-wrapper blue-grey">
          <a href="#!" className="brand-logo">Logo</a>
          <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
          <ul className="right hide-on-med-and-down">
            <li><NavLink to="/game">Play</NavLink></li>
            <li><NavLink to="/statistic">Statistic</NavLink></li>
            <li><a href="/" onClick={logoutHandler}>Logout</a></li>
          </ul>
        </div>
      </nav>

      <ul className="sidenav" id="mobile-demo">
        <li><a to="/game">Play</a></li>
        <li><a to="/statistic">Statistic</a></li>
        <li><a href="/" onClick={logoutHandler}>Logout</a></li>
      </ul>
    </>
  );
};

export default Navbar;
