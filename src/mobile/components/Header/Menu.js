/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react'
import {Link,useRouteMatch} from 'react-router-dom'
import logo from '../../img/deri-logo.png'
import menuDown from '../../img/menu-down.png'
import './menu.less'

export default function Menu({closeMenu}){
  const isMining =  useRouteMatch('/mining') ? true : false
  const isTrade = useRouteMatch('/lite') ? true : false



  useEffect(() => {
    document.querySelectorAll('.menu li a').forEach(e => e.addEventListener('click',closeMenu));    
    return () => {};
  }, []);

  return (
    <div className='menu'>
      <div className="top">
        <a className="logo" href="https://deri.finance/">
          <img src={logo} alt=""/>
        </a>
        <span className="close-menu" click="close" onClick={closeMenu}></span>
      </div>
      <div className="ul">
        <ul>
          <li className={isMining ? 'selected' :'' }>
            <Link to="/mining">Mining</Link>
          </li>
          <li className={isTrade ? 'selected' : ''}>
          <Link to="/lite"> Trade </Link>
          </li>
          <li>
            <a  rel='noreferrer' href="https://governance.deri.finance/"
              >Governance</a>
          </li>
          <li>
            <a  rel='noreferrer' href="https://bridge.deri.finance/">Bridge</a>
          </li>
          <li className="ref">
            Docs <img  src={menuDown} alt=""/>
            <ul className="ref-box">
              <li>
                <a
                  href="https://docs.deri.finance/whitepaper"
                  >Whitepaper</a>
              </li>
              <li>
                <a
                  href="https://docs.deri.finance/code-audits"
                  >Code Audit</a>
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

        <div className="banquan">© 2021 Deri Protocol</div>
      </div>
  </div>
  )
}