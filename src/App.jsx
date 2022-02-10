import React from 'react';
import * as Router from 'react-router-dom';
import './index.css';

import SignUp from './Pages/SignUp';
import SignIn from './Pages/SignIn';
import Header from './Components/Header';
import Dashboard from './Pages/Dashboard';
import EditQuizPage from './Pages/EditQuizPage';
import EditQuestionPage from './Pages/EditQuestionPage';
import AdminResults from './Pages/AdminResults';
import JoinQuizPage from './Pages/JoinQuizPage';
import GameSessionPage from './Pages/GameSessionPage';
import AdminGameSession from './Pages/AdminGameSession';
import PlayerResults from './Pages/PlayerResults';

export default function App() {
  return (
    <React.StrictMode>
      <Router.BrowserRouter>
        <div>
          <Router.Switch>
            <Router.Route exact path="/admin/signup">
              <Header />
              <SignUp />
            </Router.Route>
            <Router.Route exact path="/admin/signin">
              <Header />
              <SignIn />
            </Router.Route>
            <Router.Route exact path="/admin/dashboard">
              <Header />
              <Dashboard />
            </Router.Route>
            <Router.Route exact path="/admin/results/:quizid?/:sessionid?">
              <Header />
              <AdminResults />
            </Router.Route>
            <Router.Route exact path="/admin/:editquiz?">
              <Header />
              <EditQuizPage />
            </Router.Route>
            <Router.Route exact path="/admin/edit/:quizid?/:question?">
              <Header />
              <EditQuestionPage />
            </Router.Route>
            <Router.Route exact path="/join">
              <Header />
              <JoinQuizPage />
            </Router.Route>
            <Router.Route exact path="/results/:playerID?">
              <Header />
              <PlayerResults />
            </Router.Route>
            <Router.Route exact path="/admin/:quizID?/:sessionID?">
              <Header />
              <AdminGameSession />
            </Router.Route>
            <Router.Route exact path="/player/:sessionID?/:playerID?">
              <Header />
              <GameSessionPage />
            </Router.Route>
            <Router.Route exact path="/">
              <Header />
              <SignIn />
            </Router.Route>
          </Router.Switch>
        </div>
      </Router.BrowserRouter>
    </React.StrictMode>
  );
}

// localhost:5000/session=sessionID
