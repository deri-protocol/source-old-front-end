import React, { useState ,useEffect} from 'react'
import languageIcon from '../../assets/img/language-pick.png'
import arrowIcon from '../../assets/img/symbol-arrow.svg'
import './langSelector.less'
import { inject, observer } from 'mobx-react'
import useQuery from '../../hooks/useQuery'
import languages from '../../locales/lang.json'

function LanguageSelector({intl}){
  const query = useQuery();
  const onClick = (lang,refresh) => {
    intl.setLocale(lang)
    if(refresh){
      window.location.href = window.location.origin + window.location.hash.replace(/locale=\w+/,`locale=${lang}`)
    }
  }

  useEffect(() => {
    if(query.has('locale')){
      onClick(query.get('locale'))
    }
    return () => {}
  }, [intl])
  return (
    <div className='lang-picker'>
      <img src={languageIcon} alt='language selector'/>
      <img src={arrowIcon} alt='selector' />
      <div className='lang-box'>
        {Object.keys(languages).map((lang,index) => <div key={index} className={lang === intl.locale ? 'lang-item selected' : 'lang-item'} onClick={() => onClick(lang,true)}>{languages[lang]}</div>)}
      </div>
    </div>
  )
}

export default inject('intl')(observer(LanguageSelector))