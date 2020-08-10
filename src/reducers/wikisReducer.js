import { GET_WIKIS } from '../actions/types'
const initialState = {
  wikis: []
}

export default (state = initialState, action) => {
    switch(action.type) {
      case GET_WIKIS: {
        console.log(`Action Recieved in reducer! ${action.type}`);
        console.log(`And its payload is = ${action.payload}`);
        return {
          ...state
        }
      }
      default:{
        return state
      }
    }
  }