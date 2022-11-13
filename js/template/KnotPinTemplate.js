import { html } from "lit"
import Utility from "../Utility"
import PinTemplate from "./PinTemplate"

/** @typedef {import("./KnotNodeTemplate").default} KnotNodeTemplate */

export default class KnotPinTemplate extends PinTemplate {

    render() {
        return this.element.isOutput() ? this.renderIcon() : html``
    }

    getLinkLocation() {
        const rect = (
            this.element.isInput()
                // @ts-expect-error
                ? /** @type {KnotNodeTemplate} */ (this.element.nodeElement.template).outputPin.template.iconElement
                : this.iconElement
        ).getBoundingClientRect()
        const location = Utility.convertLocation(
            [
                this.element.isInput() ? (rect.left + rect.right) / 2 : rect.right + 2,
                (rect.top + rect.bottom) / 2,
            ],
            this.element.blueprint.gridElement
        )
        return this.element.blueprint.compensateTranslation(location)
    }
}