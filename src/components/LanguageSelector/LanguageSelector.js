import React, { useState ,useEffect} from 'react'
import languageIcon from '../../assets/img/language-pick.png'
import arrowIcon from '../../assets/img/symbol-arrow.svg'
import './langSelector.less'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'
import useQuery from '../../hooks/useQuery'

const languages = {
  'en' : 'English',
  'zh' : '中文',
  'de' : 'Deutsch'
}
function LanguageSelector({intl}){
  const [hidden, setHidden] = useState(false)
  const query = useQuery();
  const onClick = (lang,refresh) => {
    intl.setLocale(lang)
    setHidden(true)
    if(refresh){
      window.location.href = window.location.origin + window.location.hash.replace(/locale=\w+/,`locale=${lang}`)
    }
  }
  const showLangBox = () => setHidden(false)
  const langBoxClass = classNames('lang-box',{'hidden' : hidden})

  useEffect(() => {
    if(query.has('locale')){
      onClick(query.get('locale'))
    }
    return () => {}
  }, [intl])
  return (
    <div className='lang-picker'>
      <img src={languageIcon} alt='language selector' onClick={showLangBox}/>
      <img src={arrowIcon} alt='selector' onClick={showLangBox}/>
      <div className={langBoxClass}>
        {Object.keys(languages).map((lang,index) => <div key={index} className={lang === intl.locale ? 'lang-item selected' : 'lang-item'} onClick={() => onClick(lang,true)}>{languages[lang]}</div>)}
      </div>
    </div>
  )
}

export default inject('intl')(observer(LanguageSelector))