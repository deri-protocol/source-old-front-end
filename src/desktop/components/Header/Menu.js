import {Link} from 'react-router-dom'
import deri from '../../img/deri.svg'
import logo from '../../img/logo.svg'

export default function Menu() {

  return (
    <div className="nav-menu">
      <div className="logo">
        <a href="http://deri.finance" target="_blank">
          <img src={logo} alt="" />
          <img src={deri} alt="" />
        </a>
      </div>
      <div className="mean">
        <ul>
          <li>
            <Link to="/mining">Mining</Link>
          </li>
          <li><Link to='/lite'>Trade</Link></li>
          <li>
            <a target="_blank" href="https://governance.deri.finance/">Governance</a>
          </li>
          <li>
            <a target="_blank" href="https://bridge.deri.finance/">Bridge</a>
          </li>
          <li className="ref">
            <a href="https://docs.deri.finance/">Docs</a><i><svg data-v-16f7de50="" fill="currentColor" viewBox="0 0 24 24" width="24" height="24" className="Zi Zi--ArrowDown ContentItem-arrowIcon"><path data-v-16f7de50="" d="M12 13L8.285 9.218a.758.758 0 0 0-1.064 0 .738.738 0 0 0 0 1.052l4.249 4.512a.758.758 0 0 0 1.064 0l4.246-4.512a.738.738 0 0 0 0-1.052.757.757 0 0 0-1.063 0L12.002 13z" fill-rule="evenodd"></path></svg></i>
            <ul className="ref_box">
              <li>
                <a href="https://github.com/deri-finance/whitepaper/blob/master/deri_whitepaper.pdf">Whitepaper</a>
              </li>
              <li>
                <a href="https://github.com/peckshield/publications/blob/master/audit_reports/PeckShield-Audit-Report-Deri-v1.0.pdf">Code Audit</a>
              </li>
              <li>
                <a href="http://deri.finance/#/team">Team</a>
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
    </div>
  )
}