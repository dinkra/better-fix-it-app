import React from 'react';
import styled from 'styled-components';

const StyledFooter = styled('footer')`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #f5f5f5;
`;

const Footer = () =>
  <StyledFooter>
    email: info@betterfixit.nl
  </StyledFooter>;

export default Footer;
