/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react'
import {Link,useRouteMatch} from 'react-router-dom'
import logo from '../../img/deri-logo.png'
import menuDown from '../../img/menu-down.png'
import './menu.less'

export default function Menu({closeMenu,lang,locale}){
  const isMining =  useRouteMatch('/mining') ? true : false
  const isTrade = useRouteMatch('/lite') ? true : false



  useEffect(() => {
    document.querySelectorAll('.menu li a').forEach(e => e.addEventListener('click',closeMenu));    
    return () => {};
  }, []);

  return (
    <div className='menu'>
      <div className="top">
        <a className="logo" href={`https://deri.finance/#index?locale=${locale}`}>
          <img src={logo} alt=""/>
        </a>
        <span className="close-menu" click="close" onClick={closeMenu}></span>
      </div>
      <div className="ul">
        <ul>
          <li className={isMining ? 'selected' :'' }>
            <a  rel='noreferrer' href={`https://app.deri.finance/#mining?locale=${locale}`}>{lang['mining']}</a>
          </li>
          <li className={isTrade ? 'selected' : ''}>
          <a  rel='noreferrer' href={`https://app.deri.finance/#lite?locale=${locale}`}> {lang['trade']} </a>
          </li>
          <li>
            <a  rel='noreferrer' href={`https://governance.deri.finance/#governance?locale=${locale}`}>{lang['governance']}</a>
          </li>
          <li>
            <a  rel='noreferrer' href={`https://bridge.deri.finance/#bridge?locale=${locale}`}>{lang['bridge']}</a>
          </li>
          <li className="ref">
            {lang['docs']} <img  src={menuDown} alt=""/>
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
                <a href={`http://deri.finance/#/team?locale=${locale}`}>{lang['team']}</a>
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
            {lang['more']} <img  src={menuDown} alt=""/>
            <ul className="ref-box">
              <li>
                <Link to='/broker'>{lang.broker}</Link>
              </li>
              <li>
                <Link to='/brokerbind'>{lang['broker-bind']}</Link>
              </li>
              <li>
                <Link to='/signin'>{lang['signin']}</Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div className="m-footer">
        <div className="footer-link">
          <a  rel='noreferrer' className="iocn_a" >
            <div className="circle">
              <div className='wechat'>
                <div className='down_box'></div>
              </div>
              <div className="fa fa-wechat"></div>
            </div>
          </a>
          <a  rel='noreferrer' className="iocn-a" href="mailto: service@deri.finance">
              <div className="circle">
                <div className="fa fa-envelope"></div>
              </div>
            </a>
            <a
              
              className="iocn-a"
              rel='noreferrer'
              href="https://deri-protocol.medium.com"
            >
              <div className="circle">
                <div className="fa fa-medium"></div>
              </div>
            </a>
            <a
             
              className="iocn-a"
              rel='noreferrer'
              href="https://twitter.com/DeriProtocol"
            >
              <div className="circle">
                <div className="fa fa-twitter"></div>
              </div>
            </a>

            <a
              
              className="iocn-a"
              rel='noreferrer'
              href="https://github.com/deri-finance"
            >
              <div className="circle">
                <div className="fa fa-github"></div>
              </div>
            </a>
            <a  rel='noreferrer' className="iocn-a" href="https://t.me/DeriProtocol">
              <div className="circle">
                <div className="fa fa-paper-plane"></div>
              </div>
            </a>
        </div>

        <div className="banquan">© 2021 {lang['deri-protocol']}</div>
      </div>
  </div>
  )
}