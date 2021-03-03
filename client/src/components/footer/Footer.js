import { NavLink, useHistory } from 'react-router-dom';
import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import './footer.scss';

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
      <footer className="page-footer grey darken-3">
        <div className="container">
          <div className="row">
            <div className="col l6 s12">
              <a className="footer-logo" href="https://rs.school/js/" target="_blank"></a>
            </div>
            <div className="footer-links col l4 offset-l2 s12">
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
            © 2021 <a href="https://github.com/OlegMikhailov23" target="_blank">Created by @OlegMikhailov23</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
