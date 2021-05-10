import { makeAutoObservable, observable, action } from "mobx"

export default class History {
   //history 
   history = []
 
   constructor(){
     makeAutoObservable(this,{
         history : observable,
         getHistory : action,
       }
     )
   }

   getHistory(){
     
   }
}