import React from 'react';
import HomePage from './pages/HomePage';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import ForumPage from './pages/ForumPage';
import BaseTemplate from './components/templates/BaseTemplate';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <BaseTemplate>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/forum" component={ForumPage} />
            <Redirect path="*" to="/" />
          </Switch>
        </BaseTemplate>
      </BrowserRouter>
    </div>
  );
}

export default App;
