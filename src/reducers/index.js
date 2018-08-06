import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form';

// Import and add more reducers as need
import http from './http';
import sharedState from './sharedState';
import formValues from './form';
import currentContent from './currentContent';
import auth from './auth';
import admin from './admin';
import clickaway from './clickaway';
import errors from './errors';
import media from './media';

export default combineReducers({
    http,
    form: formReducer,
    sharedState,
    formValues,
    currentContent,
    auth,
    admin,
    clickaway,
    errors,
    media,
});
