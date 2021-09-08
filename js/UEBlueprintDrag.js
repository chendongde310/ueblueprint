export default class UEBlueprintDrag {
    constructor(blueprintNode, options) {
        this.blueprintNode = blueprintNode;
        this.mousePosition = [0, 0];
        this.stepSize = options?.stepSize
        this.clickButton = options?.clickButton ?? 0
        this.exitDragAnyButton = options?.exitDragAnyButton ?? true
        let self = this;
        this.mouseDownHandler = function (e) {
            switch (e.button) {
                case self.clickButton:
                    self.clicked(e.clientX, e.clientY)
                    break;
                default:
                    if (!self.exitDragAnyButton) {
                        self.mouseUpHandler(e)
                    }
                    break;
            }
        };
        this.mouseMoveHandler = function (e) {
            let mousePosition = self.snapToGrid(e.clientX, e.clientY)
            const d = [mousePosition[0] - self.mousePosition[0], mousePosition[1] - self.mousePosition[1]]

            if (d[0] == 0 && d[1] == 0) {
                return;
            }

            self.blueprintNode.addLocation(d)

            // Reassign the position of mouse
            self.mousePosition = mousePosition
        };
        this.mouseUpHandler = function (e) {
            if (!self.exitDragAnyButton || e.button == self.clickButton) {
                // Remove the handlers of `mousemove` and `mouseup`
                document.removeEventListener('mousemove', self.mouseMoveHandler)
                document.removeEventListener('mouseup', self.mouseUpHandler)
            }
        };
        this.blueprintNode.addEventListener('mousedown', this.mouseDownHandler)
        this.blueprintNode.addEventListener('contextmenu', e => e.preventDefault())
    }

    unlistenDOMElement() {
        this.blueprintNode.removeEventListener('mousedown', this.mouseDownHandler)
    }

    snapToGrid(posX, posY) {
        return [
            this.stepSize * Math.round(posX / this.stepSize),
            this.stepSize * Math.round(posY / this.stepSize)
        ]
    }

    clicked(x, y) {
        if (!this.stepSize) {
            this.stepSize = parseInt(getComputedStyle(this.blueprintNode).getPropertyValue('--ueb-grid-snap'))
        }
        // Get the current mouse position
        this.mousePosition = this.snapToGrid(x, y)
        // Attach the listeners to `document`
        document.addEventListener('mousemove', this.mouseMoveHandler)
        document.addEventListener('mouseup', this.mouseUpHandler)
    }
}