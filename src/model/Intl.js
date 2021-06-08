import { makeObservable, observable, action, computed } from "mobx";
import {computedAsync} from 'computed-async-mobx'
import LoadableComponent from "../utils/LoadableComponent";

export default class Intl {
  locale = 'en-US'
  constructor(){
    makeObservable(this,{
      locale : observable,
      setLocale : action,
      dict : computed
    })
  }

  setLocale(locale){
    this.locale = locale;
  }

  dictFile = computedAsync({
    init : {},
    fetch : async () => {
      const dict = await import(`../locales/${this.locale}.json`)
      return dict
    }
  })

  get dict(){
    return this.dictFile.value;
  }


}