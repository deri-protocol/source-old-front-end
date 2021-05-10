import { makeAutoObservable, observable, action } from "mobx"

export default class Position {
   // contract info
   position = {}
 
   constructor(){
     makeAutoObservable(this,{
         position : observable,
         getPosition : action,
       }
     )
   }

   getPosition(){
     
   }
 
}