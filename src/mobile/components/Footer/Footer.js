import { useRouteMatch } from "react-router-dom";
import './footer.less'
import Account from "../../../components/Account/Account";

export default function Footer(){
  const showAccount = useRouteMatch({path : '/mining',exact : true}) ? false : true
  return(
    <div className="footer">
      {
        showAccount 
        ? <Account/> 
        : <a className="premining" href="https://premining.deri.finance/#/">PREMINING</a> 
      }
    </div>
  )
}