/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect } from 'react'
import arr from './img/arr.svg'
import add from './img/add.svg'
export default function TotalPoints({ lang }) {
  return (
    <div className='total-points'>
      <div className='desktop-total-score'>
        <div className='total-points-title'>
          {lang['the-trading-mining-event-has-four-quarters']}
        </div>
        <div className='dial'>
          <div className='first'>
            <div className='dial-title'>
              {lang['the-first']}
            </div>
            <div className='dial-time'>
              {lang['the-first-time']}
            </div>
            <div className='dial-box'>
              <div className='one-dial-box'>
                <div className='two-dial-box'>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <div class="cover"></div>
                  <div className='s-one'></div>
                  <div class="dotted"></div>
                </div>
                <div className='points first-points'>
                  {lang['the-first-points']}
                </div>
              </div>
            </div>
          </div>
          <img src={add} className='add-img'></img>
          <div className='second'>
            <div className='dial-title'>
              {lang['the-second']}
            </div>
            <div className='dial-time'>
              {lang['the-second-time']}
            </div>
            <div className='dial-box'>
              <div className='one-dial-box'>
                <div className='two-dial-box'>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <div class="cover"></div>
                  <div className='s-two'></div>
                  <div class="dotted"></div>
                </div>
                <div className='points second-points'>
                  {lang['the-second-points']}
                </div>
              </div>
            </div>
          </div>
          <img src={add} className='add-img'></img>
          <div className='third'>
            <div className='dial-title'>
              {lang['the-third']}
            </div>
            <div className='dial-time'>
              {lang['the-third-time']}
            </div>
            <div className='dial-box'>
              <div className='one-dial-box'>
                <div className='two-dial-box'>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <div class="cover"></div>
                  <div className='s-three'></div>
                  <div class="dotted"></div>
                </div>
                <div className='points third-points'>
                  {lang['the-third-points']}
                </div>
              </div>
            </div>
          </div>
          <img src={add} className='add-img'></img>
          <div className='fourth'>
            <div className='dial-title'>
              {lang['the-fourth']}
            </div>
            <div className='dial-time'>
              {lang['the-fourth-time']}
            </div>
            <div className='dial-box'>
              <div className='one-dial-box'>
                <div className='two-dial-box'>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <li className='line'></li>
                  <div class="cover"></div>
                  <div className='s-four'></div>
                  <div class="dotted"></div>
                </div>
                <div className='points fourth-points'>
                  {lang['the-fourth-points']}
                </div>
              </div>

            </div>
          </div>
          <img src={arr} className='arr-img'></img>
          <div className='total-score'>
            <div className='total-score-title'>
              {lang['totalpoints']}
            </div>
            <div className='total-score-box'>
              110,000
          </div>
          </div>
        </div>
      </div>

    </div>
  )
}