import axios from 'axios';
import { errorHandler } from '../utils/errorHandler';
import { GET_WIKIS } from './types';
import { BASE_URL } from './baseApi'

export const getWikis = () => async (dispatch) => {
    try {
    const res = await axios.get(`${BASE_URL}/wikis`)
      dispatch({
        type: GET_WIKIS,
        payload: res.data.wikis
      })
    } catch(error) {
      dispatch(errorHandler(error))
    }
}
