import {Link} from 'react-router-dom'
import menuDown from '../../img/menu-down.png'

export default function Menu(){

  return (
    <div className='menu'>
      <ul>
        <li className="mining">
          <Link to="/pool">Mining</Link>
        </li>
        <li className="trade">
          <Link to="/lite"> Trade </Link>
        </li>
        <li>
          <a target="_blank" href="https://governance.deri.finance/">Governance</a>
        </li>
        <li>
          <a target="_blank" href="https://bridge.deri.finance/">Bridge</a>
        </li>
        <li className="ref">
          Docs <img  src={menuDown} alt=""/>
          <ul className="ref_box">
            <li>
              <a
                href="https://github.com/deri-finance/whitepaper/blob/master/deri_whitepaper.pdf"
                >Whitepaper</a
              >
            </li>
            <li>
              <a
                href="https://github.com/peckshield/publications/blob/master/audit_reports/PeckShield-Audit-Report-Deri-v1.0.pdf"
                >Code Audit</a
              >
            </li>
            <li>
              <a href="https://deri.finance/#/team">Team</a>
            </li>
            <li>
              <a href="https://docs.deri.finance/faq">FAQ</a>
            </li>
            <li>
              <a href="https://docs.deri.finance/">Guide</a>
            </li>

            <li>
              <a href="https://github.com/deri-finance/">Github</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  )
}