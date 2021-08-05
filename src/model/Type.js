import {makeAutoObservable,observable,action,computed} from 'mobx'

class Type{
  current = null;
 
  constructor(){
    makeAutoObservable(this,{
      current : observable,
      setCurrent : action,
      isOptions : computed,
    })
  }

  setCurrent(options){
    this.current = options;
  }

  get isOptions(){
    return this.current === true
  }
}

export default new Type()