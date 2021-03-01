import { NavLink, useHistory } from 'react-router-dom';
import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Footer = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);

  const logoutHandler = (e) => {
    e.preventDefault();
    auth.logout();
    history.push('/');
  };

  return (
    <>
      <footer className="page-footer">
        <div className="container">
          <div className="row">
            <div className="col l6 s12">
              <h5 className="white-text">Footer Content</h5>
              <p className="grey-text text-lighten-4">You can use rows and columns here to organize your footer
                content.</p>
            </div>
            <div className="col l4 offset-l2 s12">
              <h5 className="white-text">Links</h5>
              <ul>
                <li><NavLink to="/game">Play</NavLink></li>
                <li><NavLink to="/statistic">Statistic</NavLink></li>
                <li><a href="/" onClick={logoutHandler}>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <div className="container">
            © 2021 RS School
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
