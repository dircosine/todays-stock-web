import React from 'react';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import TournamentPage from './pages/TournamentPage';
import ForumPage from './pages/ForumPage';
import BaseTemplate from './components/templates/BaseTemplate';
import { Helmet } from 'react-helmet';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Helmet>
          <title>차트연습장</title>
          <meta name="description" content="하루 5분, 보석같은 투자 종목 찾기. 차트연습장" />}
        </Helmet>
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
