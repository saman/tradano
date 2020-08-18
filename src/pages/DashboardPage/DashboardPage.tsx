import React from 'react';
import { Container, Row, Col } from "shards-react";

export interface DashboardPageProps {

}

const DashboardPage: React.SFC<DashboardPageProps> = () => {
    return (
        <Container fluid className="content">
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
    );
}

export default DashboardPage;