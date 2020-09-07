import React, { Component } from "react";
import "./TicketDiscussion.scss";
import Axios from "axios";
import ReactMde from "react-mde";
import Moment from "react-moment";
import Layout from "./Layout/Layout";
import * as Showdown from "showdown";
import { Image } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Disscussion from "./Discussion/Discussion";
import "react-mde/lib/styles/css/react-mde-all.css";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../../../../actions/baseApi";
import SaveButton from "@material-ui/icons/SaveOutlined";
import EditButton from "@material-ui/icons/EditOutlined";
import CancelButton from "@material-ui/icons/ClearOutlined";
import userIcon2 from "../../../../assets/images/userIcon2.jpg";
import SendOutlinedIcon from "@material-ui/icons/SendOutlined";

class TicketDiscussions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "discussions",
      ticket: null,
    };
  }

  getTicket = async () => {
    const ticket = (
      await Axios.get(`${BASE_URL}/ticket/${this.props.ticketId}`)
    ).data;
    this.setState({ ticket: ticket.ticket });
  };

  componentDidMount() {
    this.getTicket();
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  handleBack = () => {
    this.props.back(null);
  };

  sendComment = async (content) => {
    const newTicket = (
      await Axios.post(`${BASE_URL}/ticket/${this.state.ticket._id}/comment`, {
        content,
      })
    ).data.ticket;
    this.setState({
      ticket: newTicket,
    });
  };

  // setTicketContent = (content) => {
  //   this.setState({
  //     ticket: { ...this.state.ticket, content: content },
  //   });
  // };

  handleUpdateTicket = async (updates) => {
    try {
      const newTicket = (
        await Axios.put(`${BASE_URL}/ticket/${this.state.ticket._id}`, updates)
      ).data.ticket;
      this.setState({
        ticket: newTicket,
      });
    } catch (err) {
      console.log(err);
    }
  };

  handleAddTag = async (tagName) => {
    if (this.state.ticket.tags.indexOf(tagName) !== -1) {
      toast.error("Tag already present");
    } else if (tagName.length > 10) {
      toast.error("Tag can have upto 10 characters only");
    } else if ((this.state.ticket.tags || []).length >= 7) {
      toast.error("Ticket can have upto 7 tags only");
    } else {
      try {
        const newTicket = (
          await Axios.post(`${BASE_URL}/ticket/${this.state.ticket._id}/tag/${tagName}`)
        ).data.ticket;
        this.setState({
          ticket: newTicket,
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  handleDeleteTag = async (tagName) => {
    try {
      const newTicket = (
        await Axios.delete(`${BASE_URL}/ticket/${this.state.ticket._id}/tag/${tagName}`)
      ).data.ticket;
      this.setState({
        ticket: newTicket,
      });
    } catch (err) {
      console.log(err);
    } 
  }

  handleViewChange = (atrb) => {
    this.setState({
      view: atrb,
    });
  };

  render() {
    // console.log(this.state.ticket);
    return (
      <>
        {this.state.ticket && (
          <Layout
            ticket={this.state.ticket}
            view={this.state.view}
            addTag={this.handleAddTag}
            handleBack={this.handleBack}
            removeTag={this.handleDeleteTag}
            updateTicket={this.handleUpdateTicket}
            handleViewChange={this.handleViewChange}
          >
            <Disscussion
              ticket={this.state.ticket}
              sendComment={this.sendComment}
              updateTicket={this.handleUpdateTicket}
              // setTicketContent={this.setTicketContent}
            />
          </Layout>
        )}
        <ToastContainer
          draggable
          rtl={false}
          pauseOnHover
          closeOnClick
          autoClose={5000}
          pauseOnFocusLoss
          newestOnTop={false}
          position="top-right"
          hideProgressBar={false}
        />
      </>
    );
  }
}

export default TicketDiscussions;
