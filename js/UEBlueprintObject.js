import SelectableDraggable from "./SelectableDraggable"
import NodeTemplate from "./template/NodeTemplate"

export default class UEBlueprintObject extends SelectableDraggable {

    constructor() {
        super(new NodeTemplate())
        this.graphNodeName = 'N/A'
        this.inputs = []
        this.outputs = []
    }

    connectedCallback() {
        super.connectedCallback()
        this.classList.add('ueb-node')
        if (this.selected) {
            this.classList.add('ueb-selected')
        }
        this.style.setProperty('--ueb-position-x', this.location[0])
        this.style.setProperty('--ueb-position-y', this.location[1])
    }
}

customElements.define('u-object', UEBlueprintObject)
