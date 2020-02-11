import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers';
import App from './components/App';

// import devToolsEnhancer from 'remote-redux-devtools';
// const store = createStore(rootReducer, devToolsEnhancer({realtime: true}));

const store = createStore(rootReducer); 

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);