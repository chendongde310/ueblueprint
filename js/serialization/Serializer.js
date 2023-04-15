import Grammar from "./Grammar.js"
import IEntity from "../entity/IEntity.js"
import SerializerFactory from "./SerializerFactory.js"
import Utility from "../Utility.js"

/**
 * @typedef {import("../entity/IEntity.js").EntityConstructor} EntityConstructor
 * @typedef {import("../entity/IEntity.js").AnyValue} AnyValue
 * @typedef {import("../entity/IEntity.js").AnyValueConstructor<*>} AnyValueConstructor
 */

/** @template {AnyValue} T */
export default class Serializer {

    /** @type {(v: String) => String} */
    static same = v => v

    /** @type {(entity: AnyValue, serialized: String) => String} */
    static notWrapped = (entity, serialized) => serialized

    /** @type {(entity: AnyValue, serialized: String) => String} */
    static bracketsWrapped = (entity, serialized) => `(${serialized})`

    /** @param {AnyValueConstructor} entityType */
    constructor(
        entityType,
        /** @type {(entity: T, serialized: String) => String} */
        wrap = (entity, serialized) => serialized,
        attributeSeparator = ",",
        trailingSeparator = false,
        attributeValueConjunctionSign = "=",
        attributeKeyPrinter = Serializer.same
    ) {
        this.entityType = entityType
        this.wrap = wrap
        this.attributeSeparator = attributeSeparator
        this.trailingSeparator = trailingSeparator
        this.attributeValueConjunctionSign = attributeValueConjunctionSign
        this.attributeKeyPrinter = attributeKeyPrinter
    }

    /**
     * @param {String} value
     * @returns {T}
     */
    read(value) {
        return this.doRead(value)
    }

    /** @param {T} value */
    write(value, insideString = false) {
        return this.doWrite(value, insideString)
    }

    /**
     * @param {String} value
     * @returns {T}
     */
    doRead(value) {
        let grammar = Grammar.grammarFor(undefined, this.entityType)
        const parseResult = grammar.parse(value)
        if (!parseResult.status) {
            throw new Error(`Error when trying to parse the entity ${this.entityType.prototype.constructor.name}.`)
        }
        return parseResult.value
    }

    /**
     * @param {T & IEntity} entity
     * @param {Boolean} insideString
     * @returns {String}
     */
    doWrite(
        entity,
        insideString = false,
        indentation = "",
        wrap = this.wrap,
        attributeSeparator = this.attributeSeparator,
        trailingSeparator = this.trailingSeparator,
        attributeValueConjunctionSign = this.attributeValueConjunctionSign,
        attributeKeyPrinter = this.attributeKeyPrinter
    ) {
        let result = ""
        const attributes = IEntity.getAttributes(entity)
        const keys = Utility.mergeArrays(
            Object.keys(attributes),
            Object.keys(entity)
        )
        let first = true
        for (const key of keys) {
            const value = entity[key]
            if (value !== undefined && this.showProperty(entity, key)) {
                const keyValue = entity instanceof Array ? `(${key})` : key
                const isSerialized = Utility.isSerialized(entity, key)
                if (first) {
                    first = false
                } else {
                    result += attributeSeparator
                }
                if (attributes[key]?.inlined) {
                    result += this.doWrite(
                        value,
                        insideString,
                        indentation,
                        Serializer.notWrapped,
                        attributeSeparator,
                        false,
                        attributeValueConjunctionSign,
                        attributes[key].type instanceof Array
                            ? k => attributeKeyPrinter(`${keyValue}${k}`)
                            : k => attributeKeyPrinter(`${keyValue}.${k}`)
                    )
                    continue
                }
                const keyPrinted = attributeKeyPrinter(keyValue)
                const indentationPrinted = attributeSeparator.includes("\n") ? indentation : ""
                result += (
                    keyPrinted.length
                        ? (indentationPrinted + keyPrinted + this.attributeValueConjunctionSign)
                        : ""
                )
                    + (
                        isSerialized
                            ? `"${this.doWriteValue(value, true, indentation)}"`
                            : this.doWriteValue(value, insideString, indentation)
                    )
            }
        }
        if (trailingSeparator && result.length) {
            // append separator at the end if asked and there was printed content
            result += attributeSeparator
        }
        return wrap(entity, result)
    }

    /** @param {Boolean} insideString */
    doWriteValue(value, insideString, indentation = "") {
        const type = Utility.getType(value)
        // @ts-expect-error
        const serializer = SerializerFactory.getSerializer(type)
        if (!serializer) {
            throw new Error(
                `Unknown value type "${type.name}", a serializer must be registered in the SerializerFactory class, `
                + "check initializeSerializerFactory.js"
            )
        }
        return serializer.doWrite(value, insideString, indentation)
    }

    showProperty(entity, key) {
        const attributes = /** @type {EntityConstructor} */(this.entityType).attributes
        const attribute = attributes[key]
        const value = entity[key]
        if (attribute?.constructor === Object) {
            if (attribute.ignored) {
                return false
            }
            return !Utility.equals(attribute.default, value) || attribute.showDefault
        }
        return true
    }
}