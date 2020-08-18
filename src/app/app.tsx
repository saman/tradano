import React from 'react';
import './app.css';
import { Card, CardBody } from "shards-react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import NavLayout from '../layout/nav/nav';
import DashboardPage from '../pages/dashboard/dashboard';
import TradesPage from '../pages/trades/trades';
import SettingsPage from '../pages/settings/settings';
import PortfolioPage from '../pages/portfolio/portfolio';

function App() {
  return (
    <div className="App">
      <Router>
        <NavLayout />
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
