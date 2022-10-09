import IInputPinTemplate from "./IInputPinTemplate"

/**
 * @template T
 * @extends IInputPinTemplate<T>
 */
export default class INumericPinTemplate extends IInputPinTemplate {

    /** @param {String[]} values */
    setInputs(values = [], updateDefaultValue = false) {
        if (!values || values.length == 0) {
            values = [this.getInput()]
        }
        let parsedValues = []
        for (const value of values) {
            let num = parseFloat(value)
            if (isNaN(num)) {
                num = 0
                updateDefaultValue = false
            }
            parsedValues.push(num)
        }
        super.setInputs(values, false)
        this.setDefaultValue(parsedValues, values)
    }

    /**
     * @param {Number[]} values
     * @param {String[]} rawValues
     */
    setDefaultValue(values = [], rawValues) {
        this.element.setDefaultValue(/** @type {T} */(values[0]))
    }
}
