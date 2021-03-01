// eslint-disable-next-line no-unused-vars
// import regeneratorRuntime from 'regenerator-runtime';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import useRoutes from './routes';

import 'materialize-css';
import './sass/style.scss';

// const runTime = require('regenerator-runtime');

const App = () => {
  const routes = useRoutes(false);
  return (
    <Router>
      <div className="container">
        {routes}
      </div>
    </Router>
  );
};

export default App;
