import React, { Component } from 'react';
import { connect } from 'react-redux'
import "./wikis.scss";
import Navigation from "../dashboard/navigation/navigation";
import { getWikis } from "../../actions/wikisAction";
import { Drawer, Button, List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Things to implement
// Navbar displaying pages - it will have option to create a new page and delete page when hovering over that page
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
    const useStyles = makeStyles({
        list: {
          width: 250,
        },
        fullList: {
          width: 'auto',
        },
      });

    return(
        <div className="wikis">
            <div className="navigation">
            <Navigation wikis={this.state.wikis}></Navigation>
            </div>
            <div className="news" id="wikis">
            <React.Fragment>
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
                  <List>
                    <ListItem>
                      <ListItemText>
                        Saurabh
                      </ListItemText>
                    </ListItem>
                  </List>
                </Drawer>
            </React.Fragment>
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
