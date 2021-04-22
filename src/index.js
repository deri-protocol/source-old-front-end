import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import App from './App';
import './assets/deri.less';
import { WalletContext } from './context/WalletContext';
import Wallet from './context/Wallet';

const wallet = new Wallet()

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <WalletContext.Provider value={{walletContext : wallet}}>
        <App />
      </WalletContext.Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
