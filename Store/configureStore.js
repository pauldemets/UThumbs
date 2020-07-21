// Store/configureStore.js

import { createStore, combineReducers } from 'redux';
import getDestination from './Reducers/getDestination'
import getUserStatus from './Reducers/getUserStatus'
import getUsername from './Reducers/getUsername';

const reducer = combineReducers({
    destination: getDestination,
    userStatus: getUserStatus,
    username: getUsername
})

export default createStore(reducer);

