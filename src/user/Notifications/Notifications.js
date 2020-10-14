import React, { Component } from "react";
import Navigation from "../dashboard/navigation/navigation";
import Websocket from "react-websocket";

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
    };
  }

  handleData(data) {
    console.log(data);
    this.setState({notifications: Array.from(data)});
  }

  render() {
    return (
      <div className="ticket">
        <div className="navigation">
          <Navigation ticket={true} />
        </div>
        <div className="ticket-details" id="ticket-shadow">
          <Websocket
            url={`ws://127.0.0.1:9999/?topic=${localStorage.getItem('userId')}`}
            onMessage={this.handleData.bind(this)}
          />
          {this.state.notifications.length !== 0 && this.state.notifications.map(ele => <p>{ele.message}</p>)}
        </div>
      </div>
    );
  }
}

export default Notifications;
