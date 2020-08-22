import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "react-bootstrap";
import PagesDisplay from "./PagesDisplay/PagesDisplay";
import "./Sidebar.scss";
import EditButton from "@material-ui/icons/EditOutlined";

class Sidebar extends Component {
  state = {};

  componentDidMount() {
    const allLinks = document.querySelectorAll(".wiki-sidebar a");
    Array.prototype.forEach.call(allLinks, (link) => {
      let text = link.textContent;
      if (text[0] === "$") {
        text = text.substring(1, text.lastIndexOf("$"));
        link.textContent = text;
        if (this.props.pages.filter((page) => page.title === text).length === 0)
          link.style.color = "red";
        link.addEventListener("click", (evt) => {
          evt.preventDefault();
          evt.stopPropagation();
          this.props.setView(link.textContent);
        });
      } else {
        link.innerHTML = `<span>🔗</span>${link.textContent}`;
      }
    });
  }

  render() {
    return (
      <div className="wiki-sidebar">
        <PagesDisplay pages={this.props.pages.slice(1)} setView={this.props.setView} />
        <div className="wiki-sidebar-navigator">
          {this.props.isAdmin && (
            <EditButton
              onClick={() => this.props.edit(false, true)}
              className="edit-button"
            />
          )}
          <ReactMarkdown source={this.props.content} />
        </div>
      </div>
    );
  }
}

export default Sidebar;
