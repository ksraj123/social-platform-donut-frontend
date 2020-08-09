import React, { Component } from 'react';
import "./wikis.scss";
import Navigation from "../dashboard/navigation/navigation";

class Wikis extends Component {
  constructor(props) {
    super(props);
      this.state = {
          wikis: true
      };
  }
  render() {
    return(
        <div className="wikis">
          <div className="navigation">
            <Navigation wikis={this.state.wikis}></Navigation>
          </div>
          <div className="news"></div>
        </div>
    )
  }
}

export default Wikis;
