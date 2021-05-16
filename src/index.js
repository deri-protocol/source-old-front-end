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
import OrderLine from './model/MboxExample';
import { autorun, runInAction } from 'mobx';
import Trading from './model/Trading';

const wallet = new Wallet();
// const indexPrice = new IndexPrice();
// const position = new Position();
// const oracle = new Oracle();

// const order = new OrderLine(0)
const trading = new Trading()

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


// window.trading = trading;
// window.wallet = wallet
// trading.init(wallet);
// runInAction(() => {
//   console.log(trading.amount)
// })

