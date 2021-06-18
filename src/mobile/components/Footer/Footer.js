import './footer.less'
import { useRouteMatch } from 'react-router-dom';
import Account from "../../../components/Account/Account";
import { inject, observer } from 'mobx-react';
import useLang from '../../../hooks/useLang';

function Footer({intl}){  
  const lang = useLang(intl.dict,'footer')
  const isHome = useRouteMatch('/index');
  const isTeam = useRouteMatch('/team')
  
  return(
    <div className="footer">
      <Account lang={lang} ignoreWallet={isHome || isTeam}/>
    </div>
  )
}
export default inject('intl')(observer(Footer))