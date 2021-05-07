import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import App from './App';
import './assets/deri.less';
import { Provider } from 'mobx-react';
import Wallet from './store/Wallet';

const wallet = new Wallet();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider wallet={wallet}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);


window.wallet = wallet

