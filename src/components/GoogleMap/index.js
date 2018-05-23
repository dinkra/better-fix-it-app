/**
 * Test key number AIzaSyB4xfIaSitASdx-VvSqf3mxQuPtQX_52XE
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { get, debounce } from 'lodash';
import styled from 'styled-components';

const Wrapper = styled('div')`
  // this is a fix for the library as they didn't extend styling their map wrapper for devs
  // if we have elements below the map, the page scroll will add the map height
  > div, +div {
    height: auto !important;
  }
  .gm-style-iw {
    width: 100% !important;
    top: -2px !important;
    left: 0 !important;
    right: 0 !important;
    background-color: #fff;
    border-radius: 5px;
  }
`;

const InfoWindowWrapper = styled('div')`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 235px;
  height: 175px;
  overflow: hidden;
`;

const InfoWindowImage = styled('div')`
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  background-image: url('${props => props.image}');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 110% auto;
  width: 100%;
  height: 115px;
`;

const InfoWindowAbout = styled('div')`
  position: relative;
  top: 125px;
  width: 265px;
  margin: 10px 0 0 20px;
  color: #78828B;
  a {
    text-decoration: none;
    color: #78828B;
  }
  h5 {
    font-weight: 500;
    font-size: 16px;
    margin-bottom: 0px;
  }
  p {
    font-size: 16px;
  }
`;


class Gmap extends Component {
  constructor() {
    super();

    this.state = {
      showingInfoWindow: false,
      activeMarker: null,
      selectedPlace: null
    };
  }
  componentWillMount() {
    this.delayedUpdateBoundaries = debounce(this.props.updateBoundaries, 400);
  }
  onMapClick = () => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  onMarkerClick = (props, marker) => {
    this.setState({
      showingInfoWindow: true,
      activeMarker: marker,
      selectedPlace: props
    });
  };

  onInfoWindowClose = () => {
    this.setState({
      showingInfoWindow: false,
      activeMarker: null
    });
  };

  onDragEnd = (mapProps, map) => {
    const bounds = this.getBounds(map);
    if (bounds.southWest.lat() < -85 || bounds.northEast.lat() > 85) {
      this.setMinZoomCenter(map);
    } else {
      this.handleUpdateBoundaries(bounds);
    }
  };

  onZoomChanged = (mapProps, map) => {
    const { minZoom } = this.props;
    if (map.zoom === minZoom) {
      this.setMinZoomCenter(map);
    }
    const bounds = this.getBounds(map);
    this.handleUpdateBoundaries(bounds);
  };

  onRecenter = (props, map) => {
    const bounds = this.getBounds(map);
    this.handleUpdateBoundaries(bounds);
  };

  setMinZoomCenter = (map) => {
    const { google, defaultCoordinates: { minZoomCenter } } = this.props;
    const center = new google.maps.LatLng(minZoomCenter.lat, minZoomCenter.lng);
    map.setCenter(center);
  };

  getBounds = (map) => {
    const bounds = map.getBounds();
    return {
      northEast: bounds.getNorthEast(),
      southWest: bounds.getSouthWest()
    };
  };

  handleUpdateBoundaries = (bounds) => {
    this.delayedUpdateBoundaries(bounds.northEast, bounds.southWest);
  };

  fitbounds = (props, map) => {
    if (!this.props.shouldUseFitBounds) {
      return;
    }
    const { google, markers } = this.props;
    const bounds = new google.maps.LatLngBounds();
    const positions = markers.map(marker => new google.maps.Marker({
      icon: marker.icon,
      position: marker.position
    }));
    for (let i = 0; i < positions.length; i++) {
      bounds.extend(positions[i].getPosition());
    }
    map.fitBounds(bounds);
  };

  render() {
    const {
      centerAroundCurrentLocation,
      clickableIcons,
      defaultCoordinates: { initialCenter },
      google,
      markers,
      maxZoom,
      minZoom,
      style,
      zoomLevel
    } = this.props;
    const {
      activeMarker,
      selectedPlace,
      showingInfoWindow,
    } = this.state;
    return (
      <Wrapper style={{ height: style.height }}>
        {/* passing height here will prevent the scroll from breaking when blocks are below this */}
        <Map
          onReady={this.fitbounds}
          google={google}
          zoom={zoomLevel}
          style={style}
          initialCenter={initialCenter}
          onDragend={this.onDragEnd}
          onZoom_changed={this.onZoomChanged}
          onClick={this.onMapClick}
          clickableIcons={clickableIcons}
          onRecenter={this.onRecenter}
          maxZoom={maxZoom}
          minZoom={minZoom}
          centerAroundCurrentLocation={centerAroundCurrentLocation}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.key}
              onClick={this.onMarkerClick}
              name={marker.name}
              address={marker.address}
              image={marker.image}
              link={marker.link}
              position={marker.position}
              optimized={false}
              icon={{
                url: marker.icon
              }}
            />
          ))}
          <InfoWindow
            onClose={this.onInfoWindowClose}
            onOpen={this.onReady}
            marker={activeMarker}
            visible={showingInfoWindow}
          >
            <InfoWindowWrapper>
              <InfoWindowImage
                image={`${get(selectedPlace, 'image')}`}
              />
              <InfoWindowAbout>
                <a href={`/retailer/${get(selectedPlace, 'link')}`}>
                  <h5>{get(selectedPlace, 'name')}</h5>
                  <p>{get(selectedPlace, 'address')}</p>
                </a>
              </InfoWindowAbout>
            </InfoWindowWrapper>
          </InfoWindow>
        </Map>
      </Wrapper>
    );
  }
}

const GeoPoint = PropTypes.shape({
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired
});

const MarkerShape = PropTypes.shape({
  position: GeoPoint.isRequired,
  key: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired
});

Gmap.propTypes = {
  shouldUseFitBounds: PropTypes.bool,
  defaultCoordinates: PropTypes.object.isRequired,
  // google component props
  google: PropTypes.object,
  zoomLevel: PropTypes.number.isRequired,
  maxZoom: PropTypes.number,
  minZoom: PropTypes.number,
  centerAroundCurrentLocation: PropTypes.bool.isRequired,
  // parent props
  markers: PropTypes.arrayOf(MarkerShape),
  clickableIcons: PropTypes.bool,
  updateBoundaries: PropTypes.func,
  style: PropTypes.object
};

const defaultCoordinates = {
  // Center of Amsterdam
  initialCenter: {
    lat: 52.3702,
    lng: 4.8952
  },

  // Center of the map when zoomed out completely
  minZoomCenter: {
    lat: 27.202900343528665,
    lng: 27.202900343528665
  }
};

const zoom = {
  max: 15,
  min: 2
};

Gmap.defaultProps = {
  zoomLevel: 13,
  maxZoom: zoom.max,
  minZoom: zoom.min,
  defaultCoordinates,
  centerAroundCurrentLocation: true,
  markers: [],
  clickableIcons: false, // disable clicking to maps icons (restaurants, bars, parks, etc)
  updateBoundaries: () => {},
  shouldUseFitBounds: false,
  style: {
    width: '100%',
    height: '740px'
  }
};

// eslint-disable-next-line
export default GoogleApiWrapper({
  apiKey: fashionTradeSettings.google_maps_api_key,
  version: fashionTradeSettings.google_maps_version
})(Gmap);
