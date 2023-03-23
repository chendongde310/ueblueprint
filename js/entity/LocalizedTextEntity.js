import IEntity from "./IEntity.js"
import Utility from "../Utility.js"

export default class LocalizedTextEntity extends IEntity {

    static lookbehind = "NSLOCTEXT"
    static attributes = {
        namespace: "",
        key: "",
        value: "",
    }

    static {
        this.cleanupAttributes(this.attributes)
    }

    constructor(values) {
        super(values)
        /** @type {String} */ this.namespace
        /** @type {String} */ this.key
        /** @type {String} */ this.value
    }

    toString() {
        return Utility.capitalFirstLetter(this.value)
    }
}
