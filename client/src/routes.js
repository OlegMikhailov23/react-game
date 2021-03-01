import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import GamePage from './pages/GamePage';
import StatPage from './pages/StatPage';

const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path='/game' exact>
          <GamePage />
        </Route>
        <Route path='/statistic' exact>
          <StatPage />
        </Route>
        <Redirect to="/game" />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path='/' exact>
        <AuthPage />
      </Route>
      <Redirect to='/' />
    </Switch>
  );
};

export default useRoutes;
