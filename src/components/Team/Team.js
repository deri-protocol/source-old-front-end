import React from 'react'
import CEO from './img/0xAlpha.png'
import CTO from './img/Richard.png'
import Janice from './img/Janice.png'
import Jason from './img/Jason.png'
export default function Team() {
  return (
    <div>
      <div className='team_part1'>
        <div className='label '>TEAM</div>
        <div className='team_pc'>
          <div>Deri Protocol is designed and developed by Defi Factory, a team of experts of</div>
          <div>lfinance, math and computer science. The core members have PhD degrees in science</div>
          <div>and come from the derivative business of Wall Street. The team has in-depth experiences</div>
          <div>of derivative pricing/trading/structuring. The team members have been in the crypto</div>
          <div>trading and solidity programming for several years.</div>
        </div>
        <div className='team_m'>
          Deri Protocol is designed and developed by Defi Factory, a team of experts of
          lfinance, math and computer science. The core members have PhD degrees in science
          and come from the derivative business of Wall Street. The team has in-depth experiences
          of derivative pricing/trading/structuring. The team members have been in the crypto
          trading and solidity programming for several years.
        </div>
      </div>
      <div className='team_part2'>
        <div className='top_pater'>
          <div className='bottom_square'></div>
          <div className='line_of_box'>
            <div className='box box_left'>
              <img src={CEO} />
              <div className='name'>0xAlpha</div>
              <div className='person_information'>
                <ul>
                  <li>Co-founder and CEO</li>
                  <li>Physics BS from Peking University, Physics PhD from Rice University</li>
                  <li>Worked in Wall Street on derivative pricing/trading/structuring/risk management in Deutsche Bank, HBK hedge fund , Goldman Sachs</li>
                  <li>Co-founded a quantitative hedge fund focused on tranditional and crypto derivatives</li>
                  <li>
                    <a className='link' href="https://twitter.com/0x_alpha" >Twitter: https://twitter.com/0x_alpha</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className='box box_right'>
              <img src={CTO} />
              <div className='name'>Richard</div>
              <div className='person_information'>
                <ul>
                  <li>Co-founder and CEO</li>
                  <li>Physics BS from Peking University, Physics PhD from CUNY</li>
                  <li>Former Director of Strategy of quantitative trading, in charge of strategy development of high-frequency trading, momentum trading, statistical arbitrage</li>
                  <li>Expert of financial system development in C++/Python</li>
                  <li>
                    Expert of solidity/vyper programming and smart contract development
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className='line_of_box'>
            <div className='box box_left'>
              <img src={Jason} />
              <div className='name'>Jason</div>
              <div className='person_information'>
                <ul>
                  <li>Computer Science BS from University of Washington</li>
                  <li>Former Software Engineer at Amazon, AMD</li>
                  <li>Early crypto investor</li>
                  <li>Co-founder of a crypto marketing service agency</li>
                </ul>
              </div>
            </div>
            <div className='box box_right'>
              <img src={Janice} />
              <div className='name'>Janice</div>
              <div className='person_information'>
                <ul>
                  <li>Bachelor of Management from Shanghai University of Finance and Economics</li>
                  <li>Master of Management from Shanghai University of Finance and Economics</li>
                  <li>Worked for PwC China as a senior manager in risk management for 11 years</li>
                  <li>Two and half year experiences at VeChain Operation</li>
                </ul>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
} 