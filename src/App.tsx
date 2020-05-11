import React from 'react';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import TournamentPage from './pages/TournamentPage';
import ForumPage from './pages/ForumPage';
import StatsPage from './pages/StatsPage';
import BaseTemplate from './components/templates/BaseTemplate';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <BaseTemplate>
          <Switch>
            <Route exact path="/" component={TournamentPage} />
            <Route path="/forum" component={ForumPage} />
            <Route path="/stats" component={StatsPage} />
            <Redirect path="*" to="/" />
          </Switch>
        </BaseTemplate>
      </BrowserRouter>
    </div>
  );
}

export default App;
