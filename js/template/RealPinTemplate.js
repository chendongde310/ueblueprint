import IInputPinTemplate from "./IInputPinTemplate"
import Utility from "../Utility"

/**
 * @typedef {import("../element/PinElement").default} PinElement
 */

export default class RealPinTemplate extends IInputPinTemplate {

    /**
     * @param {PinElement} pin
     * @param {String[]?} values
     */
    setInputs(pin, values = []) {
        if (!values || values.length == 0) {
            values = this.getInput(pin)
        }
        let updateDefaultValue = true
        for (let i = 0; i < values.length; ++i) {
            let num = parseFloat(values[i])
            if (isNaN(num)) {
                num = parseFloat(pin.entity.DefaultValue != ""
                    ? /** @type {String} */(pin.entity.DefaultValue)
                    : pin.entity.AutogeneratedDefaultValue)
            }
            if (isNaN(num)) {
                num = 0
                updateDefaultValue = false
            }
            values[i] = Utility.minDecimals(num)
        }
        super.setInputs(pin, values, updateDefaultValue)
    }
}