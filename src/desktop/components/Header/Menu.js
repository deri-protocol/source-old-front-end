import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../../assets/img/logo.png'
import { useRouteMatch } from 'react-router-dom'
import Version from '../../../components/Version/Version'

function Menu({ lang, locale }) {
  const isLite = useRouteMatch('/futures/lite')
  const isPro = useRouteMatch('/futures/lite')
  const isMining = useRouteMatch('/mining')
  const isApp = isLite || isPro || isMining
  const isProduction = process.env.NODE_ENV === 'production'
  const host = /^(app|alphatest|testnet)/.test(window.location.host) ? window.location.host : 'app.deri.finance'
  return (
    <div className="nav-menu">
      <div className="logo">
        <a href={`https://deri.finance/?locale=${locale}#index`} rel='noreferrer' >
          <img src={logo} alt="" />
        </a>
      </div>
      <div className="mean">
        <ul>
          <li>
            {isProduction
              ?
              <a rel='noreferrer' href={`https://${host}/?locale=${locale}#mining`} className='mining-item'>{lang.mining}</a>
              :
              <Link className='mining-item' to='/mining'>{lang.mining}</Link>}
          </li>
          <li>
            {isProduction
              ? <a rel='noreferrer' href={`https://${host}/?locale=${locale}#/futures/pro`} className='trade-item'>{lang.trade}</a>
              : <Link className='trade-item' to='/futures/pro'>{lang.trade}</Link>
            }
          </li>
          <li>
            <span className='beta'>
              {lang['beta']}
            </span>
            {isProduction
              ? <a rel='noreferrer' href={`https://${host}/?locale=${locale}#/options/pro`} className='option-item'>{lang.options}</a>
              : <Link className='option-item' to='/options/pro'>{lang.options}</Link>
            }
          </li>
          <li>
            {isProduction
              ?
              <a rel='noreferrer' href={`https://${host}/?locale=${locale}#deritoken`} className='token-item'>{lang['deri-token']}</a>
              :
              <Link className='token-item' to='/deritoken'>{lang['deri-token']}</Link>}
          </li>
          <li>
            <a rel='noreferrer' className='bridge-item' href={`https://bridge.deri.finance/?locale=${locale}#bridge`}>{lang.bridge}</a>
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
                <a href={`http://deri.finance/?locale=${locale}#/team`} className='team-item'>{lang.team}</a>
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
          <li className="ref">
            <span className='more'>{lang['more']}</span> <i><svg data-v-16f7de50="" fill="currentColor" viewBox="0 0 24 24" width="24" height="24" className="Zi Zi--ArrowDown ContentItem-arrowIcon"><path data-v-16f7de50="" d="M12 13L8.285 9.218a.758.758 0 0 0-1.064 0 .738.738 0 0 0 0 1.052l4.249 4.512a.758.758 0 0 0 1.064 0l4.246-4.512a.738.738 0 0 0 0-1.052.757.757 0 0 0-1.063 0L12.002 13z" ></path></svg></i>
            <ul className="ref-box">
              {/* <li>
                {isProduction ?
                  <a className='broker-item' href={`https://${host}/#/broker`}>{lang.broker}</a>
                  :
                  <Link className='broker-item' to='/broker'>{lang.broker}</Link>
                }
              </li>
              <li>
                {isProduction
                  ?
                  <a className='brokerbind-item' href={`https://${host}/#/brokerbind`}>{lang['broker-bind']}</a>
                  :
                  <Link className='brokerbind-item' to='/brokerbind'>{lang['broker-bind']}</Link>
                }
              </li> */}
              <li>
                <a rel='noreferrer' className='governance-item' href={`https://governance.deri.finance/?locale=${locale}#governance`}>{lang.governance}</a>
              </li>
              <li>
                {isProduction
                  ?
                  <a className='signin-item' href={`https://${host}/#/trade-to-earn`}>{lang['signin']}</a>
                  :
                  <Link className='signin-item' to='/trade-to-earn'>{lang['signin']}</Link>
                }
              </li>
              <li>
                {isProduction
                  ?
                  <a rel='noreferrer' href={`https://${host}/?locale=${locale}#retired`} className='retired-item'>{lang['retired-pools']}</a>
                  :
                  <Link className='retired-item' to='/retired'>{lang['retired-pools']}</Link>}
              </li>

            </ul>
          </li>
          <li className='event'>
            <span className='y-event' >
              Trade to Earn
            </span>
            {isProduction
              ?
              <a className='' href={`https://${host}/#/trade-to-earn`}>$ 1 Million in DERI</a>
              :
              <Link className='' to='/trade-to-earn'>$ 1 Million in DERI</Link>
            }
          </li>
        </ul>
      </div>
      <Version />
    </div>
  )
}
export default Menu