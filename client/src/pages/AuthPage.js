import React, { useContext, useEffect, useState } from 'react';
import useHttp from '../hooks/http.hook';
import './AuthPage.scss';
import useMessage from '../hooks/message.hook';
import AuthContext from '../context/AuthContext';

const AuthPage = () => {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const {
    loading, request, error, clearError,
  } = useHttp();
  const [form, setForm] = useState(
    {
      login: '',
      password: '',
    },
  );

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', { ...form });
      message(data.message);
    } catch (e) {
    }
  };

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', { ...form });
      auth.login(data.token, data.userId);
    } catch (e) {
    }
  };

  return (
    <div className="row">
      <div className="col s12 l6 offset-l3">
        <h1>Lets play rock-paper-scissors?</h1>
        <div className="card blue lighten-1">
          <div className="card-content white-text row">
            <span className="card-title">Please, login or signin</span>
            <div className="input-field col l6">
              <input
                placeholder="Login"
                id="login"
                type="text"
                name="login"
                className='custom-input'
                onChange={changeHandler}
              />
              <label htmlFor="email">Login</label>
            </div>
            <div className="input-field col l6">
              <input
                placeholder="Password"
                id="password"
                type="password"
                name="password"
                className='custom-input'
                onChange={changeHandler}
              />
              <label htmlFor="password">Password</label>
            </div>
          </div>
          <div className="card-action">
            <button
              className="btn green lighten-2"
              title="Log In"
              onClick={loginHandler}
              disabled={loading}
            >
              Log in
            </button>
            <button
              className="btn blue-grey"
              title="Sign In"
              onClick={registerHandler}
              disabled={loading}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthPage;
