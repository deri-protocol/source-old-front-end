import { makeObservable, observable, computed, autorun } from "mobx"

export default class OrderLine {
    price = 0
    amount = 1

    info = {}

    constructor(price) {
        makeObservable(this, {
            info : observable,
            total: computed
        })
        this.price = price
    }

    setPrice(price){
        this.info.price = price
        console.log('total ',this.total.total)
    }

    setAmount(amount){
        this.info.amount = amount
    }

    get total() {
        console.log("Computing...")
        return {
            total :
            this.info.price * this.info.amount
        }
    }
}


