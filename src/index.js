import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from 'react-router-dom'
import App from './App';
import './assets/deri.less';
import { Provider } from 'mobx-react';
import Wallet from './model/Wallet';
import Trading from './model/Trading';
import { DeriEnv } from './lib/web3js/indexV2';
import version from './model/Version';
import intl from './model/Intl';
import loading from './model/Loading';

const wallet = new Wallet();
const trading = new Trading()

if(process.env.NODE_ENV === 'production') {
  DeriEnv.set('prod')
}
// DeriEnv.set('prod')
ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Provider wallet={wallet}  trading={trading} version={version} intl={intl} loading={loading}>
        <App />
      </Provider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);


