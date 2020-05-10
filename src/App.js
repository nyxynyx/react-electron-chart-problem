import React, { Component } from "react";

import Chart from './components/Chart/Chart';
import "./custom.css";

class App extends Component {
  render() {
    return (
      <div>
        <h3>App</h3>
        <Chart />
      </div>
    );
  }
}
export default App;
