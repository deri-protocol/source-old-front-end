import { makeAutoObservable, observable, action, computed } from "mobx";
const versionKey = 'deri-current-version'

export default class Version {
  current = null;

  constructor(){
    makeAutoObservable(this,{
      current : observable,
      setCurrent : action,
      isV1 : computed,
      isV2 : computed
    })
    const versionFromSession = sessionStorage.getItem(versionKey);
    this.current = versionFromSession ? versionFromSession : null
  }


  setCurrent(version,notSave){
    this.current = version;
    if(!notSave){
      sessionStorage.setItem(versionKey,version)
    }
  }

  switch(){
    if(this.current === 'v1'){
      this.setCurrent('v2')
    } else {
      this.setCurrent('v1')
    }
  }

  get isV1() {
    return this.current === 'v1'
  }

  get isV2(){
    return this.current === 'v2'
  }
}