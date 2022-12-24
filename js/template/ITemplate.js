import { html } from "lit"

/**
 * @typedef {import("../element/IElement").default} IElement
 * @typedef {import("../input/IInput").default} IInput
 * @typedef {import("lit").PropertyValues} PropertyValues
 */

/** @template {IElement} T */
export default class ITemplate {

    /** @type {T} */
    element

    /** @type {IInput[]} */
    #inputObjects = []
    get inputObjects() {
        return this.#inputObjects
    }

    /** @param {T} element */
    initialize(element) {
        this.element = element
    }

    createInputObjects() {
        return /** @type {IInput[]} */([])
    }

    setup() {
    }

    cleanup() {
        this.#inputObjects.forEach(v => v.unlistenDOMElement())
    }

    /** @param {PropertyValues} changedProperties */
    willUpdate(changedProperties) {
    }

    /** @param {PropertyValues} changedProperties */
    update(changedProperties) {
    }

    render() {
        return html``
    }

    /** @param {PropertyValues} changedProperties */
    firstUpdated(changedProperties) {
    }

    /** @param {PropertyValues} changedProperties */
    updated(changedProperties) {
    }

    inputSetup() {
        this.#inputObjects = this.createInputObjects()
    }
}
