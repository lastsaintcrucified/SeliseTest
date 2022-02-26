import {createStore, combineReducers} from 'redux';

//reducers

const reducers = combineReducers({
  users: userRerducer,
});

const store = createStore(reducers);

export default store;
