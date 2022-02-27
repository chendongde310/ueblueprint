import FastSelectionModel from "../selection/FastSelectionModel"
import IElement from "./IElement"
import SelectorTemplate from "../template/SelectorTemplate"

export default class SelectorElement extends IElement {

    static tagName = "ueb-selector"

    constructor() {
        super({}, new SelectorTemplate())
        this.selectionModel = null
        /** @type {SelectorTemplate} */
        this.template
    }

    /**
     * Create a selection rectangle starting from the specified position
     * @param {number[]} initialPosition - Selection rectangle initial position (relative to the .ueb-grid element)
     */
    startSelecting(initialPosition) {
        this.template.applyStartSelecting(this, initialPosition)
        this.selectionModel = new FastSelectionModel(initialPosition, this.blueprint.getNodes(), this.blueprint.nodeBoundariesSupplier, this.blueprint.nodeSelectToggleFunction)
    }

    /**
     * Move selection rectagle to the specified final position. The initial position was specified by startSelecting()
     * @param {number[]} finalPosition - Selection rectangle final position (relative to the .ueb-grid element)
     */
    doSelecting(finalPosition) {
        this.template.applyDoSelecting(this, finalPosition)
        this.selectionModel.selectTo(finalPosition)
    }

    finishSelecting() {
        this.template.applyFinishSelecting(this)
        this.selectionModel = null
    }
}

customElements.define(SelectorElement.tagName, SelectorElement)