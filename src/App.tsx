import React from 'react';
import './App.css';
import { Card, CardBody } from "shards-react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import NavComponent from './layout/NavComponent/NavComponent';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import TradesPage from './pages/TradesPage/TradesPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import PortfolioPage from './pages/PortfolioPage/PortfolioPage';

function App() {
  return (
    <div className="App">
      <Router>
        <NavComponent />
        <Card>
          <CardBody>
            <Switch>
              <Route exact path="/">
                <Redirect to="/dashboard" />
              </Route>
              <Route exact path="/dashboard">
                <DashboardPage />
              </Route>
              <Route exact path="/trades">
                <TradesPage />
              </Route>
              <Route exact path="/portfolio">
                <PortfolioPage />
              </Route>
              <Route exact path="/settings">
                <SettingsPage />
              </Route>
            </Switch>
          </CardBody>
        </Card>
      </Router>
    </div>
  );
}

export default App;
