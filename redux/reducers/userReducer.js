import {ADD_USER, REMOVE_USER} from '../types';

const userRerducer = (state = [], action) => {
  switch (action.type) {
    case ADD_USER:
      return [...state, action.payload];
    case REMOVE_USER:
      return state.filter(user => user !== action.payload);
    default:
      return state;
  }
};

export default userRerducer;
