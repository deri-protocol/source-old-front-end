import React from 'react'
import CEO from './img/0xAlpha.png'
import CTO from './img/Richard.png'
import Janice from './img/Janice.png'
import Jason from './img/Jason.png'
import './zh-team.less'
export default function Team({lang}) {
  return (
    <div>
      <div className='team_part1'>
        <div className='label '>{lang['team']}</div>  
        <div className='team_pc'>
          <div>{lang['team-describe']}</div>
        </div>
        <div className='team_m'>
        {lang['team-describe']}
        </div>
      </div>
      <div className='team_part2'>
        <div className='top_pater'>
          <div className='bottom_square'></div>
          <div className='line_of_box'>
            <div className='box box_left'>
              <img src={CEO} />
              <div className='name'>{lang['ceo']}</div>
              <div className='person_information'>
                <ul>
                  <li>{lang['co-founder-and-ceo']}</li>
                  <li>{lang['ceo-school']}</li>
                  <li>
                    {lang['ceo-worked-one']}<br/>
                    {lang['ceo-worked-two']}<br/>
                    {lang['ceo-worked-three']}
                  </li>
                  <li>{lang['c-f-a-qu-he-fund-fo-on-tr-and-cr-de']}</li>
                  <li>
                    <a className='link' href="https://twitter.com/0x_alpha" >{lang['ceo-twitter']}: https://twitter.com/0x_alpha</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className='box box_right'>
              <img src={CTO} />
              <div className='name'>{lang['cto']}</div>
              <div className='person_information'>
                <ul>
                  <li>{lang['co-founder-and-cto']}</li>
                  <li>{lang['cto-school']}</li>
                  <li>{lang['cto-worked']}</li>
                  <li>{lang['cto-good-at-language']}</li>
                  <li>
                    {lang['cto-ex-of-so-vy-pr-and-sm-con-dev']}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className='line_of_box'>
            <div className='box box_left'>
              <img src={Jason} />
              <div className='name'>{lang['jason']}</div>
              <div className='person_information'>
                <ul>
                  <li>{lang['jason-school']}</li>
                  <li>{lang['jason-worked']}</li>
                  <li>{lang['jason-er-inv']}</li>
                  <li>{lang['jason-co-fo-of-a-cr-ma-se-ag']}</li>
                </ul>
              </div>
            </div>
            <div className='box box_right'>
              <img src={Janice} />
              <div className='name'>{lang['janice']}</div>
              <div className='person_information'>
                <ul>
                  <li>{lang['janice-school']}</li>
                  <li>{lang['janice-degree']}</li>
                  <li>{lang['janice-worked']}</li>
                  <li>{lang['janice-t-and-ha-ye-ex-at-ve-op']}</li>
                </ul>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
} 