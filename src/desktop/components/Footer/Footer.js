/* eslint-disable jsx-a11y/anchor-is-valid */
import './footer.less'
import './zh-footer.less'
import { inject, observer } from 'mobx-react';
import useLang from '../../../hooks/useLang'
import { useRouteMatch } from 'react-router-dom';

function Footer({intl}){
  const lang = useLang(intl.dict,'footer');
  const isLite = useRouteMatch('/lite')
  const isPro = useRouteMatch('/pro')
  const isMining = useRouteMatch('/mining')
  const isApp = isLite || isPro || isMining  
  
  return (
    <div className="footer">
    <div className="footer-info">
      <div className="hr"></div>
      <div className="footer-box">
        <div className="left">
          <div>
            <span>
              <a  rel='noreferrer' href={`https://app.deri.finance/#/futures/lite?locale=${intl.locale}`} target={isApp ? '' : '_blank'} className='mt-27'>{lang['app']}</a>  
            </span>
            <span className="mt-27">
              <a href="https://docs.deri.finance/">{lang['docs']}</a> 
            </span>
            <span className="mt-27">
                <a href="http://deri.finance/#/team">{lang['team']}</a>
            </span>
            <span className="mt-27">
              <a href="https://docs.deri.finance/library/faqs">{lang['faq']}</a>
            </span>
          </div>
          <div className="mt-19">© 2021 {lang['deri-protocol']}</div>
        </div>
        <div className="right">
          <span> {lang['visit-us-on']}</span>
          
          <a target="_blank" rel='noreferrer' className="iocn-a" href="mailto: service@deri.finance">
            <div className="circle">
              <div className="fa fa-envelope"></div>
            </div>
          </a>
          <a
            target="_blank"
            className="iocn-a"
            href="https://deri-protocol.medium.com"
            rel='noreferrer' 
          >
            <div className="circle">
              <div className="fa fa-medium"></div>
            </div>
          </a>
          <a
            target="_blank"
            className="iocn-a"
            href="https://twitter.com/DeriProtocol"
            rel='noreferrer' 
          >
            <div className="circle">
              <div className="fa fa-twitter"></div>
            </div>
          </a>

          <a
            target="_blank"
            className="iocn-a"
            href="https://github.com/deri-finance"
            rel='noreferrer' 
          >
            <div className="circle">
              <div className="fa fa-github"></div>
            </div>
          </a>
          <a rel='noreferrer'  target="_blank" className="iocn-a" href="https://t.me/DeriProtocol">
            <div className="circle">
              <div className="fa fa-paper-plane"></div>
            </div>
          </a>
          {/* <a target="_blank" rel='noreferrer' className="iocn-a" >
            <div className="circle">
              <div className='wechat'>
                <div className='down-box'></div>
              </div>
              <div className="fa fa-wechat"></div>
            </div>
          </a> */}
        </div>
      </div>
    </div>
  </div>)
}
export default inject('intl')(observer(Footer))