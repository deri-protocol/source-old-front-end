import React from 'react'
import deri_background from './img/deri_background.png'
import Completely from './img/CompletelyOn-Chain.png'
import Completely_b from './img/CompletelyOn-Chain_b.png'
import RealDerivatives from './img/Real Derivatives.png'
import RealDerivatives_b from './img/Real Derivatives_b.png';
import Composability from './img/Composability.png'
import Composability_b from './img/Composability_b.png'
import ETHBSCHECO from './img/ETH + BSC + HECO.png'
import ETHBSCHECO_b from './img/ETH + BSC + HECO_b.png'
import LiquidityProviders from './img/Liquidity Providers.png'
import Traders from './img/Traders.png'
import Positionliquidators from './img/Position liquidators.png'
import AKG from './img/AKG.png'
import AutoFarm from './img/AutoFarm.png'
import BASIS from './img/BASIS.png'
import BIXIN from './img/BIXIN.png'
import BlackRange from './img/BlackRange.png'
import CDF from './img/CDF.png'
import dForce from './img/dForce.png'
import WOO from './img/WOO.png'
import FBG from './img/FBG.png'
import QCP from './img/QCP.png'
import GSR from './img/GSR.png'
import binance from './img/binance.png'
import Kryptos from './img/Kryptos.png'
import LD from './img/LD.png'
import LotusCapital from './img/LotusCapital.png'
import Arbitragers from './img/Arbitragers.png'
import MatrixRain from './MatrixRain'
import "./zh-home.less"
import StatsBox from './StatsBox'
export default function Content({lang}) {
  return (
    <div>
      <div className='index_part1'>
        <MatrixRain lang={lang}/>
        <div className='index_part1-1'>
          <div className="slogon">
            <div className='index_part1-3'>{lang['deri-protocol']}</div>
            <div className='describe'>= ( <span> <a href='https://app.deri.finance/#/futures/pro'>  {lang['perpetual-futures']} </a></span>  +  <span className='moblie '> <a href='https://app.deri.finance/#/options/pro'>{lang['everlasting-options']}</a> </span> ) <span className='moblie no-d'>{lang['deri-describe']}</span> </div>
          </div>
          {/* <div className='index_part1-1_title'>
          
            <div className='index_part1-2'>{lang['the']}</div>
            <div className='index_part1-3'>{lang['defi-way']}</div>
            <div className='index_part1-4'>{lang['to-trade-derivatives']}</div>
          </div> */}
        </div>
      </div>
      <div className='index_part2 px1200'>
        <StatsBox lang={lang}/>
      </div>
      <div className='index_part3 px1200 big_square'>
        <div className='top_pater'>
          <div className='bottom_square'></div>
          <div className='label H2'>{lang['defining-features']}</div>
          <div className='line_of_box'>
            <div className='box left_box'>
              <div className='box_top'>
                <img src={Completely} className='box_label_img' alt=''/>
                <div className="box_lable H3">{lang['completely-on-chain']}</div>
                <div className="box_note">{lang['ex-me-fu-im-wi-eth-sm-con']}</div>
              </div>
              <img src={Completely_b} className='box_background' alt=''/>
              <div className='box_bottom'></div>
            </div>
            <div className='box right_box'>
              <div className='box_top'>
                <img src={RealDerivatives} className='box_label_img' alt=''/>
                <div className="box_lable H3">{lang['real-derivatives']}</div>
                <div className="box_note">{lang['get-ri-ex-pr-and-cap-eff']}</div>
              </div>
              <img src={RealDerivatives_b} className='box_background' alt=''/>
              <div className='box_bottom'></div>
            </div>
          </div>
          <div className='line_of_box'>
            <div className='box left_box'>
              <div className='box_top'>
                <img src={Composability} className='box_label_img' alt=''/>
                <div className="box_lable H3">{lang['composability']}</div>
                <div className="box_note">{lang['ri-ex-to-as-nft-to-be-ut-as-le-bl']}</div>
              </div>
              <img src={Composability_b} className='box_background' alt=''/>
              <div className='box_bottom'></div>
            </div>
            <div className='box right_box'>
              <div className='box_top'>
                <img src={ETHBSCHECO} className='box_label_img' alt='' />
                <div className="box_lable H3">{lang['eth-bsc-heco']}</div>
                <div className="box_note">{lang['three-chains-one-ecosystem']}</div>
              </div>
              <img src={ETHBSCHECO_b} className='box_background' alt=''/>
              <div className='box_bottom'></div>
            </div>
          </div>
        </div>
      </div>
      <div className='index_part4 px1200 big_square'>
        <div className='top_pater'>
          <div className='bottom_square'></div>
          <div className='label H2'>{lang['roles-in-deri']}</div>
          <div className='line_of_box'>
            <div className='box left_box'>
              <div className='box_top'>
                <img src={LiquidityProviders} className='box_label_img' alt=''/>
                <div className="box_lable H3">{lang['liquidity-providers']}</div>
                <div className="box_note">{lang['liquidity-providers-roles']}</div>
              </div>
              <div className='box_bottom'></div>
            </div>
            <div className='box right_box'>
              <div className='box_top'>
                <img src={Traders} className='box_label_img' alt=''/>
                <div className="box_lable H3">{lang['traders']}</div>
                <div className="box_note">{lang['traders-roles']}</div>
              </div>
              <div className='box_bottom'></div>
            </div>
          </div>
          <div className='line_of_box'>
            <div className='box left_box'>
              <div className='box_top'>
                <img src={Arbitragers} className='box_label_img' alt=''/>
                <div className="box_lable H3">{lang['arbitragers']}</div>
                <div className="box_note">{lang['arbitragers-roles']}</div>
              </div>
              <div className='box_bottom'></div>
            </div>
            <div className='box right_box'>
              <div className='box_top'>
                <img src={Positionliquidators} className='box_label_img' alt=''/>
                <div className="box_lable H3">{lang['position-liquidators']}</div>
                <div className="box_note">{lang['position-liquidators-roles']}</div>
              </div>
              <div className='box_bottom'></div>
            </div>
          </div>
        </div>
      </div>
      <div className='index_part5 pics'>
        <div className="label H2">{lang['investors']}</div>
        <div className='pic_inline'>
          <div className='pic'>
            <img src={FBG} alt=''/>
          </div>
          <div className='pic'>
            <img src={BIXIN} alt=''/>
          </div>
          <div className='pic'>
            <img src={LotusCapital} alt=''/>
          </div>
          <div className='pic'>
            <img src={BlackRange} alt=''/>
          </div>
          <div className='pic'>
            <img src={LD} alt=''/>
          </div>
          <div className='pic'>
            <img src={Kryptos} alt=''/>
          </div>
          <div className='pic'>
            <img src={AKG} alt=''/>
          </div>
          <div className='pic'>
            <img src={CDF} alt=''/>
          </div>
          <div className='pic'>
            <img src={GSR} alt=''/>
          </div>
          <div className='pic'>
            <img src={WOO} alt=''/>
          </div>
          <div className='pic'>
            <img src={QCP} alt=''/>
          </div>
          <div className='pic'>
            <img src={binance} alt=''/>
          </div>
          
        </div>
      </div>
      <div className='index_part6 pics'>
        <div className="label H2">{lang['partners']}</div>
        <div className='pic_inline'>
          <div className='pic'>
            <img src={BASIS} alt=''/>
          </div>
          <div className='pic'>
            <img src={dForce} alt=''/>  
          </div>
          <div className='pic'>
            <img src={AutoFarm} alt=''/>
          </div>
          <div className='pic'>
            {/* <img src={AutoFarm} /> */}
          </div>
        </div>
      </div>
    </div>

  )
}