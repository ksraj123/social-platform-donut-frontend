import React from "react";
import "./Page.scss";
import History from "../History/History";
import { Button } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import HistoryIcon from "@material-ui/icons/History";
import EditButton from "@material-ui/icons/EditOutlined";
import NewPageButton from "@material-ui/icons/DescriptionOutlined";

const Page = (props) => (
  <div className="page">
    <div className="page-header">
      {props.isAdmin && (
        <div className="wikis-top-controls">
          <Button
            variant="light"
            disabled={props.historyMode}
            onClick={() => props.handleEditorMode()}
          >
            <EditButton />
            Edit
          </Button>
          <Button
            variant="primary"
            onClick={() => props.handleEditorMode(true, false)}
          >
            <NewPageButton />
            New Page
          </Button>
        </div>
      )}
      <h1>{props.allWikis[props.currentPage].title}</h1>
      <div className="last-edited">
        <span>
          Last Edited by{" "}
          {props.allWikis[props.currentPage]?.history[0]?.user?.login} at{" "}
          {new Date(
            props.allWikis[props.currentPage]?.history[0]?.created_at
          ).toDateString()}
        </span>
        <Button variant="light" onClick={props.handleViewHistory}>
          <HistoryIcon />
          <span>History</span>
        </Button>
      </div>
    </div>
    {!props.viewHistory && (
      <ReactMarkdown source={props.allWikis[props.currentPage].content} />
    )}
    {props.viewHistory && (
      <History
        view={props.handleViewHistoryItem}
        page={props.allWikis[props.currentPage]}
      />
    )}
  </div>
);

export default Page;
