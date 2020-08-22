import React, { Component } from "react";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CancelButton from "@material-ui/icons/ClearOutlined";
import SaveButton from "@material-ui/icons/SaveOutlined";
import "react-mde/lib/styles/css/react-mde-all.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import * as Showdown from "showdown";
import ReactMde from "react-mde";
import "./Editor.scss";

class Editor extends Component {
  state = {
    comments: "",
    selectedTab: "write",
    title: this.props.page?.title,
    content: this.props.page?.content,
  };

  handleSave = () => {
    this.props.save(
      {
        title: this.state.title,
        content: this.state.content,
        comments: this.state.comments,
        history: this.props.page?.history
      },
      this.props.newPage,
      this.props.sidebar
    );
  };
  
  setContent = content => this.setState({ content });
  
  setTitle = evt => this.setState({ title: evt.target.value });

  setSelectedTab = selectedTab => this.setState({ selectedTab });

  setComments = evt => this.setState({ comments: evt.target.value });

  render() {
    const converter = new Showdown.Converter({
      tables: true,
      tasklists: true,
      strikethrough: true,
      simplifiedAutoLink: true,
    });

    return (
      <div className="wiki-editor">
        <div className="wikis-top-controls">
          <Button 
            variant="outline-danger" 
            onClick={this.props.delete} 
            disabled={this.props.sidebar || this.props.newPage || this.props.page.title==="Home"}>
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
            as="input"
            name="pageTitle"
            className="searchbar"
            value={this.state.title}
            onChange={this.setTitle}
            readOnly={!this.props.newPage}
          />
        </Form>
        <ReactMde
          onChange={this.setContent}
          value={this.state.content}
          onTabChange={this.setSelectedTab}
          selectedTab={this.state.selectedTab}
          generateMarkdownPreview={markdown =>
            Promise.resolve(converter.makeHtml(markdown))
          }
        />
        <Form>
          <Form.Label className="field-title">Comments</Form.Label>
          <Form.Control 
            as="input" 
            name="comments"
            className="searchbar"
            value={this.state.comments}
            onChange={this.setComments} />
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

export default Editor;
