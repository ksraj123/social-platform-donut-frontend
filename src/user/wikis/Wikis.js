import React, { Component } from "react";
import { connect } from "react-redux";
import "./wikis.scss";
import NewPageButton from "@material-ui/icons/DescriptionOutlined";
import Navigation from "../dashboard/navigation/navigation";
import EditButton from "@material-ui/icons/EditOutlined";
import PagesDisplay from "./PagesDisplay/PagesDisplay";
import { getWikis } from "../../actions/wikisAction";
import ReactMarkdown from "react-markdown";
import { Button } from "react-bootstrap";
import Sidebar from "./Sidebar/Sidebar";
import Editor from "./Editor/Editor";

// Things to implement
// Navbar displaying pages - it will have option to create a new page and delete page when hovering over that page
// known styling issue with Navigator - on closing is goes all the way to the side
// Option to edit in each page, and when editing a save button would appear

class Wikis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wikis: true,
      allWikis: [],
      currentPage: 1,
      editorMode: false,
      newPageEditor: false,
      sidebarEditor: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      allWikis: nextProps.wikis.wikis
    });
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.getWikis();
    });
  }

  editorMode = (newPage = false, sidebar = false) => {
    this.setState({
      editorMode: true,
      newPageEditor: !!newPage,
      sidebarEditor: !!sidebar
    });
  };

  cancelEditor = () => {
    this.setState({
      editorMode: false,
      newPageEditor: false
    });
  };

  setView = page => {
    let pos = 0;
    this.state.allWikis.forEach((ele, index) => {
      if (ele.title === page) pos = index;
    });
    if (pos) {
      this.setState({
        currentPage: pos
      });
    } else {
      this.editorMode(true);
    }
  };

  handleSave = (page, newPage = false, sidebar = false) => {
    const { allWikis, currentPage } = this.state;
    if (!newPage && !sidebar) {
      this.setState({
        allWikis: [
          ...allWikis.slice(0, currentPage),
          page,
          ...allWikis.slice(currentPage + 1)
        ],
        editorMode: false
      });
    } else if (sidebar) {
      this.setState({
        allWikis: [page, ...allWikis.slice(1)],
        sidebarEditor: false,
        editorMode: false
      });
    } else {
      if (allWikis.filter(ele => ele.title === page.title).length === 0) {
        this.setState({
          allWikis: [...allWikis, page],
          editorMode: false,
          newPageEditor: false,
          currentPage: this.state.allWikis.length
        });
      } else {
        console.log("Page with that title already exsits!");
      }
    }
  };

  deletePage = () => {
    const { allWikis, currentPage } = this.state;
    if (allWikis.length === 2){
      console.log("There has to be atleast 1 page is wikis");
      this.setState({
        editorMode: false
      })
    } else {
      this.setState({
        allWikis: [
          ...allWikis.slice(0, currentPage),
          ...allWikis.slice(currentPage + 1)
        ],
        editorMode: false,
        currentPage: 1
      });
    }
  }

  render() {
    // const editor =
    return (
      <div className="wikis">
        <div className="navigation">
          <Navigation isMobile={true} wikis={this.state.wikis}></Navigation>
        </div>
        <div id="wikis">
          {!this.state.editorMode && this.state.allWikis.length !== 0 && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="page">
                <div className="page-header">
                  <div className="wikis-top-controls">
                    <Button onClick={() => this.editorMode()} variant="light">
                      <EditButton />Edit
                    </Button>
                    <Button onClick={() => this.editorMode(true, false)} variant="primary">
                      <NewPageButton />New Page
                    </Button>
                  </div>
                  <h1>{this.state.allWikis[this.state.currentPage].title}</h1>
                </div>
                <ReactMarkdown
                  source={this.state.allWikis[this.state.currentPage].content}
                />
              </div>
              <div className="Side">
                <PagesDisplay
                  pages={this.state.allWikis.slice(1)}
                  setView={this.setView}
                />
                <Sidebar
                  edit={this.editorMode}
                  setView={this.setView}
                  pages={this.state.allWikis}
                  content={this.state.allWikis[0].content}
                />
              </div>
            </div>
          )}

          {this.state.editorMode &&
            !this.state.newPageEditor &&
            !this.state.sidebarEditor && (
              <Editor
                save={this.handleSave}
                cancel={this.cancelEditor}
                delete={this.state.allWikis.length > 2? this.deletePage : false}
                page={this.state.allWikis[this.state.currentPage]}
              />
            )}
          {this.state.editorMode && this.state.newPageEditor && (
            <Editor 
              cancel={this.cancelEditor} 
              save={this.handleSave} 
              newPage page={{}} />
          )}
          {this.state.editorMode && this.state.sidebarEditor && (
            <Editor
              cancel={this.cancelEditor}
              save={this.handleSave}
              sidebar
              page={this.state.allWikis[0]}
            />
          )}
        </div>
      </div>
    );
  }
}

// map state to props
const mapStateToProps = state => ({
  auth: state.auth,
  error: state.error,
  event: state.event,
  post: state.post,
  project: state.project,
  wikis: state.wikis
});

export default connect(mapStateToProps, { getWikis })(Wikis);

// tiny mce notes for sidebar
// - on it github it does not support photos it supports emojis in headings, tiny mce is supporting emojis
// - will not support ordered lists as not require
// - wil not provide Bold italic etc tools
// - will not provide alignment tools like left justify etc
// - will not provide format select tool
// -

// demo sidebar

// - [$Home$]
// - ##### Events
//     - [$Google Summer of Code$]
//     - [$Linux Foundation Community Bridge Program$]
// - [$About$]
// - ##### Our projects
//     - [$Donut$]
//         - Introduction
//         - Setup
//         - Use Cases
//     - [$Spansberry$]
//         - Introduction
//         - Setup
//         - Use Cases
//     - [$CodeBadge$]
//         - Introduction
//         - Setup
//         - Use Cases
// - [Docs](https://www.google.co.in/)
// - [Official Website](https://www.google.co.in/)

// Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.


// Issues with preview
// enter html in write rection you will get that html rendered in preview but it will not be rendered in the actual page
// sidebar editing preview does not display exaclty how the sidebar would look
//   Red things do not get red, blue things do not get blue, and $ sticks around