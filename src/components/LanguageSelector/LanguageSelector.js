import React, { useState } from 'react'
import languageIcon from '../../assets/img/language-pick.png'
import arrowIcon from '../../assets/img/symbol-arrow.svg'
import './langSelector.less'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'

const languages = {
  'en' : 'English',
  'zh' : '中文',
  'de' : 'Deutsch'
}
function LanguageSelector({intl}){
  const [hidden, setHidden] = useState(false)
  const onClick = (lang) => {
    intl.setLocale(lang)
    setHidden(true)
  }
  const showLangBox = () => setHidden(false)
  const langBoxClass = classNames('lang-box',{'hidden' : hidden})
  return (
    <div className='lang-picker'>
      <img src={languageIcon} alt='language selector' onClick={showLangBox}/>
      <img src={arrowIcon} alt='selector' onClick={showLangBox}/>
      <div className={langBoxClass}>
        {Object.keys(languages).map((lang,index) => <div key={index} className={lang === intl.locale ? 'lang-item selected' : 'lang-item'} onClick={() => onClick(lang)}>{languages[lang]}</div>)}
      </div>
    </div>
  )
}

export default inject('intl')(observer(LanguageSelector))