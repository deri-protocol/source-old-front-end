import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import App from './App';
import './assets/deri.less';
import { Provider } from 'mobx-react';
import Wallet from './model/Wallet';
//note dont remove zhe line
import NumberPolyfill from './lib/polyfill/numberPolyfill'
import IndexPrice from './model/IndexPrice';

const wallet = new Wallet();
const indexPrice = new IndexPrice();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Provider wallet={wallet} indexPrice={indexPrice}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);


window.wallet = wallet

