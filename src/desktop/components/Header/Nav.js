import React ,{useState} from 'react'
import deri from '../../img/deri.svg'
import logo from '../../img/logo.svg'
import './nav.less'


export default function Nav (){
  const [networkText, setNetworkText] = useState('');
  const [wallet,setWallet] = useState('')
  const [walletSymbol,setWalletSymbol] = useState('')
  const [address,setAddress] = useState('');
  const [noNetworkText, setNoNetworkText] = useState('')
  return (
    <div className="nav">
      <div className="nav_mean">
        <div className="logo">
          <a href="http://deri.finance" target="_blank">
            <img src={logo} alt="" />
            <img src={deri} alt="" />
          </a>
        </div>
        <div className="mean">
          <ul>
            <li>
              <router-link to="/mining">Mining</router-link>
            </li>
            <li>Trade</li>
            <li>
              <a target="_blank" href="https://governance.deri.finance/">Governance</a>
            </li>
            <li>
              <a target="_blank" href="https://bridge.deri.finance/">Bridge</a>
            </li>
            <li className="ref">
              <a href="https://docs.deri.finance/">Docs</a>
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
      <div className="connect">
        <div className="network_text_logo">
          <i className="walletSymbol"></i>
          <span className="logo_text">{ networkText }</span>
        </div>
        <div v-if="noNetwork">
          <button
            className="nav_btn connect_btn"
          >
            Connect Wallet
          </button>
          {/* <button v-else className="nav_btn">
            { wallet } { walletSymbol }
            <span className="address">{ address }</span>
          </button> */}
        </div>
        {/* <div v-else>
          <button className="nav_btn noNetwork">
            { noNetworkText }
          </button>
        </div> */}
      </div>
    </div>
  )
}