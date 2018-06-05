/**
 * Test key number AIzaSyB4xfIaSitASdx-VvSqf3mxQuPtQX_52XE
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import { debounce } from 'lodash';
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

  onMapClick = (props, map) => {
    const lat = map.center.lat();
    const lng = map.center.lng();
    this.props.setLocation(lat, lng);
    this.setState({
      activeMarker: {
        lat,
        lng
      }
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
    const lat = map.center.lat();
    const lng = map.center.lng();
    this.props.locationLoaded();
    this.props.setLocation(lat, lng);
    this.setState({
      activeMarker: {
        lat,
        lng
      }
    });
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

  render() {
    const {
      centerAroundCurrentLocation,
      clickableIcons,
      defaultCoordinates: { initialCenter },
      google,
      maxZoom,
      minZoom,
      style,
      zoomLevel
    } = this.props;
    const { activeMarker } = this.state;
    return (
      <Wrapper style={{ height: style.height }}>
        {/* passing height here will prevent the scroll from breaking when blocks are below this */}
        <Map
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
          <Marker
            position={activeMarker}
            optimized={false}
          />
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
  defaultCoordinates: PropTypes.object.isRequired,
  // google component props
  google: PropTypes.object,
  zoomLevel: PropTypes.number.isRequired,
  maxZoom: PropTypes.number,
  minZoom: PropTypes.number,
  centerAroundCurrentLocation: PropTypes.bool.isRequired,
  // parent props
  locationLoaded: PropTypes.func,
  setLocation: PropTypes.func,
  style: PropTypes.object
};

const defaultCoordinates = {
  // Center of Amsterdam
  initialCenter: {
    lat: 52.373637,
    lng: 4.880264
  },

  // Center of the map when zoomed out completely
  minZoomCenter: {
    lat: 27.202900343528665,
    lng: 27.202900343528665
  }
};

const zoom = {
  max: 18,
  min: 2
};

Gmap.defaultProps = {
  zoomLevel: 18,
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
  apiKey: 'AIzaSyB4xfIaSitASdx-VvSqf3mxQuPtQX_52XE',
  version: 3.28
})(Gmap);
