import React from "react";
import "./Layout.scss";
import { Button } from "react-bootstrap";
import { BASE_URL } from "../../../actions/baseApi";
import LoadingOverlay from "react-loading-overlay";
import GitHubIcon from "@material-ui/icons/GitHub";
import ClockLoader from "react-spinners/ClockLoader";
import Navigation from "../../dashboard/navigation/navigation";

const Layout = (props) => (
  <React.Fragment>
    <div className="navigation">
      <Navigation wikis={props.wikis}></Navigation>
    </div>
    <div id="wikis">
      <LoadingOverlay
        active={!!props.spinner}
        text={props.spinner}
        spinner={<ClockLoader color={"#1A73E8"} />}
        styles={{
          spinner: (base) => ({
            ...base,
            width: "100px",
            "& svg circle": {
              stroke: "rgba(26, 115, 232, 0.5)",
            },
          }),
        }}
      >
        <h1 className="wikis-heading">Wikis</h1>
        {props.allWikis === "NO_ACCESS_TOKEN" ? (
          <div className="wikis-not-found">
            {props.isAdmin ? (
              <a href={`${BASE_URL}/wikis/oauth-check`}>
                <Button variant="light">
                  <GitHubIcon />
                  Connect Github
                </Button>
              </a>
            ) : (
              "Nothing here Yet"
            )}
          </div>
        ) : (
          props.children
        )}
      </LoadingOverlay>
    </div>
  </React.Fragment>
);

export default Layout;
