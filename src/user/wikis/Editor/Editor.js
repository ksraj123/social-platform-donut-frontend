import React, { Component } from "react";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CancelButton from "@material-ui/icons/ClearOutlined";
import SaveButton from "@material-ui/icons/SaveOutlined";
import "react-mde/lib/styles/css/react-mde-all.css";
import { Button, Form } from "react-bootstrap";
import * as Showdown from "showdown";
import ReactMde from "react-mde";
import "./Editor.scss";

class Sidebar extends Component {
  state = {
    selectedTab: "write",
    title: this.props.page?.title,
    content: this.props.page?.content
  };

  handleSave = () => {
    this.props.save(
      {
        title: this.state.title,
        content: this.state.content,
        history: this.props.page?.history
      },
      this.props.newPage,
      this.props.sidebar
    );
  };

  setSelectedTab = selectedTab => this.setState({ selectedTab });

  setContent = content => this.setState({ content });

  setTitle = evt => {
    this.setState({ title: evt.target.value });
  };

  render() {
    const converter = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true,
      strikethrough: true,
      tasklists: true
    });

    return (
      <div className="wiki-editor">
        <div className="wikis-top-controls">
          <Button 
            variant="danger" 
            onClick={this.props.delete} 
            disabled={!this.props.delete}>
            <span className="vc">
              <DeleteOutlinedIcon />
              Delete
            </span>
          </Button>
          <Button onClick={this.props.cancel} variant="light">
            <span className="vc">
              <CancelButton />
              Cancel
            </span>
          </Button>
        </div>
        <Form>
          <Form.Label className="field-title">Page Title</Form.Label>
          <Form.Control
            value={this.state.title}
            onChange={this.setTitle}
            as="input"
            name="pageTitle"
            className="searchbar"
            readOnly={this.props.sidebar}
          />
        </Form>
        <ReactMde
          value={this.state.content}
          selectedTab={this.state.selectedTab}
          onTabChange={this.setSelectedTab}
          onChange={this.setContent}
          generateMarkdownPreview={markdown =>
            Promise.resolve(converter.makeHtml(markdown))
          }
        />
        <Form>
          <Form.Label className="field-title">Comments</Form.Label>
          <Form.Control as="input" name="pageTitle" className="searchbar" />
        </Form>
        <div className="wikis-top-controls">
          <Button variant="primary" onClick={this.handleSave}>
            <span className="vc">
              <SaveButton /> Save
            </span>
          </Button>
        </div>
      </div>
    );
  }
}

export default Sidebar;
