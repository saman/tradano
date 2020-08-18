import React from 'react';
import './NavComponent.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faColumns, faCoins, faCog, faListAlt } from '@fortawesome/free-solid-svg-icons'
import {
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Collapse,
} from "shards-react";

import { Link } from "react-router-dom";

export interface NavComponentProps {

}

const logo = process.env.PUBLIC_URL + '/logo.svg';

const NavComponent: React.SFC<NavComponentProps> = () => {
    return (
        <Navbar type="light" expand="md">
            <NavbarBrand className="brand" href="/">
                <img width="32" src={logo} alt="" />
                <h1>Tradano</h1>
            </NavbarBrand>
            <NavbarToggler />
            <Collapse navbar>
                <Nav navbar className="items ml-auto">
                    <NavItem>
                        <NavLink tag={Link} to="/dashboard">
                            <FontAwesomeIcon icon={faColumns} />
                            <span>Dashboard</span>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink active tag={Link} to="/trades">
                            <FontAwesomeIcon icon={faListAlt} />
                            <span>Trades</span>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to="/portfolio">
                            <FontAwesomeIcon icon={faCoins} />
                            <span>Portfolio</span>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to="/settings">
                            <FontAwesomeIcon icon={faCog} />
                            <span>Settings</span>
                        </NavLink>
                    </NavItem>
                </Nav>

            </Collapse>
        </Navbar>
    );
}

export default NavComponent;