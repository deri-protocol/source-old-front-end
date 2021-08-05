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

  switch(){
    if(this.current === 'futures'){
      this.setCurrent(false)
    }else{
      this.setCurrent(true)
    }
  }

  get isOptions(){
    return this.current === 'options'
  }
}

export default new Type()