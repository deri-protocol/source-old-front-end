import { makeObservable, observable, action, computed, flow } from "mobx";
import {computedAsync, promisedComputed} from 'computed-async-mobx'
import LoadableComponent from "../utils/LoadableComponent";

export default class Intl {
  locale = 'en-US'
  constructor(){
    makeObservable(this,{
      locale : observable,
      setLocale : action,
    })
  }

  setLocale(locale){
    this.locale = locale;
  }

  fetchDict = flow(function* (){
    // const dict = yield import(`../locales/${this.locale}.json`)
    // this.dict = dict.default;
    // return this.dict
  })
}