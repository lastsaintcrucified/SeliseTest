import {ADD_USER, REMOVE_USER, CLEAR_CART} from '../types';

export const addUser = payload => {
  return {
    type: ADD_USER,
    payload,
  };
};
export const removeUser = payload => {
  return {
    type: REMOVE_USER,
    payload,
  };
};
