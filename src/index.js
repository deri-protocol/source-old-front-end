import React from 'react';
import ReactDOM from 'react-dom';
import { StrictMode,BrowserRouter ,HashRouter} from 'react-router-dom'
import App from './App';
import './assets/deri.less';
import { Provider } from 'mobx-react';
import Wallet from './model/Wallet';
//note dont remove zhe line
import NumberPolyfill from './lib/polyfill/numberPolyfill'
import IndexPrice from './model/IndexPrice';
import Position from './model/Position';
import Oracle from './model/Oracle';

const wallet = new Wallet();
const indexPrice = new IndexPrice();
const position = new Position();
const oracle = new Oracle();

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Provider wallet={wallet} indexPrice={oracle} position={position}>
        <App />
      </Provider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);


window.wallet = wallet

