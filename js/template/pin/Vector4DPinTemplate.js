import { html } from "lit"
import NumberEntity from "../../entity/NumberEntity.js"
import Vector4DEntity from "../../entity/Vector4DEntity.js"
import INumericPinTemplate from "./INumericPinTemplate.js"

/** @extends INumericPinTemplate<Vector4DEntity> */
export default class Vector4DPinTemplate extends INumericPinTemplate {

    #getX() {
        return NumberEntity.printNumber(this.element.getDefaultValue()?.X.valueOf() ?? 0)
    }

    #getY() {
        return NumberEntity.printNumber(this.element.getDefaultValue()?.Y.valueOf() ?? 0)
    }

    #getZ() {
        return NumberEntity.printNumber(this.element.getDefaultValue()?.Z.valueOf() ?? 0)
    }

    #getW() {
        return NumberEntity.printNumber(this.element.getDefaultValue()?.W.valueOf() ?? 0)
    }

    /**
     * @param {Number[]} values
     * @param {String[]} rawValues
     */
    setDefaultValue(values, rawValues) {
        const vector = this.element.getDefaultValue(true)
        if (!(vector instanceof Vector4DEntity)) {
            throw new TypeError("Expected DefaultValue to be a Vector4DEntity")
        }
        vector.X.value = values[0]
        vector.Y.value = values[1]
        vector.Z.value = values[2]
        vector.W.value = values[3]
        this.element.requestUpdate("DefaultValue", vector)
    }

    renderInput() {
        return html`
            <div class="ueb-pin-input-wrapper">
                <span class="ueb-pin-input-label">X</span>
                <div class="ueb-pin-input">
                    <ueb-input .singleLine="${true}" .innerText="${this.#getX()}"></ueb-input>
                </div>
                <span class="ueb-pin-input-label">Y</span>
                <div class="ueb-pin-input">
                    <ueb-input .singleLine="${true}" .innerText="${this.#getY()}"></ueb-input>
                </div>
                <span class="ueb-pin-input-label">Z</span>
                <div class="ueb-pin-input">
                    <ueb-input .singleLine="${true}" .innerText="${this.#getZ()}"></ueb-input>
                </div>
                <span class="ueb-pin-input-label">W</span>
                <div class="ueb-pin-input">
                    <ueb-input .singleLine="${true}" .innerText="${this.#getW()}"></ueb-input>
                </div>
            </div>
        `
    }
}
