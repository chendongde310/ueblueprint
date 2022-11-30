import IPointing from "./IPointing"

/** @typedef {import("../../Blueprint").default} Blueprint */

/**
 * @template {HTMLElement} T
 * @extends {IPointing<T>}
 */
export default class MouseDbClick extends IPointing {

    static ignoreDbClick =
        /** @param {Number[]} location */
        location => { }

    #mouseDbClickHandler =
        /** @param {MouseEvent} e */
        e => {
            if (!this.options.strictTarget || e.target === e.currentTarget) {
                if (this.options.consumeEvent) {
                    e.stopImmediatePropagation() // Captured, don't call anyone else
                }
                this.clickedPosition = this.locationFromEvent(e)
                this.blueprint.mousePosition[0] = this.clickedPosition[0]
                this.blueprint.mousePosition[1] = this.clickedPosition[1]
                this.dbclicked(this.clickedPosition)
            }
        }

    #onDbClick
    get onDbClick() {
        return this.#onDbClick
    }
    set onDbClick(value) {
        this.#onDbClick = value
    }

    clickedPosition = [0, 0]

    constructor(target, blueprint, options = {}, onDbClick = MouseDbClick.ignoreDbClick) {
        options.consumeEvent ??= true
        options.strictTarget ??= false
        super(target, blueprint, options)
        this.#onDbClick = onDbClick
        this.listenEvents()
    }

    listenEvents() {
        this.target.addEventListener("dblclick", this.#mouseDbClickHandler)
    }

    unlistenEvents() {
        this.target.removeEventListener("dblclick", this.#mouseDbClickHandler)
    }

    /* Subclasses will override the following method */
    dbclicked(location) {
        this.onDbClick(location)
    }
}