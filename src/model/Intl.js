import { makeObservable, observable, action, computed } from "mobx";
import { restoreLocale, storeLocale } from "../utils/utils";

const cache = {}

function importAll(r){
  return r.keys().forEach(key => {
    const path = key.split('/')
    const lang = path[1]
    const page = path[2].split('.')[0].toLowerCase()
    if(!cache[lang]) {
      cache[lang] = {}
    }
    
    if(/mobile-/.test(page)){
      const pageName= page.split('-')[1]
      if(!cache[lang][pageName]){
        cache[lang][pageName] = {}
      }
      cache[lang][pageName]['mobile'] = r(key)
    } else {
      cache[lang][page] = r(key)
    }
  });
}
//lang.json 是语言包目录，需要排除在外
importAll(require.context(`../locales/`,true,/^((?!lang).)*\.json$/))

class Intl {
  locale = 'en'
  constructor(){
    makeObservable(this,{
      locale : observable,
      setLocale : action,
      dict : computed
    })
    const language = navigator.language
    const locale = restoreLocale()
    if(locale){
      this.locale = locale;
    } else if(language){
      this.locale = language.split('-')[0];
    }
  }

  setLocale(locale){
    this.locale = locale;
    storeLocale(locale)
  }

  get(page,key){
    return cache[this.locale][page][key]
  }

  get dict(){         
    return cache[this.locale]
  }
}

export default new Intl();