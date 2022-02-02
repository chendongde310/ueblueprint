import GraphNode from "../../graph/GraphNode"
import ObjectSerializer from "../../serialization/ObjectSerializer"
import Context from "../Context"

export default class Paste extends Context {

    constructor(target, blueprint, options = {}) {
        options.wantsFocusCallback = true
        super(target, blueprint, options)
        this.serializer = new ObjectSerializer()
        let self = this
        this.pasteHandle = e => self.pasted(e.clipboardData.getData("Text"))
    }

    blueprintFocused() {
        document.body.addEventListener("paste", this.pasteHandle)
    }

    blueprintUnfocused() {
        document.body.removeEventListener("paste", this.pasteHandle)
    }

    pasted(value) {
        let top = 0
        let left = 0
        let count = 0
        let nodes = this.serializer.readMultiple(value).map(entity => {
            let node = new GraphNode(entity)
            top += node.location[1]
            left += node.location[0]
            ++count
            return node
        })
        top /= count
        left /= count
        if (nodes.length > 0) {
            this.blueprint.unselectAll()
        }
        let mousePosition = this.blueprint.entity.mousePosition
        this.blueprint.addGraphElement(...nodes)
        nodes.forEach(node => {
            const locationOffset = [
                mousePosition[0] - left,
                mousePosition[1] - top,
            ]
            node.addLocation(this.blueprint.compensateTranslation(locationOffset))
            node.setSelected(true)
            node.snapToGrid()
        })
        return true
    }
}