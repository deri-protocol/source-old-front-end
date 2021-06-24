import './footer.less'
import { useRouteMatch } from 'react-router-dom';
import Account from "../../../components/Account/Account";
import { inject, observer } from 'mobx-react';
import useLang from '../../../hooks/useLang';

function Footer({intl}){  
  const lang = useLang(intl.dict,'footer')
  const isIndex = useRouteMatch('/index');
  const isTeam = useRouteMatch('/team')
  const showWallet = !isIndex && !isTeam
  return(
    <div className="footer">
      {showWallet && <Account lang={lang}/>}
    </div>
  )
}
export default inject('intl')(observer(Footer))