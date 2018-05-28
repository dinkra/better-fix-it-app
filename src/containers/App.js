import React, { Component } from 'react';
import '../App.css';

import Header from '../components/Header';
import Gmap from '../components/GoogleMap';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <p className="App-intro">
          <Gmap
            style={{ height: '635px' }}
            centerAroundCurrentLocation={true}
            shouldUseFitBounds={false}
            markers={[]}
          />
        </p>
      </div>
    );
  }
}

export default App;
