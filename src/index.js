import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from 'react-router-dom'
import App from './App';
import './assets/deri.less';
import { Provider } from 'mobx-react';
import Wallet from './model/Wallet';
import Trading from './model/Trading';
import { DeriEnv } from './lib/web3js/indexV2';
import Version from './model/Version';
import Intl from './model/Intl';

const wallet = new Wallet();
const trading = new Trading()
const version = new Version();
const intl = new Intl()

if(process.env.NODE_ENV === 'production') {
  DeriEnv.set('prod')
} 
DeriEnv.set('prod')
ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Provider wallet={wallet}  trading={trading} version={version} intl={intl}>
        <App />
      </Provider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);


