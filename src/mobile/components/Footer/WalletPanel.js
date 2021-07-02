import './walletPanel.less'
import { useRouteMatch } from 'react-router-dom';
import Account from "../../../components/Account/Account";
import { inject, observer } from 'mobx-react';
import useLang from '../../../hooks/useLang';

function WalletPanel({intl}){  
  const lang = useLang(intl.dict,'footer')
  const isIndex = useRouteMatch('/index');
  const isTeam = useRouteMatch('/team')
  const showWallet = !isIndex && !isTeam
  return(
    <div className="wallet-panel">
      {showWallet && <Account lang={lang}/>}
    </div>
  )
}
export default inject('intl')(observer(WalletPanel))