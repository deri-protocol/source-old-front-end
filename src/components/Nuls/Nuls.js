/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import nulsimg from './img/nuls.svg'
import deriimg from './img/deri.svg'
import success from './img/success.svg'
import undone from './img/undone.svg'
import right from './img/right.svg'

function Nuls({ wallet = {}, lang }) {
  return (
    <div className='nuls-box'>
      <div className='title'>
        {lang['title']}<br />
        {lang['title-one']}
      </div>
      <div className='logo'>
        <img className='nuls-img' src={nulsimg} />
        <img src={deriimg} />
      </div>
      <div className='user-rasks'>
        <div className='header'>
          {lang['user-tasks']}
        </div>
        <div className='content'>
          <div className='content-text'>
            <div className='step'>
              <div className='step-img'>
                <div>
                  <img src={undone} />
                </div>
                <div>
                  {lang['register']}
                </div>
              </div>
              <div className='step-img'>
                <div>
                  <img src={right} />
                </div>

              </div>
              <div className='step-img'>
                <div>
                  <img src={undone} />
                </div>
                <div>
                  {lang['claim']}
                </div>
              </div>
              <div className='step-img'>
                <div>
                  <img src={right} />
                </div>

              </div>
              <div className='step-img'>
                <div>
                  <img src={undone} />
                </div>
                <div>
                  {lang['trade']}
                </div>
              </div>
            </div>
            <div className='button'>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default inject("wallet")(observer(Nuls))