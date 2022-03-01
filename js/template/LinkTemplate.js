import Configuration from "../Configuration"
import html from "./html"
import ITemplate from "./ITemplate"
import sanitizeText from "./sanitizeText"

/**
 * @typedef {import("../element/LinkElement").default} LinkElement
 * @typedef {import("../element/LinkMessageElement").default} LinkMessageElement
 */
export default class LinkTemplate extends ITemplate {

    static pixelToUnit(pixels, pixelFullSize) {
        return pixels * 100 / pixelFullSize
    }

    static unitToPixel(units, pixelFullSize) {
        return Math.round(units * pixelFullSize / 100)
    }

    /**
     * Computes the html content of the target element.
     * @param {LinkElement} link connecting two graph nodes 
     * @returns The result html 
     */
    render(link) {
        const uniqueId = crypto.randomUUID()
        return html`
            <svg version="1.2" baseProfile="tiny" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <g>
                    <path id="${uniqueId}" fill="none" vector-effect="non-scaling-stroke" />
                    <use href="#${uniqueId}" pointer-events="stroke" stroke-width="10" />
                </g>
            </svg>
        `
    }

    /**
     * Applies the style to the element.
     * @param {LinkElement} link Element of the graph
     */
    apply(link) {
        if (link.linkMessageElement) {
            link.appendChild(link.linkMessageElement)
        }
        super.apply(link)
        link.classList.add("ueb-positioned")
        link.pathElement = link.querySelector("path")
    }

    /**
     * 
     * @param {LinkElement} link element
     */
    applyStartDragging(link) {
        link.blueprint.dataset.creatingLink = true
        const referencePin = link.getSourcePin() ?? link.getDestinationPin()
        if (referencePin) {
            link.style.setProperty("--ueb-node-value-color", referencePin.getColor())
        }
        link.classList.add("ueb-link-dragging")
    }

    /**
     * 
     * @param {LinkElement} link element
     */
    applyFinishDragging(link) {
        link.blueprint.dataset.creatingLink = false
        link.classList.remove("ueb-link-dragging")
    }

    /**
     * Applies the style relative to the source pin location.
     * @param {LinkElement} link element
     */
    applySourceLocation(link) {
        link.style.setProperty("--ueb-from-input", link.originatesFromInput ? "0" : "1")
        link.style.setProperty("--ueb-from-x", sanitizeText(link.sourceLocation[0]))
        link.style.setProperty("--ueb-from-y", sanitizeText(link.sourceLocation[1]))
    }

    /**
     * Applies the style relative to the destination pin location.
     * @param {LinkElement} link Link element
     */
    applyFullLocation(link) {
        const dx = Math.max(Math.abs(link.sourceLocation[0] - link.destinationLocation[0]), 1)
        const width = Math.max(dx, Configuration.linkMinWidth)
        const height = Math.max(Math.abs(link.sourceLocation[1] - link.destinationLocation[1]), 1)
        const fillRatio = dx / width
        const aspectRatio = width / height
        const xInverted = link.originatesFromInput
            ? link.sourceLocation[0] < link.destinationLocation[0]
            : link.destinationLocation[0] < link.sourceLocation[0]
        let start = dx < width // If under minimum width
            ? (width - dx) / 2 // Start from half the empty space
            : 0 // Otherwise start from the beginning
        {
            link.style.setProperty("--ueb-from-x", sanitizeText(link.sourceLocation[0]))
            link.style.setProperty("--ueb-from-y", sanitizeText(link.sourceLocation[1]))
            link.style.setProperty("--ueb-to-x", sanitizeText(link.destinationLocation[0]))
            link.style.setProperty("--ueb-to-y", sanitizeText(link.destinationLocation[1]))
            link.style.setProperty("margin-left", `-${start}px`)
        }
        if (xInverted) {
            start += fillRatio * 100
        }
        link.style.setProperty("--ueb-start-percentage", `${100 - start}%`)
        const c1 = start + 15 * fillRatio
        let c2 = Math.max(40 / aspectRatio, 30) + start
        const c2Decreasing = -0.06
        const getMaxC2 = (m, p) => {
            const a = -m * p[0] * p[0]
            const q = p[1] - a / p[0]
            return x => a / x + q
        }
        const controlPointC2 = [500, 140]
        c2 = Math.min(c2, getMaxC2(c2Decreasing, controlPointC2)(width))
        const d = Configuration.linkRightSVGPath(start, c1, c2)
        // TODO move to CSS when Firefox will support property d
        link.pathElement.setAttribute("d", d)
    }

    /**
     * 
     * @param {LinkElement} link element
     * @param {LinkMessageElement} linkMessage 
     */
    applyLinkMessage(link, linkMessage) {
        link.querySelectorAll(linkMessage.constructor.tagName).forEach(element => element.remove())
        link.appendChild(linkMessage)
        link.linkMessageElement = linkMessage
    }
}
