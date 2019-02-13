import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import configureStore from './store';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

const store = configureStore();

// DEBUG HELPERS
// import { sendMessage } from './actions/roomActions';
// window.store = store;
// window.sendMessage = sendMessage;

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();