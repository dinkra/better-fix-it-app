import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, Modal } from 'react-bootstrap';

import api from '../api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Gmap from '../components/GoogleMap';
import Loader from '../components/Loader';

const StyledButton = styled(Button)`
  position: absolute;
  bottom: 60px;
  width: 100%;
  height: 50px;
  font-size: 18px;
  font-weight: 600;
  color: white;
  background-color: #4B042F;
  
  &:hover, &:focus, &:active, &:focus:active {
    color: white;
    background-color: #6D0845;
  }
`;

const SuccessText = styled('div')`
  text-align: center;
  text-font: 18px;
  padding: 50px 0;
`;

class App extends Component {
  state = {
    loading: true,
    lat: null,
    lng: null,
    success: false
  };

  onLocationLoaded = (lat, lng) => {
    this.setState({
      loading: false,
      lat,
      lng
    });
  };

  setLocation = (lat, lng) => {
    this.setState({
      lat,
      lng
    });
  };

  submitLocation = () => {
    const { lat, lng } = this.state;
    api.postLocation(lat, lng)
      .then(() => {
        this.setState({
          success: true
        });
      })
  };

  render() {
    const { loading, success } = this.state;
    return (
      <div className="App">
        {loading && (<Loader />)}
        {success && (
          <Modal show={success} onHide={this.handleClose}>
            <Modal.Title>
              <SuccessText>Thank you!</SuccessText>
            </Modal.Title>
          </Modal>
        )}
        <Header />
        <Gmap
          style={{ height: 'calc(100vh - 100px)' }}
          centerAroundCurrentLocation={true}
          shouldUseFitBounds={false}
          markers={[]}
          locationLoaded={this.onLocationLoaded}
          setLocation={this.setLocation}
        />
        <StyledButton
          onClick={this.submitLocation}
        >Submit location</StyledButton>
        <Footer />
      </div>
    );
  }
}

export default App;
