import { html } from "lit"
import Configuration from "../../Configuration.js"
import Utility from "../../Utility.js"
import IInputPinTemplate from "./IInputPinTemplate.js"

/** @extends IInputPinTemplate<EnumEntity> */
export default class EnumPinTemplate extends IInputPinTemplate {

    static saveEachInputChange = true // Otherwise save only on focus out

    /** @type {DropdownElement} */
    #dropdownElement

    #dropdownEntries = []

    setup() {
        super.setup()
        const enumEntries = this.element.nodeElement.entity.EnumEntries
        this.#dropdownEntries =
            enumEntries?.map(k => {
                if (k === "") {
                    k = "None"
                }
                return [
                    k,
                    this.element.nodeElement.getPinEntities().find(pinEntity => k === pinEntity.PinName)
                        ?.PinFriendlyName.toString()
                    ?? k
                ]
            })
            ?? Configuration.CommonEnums[this.element.entity.getSubCategory()]?.map(k =>
                k instanceof Array
                    ? k
                    : [k, Utility.formatStringName(k)]
            )
            ?? []
        const defaultEntry = this.element.getDefaultValue()?.toString()
        if (!this.#dropdownEntries.find(([k, v]) => k === defaultEntry)) {
            this.#dropdownEntries.push([defaultEntry, Utility.formatStringName(defaultEntry)])
        }
        this.element.requestUpdate()
    }

    renderInput() {
        const entity = this.element.nodeElement.entity
        return html`
            <ueb-dropdown
                class="ueb-pin-input-wrapper ueb-pin-input"
                .options="${this.#dropdownEntries}"
                .selectedOption="${this.element.defaultValue?.value}"
            >
            </ueb-dropdown>
        `
    }

    /** @param {PropertyValues} changedProperties */
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties)
        this.#dropdownElement = this.element.querySelector("ueb-dropdown")
    }

    getInputs() {
        return [this.#dropdownElement.getValue()]
    }
}
