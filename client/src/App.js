import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import useSound from 'use-sound';
import useRoutes from './routes';
import useMessage from './hooks/message.hook';

import 'materialize-css';
import './sass/style.scss';
import useAuth from './hooks/auth.hook';
import AuthContext from './context/AuthContext';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';

import musicSound from './assets/sound/3.mp3';

const App = () => {
  const {
    token, login, logout, userId,
  } = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);

  const [playMusic, { stop }] = useSound(musicSound);

  const [musicButtonClass, setMusicButtonClass] = useState('music-switcher red lighten-2 btn');

  const [isMusic, setMusic] = useState(false);

  const message = useMessage();

  useEffect(() => {
    if (isMusic) {
      setMusicButtonClass('music-switcher red lighten-2 btn');
      message('Music on 🎺');
    } else {
      setMusicButtonClass('music-switcher green lighten-2 btn');
      message('Music off 🙉');
    }
  }, [isMusic]);

  const musicHandler = () => {
    setMusic(!isMusic);
    if (isMusic) {
      stop();
    } else {
      playMusic();
    }
    // eslint-disable-next-line no-use-before-define
    document.removeEventListener('keydown', pressMusicHandler, false);
  };

  const pressMusicHandler = useCallback((e) => {
    if (e.key === 'w') {
      musicHandler();
    }
  }, [isMusic]);

  useEffect(() => {
    document.addEventListener('keydown', pressMusicHandler, false);
    return () => {
      document.removeEventListener('keydown', pressMusicHandler, false);
    };
  }, [isMusic]);

  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, isAuthenticated,
    }}>
    <Router>
      {isAuthenticated && <Navbar />}
      <button className={musicButtonClass} onClick={musicHandler} title="music On/Off"><i className="material-icons">library_music</i></button>
      <div className="container">
        {routes}
      </div>
      {isAuthenticated && <Footer />}
    </Router>
    </AuthContext.Provider>
  );
};

export default App;
