import React, { Component } from "react";
import { connect } from "react-redux";
import "./wikis.scss";
import axios from 'axios';
import Page from "./Page/Page";
import Layout from "./Layout/Layout";
import Editor from "./Editor/Editor";
import Sidebar from "./Sidebar/Sidebar";
import { BASE_URL } from "../../actions/baseApi";
import { getWikis } from "../../actions/wikisAction";
import { ToastContainer, toast } from "react-toastify";

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
    this.axiosCancel = axios.CancelToken.source();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      allWikis: nextProps.wikis.wikis,
      spinner: "",
    });
  }

  componentDidMount() {
    const { getWikis } = this.props
    setTimeout(() => {
      getWikis();
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
    const { allWikis } = this.state
    allWikis.forEach((ele, index) => {
      if (ele.title === page) pos = index;
    });
    if (pos) {
      this.setState(
        {
          spinner: "Switing Page.... ",
        },
        async () => {
          try {
            let wikis = (
              await axios.get(`${BASE_URL}/wikis/pages?title=${page}`, {
                cancelToken: this.axiosCancel.token,
              })
            ).data.wikis;
            wikis.forEach((ele, index) => {
              if (ele.title === page.title) pos = index;
            });
            this.setState({
              spinner: "",
              allWikis: wikis,
              currentPage: pos,
              viewHistory: false,
              historyMode: false,
            });
          } catch (err) {
            console.log(err.message);
          }
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
      let pos = 0;
      arr.forEach((ele, index) => {
        if (ele.title === page.title) pos = index;
      });
      return pos;
    };
    if (!newPage && !sidebar) {
      this.setState(
        {
          spinner: "Saving... ",
        },
        async () => {
          try {
            const wikis = (
              await axios.put(endpoint, data, {
                cancelToken: this.axiosCancel.token,
              })
            ).data.wikis;
            const index = findIndexOfPage(wikis, page);
            this.setState({
              spinner: "",
              editorMode: false,
              currentPage: index,
              allWikis: [...wikis],
            });
          } catch (err) {
            console.log(err.message);
          }
        }
      );
    } else if (sidebar) {
      this.setState(
        {
          spinner: "Saving...",
        },
        async () => {
          try {
            const wikis = (
              await axios.put(endpoint, data, {
                cancelToken: this.axiosCancel.token,
              })
            ).data.wikis;
            this.setState({
              spinner: "",
              currentPage: 1,
              editorMode: false,
              allWikis: [...wikis],
              sidebarEditor: false,
            });
          } catch (err) {
            console.log(err.message);
          }
        }
      );
    } else {
      if (allWikis.filter((ele) => ele.title === page.title).length === 0) {
        this.setState(
          {
            spinner: "Creating New Page...",
          },
          async () => {
            try {
              const wikis = (
                await axios.post(endpoint, data, {
                  cancelToken: this.axiosCancel.token,
                })
              ).data.wikis;
              const index = findIndexOfPage(wikis, page);
              this.setState({
                spinner: "",
                editorMode: false,
                currentPage: index,
                allWikis: [...wikis],
                newPageEditor: false,
              });
            } catch (err) {
              console.log(err.message);
            }
          }
        );
      } else {
        toast.error("Page with that title already exsits!");
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
        try {
          const wikis = (
            await axios.delete(`${BASE_URL}/wikis/pages`, {
              data: { title: allWikis[currentPage].title },
              cancelToken: this.axiosCancel.token,
            })
          ).data.wikis;
          this.setState({
            spinner: "",
            currentPage: 1,
            editorMode: false,
            allWikis: [...wikis],
          });
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  };

  handleViewHistory = () => {
    this.setState({
      historyMode: true,
      viewHistory: true,
    });
  };

  oauthCheck = async () => {
    try {
      this.setState({
        spinner: "Connecting to GitHub..."
      }, async ()=>{
        const check = (await axios.get(`${BASE_URL}/wikis/oauth-check`)).data
        if (check.redirect){
          window.location = check.redirect_url;
        } else {
          this.setState({
            spinner: ""
          })
        }
      })
    } catch (err) {
      console.log(err.message);
    }
  };

  handleViewHistoryItem = async (commit) => {
    const { allWikis, currentPage } = this.state
    const title = allWikis[currentPage].title;
    this.setState(
      {
        spinner: "Time Travelling...",
      },
      async () => {
        try {
          this.setState({
            spinner: "",
            viewHistory: false,
            allWikis: (
              await axios.get(
                `${BASE_URL}/wikis/pages?title=${title}&ref=${commit}`,
                { cancelToken: this.axiosCancel.token }
              )
            ).data.wikis,
          });
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  };

  render() {
    const {
      wikis,
      spinner,
      allWikis,
      editorMode,
      viewHistory,
      historyMode,
      currentPage,
      sidebarEditor,
      newPageEditor,
    } = this.state;
    const isAdmin = localStorage.getItem("admin");

    return (
      <div className="wikis">
        <Layout
          isAdmin={isAdmin}
          allWikis={allWikis}
          wikis={wikis}
          spinner={spinner}
          oauthCheck={this.oauthCheck}
        >
          <React.Fragment>
            {!editorMode && allWikis.length !== 0 && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Page
                  isAdmin={isAdmin}
                  allWikis={allWikis}
                  currentPage={currentPage}
                  viewHistory={viewHistory}
                  historyMode={historyMode}
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
                deletePage={this.deletePage}
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
            <ToastContainer
              draggable
              rtl={false}
              pauseOnHover
              closeOnClick
              pauseOnFocusLoss
              autoClose={5000}
              position="top-right"
              newestOnTop={false}
              hideProgressBar={false}
            />
          </React.Fragment>
        </Layout>
      </div>
    );
  }

  componentWillUnmount() {
    this.axiosCancel.cancel("axios request cancelled - Component Unmounted");
  }
}

// map state to props
const mapStateToProps = (state) => ({
  wikis: state.wikis,
});

export default connect(mapStateToProps, { getWikis })(Wikis);
