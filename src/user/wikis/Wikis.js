import React, { Component } from 'react';
import { connect } from 'react-redux'
import "./wikis.scss";
import Navigation from "../dashboard/navigation/navigation";
import { getWikis } from "../../actions/wikisAction";
import { Drawer, Button, List, ListItem, ListItemText } from '@material-ui/core';

// Things to implement
// Navbar displaying pages - it will have option to create a new page and delete page when hovering over that page
// known styling issue with Navigator - on closing is goes all the way to the side
// Option to edit in each page, and when editing a save button would appear

class Wikis extends Component {
  constructor(props) {
    super(props);
      this.state = {
        wikis: true,
        wikiNavigator: false
      };
      this.toggleDrawer = this.toggleDrawer.bind(this);
  }
  
  componentDidMount() {
    setTimeout(() => {
      this.props.getWikis();
    })
  }

  toggleDrawer() {
    this.setState((state)=>{
      return {
        wikiNavigator: !state.wikiNavigator
      }
    })
  }

  render() {
    return(
        <div className="wikis">
            <div className="navigation">
              <Navigation wikis={this.state.wikis}></Navigation>
            </div>
            <div id="wikis">
                <Button onClick={this.toggleDrawer}>Left</Button>
                <Drawer 
                    anchor={"left"} 
                    open={this.state.wikiNavigator}
                    PaperProps={{ style: { position: 'absolute' } }}
                    BackdropProps={{ style: { position: 'absolute' } }} 
                    ModalProps={{
                    container: document.getElementById('wikis'),
                    style: { position: 'absolute' }
                    }}
                    variant="temporary"
                    onClose={this.toggleDrawer}>
                    <List className="list">
                      <ListItem>
                        <ListItemText>
                          Saurabh
                        </ListItemText>
                      </ListItem>
                    </List>
                </Drawer>
            </div>
        </div>
    )
  }
}

// map state to props 
const mapStateToProps = (state) => ({
    auth: state.auth,
    error: state.error,
    event: state.event,
    post: state.post,
    project: state.project
  })

export default connect(mapStateToProps, { getWikis })(Wikis);
