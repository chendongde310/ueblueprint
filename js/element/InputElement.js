import BooleanEntity from "../entity/BooleanEntity.js"
import InputTemplate from "../template/pin/InputTemplate.js"
import IElement from "./IElement.js"

/** @extends {IElement<Object, InputTemplate>} */
export default class InputElement extends IElement {

    static properties = {
        ...super.properties,
        singleLine: {
            type: Boolean,
            attribute: "data-single-line",
            converter: BooleanEntity.booleanConverter,
            reflect: true,
        },
        selectOnFocus: {
            type: Boolean,
            attribute: "data-select-focus",
            converter: BooleanEntity.booleanConverter,
            reflect: true,
        },
        blurOnEnter: {
            type: Boolean,
            attribute: "data-blur-enter",
            converter: BooleanEntity.booleanConverter,
            reflect: true,
        },
    }

    constructor() {
        super()
        this.singleLine = false
        this.selectOnFocus = true
        this.blurOnEnter = true
        super.initialize({}, new InputTemplate())
    }

    static newObject() {
        return new InputElement()
    }

    initialize() {
        // Initialized in the constructor, this method does nothing
    }
}
