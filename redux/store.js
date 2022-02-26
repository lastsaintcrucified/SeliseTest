import {createStore, combineReducers} from 'redux';
import userRerducer from './reducers/userReducer';

//reducers

const reducers = combineReducers({
  users: userRerducer,
});

const store = createStore(reducers);

export default store;
