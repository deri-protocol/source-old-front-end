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
import FBG from './img/FBG.png'
import GSR from './img/GSR.png'
import Kryptos from './img/Kryptos.png'
import LD from './img/LD.png'
import LotusCapital from './img/LotusCapital.png'
import Arbitragers from './img/Arbitragers.png'
export default function Title() {
  return (
    <div>
      <div className='index_part1'>
        <img src={deri_background} />
        <div className='index_part1-1 px1200'>
          <div className='index_part1-2'>THE</div>
          <div className='index_part1-3'>DEFI WAY</div>
          <div className='index_part1-4'>TO TRADE DERIVATIVES </div>
        </div>
      </div>
      <div className='index_part2 px1200'>
        <div className='index_part2-center'>
          <div className="index_part2-L">
            <div>
              <span className="key">DERI Protocol </span>
              is a decentralized
            </div>
            <div>protocol to exchange risk exposures</div>
            <div>precisely and capital-efficiently.</div>
          </div>
          <div className='index_part2-R'>
            <div> <span>We are on </span> 
              <a href="https://app.sushi.com/token/0xa487bf43cf3b10dffc97a9a744cbb7036965d3b9" class="Body-link">SUSHI</a>
              <span> and </span> 
              <a href="https://exchange.pancakeswap.finance/#/swap?inputCurrency=0xe60eaf5a997dfae83739e035b005a33afdcc6df5" class="Body-link">PANCAKE</a> !
            </div>
            <div> <span> Read our </span> 
              <a href="https://docs.deri.finance/whitepaper" class="Body-link">Whitepaper</a>
              <span> and PeckShield </span> 
              <a href="https://docs.deri.finance/code-audits" class="Body-link">audit report</a> .
            </div>
          </div>
        </div>
      </div>
      <div className='index_part3 px1200 big_square'>
        <div className='top_pater'>
          <div className='bottom_square'></div>
          <div className='label H2'>DEFINING FEATURES</div>
          <div className='line_of_box'>
            <div className='box left_box'>
              <div className='box_top'>
                <img src={Completely} className='box_label_img' />
                <div className="box_lable H3">Completely On-Chain</div>
                <div className="box_note">Exchanging mechanism fully implemented within Ethereum smart contracts</div>
              </div>
              <img src={Completely_b} className='box_background' />
              <div className='box_bottom'></div>
            </div>
            <div className='box right_box'>
              <div className='box_top'>
                <img src={RealDerivatives} className='box_label_img' />
                <div className="box_lable H3">Real Derivatives</div>
                <div className="box_note">Get risk exposures precisely and capital-efficiently</div>
              </div>
              <img src={RealDerivatives_b} className='box_background' />
              <div className='box_bottom'></div>
            </div>
          </div>
          <div className='line_of_box'>
            <div className='box left_box'>
              <div className='box_top'>
                <img src={Composability} className='box_label_img' />
                <div className="box_lable H3">Composability</div>
                <div className="box_note">Risk exposures tokenized as NFTs to be utilized as lego blocks</div>
              </div>
              <img src={Composability_b} className='box_background' />
              <div className='box_bottom'></div>
            </div>
            <div className='box right_box'>
              <div className='box_top'>
                <img src={ETHBSCHECO} className='box_label_img' />
                <div className="box_lable H3">ETH + BSC + HECO</div>
                <div className="box_note">Three chains, one ecosystem</div>
              </div>
              <img src={ETHBSCHECO_b} className='box_background' />
              <div className='box_bottom'></div>
            </div>
          </div>
        </div>
      </div>
      <div className='index_part4 px1200 big_square'>
        <div className='top_pater'>
          <div className='bottom_square'></div>
          <div className='label H2'>ROLES IN DERI</div>
          <div className='line_of_box'>
            <div className='box left_box'>
              <div className='box_top'>
                <img src={LiquidityProviders} className='box_label_img' />
                <div className="box_lable H3">Liquidity Providers</div>
                <div className="box_note">Liquidity providers provide liquidity to the pools to gain transaction fee, funding fee and DERI award etc.</div>
              </div>
              <div className='box_bottom'></div>
            </div>
            <div className='box right_box'>
              <div className='box_top'>
                <img src={Traders} className='box_label_img' />
                <div className="box_lable H3">Traders</div>
                <div className="box_note">With Deri Protocol, traders are able to acquire the targeted risk exposures precisely and capital-efficiently.</div>
              </div>
              <div className='box_bottom'></div>
            </div>
          </div>
          <div className='line_of_box'>
            <div className='box left_box'>
              <div className='box_top'>
                <img src={Arbitragers} className='box_label_img' />
                <div className="box_lable H3">Arbitragers</div>
                <div className="box_note">Arbitragers are a special type of traders induced by funding fee arbitrage to balance the two sides of long and short positions.</div>
              </div>
              <div className='box_bottom'></div>
            </div>
            <div className='box right_box'>
              <div className='box_top'>
                <img src={Positionliquidators} className='box_label_img' />
                <div className="box_lable H3">Position Liquidators</div>
                <div className="box_note">Positions touching their liquidation lines are liquidated by Position Liquidators, who share the positions' remaining margin as reward.</div>
              </div>
              <div className='box_bottom'></div>
            </div>
          </div>
        </div>
      </div>
      <div className='index_part5 pics'>
        <div className="label H2">INVESTORS</div>
        <div className='pic_inline'>
          <div className='pic'>
            <img src={FBG} />
          </div>
          <div className='pic'>
            <img src={BIXIN} />
          </div>
          <div className='pic'>
            <img src={LotusCapital} />
          </div>
          <div className='pic'>
            <img src={BlackRange} />
          </div>
          <div className='pic'>
            <img src={LD} />
          </div>
          <div className='pic'>
            <img src={Kryptos} />
          </div>
          <div className='pic'>
            <img src={AKG} />
          </div>
          <div className='pic'>
            <img src={CDF} />
          </div>
          <div className='pic'>
            <img src={GSR} />
          </div>
        </div>
      </div>
      <div className='index_part6 pics'>
        <div className="label H2">PARTNERS</div>
        <div className='pic_inline'>
          <div className='pic'>
            <img src={BASIS} />
          </div>
          <div className='pic'>
            <img src={BIXIN} />
          </div>
          <div className='pic'>
            <img src={AutoFarm} />
          </div>
          <div className='pic'>
            {/* <img src={AutoFarm} /> */}
          </div>
        </div>
      </div>
    </div>

  )
}