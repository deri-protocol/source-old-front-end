/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect,useState } from 'react'
import arr from '../img/arr.svg'
import add from '../img/add.svg'
export default function TotalPoints({ lang }) {
  const [endOne,setEndOne] = useState(false)
  const [endTwo,setEndTwo] = useState(false)
  const [endThree,setEndThree] = useState(false)
  const [endFour,setEndFour] = useState(false)


  useEffect(() => {
    let timestamp = new Date()
    if (timestamp.getTime() >= 1634724000000) {
      setEndOne(true)
      document.getElementsByClassName('frist-one-dial')[0].style.border = '2px solid #CCC'
      document.getElementsByClassName('frist-two-dial')[0].style.border = '10px solid #CCC'
      document.getElementsByClassName('frist-dotted')[0].style.border = '3px solid #CCC'
      document.getElementsByClassName('s-one')[0].style.background = '#CCC'
      let fristLine = document.getElementsByClassName('frist-line')
      for (let i = 0; i < fristLine.length; i++) {
        fristLine[i].style.background = '#ccc'
      }
    }
    if (timestamp.getTime() >= 1635328800000) {
      setEndTwo(true)
      document.getElementsByClassName('second-one-dial')[0].style.border = '2px solid #CCC'
      document.getElementsByClassName('second-two-dial')[0].style.border = '10px solid #CCC'
      document.getElementsByClassName('second-dotted')[0].style.border = '3px solid #CCC'
      document.getElementsByClassName('s-two')[0].style.background = '#CCC'
      let fristLine = document.getElementsByClassName('second-line')
      for (let i = 0; i < fristLine.length; i++) {
        fristLine[i].style.background = '#ccc'
      }
    }
    if (timestamp.getTime() >= 1635933600000) {
      setEndThree(true)
      document.getElementsByClassName('third-one-dial')[0].style.border = '2px solid #CCC'
      document.getElementsByClassName('third-two-dial')[0].style.border = '10px solid #CCC'
      document.getElementsByClassName('third-dotted')[0].style.border = '3px solid #CCC'
      document.getElementsByClassName('s-three')[0].style.background = '#CCC'
      let fristLine = document.getElementsByClassName('third-line')
      for (let i = 0; i < fristLine.length; i++) {
        fristLine[i].style.background = '#ccc'
      }
    }
    if (timestamp.getTime() >= 1636538400000) {
      setEndFour(true)
      document.getElementsByClassName('fourth-one-dial')[0].style.border = '2px solid #CCC'
      document.getElementsByClassName('fourth-two-dial')[0].style.border = '10px solid #CCC'
      document.getElementsByClassName('fourth-dotted')[0].style.border = '3px solid #CCC'
      document.getElementsByClassName('s-four')[0].style.background = '#CCC'
      let fristLine = document.getElementsByClassName('fourth-line')
      for (let i = 0; i < fristLine.length; i++) {
        fristLine[i].style.background = '#ccc'
      }
    }

  }, [])

  return (
    <div className='total-points'>
      <div className='desktop-total-score'>
        <div className='dial'>
          <div className='first'>
            <div className='dial-title'>
              {lang['the-first']}
            </div>
            <div className='dial-time'>
              {lang['the-first-time']}
            </div>
            <div className='dial-box'>
              <div className='one-dial-box frist-one-dial'>
                <div className='two-dial-box frist-two-dial'>
                  <li className='line frist-line'></li>
                  <li className='line frist-line'></li>
                  <li className='line frist-line'></li>
                  <li className='line frist-line'></li>
                  <li className='line frist-line'></li>
                  <li className='line frist-line'></li>
                  <li className='line frist-line'></li>
                  <li className='line frist-line'></li>
                  <li className='line frist-line'></li>
                  <li className='line frist-line'></li>
                  <li className='line frist-line'></li>
                  <li className='line frist-line'></li>
                  <div class="cover"></div>
                  <div className={endOne ? 'end-one' :'s-one' }></div>
                  <div class="dotted frist-dotted"></div>
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
              <div className='one-dial-box second-one-dial'>
                <div className='two-dial-box second-two-dial'>
                  <li className='line second-line'></li>
                  <li className='line second-line'></li>
                  <li className='line second-line'></li>
                  <li className='line second-line'></li>
                  <li className='line second-line'></li>
                  <li className='line second-line'></li>
                  <li className='line second-line'></li>
                  <li className='line second-line'></li>
                  <li className='line second-line'></li>
                  <li className='line second-line'></li>
                  <li className='line second-line'></li>
                  <li className='line second-line'></li>
                  <div class="cover"></div>
                  <div className={endTwo ? 'end-two' :'s-two' } ></div>
                  <div class="dotted second-dotted"></div>
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
              <div className='one-dial-box third-one-dial'>
                <div className='two-dial-box third-two-dial'>
                  <li className='line third-line'></li>
                  <li className='line third-line'></li>
                  <li className='line third-line'></li>
                  <li className='line third-line'></li>
                  <li className='line third-line'></li>
                  <li className='line third-line'></li>
                  <li className='line third-line'></li>
                  <li className='line third-line'></li>
                  <li className='line third-line'></li>
                  <li className='line third-line'></li>
                  <li className='line third-line'></li>
                  <li className='line third-line'></li>
                  <div class="cover"></div>
                  <div className= {endThree ? 'end-three' :'s-three' }></div>
                  <div class="dotted third-dotted"></div>
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
              <div className='one-dial-box fourth-one-dial'>
                <div className='two-dial-box fourth-two-dial'>
                  <li className='line fourth-line'></li>
                  <li className='line fourth-line'></li>
                  <li className='line fourth-line'></li>
                  <li className='line fourth-line'></li>
                  <li className='line fourth-line'></li>
                  <li className='line fourth-line'></li>
                  <li className='line fourth-line'></li>
                  <li className='line fourth-line'></li>
                  <li className='line fourth-line'></li>
                  <li className='line fourth-line'></li>
                  <li className='line fourth-line'></li>
                  <div class="cover"></div>
                  <div className={endFour ? 'end-four' :'s-four' }></div>
                  <div class="dotted fourth-dotted"></div>
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