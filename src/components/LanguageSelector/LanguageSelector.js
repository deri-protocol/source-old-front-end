import React, { useState ,useEffect} from 'react'
import languageIcon from '../../assets/img/language-pick.png'
import arrowIcon from '../../assets/img/symbol-arrow.svg'
import './langSelector.less'
import { inject, observer } from 'mobx-react'
import useQuery from '../../hooks/useQuery'
import languages from '../../locales/lang.json'
import classNames from 'classnames'
import { addParam, hasParam, getParam } from '../../utils/utils'

function LanguageSelector({intl}){
  const [show, setShow] = useState(false)
  const onClick = (lang,refresh) => {
    intl.setLocale(lang)
    setShow(false);
    if(refresh){
      window.location.href = addParam('locale',lang)
    }
  }

  const onMouseOver = () => {
    setShow(true);
  } 
  const onMouseOut = () => {
    setShow(false)
  }
  const langBoxClass = classNames('lang-box',{show : show})
  

  useEffect(() => {
    if(hasParam('locale')){
      onClick(getParam('locale'))
    }
    return () => {}
  }, [intl])
  return (
    <div className='lang-picker' onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
      <span className='locale'>{intl.localeLabel}</span>
      <img src={arrowIcon} alt='selector' />
      <div className={langBoxClass} >
        {Object.keys(languages).map((lang,index) => <div key={index} className={lang === intl.locale ? 'lang-item selected' : 'lang-item'} onClick={(e) => onClick(lang,true)}>{languages[lang]}</div>)}
      </div>
    </div>
  )
}

export default inject('intl')(observer(LanguageSelector))