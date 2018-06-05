import React from 'react';
import styled from 'styled-components';
import Spinner from './Spinner';

const StyledLoader = styled('div')`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.3;
  text-align: center;
`;

const StyledSpinner = styled(Spinner)`
  position: relative;
  top: 50%;
`;

const Loader = () =>
  <StyledLoader>
    <StyledSpinner />
  </StyledLoader>;

export default Loader;
