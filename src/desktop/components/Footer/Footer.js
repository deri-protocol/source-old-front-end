import './footer.css'
export default function Footer(){
  
  return (
    <div id="footers">
    <div class="footer_info">
      <div class="hr"></div>
      <div class="footer_box">
        <div class="left">
          <div>
            <span>
              <router-link to='/lite'>App</router-link>  
            </span>
            <span class="mt_27">
              <a href="https://docs.deri.finance/">Docs</a> 
            </span>
            <span class="mt_27">
                <a href="http://deri.finance/#/team">Team</a>
            </span>
            <span class="mt_27">
              <a href="https://docs.deri.finance/faq">FAQ</a>
            </span>
          </div>
          <div class="mt_19">© 2021 Deri Protocol</div>
        </div>
        <div class="right">
          <span> Visit us on </span>
          <a target="_blank" class="iocn_a" href="mailto: service@deri.finance">
            <div class="circle">
              <div class="fa fa-envelope"></div>
            </div>
          </a>
          <a
            target="_blank"
            class="iocn_a"
            href="https://deri-protocol.medium.com"
          >
            <div class="circle">
              <div class="fa fa-medium"></div>
            </div>
          </a>
          <a
            target="_blank"
            class="iocn_a"
            href="https://twitter.com/DeriProtocol"
          >
            <div class="circle">
              <div class="fa fa-twitter"></div>
            </div>
          </a>

          <a
            target="_blank"
            class="iocn_a"
            href="https://github.com/deri-finance"
          >
            <div class="circle">
              <div class="fa fa-github"></div>
            </div>
          </a>
          <a target="_blank" class="iocn_a" href="https://t.me/DeriProtocol">
            <div class="circle">
              <div class="fa fa-paper-plane"></div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>)
}