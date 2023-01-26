import { css } from "lit"
import SVGIcon from "./SVGIcon"
import Utility from "./Utility"

/**
 * @typedef {import("./element/NodeElement").default} NodeElement
 * @typedef {import("./element/PinElement").default} PinElement
 * @typedef {import("lit").CSSResult} CSSResult
 */

export default class Configuration {
    static #pinColor = {
        "/Script/CoreUObject.Rotator": css`157, 177, 251`,
        "/Script/CoreUObject.Transform": css`227, 103, 0`,
        "/Script/CoreUObject.Vector": css`251, 198, 34`,
        "bool": css`147, 0, 0`,
        "byte": css`0, 109, 99`,
        "class": css`88, 0, 186`,
        "default": css`255, 255, 255`,
        "delegate": css`255, 56, 56`,
        "enum": css`0, 109, 99`,
        "exec": css`240, 240, 240`,
        "int": css`31, 224, 172`,
        "int64": css`169, 223, 172`,
        "interface": css`238, 252, 168`,
        "name": css`201, 128, 251`,
        "object": css`0, 167, 240`,
        "real": css`54, 208, 0`,
        "string": css`251, 0, 209`,
        "struct": css`0, 88, 201`,
        "text": css`226, 121, 167`,
        "wildcard": css`128, 120, 120`,
    }
    static nodeColors = {
        blue: css`84, 122, 156`,
        gray: css`150,150,150`,
        green: css`95, 129, 90`,
        red: css`151, 33, 32`,
        turquoise: css`46, 104, 106`,
    }
    static #keyName = {
        "A_AccentGrave": "à",
        "E_AccentGrave": "è",
        "E_AccentAigu": "é",
        "Add": "Num +",
        "Decimal": "Num .",
        "Divide": "Num /",
        "Multiply": "Num *",
        "Subtract": "Num -",
        "Section": "§",
        "C_Cedille": "ç",
    }
    static alphaPattern = "repeating-conic-gradient(#7c8184 0% 25%, #c2c3c4 0% 50%) 50% / 10px 10px"
    static colorDragEventName = "ueb-color-drag"
    static colorPickEventName = "ueb-color-pick"
    static colorWindowEventName = "ueb-color-window"
    static defaultCommentHeight = 96
    static defaultCommentWidth = 400
    static deleteNodesKeyboardKey = "Delete"
    static distanceThreshold = 5 // px
    static dragEventName = "ueb-drag"
    static dragGeneralEventName = "ueb-drag-general"
    static editTextEventName = {
        begin: "ueb-edit-text-begin",
        end: "ueb-edit-text-end",
    }
    static enableZoomIn = ["LeftControl", "RightControl"] // Button to enable more than 0 (1:1) zoom
    static expandGridSize = 400
    static focusEventName = {
        begin: "blueprint-focus",
        end: "blueprint-unfocus",
    }
    static fontSize = css`12.5px`
    static gridAxisLineColor = css`black`
    static gridExpandThreshold = 0.25 // remaining size factor threshold to cause an expansion event
    static gridLineColor = css`#353535`
    static gridLineWidth = 1 // px
    static gridSet = 8
    static gridSetLineColor = css`#161616`
    static gridShrinkThreshold = 4 // exceding size factor threshold to cause a shrink event
    static gridSize = 16 // px
    static hexColorRegex = /^\s*#(?<r>[0-9a-fA-F]{2})(?<g>[0-9a-fA-F]{2})(?<b>[0-9a-fA-F]{2})([0-9a-fA-F]{2})?|#(?<rs>[0-9a-fA-F])(?<gs>[0-9a-fA-F])(?<bs>[0-9a-fA-F])\s*$/
    /** @param {String} value */
    static keyName(value) {
        let result = Configuration.#keyName[value]
        if (result) {
            return result
        }
        result = Utility.numberFromText(value)?.toString()
        if (result) {
            return result
        }
        const match = value.match(/NumPad([a-zA-Z]+)/)
        if (match) {
            result = Utility.numberFromText(match[1])
            if (result) {
                return "Num " + result
            }
        }
    }
    /** @param {NodeElement} node */
    static hidAttribute(node) {
        return node.entity.InputKey ?? node.entity.AxisKey ?? node.entity.InputAxisKey
    }
    static keysSeparator = "+"
    static linkCurveHeight = 15 // px
    static linkCurveWidth = 80 // px
    static linkMinWidth = 100 // px
    /**
     * @param {Number} start
     * @param {Number} c1
     * @param {Number} c2
     */
    static linkRightSVGPath = (start, c1, c2) => {
        let end = 100 - start
        return `M ${start} 0 C ${c1} 0, ${c2} 0, 50 50 S ${end - c1 + start} 100, ${end} 100`
    }
    static maxZoom = 7
    static minZoom = -12
    static mouseWheelFactor = 0.2
    static nodeDragGeneralEventName = "ueb-node-drag-general"
    static nodeDragEventName = "ueb-node-drag"
    /** @param {NodeElement} node */
    static nodeIcon(node) {
        switch (node.getType()) {
            case Configuration.nodeType.doN: return SVGIcon.doN
            case Configuration.nodeType.dynamicCast: return SVGIcon.cast
            case Configuration.nodeType.event:
            case Configuration.nodeType.customEvent:
                return SVGIcon.event
            case Configuration.nodeType.executionSequence: return SVGIcon.sequence
            case Configuration.nodeType.forEachElementInEnum: return SVGIcon.loop
            case Configuration.nodeType.forEachLoop: return SVGIcon.forEachLoop
            case Configuration.nodeType.forEachLoopWithBreak: return SVGIcon.forEachLoop
            case Configuration.nodeType.forLoop: return SVGIcon.loop
            case Configuration.nodeType.forLoopWithBreak: return SVGIcon.loop
            case Configuration.nodeType.ifThenElse: return SVGIcon.branchNode
            case Configuration.nodeType.makeArray: return SVGIcon.makeArray
            case Configuration.nodeType.makeMap: return SVGIcon.makeMap
            case Configuration.nodeType.makeSet: return SVGIcon.makeSet
            case Configuration.nodeType.select: return SVGIcon.select
            case Configuration.nodeType.whileLoop: return SVGIcon.loop
        }
        if (node.getNodeDisplayName().startsWith("Break")) {
            return SVGIcon.breakStruct
        }
        if (node.entity.getClass() === Configuration.nodeType.macro) {
            return SVGIcon.macro
        }
        const hidValue = Configuration.hidAttribute(node)
        if (hidValue) {
            if (hidValue.toString().includes("Mouse")) {
                return SVGIcon.mouse
            } else {
                return SVGIcon.keyboard
            }
        }
        return SVGIcon.functionSymbol
    }
    /** @param {NodeElement} node */
    static nodeColor(node) {
        switch (node.entity.getClass()) {
            case Configuration.nodeType.callFunction:
                return node.entity.bIsPureFunc
                    ? Configuration.nodeColors.green
                    : Configuration.nodeColors.blue
            case Configuration.nodeType.event:
            case Configuration.nodeType.customEvent:
            case Configuration.nodeType.inputKey:
            case Configuration.nodeType.inputAxisKeyEvent:
            case Configuration.nodeType.inputDebugKey:
                return Configuration.nodeColors.red
            case Configuration.nodeType.makeArray:
            case Configuration.nodeType.makeMap:
            case Configuration.nodeType.select:
                return Configuration.nodeColors.green
            case Configuration.nodeType.executionSequence:
            case Configuration.nodeType.ifThenElse:
            case Configuration.nodeType.macro:
                return Configuration.nodeColors.gray
            case Configuration.nodeType.dynamicCast:
                return Configuration.nodeColors.turquoise
        }
        if (node.entity.bIsPureFunc) {
            return Configuration.nodeColors.green
        }
        if (node.isEvent()) {
            return Configuration.nodeColors.red
        }
        return Configuration.nodeColors.blue
    }
    static nodeName = (name, counter) => `${name}_${counter}`
    /** @param {NodeElement} node */
    static nodeDisplayName(node) {
        switch (node.getType()) {
            case Configuration.nodeType.callFunction:
            case Configuration.nodeType.commutativeAssociativeBinaryOperator:
                let memberName = node.entity.FunctionReference.MemberName ?? ""
                const memberParent = node.entity.FunctionReference.MemberParent?.path ?? ""
                if (memberName === "AddKey") {
                    const sequencerScriptingNameRegex = /\/Script\/SequencerScripting\.MovieSceneScripting(.+)Channel/
                    let result = memberParent.match(sequencerScriptingNameRegex)
                    if (result) {
                        return `Add Key (${Utility.formatStringName(result[1])})`
                    }
                }
                if (memberParent == "/Script/Engine.KismetMathLibrary") {
                    if (memberName.startsWith("Conv_")) {
                        return "" // Conversion  nodes do not have visible names
                    }
                    if (memberName.startsWith("Percent_")) {
                        return "%"
                    }
                    const leadingLetter = memberName.match(/[BF]([A-Z]\w+)/)
                    if (leadingLetter) {
                        // Some functions start with B or F (Like FCeil, FMax, BMin)
                        memberName = leadingLetter[1]
                    }
                    switch (memberName) {
                        case "Abs": return "ABS"
                        case "Exp": return "e"
                        case "Max": return "MAX"
                        case "MaxInt64": return "MAX"
                        case "Min": return "MIN"
                        case "MinInt64": return "MIN"
                    }
                }
                if (memberParent === "/Script/Engine.BlueprintSetLibrary") {
                    const setOperationMatch = memberName.match(/Set_(\w+)/)
                    if (setOperationMatch) {
                        return Utility.formatStringName(setOperationMatch[1]).toUpperCase()
                    }
                }
                if (memberParent === "/Script/Engine.BlueprintMapLibrary") {
                    const setOperationMatch = memberName.match(/Map_(\w+)/)
                    if (setOperationMatch) {
                        return Utility.formatStringName(setOperationMatch[1]).toUpperCase()
                    }
                }
                return Utility.formatStringName(memberName)
            case Configuration.nodeType.dynamicCast:
                return `Cast To ${node.entity.TargetType.getName()}`
            case Configuration.nodeType.event:
                return `Event ${(node.entity.EventReference?.MemberName ?? "").replace(/^Receive/, "")}`
            case Configuration.nodeType.executionSequence:
                return "Sequence"
            case Configuration.nodeType.forEachElementInEnum:
                return `For Each ${node.entity.Enum.getName()}`
            case Configuration.nodeType.forEachLoopWithBreak:
                return "For Each Loop with Break"
            case Configuration.nodeType.ifThenElse:
                return "Branch"
            case Configuration.nodeType.variableGet:
                return ""
            case Configuration.nodeType.variableSet:
                return "SET"
        }
        const keyNameSymbol = Configuration.hidAttribute(node)
        if (keyNameSymbol) {
            const keyName = keyNameSymbol.toString()
            let title = Configuration.keyName(keyName) ?? Utility.formatStringName(keyName)
            if (node.entity.getClass() === Configuration.nodeType.inputDebugKey) {
                title = "Debug Key " + title
            }
            return title
        }
        if (node.entity.getClass() === Configuration.nodeType.macro) {
            return Utility.formatStringName(node.entity.MacroGraphReference.getMacroName())
        } else {
            return Utility.formatStringName(node.entity.getNameAndCounter()[0])
        }
    }
    static nodeRadius = 8 // px
    static nodeReflowEventName = "ueb-node-reflow"
    static nodeType = {
        callFunction: "/Script/BlueprintGraph.K2Node_CallFunction",
        comment: "/Script/UnrealEd.EdGraphNode_Comment",
        commutativeAssociativeBinaryOperator: "/Script/BlueprintGraph.K2Node_CommutativeAssociativeBinaryOperator",
        customEvent: "/Script/BlueprintGraph.K2Node_CustomEvent",
        doN: "/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:Do N",
        dynamicCast: "/Script/BlueprintGraph.K2Node_DynamicCast",
        enum: "/Script/CoreUObject.Enum",
        event: "/Script/BlueprintGraph.K2Node_Event",
        executionSequence: "/Script/BlueprintGraph.K2Node_ExecutionSequence",
        forEachElementInEnum: "/Script/BlueprintGraph.K2Node_ForEachElementInEnum",
        forEachLoop: "/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:ForEachLoop",
        forEachLoopWithBreak: "/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:ForEachLoopWithBreak",
        forLoop: "/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:ForLoop",
        forLoopWithBreak: "/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:ForLoopWithBreak",
        functionEntry: "/Script/BlueprintGraph.K2Node_FunctionEntry",
        getInputAxisKeyValue: "/Script/BlueprintGraph.K2Node_GetInputAxisKeyValue",
        ifThenElse: "/Script/BlueprintGraph.K2Node_IfThenElse",
        inputAxisKeyEvent: "/Script/BlueprintGraph.K2Node_InputAxisKeyEvent",
        inputDebugKey: "/Script/InputBlueprintNodes.K2Node_InputDebugKey",
        inputKey: "/Script/BlueprintGraph.K2Node_InputKey",
        knot: "/Script/BlueprintGraph.K2Node_Knot",
        macro: "/Script/BlueprintGraph.K2Node_MacroInstance",
        makeArray: "/Script/BlueprintGraph.K2Node_MakeArray",
        makeMap: "/Script/BlueprintGraph.K2Node_MakeMap",
        makeSet: "/Script/BlueprintGraph.K2Node_MakeSet",
        pawn: "/Script/Engine.Pawn",
        reverseForEachLoop: "/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:ReverseForEachLoop",
        select: "/Script/BlueprintGraph.K2Node_Select",
        userDefinedEnum: "/Script/Engine.UserDefinedEnum",
        variableGet: "/Script/BlueprintGraph.K2Node_VariableGet",
        variableSet: "/Script/BlueprintGraph.K2Node_VariableSet",
        whileLoop: "/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:WhileLoop",
    }
    /**
     * @param {PinElement} pin
     * @return {CSSResult}
     */
    static pinColor(pin) {
        return Configuration.#pinColor[pin.entity.getType()]
            ?? Configuration.#pinColor[pin.entity.PinType.PinCategory]
            ?? Configuration.#pinColor["default"]
    }
    static removeEventName = "ueb-element-delete"
    static scale = {
        [-12]: 0.133333,
        [-11]: 0.166666,
        [-10]: 0.2,
        [-9]: 0.233333,
        [-8]: 0.266666,
        [-7]: 0.3,
        [-6]: 0.333333,
        [-5]: 0.375,
        [-4]: 0.5,
        [-3]: 0.675,
        [-2]: 0.75,
        [-1]: 0.875,
        0: 1,
        1: 1.25,
        2: 1.375,
        3: 1.5,
        4: 1.675,
        5: 1.75,
        6: 1.875,
        7: 2,
    }
    static selectAllKeyboardKey = "(bCtrl=True,Key=A)"
    static smoothScrollTime = 1000 // ms
    static trackingMouseEventName = {
        begin: "ueb-tracking-mouse-begin",
        end: "ueb-tracking-mouse-end",
    }
    static windowApplyEventName = "ueb-window-apply"
    static windowCancelEventName = "ueb-window-cancel"
    static windowCloseEventName = "ueb-window-close"
    static ModifierKeys = [
        "Ctrl",
        "Shift",
        "Alt",
        "Meta",
    ]
    static Keys = {
        /* UE name: JS name */
        "Backspace": "Backspace",
        "Tab": "Tab",
        "LeftControl": "ControlLeft",
        "RightControl": "ControlRight",
        "LeftShift": "ShiftLeft",
        "RightShift": "ShiftRight",
        "LeftAlt": "AltLeft",
        "RightAlt": "AltRight",
        "Enter": "Enter",
        "Pause": "Pause",
        "CapsLock": "CapsLock",
        "Escape": "Escape",
        "Space": "Space",
        "PageUp": "PageUp",
        "PageDown": "PageDown",
        "End": "End",
        "Home": "Home",
        "ArrowLeft": "Left",
        "ArrowUp": "Up",
        "ArrowRight": "Right",
        "ArrowDown": "Down",
        "PrintScreen": "PrintScreen",
        "Insert": "Insert",
        "Delete": "Delete",
        "Zero": "Digit0",
        "One": "Digit1",
        "Two": "Digit2",
        "Three": "Digit3",
        "Four": "Digit4",
        "Five": "Digit5",
        "Six": "Digit6",
        "Seven": "Digit7",
        "Eight": "Digit8",
        "Nine": "Digit9",
        "A": "KeyA",
        "B": "KeyB",
        "C": "KeyC",
        "D": "KeyD",
        "E": "KeyE",
        "F": "KeyF",
        "G": "KeyG",
        "H": "KeyH",
        "I": "KeyI",
        "K": "KeyK",
        "L": "KeyL",
        "M": "KeyM",
        "N": "KeyN",
        "O": "KeyO",
        "P": "KeyP",
        "Q": "KeyQ",
        "R": "KeyR",
        "S": "KeyS",
        "T": "KeyT",
        "U": "KeyU",
        "V": "KeyV",
        "W": "KeyW",
        "X": "KeyX",
        "Y": "KeyY",
        "Z": "KeyZ",
        "NumPadZero": "Numpad0",
        "NumPadOne": "Numpad1",
        "NumPadTwo": "Numpad2",
        "NumPadThree": "Numpad3",
        "NumPadFour": "Numpad4",
        "NumPadFive": "Numpad5",
        "NumPadSix": "Numpad6",
        "NumPadSeven": "Numpad7",
        "NumPadEight": "Numpad8",
        "NumPadNine": "Numpad9",
        "Multiply": "NumpadMultiply",
        "Add": "NumpadAdd",
        "Subtract": "NumpadSubtract",
        "Decimal": "NumpadDecimal",
        "Divide": "NumpadDivide",
        "F1": "F1",
        "F2": "F2",
        "F3": "F3",
        "F4": "F4",
        "F5": "F5",
        "F6": "F6",
        "F7": "F7",
        "F8": "F8",
        "F9": "F9",
        "F10": "F10",
        "F11": "F11",
        "F12": "F12",
        "NumLock": "NumLock",
        "ScrollLock": "ScrollLock",
    }
}
