import './footer.less'
export default function Footer(){
  
  return (
    <div className="footer">
    <div className="footer_info">
      <div className="hr"></div>
      <div className="footer_box">
        <div className="left">
          <div>
            <span>
              <router-link to='/lite'>App</router-link>  
            </span>
            <span className="mt_27">
              <a href="https://docs.deri.finance/">Docs</a> 
            </span>
            <span className="mt_27">
                <a href="http://deri.finance/#/team">Team</a>
            </span>
            <span className="mt_27">
              <a href="https://docs.deri.finance/faq">FAQ</a>
            </span>
          </div>
          <div className="mt_19">© 2021 Deri Protocol</div>
        </div>
        <div className="right">
          <span> Visit us on </span>
          <a target="_blank" className="iocn_a" href="mailto: service@deri.finance">
            <div className="circle">
              <div className="fa fa-envelope"></div>
            </div>
          </a>
          <a
            target="_blank"
            className="iocn_a"
            href="https://deri-protocol.medium.com"
          >
            <div className="circle">
              <div className="fa fa-medium"></div>
            </div>
          </a>
          <a
            target="_blank"
            className="iocn_a"
            href="https://twitter.com/DeriProtocol"
          >
            <div className="circle">
              <div className="fa fa-twitter"></div>
            </div>
          </a>

          <a
            target="_blank"
            className="iocn_a"
            href="https://github.com/deri-finance"
          >
            <div className="circle">
              <div className="fa fa-github"></div>
            </div>
          </a>
          <a target="_blank" className="iocn_a" href="https://t.me/DeriProtocol">
            <div className="circle">
              <div className="fa fa-paper-plane"></div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>)
}