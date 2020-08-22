import React, { Component } from "react";
import { connect } from "react-redux";
import "./wikis.scss";
import Axios from "axios";
import Page from "./Page/Page";
import Layout from "./Layout/Layout";
import Editor from "./Editor/Editor";
import Sidebar from "./Sidebar/Sidebar";
import { BASE_URL } from "../../actions/baseApi";
import { getWikis } from "../../actions/wikisAction";

class Wikis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wikis: true,
      allWikis: [],
      currentPage: 1,
      editorMode: false,
      historyMode: false,
      viewHistory: false,
      newPageEditor: false,
      sidebarEditor: false,
      spinner: "Loading...",
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      allWikis: nextProps.wikis.wikis,
      spinner: "",
    });
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.getWikis();
    });
  }

  handleEditorMode = (newPage = false, sidebar = false) => {
    this.setState({
      editorMode: true,
      newPageEditor: !!newPage,
      sidebarEditor: !!sidebar,
    });
  };

  cancelEditor = () => {
    this.setState({
      editorMode: false,
      newPageEditor: false,
    });
  };

  setView = async (page, ref) => {
    let pos = 0;
    this.state.allWikis.forEach((ele, index) => {
      if (ele.title === page) pos = index;
    });
    if (pos) {
      this.setState(
        {
          spinner: "Switing Page.... ",
        },
        async () => {
          let resp = await Axios.get(`${BASE_URL}/wikis/pages?title=${page}`);
          resp = resp.data;
          for (let i = 0; i < resp.wikis.length; i++) {
            if (resp.wikis[i].title === page.title) {
              pos = i;
              break;
            }
          }
          this.setState({
            spinner: "",
            currentPage: pos,
            viewHistory: false,
            historyMode: false,
            allWikis: resp.wikis,
          });
        }
      );
    } else {
      this.handleEditorMode(true);
    }
  };

  handleSave = async (page, newPage = false, sidebar = false) => {
    const { allWikis } = this.state;
    const endpoint = `${BASE_URL}/wikis/pages`;
    const data = {
      title: page.title,
      content: page.content,
      comments: page.comments,
    };
    const findIndexOfPage = (arr, page) => {
      for (let i = 0; i < arr.length; i++)
        if (arr[i].title === page.title) return i;
      return 0;
    };
    if (!newPage && !sidebar) {
      this.setState(
        {
          spinner: "Saving... ",
        },
        async () => {
          const wikis = (await Axios.put(endpoint, data)).data.wikis;
          const index = findIndexOfPage(wikis, page);
          this.setState({
            spinner: "",
            editorMode: false,
            currentPage: index,
            allWikis: [...wikis],
          });
        }
      );
    } else if (sidebar) {
      this.setState(
        {
          spinner: "Saving...",
        },
        async () => {
          const wikis = (await Axios.put(endpoint, data)).data.wikis;
          this.setState({
            spinner: "",
            currentPage: 1,
            editorMode: false,
            allWikis: [...wikis],
            sidebarEditor: false,
          });
        }
      );
    } else {
      if (allWikis.filter((ele) => ele.title === page.title).length === 0) {
        this.setState(
          {
            spinner: "Creating New Page...",
          },
          async () => {
            const wikis = (await Axios.post(endpoint, data)).data.wikis;
            const index = findIndexOfPage(wikis, page);
            this.setState({
              spinner: "",
              editorMode: false,
              currentPage: index,
              allWikis: [...wikis],
              newPageEditor: false,
            });
          }
        );
      } else {
        console.log("Page with that title already exsits!");
      }
    }
  };

  deletePage = async () => {
    const { allWikis, currentPage } = this.state;
    this.setState(
      {
        spinner: "Deleting Page...",
      },
      async () => {
        const wikis = (
          await Axios.delete(`${BASE_URL}/wikis/pages`, {
            data: { title: allWikis[currentPage].title },
          })
        ).data.wikis;
        this.setState({
          spinner: "",
          currentPage: 1,
          editorMode: false,
          allWikis: [...wikis],
        });
      }
    );
  };

  handleViewHistory = () => {
    this.setState({
      historyMode: true,
      viewHistory: true,
    });
  };

  handleViewHistoryItem = async (commit) => {
    const title = this.state.allWikis[this.state.currentPage].title;
    this.setState(
      {
        spinner: "Time Travelling...",
      },
      async () => {
        this.setState({
          spinner: "",
          viewHistory: false,
          allWikis: (
            await Axios.get(
              `${BASE_URL}/wikis/pages?title=${title}&ref=${commit}`
            )
          ).data.wikis,
        });
      }
    );
  };

  render() {
    const {
      allWikis,
      editorMode,
      currentPage,
      sidebarEditor,
      newPageEditor,
    } = this.state;
    const isAdmin = localStorage.getItem("admin");

    return (
      <div className="wikis">
        <Layout
          wikis={this.state.wikis}
          spinner={this.state.spinner}
          allWikis={allWikis}
          isAdmin={isAdmin}
        >
          <React.Fragment>
            {!editorMode && allWikis.length !== 0 && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Page
                  isAdmin={isAdmin}
                  allWikis={allWikis}
                  currentPage={currentPage}
                  viewHistory={this.state.viewHistory}
                  historyMode={this.state.historyMode}
                  handleEditorMode={this.handleEditorMode}
                  handleViewHistory={this.handleViewHistory}
                  handleViewHistoryItem={this.handleViewHistoryItem}
                />
                <Sidebar
                  pages={allWikis}
                  isAdmin={isAdmin}
                  setView={this.setView}
                  edit={this.handleEditorMode}
                  content={allWikis[0].content}
                />
              </div>
            )}
            {editorMode && (
              <Editor
                save={this.handleSave}
                newPage={newPageEditor}
                sidebar={sidebarEditor}
                delete={this.deletePage}
                cancel={this.cancelEditor}
                page={
                  newPageEditor
                    ? {}
                    : sidebarEditor
                    ? allWikis[0]
                    : allWikis[currentPage]
                }
              />
            )}
          </React.Fragment>
        </Layout>
      </div>
    );
  }
}

// map state to props
const mapStateToProps = (state) => ({
  wikis: state.wikis,
});

export default connect(mapStateToProps, { getWikis })(Wikis);
