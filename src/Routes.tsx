import React from 'react';
import { Route, Switch, HashRouter as Router } from 'react-router-dom';
import Main from './pages/Main';

function AppRouter() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Main} />
      </Switch>
    </Router>
  );
}

export default AppRouter;
