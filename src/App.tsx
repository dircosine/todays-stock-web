import React from 'react';
import TournamentPage from './pages/TournamentPage';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import ForumPage from './pages/ForumPage';
import BaseTemplate from './components/templates/BaseTemplate';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <BaseTemplate>
          <Switch>
            <Route exact path="/" component={TournamentPage} />
            <Route path="/forum" component={ForumPage} />
            <Redirect path="*" to="/" />
          </Switch>
        </BaseTemplate>
      </BrowserRouter>
    </div>
  );
}

export default App;
