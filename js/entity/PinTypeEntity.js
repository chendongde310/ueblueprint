import FunctionReferenceEntity from "./FunctionReferenceEntity.js"
import IEntity from "./IEntity.js"
import ObjectReferenceEntity from "./ObjectReferenceEntity.js"
import PathSymbolEntity from "./PathSymbolEntity.js"

export default class PinTypeEntity extends IEntity {

    static attributes = {
        PinCategory: {
            default: "",
        },
        PinSubCategory: {
            default: "",
        },
        PinSubCategoryObject: {
            type: ObjectReferenceEntity,
        },
        PinSubCategoryMemberReference: {
            type: FunctionReferenceEntity,
            default: null,
        },
        PinValueType: {
            type: PinTypeEntity,
            default: null,
        },
        ContainerType: {
            type: PathSymbolEntity,
        },
        bIsReference: {
            default: false,
        },
        bIsConst: {
            default: false,
        },
        bIsWeakPointer: {
            default: false,
        },
        bIsUObjectWrapper: {
            default: false,
        },
        bSerializeAsSinglePrecisionFloat: {
            default: false,
        },
    }

    static {
        this.cleanupAttributes(this.attributes)
    }

    constructor(values = {}, suppressWarns = false) {
        super(values, suppressWarns)
        /** @type {String} */ this.PinCategory
        /** @type {String} */ this.PinSubCategory
        /** @type {ObjectReferenceEntity} */ this.PinSubCategoryObject
        /** @type {FunctionReferenceEntity} */ this.PinSubCategoryMemberReference
        /** @type {PinTypeEntity} */ this.PinValueType
        /** @type {PathSymbolEntity} */ this.ContainerType
        /** @type {Boolean} */ this.bIsReference
        /** @type {Boolean} */ this.bIsConst
        /** @type {Boolean} */ this.bIsWeakPointer
        /** @type {Boolean} */ this.bIsUObjectWrapper
        /** @type {Boolean} */ this.bIsUObjectWrapper
        /** @type {Boolean} */ this.bSerializeAsSinglePrecisionFloat
    }

    /** @param {PinTypeEntity} other */
    copyTypeFrom(other) {
        this.PinCategory = other.PinCategory
        this.PinSubCategory = other.PinSubCategory
        this.PinSubCategoryObject = other.PinSubCategoryObject
        this.PinSubCategoryMemberReference = other.PinSubCategoryMemberReference
        this.PinValueType = other.PinValueType
        this.ContainerType = other.ContainerType
        this.bIsReference = other.bIsReference
        this.bIsConst = other.bIsConst
        this.bIsWeakPointer = other.bIsWeakPointer
        this.bIsUObjectWrapper = other.bIsUObjectWrapper
        this.bSerializeAsSinglePrecisionFloat = other.bSerializeAsSinglePrecisionFloat
    }
}
