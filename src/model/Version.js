import { makeAutoObservable, observable, action, computed } from "mobx";
import { storeVersion, restoreVersion } from "../utils/utils";

class Version {
  current = null;

  constructor(){
    makeAutoObservable(this,{
      current : observable,
      setCurrent : action,
      isV1 : computed,
      isV2 : computed
    })
  }


  setCurrent(version){
    this.current = version;
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
export default new Version()