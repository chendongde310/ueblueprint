// @ts-check

import IElement from "./IElement"
import MouseMoveNodes from "../input/mouse/MouseMoveNodes"

/**
 * @typedef {import("../template/SelectableDraggableTemplate").default} SelectableDraggableTemplate
 * @typedef {import("../entity/IntegerEntity").default} IntegerEntity
 */
export default class ISelectableDraggableElement extends IElement {

    constructor(...args) {
        super(...args)
        this.dragObject = null
        this.location = [0, 0]
        this.selected = false
        /** @type {SelectableDraggableTemplate} */
        this.template

        let self = this
        this.dragHandler = (e) => {
            self.addLocation(e.detail.value)
        }
    }

    createInputObjects() {
        return [
            new MouseMoveNodes(this, this.blueprint, {
                looseTarget: true
            }),
        ]
    }

    /**
     * @param {Number[]} value 
     */
    setLocation(value = [0, 0]) {
        const d = [value[0] - this.location[0], value[1] - this.location[1]]
        this.location = value
        this.template.applyLocation(this)
        if (this.blueprint) {
            const dragLocalEvent = new CustomEvent(this.blueprint.settings.nodeDragLocalEventName, {
                detail: {
                    value: d
                },
                bubbles: false,
                cancelable: true
            })
            this.dispatchEvent(dragLocalEvent)
        }
    }

    addLocation(value) {
        this.setLocation([this.location[0] + value[0], this.location[1] + value[1]])
    }

    setSelected(value = true) {
        if (this.selected == value) {
            return
        }
        this.selected = value
        if (this.selected) {
            this.blueprint.addEventListener(this.blueprint.settings.nodeDragEventName, this.dragHandler)
        } else {
            this.blueprint.removeEventListener(this.blueprint.settings.nodeDragEventName, this.dragHandler)
        }
        this.template.applySelected(this)
    }

    dispatchDragEvent(value) {
        if (!this.selected) {
            this.blueprint.unselectAll()
            this.setSelected(true)
        }
        const dragEvent = new CustomEvent(this.blueprint.settings.nodeDragEventName, {
            detail: {
                value: value
            },
            bubbles: true,
            cancelable: true
        })
        this.dispatchEvent(dragEvent)
    }

    snapToGrid() {
        let snappedLocation = this.blueprint.snapToGrid(this.location)
        if (this.location[0] != snappedLocation[0] || this.location[1] != snappedLocation[1]) {
            this.setLocation(snappedLocation)
        }
    }
}
