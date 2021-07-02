import React from 'react'
import './menu.less'

export default function Footer({lang}){
  return(
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
  )

}