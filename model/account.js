
"use strict"


class AccountingType{

}
class AccountingPoint {
    constructor(date,amount=0,account ="",concept="", type = "",notes ="",estimate = false ){
        this.date = date
        this.amount = amount
        this.account = account
        this.concept = concept
        this.notes = notes
        this.estimate = estimate
        this.type = type
    }

}