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
import Version from './model/Version';

const wallet = new Wallet();
const trading = new Trading()
const version = new Version();

if(process.env.NODE_ENV === 'production') {
  DeriEnv.set('prod')
} 
DeriEnv.set('prod')
ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Provider wallet={wallet}  trading={trading} version={version}>
        <App />
      </Provider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);


