import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from 'react-router-dom'
import App from './App';
import './assets/deri.less';
import { Provider } from 'mobx-react';
import Wallet from './model/Wallet';
//note dont remove zhe line
import NumberPolyfill from './lib/polyfill/numberPolyfill'
import Trading from './model/Trading';
import { DeriEnv } from './lib/web3js/config';

const wallet = new Wallet();
const trading = new Trading()

// DeriEnv.set('prod')
ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Provider wallet={wallet}  trading={trading} >
        <App />
      </Provider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);


