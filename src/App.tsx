import React from 'react';
import logo from './img/logo.svg';
import './App.css';
import { Container, Row, Col } from "shards-react";
import { Nav, NavItem, NavLink } from "shards-react";

import { Alert } from "shards-react";
import { Button } from "shards-react";

function App() {
  return (
    <div className="App">
      <Nav tabs className="no-border">
        <NavItem>
          <NavLink active href="#">
            Active
        </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#">Link</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#">Another Link</NavLink>
        </NavItem>
        <NavItem>
          <NavLink disabled href="#">
            Disabled Link
        </NavLink>
        </NavItem>
      </Nav>

      <Container fluid="true" className="content">
        <Row>
          <Col>1 / 12</Col>
          <Col>2 / 12</Col>
          <Col>3 / 12</Col>
          <Col>4 / 12</Col>
          <Col>5 / 12</Col>
          <Col>6 / 12</Col>
          <Col>7 / 12</Col>
          <Col>8 / 12</Col>
          <Col>9 / 12</Col>
          <Col>10 / 12</Col>
          <Col>11 / 12</Col>
          <Col>12 / 12</Col>
        </Row>
        <Row>
          <Col>1 / 12</Col>
          <Col>2 / 12</Col>
          <Col>3 / 12</Col>
          <Col>4 / 12</Col>
          <Col>5 / 12</Col>
          <Col>6 / 12</Col>
          <Col>7 / 12</Col>
          <Col>8 / 12</Col>
          <Col>9 / 12</Col>
          <Col>10 / 12</Col>
          <Col>11 / 12</Col>
          <Col>12 / 12</Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
