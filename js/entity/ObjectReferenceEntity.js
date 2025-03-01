import P from "parsernostrum"
import Utility from "../Utility.js"
import Grammar from "../serialization/Grammar.js"
import IEntity from "./IEntity.js"

export default class ObjectReferenceEntity extends IEntity {

    /** @protected */
    static _quotedParser = P.regArray(new RegExp(
        `'"(${Grammar.Regex.InsideString.source})"'`
        + "|"
        + `'(${Grammar.Regex.InsideSingleQuotedString.source})'`
    )).map(([_0, a, b]) => a ?? b)
    static typeReference = P.reg(
        // @ts-expect-error
        new RegExp(Grammar.Regex.Path.source + "|" + Grammar.symbol.getParser().regexp.source)
    )
    static fullReferenceGrammar = this.createFullReferenceGrammar()
    static grammar = this.createGrammar()

    #type
    get type() {
        return this.#type
    }
    set type(value) {
        this.#type = value
    }

    #path
    get path() {
        return this.#path
    }
    set path(value) {
        this.#path = value
    }

    #fullEscaped
    /** @type {String} */
    #full
    get full() {
        return this.#full
    }
    set full(value) {
        this.#full = value
    }


    constructor(type = "None", path = "", full = null) {
        super()
        this.#type = type
        this.#path = path
        this.#full = full ?? (
            this.type.includes("/") || this.path
                ? `"${this.type + (this.path ? (`'${this.path}'`) : "")}"`
                : this.type
        )
    }

    /** @returns {P<ObjectReferenceEntity>} */
    static createGrammar() {
        return P.alt(
            this.createFullReferenceSerializedGrammar(),
            this.createFullReferenceGrammar(),
            this.createTypeReferenceGrammar(),
        ).label("ObjectReferenceEntity")
    }

    /** @returns {P<ObjectReferenceEntity>} */
    static createFullReferenceGrammar() {
        return P.regArray(
            new RegExp(
                // @ts-expect-error
                "(" + this.typeReference.getParser().regexp.source + ")"
                // @ts-expect-error
                + "(?:" + this._quotedParser.getParser().parser.regexp.source + ")"
            )
        ).map(([full, type, ...path]) => new this(type, path.find(v => v), full))
    }

    /** @returns {P<ObjectReferenceEntity>} */
    static createFullReferenceSerializedGrammar() {
        return P.regArray(
            new RegExp(
                '"(' + Grammar.Regex.InsideString.source + "?)"
                + "(?:'(" + Grammar.Regex.InsideSingleQuotedString.source + `?)')?"`
            )
        ).map(([full, type, path]) => new this(type, path, full))
    }

    /** @returns {P<ObjectReferenceEntity>} */
    static createTypeReferenceGrammar() {
        return this.typeReference.map(v => new this(v, "", v))
    }

    static createNoneInstance() {
        return new ObjectReferenceEntity("None", "", "None")
    }

    getName(dropCounter = false) {
        return Utility.getNameFromPath(this.path.replace(/_C$/, ""), dropCounter)
    }

    doSerialize(insideString = false) {
        if (insideString) {
            if (this.#fullEscaped === undefined) {
                this.#fullEscaped = Utility.escapeString(this.#full, false)
            }
            return this.#fullEscaped
        }
        return this.full
    }

    /** @param {IEntity} other */
    equals(other) {
        if (!(other instanceof ObjectReferenceEntity)) {
            return false
        }
        return this.type == other.type && this.path == other.path
    }
}
