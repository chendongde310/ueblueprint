import IDraggableElement from "./IDraggableElement"

/**
 * @typedef {import("../element/WindowElement").default} WindowElement
 * @typedef {import("../entity/IEntity").default} IEntity
 * @typedef {import("../template/IDraggableControlTemplate").default} IDraggableControlTemplate
 */

/**
 * @template {IEntity} T
 * @template {IDraggableControlTemplate} U
 * @extends {IDraggableElement<T, U>}
 */
export default class IDraggableControlElement extends IDraggableElement {

    /** @type {WindowElement} */
    windowElement

    setup() {
        super.setup()
        this.windowElement = this.closest("ueb-window")
    }

    /** @param {Number[]} param0 */
    setLocation([x, y]) {
        super.setLocation(this.template.adjustLocation([x, y]))
    }
}
