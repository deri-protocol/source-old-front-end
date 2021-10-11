/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import logo from '../../img/deri-logo.png'
import menuDown from '../../img/menu-down.png'
import Footer from './Footer'
import './menu.less'

export default function Menu({ closeMenu, lang, locale }) {
  const isMining = useRouteMatch('/mining') ? true : false
  const isTrade = useRouteMatch('/futures/lite') ? true : false
  const isOption = useRouteMatch('/options/lite') ? true : false
  const isDeriToken = useRouteMatch('/deritoken') ? true : false
  const isBridge = useRouteMatch('/bridge') ? true : false

  useEffect(() => {
    document.querySelectorAll('.menu li a').forEach(e => e.addEventListener('click', closeMenu));
    return () => { };
  }, []);

  return (
    <div className='menu'>
      <div className="top">
        <a className="logo" href={`https://deri.finance/?locale=${locale}#index`}>
          <img src={logo} alt="" />
        </a>
        <span className="close-menu" click="close" onClick={closeMenu}></span>
      </div>
      <div className="ul">
        <ul>
          <li className={isMining ? 'selected' : ''}>
            <a rel='noreferrer' href={`https://app.deri.finance/?locale=${locale}#mining`}>{lang['mining']}</a>
          </li>
          <li className={isTrade ? 'selected' : ''}>
            <a rel='noreferrer' href={`https://app.deri.finance/?locale=${locale}#/futures/lite`}> {lang['trade']} </a>
          </li>
          <li className={isOption ? 'selected' : ''}>
          <span className='beta'>
              {lang['beta']}
            </span>
            <a rel='noreferrer' href={`https://app.deri.finance/?locale=${locale}#/options/lite`}> {lang['options']} </a>
          </li>
          <li className={isDeriToken ? 'selected' : ''}>
            <Link to='/deritoken'>{lang['deri-token']}</Link>
          </li>
          <li className={isBridge ? 'selected' : ''}>
            <a rel='noreferrer' href={`https://bridge.deri.finance/?locale=${locale}#bridge`}>{lang['bridge']}</a>
          </li>
          <li className="ref">
            {lang['docs']} <img src={menuDown} alt="" />
            <ul className="ref-box">
              <li>
                <a
                  href="https://docs.deri.finance/whitepaper"
                >{lang['whitepaper']}</a>
              </li>
              <li>
                <a
                  href="https://docs.deri.finance/code-audits"
                >{lang['code-audit']}</a>
              </li>
              <li>
                <a href={`http://deri.finance/?locale=${locale}#/team`}>{lang['team']}</a>
              </li>
              <li>
                <a href="https://docs.deri.finance/faq">{lang['faq']}</a>
              </li>
              <li>
                <a href="https://docs.deri.finance/">{lang['guide']}</a>
              </li>

              <li>
                <a href="https://github.com/deri-finance/">{lang['github']}</a>
              </li>
            </ul>
          </li>
          <li className="ref">
            {lang['more']} <img src={menuDown} alt="" />
            <ul className="ref-box">
              {/* <li>
                <Link to='/broker'>{lang.broker}</Link>
              </li>
              <li>
                <Link to='/brokerbind'>{lang['broker-bind']}</Link>
              </li> */}
              <li>
                <Link to='/trade-to-earn'>{lang['signin']}</Link>
              </li>
              <li>
                <Link to='/retired'>{lang['retired-pools']}</Link>
              </li>
              <li>
                <a rel='noreferrer' href={`https://governance.deri.finance/?locale=${locale}#governance`}>{lang['governance']}</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <Footer lang={lang} />
    </div>
  )
}