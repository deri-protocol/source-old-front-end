import { useRouteMatch } from "react-router-dom";
import './footer.less'
import Account from "../../../desktop/components/Header/Account";

export default function Footer(){
  const showAccount = useRouteMatch('/pool') ? false : true
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