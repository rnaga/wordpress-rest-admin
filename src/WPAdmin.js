import React from 'react';
import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import { Provider } from 'react-redux';
import {HashRouter} from 'react-router-dom';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './saga';
import rootReducer from './reducers';
import './index.css';
import App from './App';
import jsonClient from './services/jsonClient';
import auth from './services/auth';
import createAuthorizer from './util/createAuthorizer';
import caches from './util/caches';

const defaultAuthorizer = caches('defaultAuthorizer');
const defaultHttpClient = caches('defaultHttpClient');

const loggerMiddleware = createLogger()
const sagaMiddleware = createSagaMiddleware();

const authorizer = createAuthorizer(auth);

var store = createStore(rootReducer,
    applyMiddleware(
        sagaMiddleware,
        loggerMiddleware, // neat middleware that logs actions
    )
);

sagaMiddleware.run(rootSaga);

// Default authorizer
defaultAuthorizer.update(authorizer);
// Default HTTP Client
defaultHttpClient.update(jsonClient);

export default props => {
    return (<Provider store={store}>
      <HashRouter>
        <App 
          store={store} 
          {...props} 
        />
      </HashRouter>
    </Provider>);
}

