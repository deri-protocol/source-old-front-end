import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../../assets/img/logo.png'
import { useRouteMatch } from 'react-router-dom'
import Version from '../../../components/Version/Version'

function Menu({lang}) {
  const isLite = useRouteMatch('/lite')
  const isPro = useRouteMatch('/pro')
  const isMining = useRouteMatch('/mining')
  const isApp = isLite || isPro || isMining
  return (
    <div className="nav-menu">
      <div className="logo">
        <a href="http://deri.finance" rel='noreferrer' target="_blank">
          <img src={logo} alt="" />
        </a>
      </div>
      <div className="mean">
        <ul>
          <li>
            <Link to="/mining" target={isApp ? '' : '_blank'} className='mining-item'>{lang.mining}</Link>
          </li>
          <li><Link to='/lite' target={isApp ? '' : '_blank'}  className='trade-item'>{lang.trade}</Link></li>
          <li>
            <a target="_blank" rel='noreferrer' className='governance-item' href="https://governance.deri.finance/">{lang.governance}</a>
          </li>
          <li>
            <a target="_blank" rel='noreferrer' className='bridge-item'  href="https://bridge.deri.finance/">{lang.bridge}</a>
          </li>
          <li className="ref">
            <a href="https://docs.deri.finance/">{lang['docs']}</a><i><svg data-v-16f7de50="" fill="currentColor" viewBox="0 0 24 24" width="24" height="24" className="Zi Zi--ArrowDown ContentItem-arrowIcon"><path data-v-16f7de50="" d="M12 13L8.285 9.218a.758.758 0 0 0-1.064 0 .738.738 0 0 0 0 1.052l4.249 4.512a.758.758 0 0 0 1.064 0l4.246-4.512a.738.738 0 0 0 0-1.052.757.757 0 0 0-1.063 0L12.002 13z" ></path></svg></i>
            <ul className="ref-box">
              <li>
                <a href="https://docs.deri.finance/whitepaper">{lang.whitepaper}</a>
              </li>
              <li>
                <a href="https://docs.deri.finance/code-audits">{lang['code-audit']}</a>
              </li>
              <li>
                <a href="http://deri.finance/#/team" className='team-item'>{lang.team}</a>
              </li>
              <li>
                <a href="https://docs.deri.finance/faq">{lang.faq}</a>
              </li>
              <li>
                <a href="https://docs.deri.finance/">{lang.guide}</a>
              </li>
              <li>
                <a href="https://github.com/deri-finance/">{lang.github}</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <Version/>
    </div>
  )
}
export default Menu