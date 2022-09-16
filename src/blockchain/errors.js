// see https://stackoverflow.com/a/41102306
const CAN_SET_PROTOTYPE = 'setPrototypeOf' in Object

export class InsufficientReservesError extends Error {
    constructor() {
        super()
        this.isInsufficientReservesError = true
        this.name = this.constructor.name
        if (CAN_SET_PROTOTYPE) Object.setPrototypeOf(this, new.target.prototype)
    }
}

export class InsufficientInputAmountError extends Error {
    constructor() {
        super()
        this.isInsufficientInputAmountError = true
        this.name = this.constructor.name
        if (CAN_SET_PROTOTYPE) Object.setPrototypeOf(this, new.target.prototype)
    }
}
