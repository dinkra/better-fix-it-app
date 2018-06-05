import React from 'react';
import styled from 'styled-components';
import { Navbar } from 'react-bootstrap';

const StyledNavbar = styled(Navbar)`
  margin-bottom: 0;
`;

const Header = () =>
  <StyledNavbar>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#home">Better Fix It</a>
      </Navbar.Brand>
    </Navbar.Header>
  </StyledNavbar>;

export default Header;
