import React, { useState, useEffect } from 'react'
import Content from '../../../components/Home/Content';
import './home.less'
export default function Home({lang}){
  return (
    <div className='home_box'>
      <Content lang={lang} />
    </div>
  )
}