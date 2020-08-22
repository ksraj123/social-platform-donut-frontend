import React, { Component } from "react";
import "./PagesDisplay.scss";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";

class PagesDisplay extends Component {
  state = {
    results: this.props.pages,
    allWikis: this.props.pages,
  };
  changeResults = (evt) => {
    console.log(evt.target.value);
    this.setState({
      results: this.state.allWikis.filter(
        (page) => page.title.indexOf(evt.target.value) !== -1
      ),
    });
  };
  render() {
    return (
      <div className="PagesDisplay">
        <Dropdown>
          <Dropdown.Toggle variant="light" id="dropdown-basic">
            <span>
              Pages
              <span className="PagesDisplay-couter">
                {this.state.allWikis.length}
              </span>
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Form className="PagesDisplay-searchbar">
              <span className="form-search-icon">
                <SearchOutlinedIcon />
              </span>
              <Form.Control
                as="input"
                name="pageTitle"
                autoComplete="off"
                className="searchbar"
                onChange={this.changeResults}
              />
            </Form>
            {this.state.results.map((page, index) => (
              <Dropdown.Item
                key={index}
                onClick={() => this.props.setView(page.title)}
              >
                {page.title}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}

export default PagesDisplay;
