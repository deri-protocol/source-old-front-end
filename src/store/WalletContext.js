import React from 'react'
import wallet from './Wallet';

function createStore(){
  return {
    wallet : wallet
  }
}

export const store = createStore();

export const WalletContext = React.createContext(store);

