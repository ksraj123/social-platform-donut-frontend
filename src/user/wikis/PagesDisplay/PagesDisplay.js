import React, { Component } from "react";
import { Dropdown, Form } from "react-bootstrap";
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import "./PagesDisplay.scss";

class PagesDisplay extends Component {
  state = {
    allWikis: this.props.pages,
    results: this.props.pages
  };
  changeResults=(evt)=>{
    console.log(evt.target.value);
    this.setState({
        results: this.state.allWikis.filter((page)=>page.title.indexOf(evt.target.value)!==-1)
    })
  }
  render() {
    return (
      <div className="PagesDisplay">
        <Dropdown>
          <Dropdown.Toggle variant="light" id="dropdown-basic">
            <span>Pages<span className="PagesDisplay-couter">{this.state.allWikis.length}</span></span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Form className="PagesDisplay-searchbar">
              <span className="form-search-icon"><SearchOutlinedIcon /></span>
              <Form.Control 
                as="input" 
                name="pageTitle" 
                className="searchbar"
                autoComplete="off"
                onChange={this.changeResults} />
            </Form>
            {this.state.results.map((page, index) => (
              <Dropdown.Item 
                key={index}
                onClick={() => this.props.setView(page.title)}>
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
