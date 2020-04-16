import React from 'react';
import HomePage from './pages/HomePage';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import ForumPage from './pages/ForumPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/forum" component={ForumPage} />
          <Redirect path="*" to="/" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
