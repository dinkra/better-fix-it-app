import React from 'react';
import styled from 'styled-components';
import { Navbar } from 'react-bootstrap';

const StyledNavbar = styled(Navbar)`
  margin-bottom: 0;
`;

const Alpha = styled('div')`
  position: absolute;
  right: 0;
  top: 0;
  width: 0;
  height: 0;
  border-top: 50px solid #4B042F;
  border-left: 50px solid transparent;
  
  &:after {
    content: "alpha";
    position: absolute;
    color: white;
    font-size: 14px;
    width: 50px;
    height: 50px;
    top: -40px;
    right: 0px;
    transform: rotate(45deg);
  }
`;

const Header = () =>
  <StyledNavbar>
    <Navbar.Header>
      <Navbar.Brand>
        <p>Better Fix It</p>
        <Alpha />
      </Navbar.Brand>
    </Navbar.Header>
  </StyledNavbar>;

export default Header;
