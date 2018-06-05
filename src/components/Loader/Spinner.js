import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

const fullCircleRotate = keyframes`
  0% { transform: rotate(0deg) }
  100% { transform: rotate(360deg) }
`;

const StyledSpinner = styled.span`
  display: inline-block;
  width: ${props => props.size};
  height: ${props => props.size};
  border: calc(${props => props.size} / 6) solid ${props => props.color};
  border-left-color: ${props => props.gapColor};
  border-radius: 100%;
  animation: ${fullCircleRotate} ${props => props.speed} linear infinite;
`;

const Spinner = ({ size, color, ...otherProps }) => (
  <StyledSpinner
    size={size}
    color={color}
    {...otherProps}
  />
);

Spinner.propTypes = {
  size: PropTypes.string,
  speed: PropTypes.string,
  color: PropTypes.string,
  gapColor: PropTypes.string,
};

Spinner.defaultProps = {
  size: '40px',
  speed: '1s',
  color: '#afb4ba',
  gapColor: `#afb4ba25`
};

export default Spinner;
