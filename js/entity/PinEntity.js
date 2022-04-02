// @ts-check

import GuidEntity from "./GuidEntity"
import IEntity from "./IEntity"
import LocalizedTextEntity from "./LocalizedTextEntity"
import ObjectReferenceEntity from "./ObjectReferenceEntity"
import PinReferenceEntity from "./PinReferenceEntity"
import TypeInitialization from "./TypeInitialization"

export default class PinEntity extends IEntity {

    static lookbehind = "Pin"
    static attributes = {
        PinId: GuidEntity,
        PinName: "",
        PinFriendlyName: new TypeInitialization(LocalizedTextEntity, false, null),
        PinToolTip: "",
        Direction: new TypeInitialization(String, false, ""),
        PinType: {
            PinCategory: "",
            PinSubCategory: "",
            PinSubCategoryObject: ObjectReferenceEntity,
            PinSubCategoryMemberReference: null,
            PinValueType: null,
            ContainerType: ObjectReferenceEntity,
            bIsReference: false,
            bIsConst: false,
            bIsWeakPointer: false,
            bIsUObjectWrapper: false,
        },
        LinkedTo: [PinReferenceEntity],
        DefaultValue: "",
        AutogeneratedDefaultValue: "",
        DefaultObject: new TypeInitialization(ObjectReferenceEntity, false, null),
        PersistentGuid: GuidEntity,
        bHidden: false,
        bNotConnectable: false,
        bDefaultValueIsReadOnly: false,
        bDefaultValueIsIgnored: false,
        bAdvancedView: false,
        bOrphanedPin: false,
    }

    constructor(options = {}) {
        super(options)
        /** @type {GuidEntity} */ this.PinId
        /** @type {String} */ this.PinName
        /** @type {LocalizedTextEntity} */ this.PinFriendlyName
        /** @type {String} */ this.PinToolTip
        /** @type {String} */ this.Direction
        /**
         * @type {{
         *     PinCategory: String,
         *     PinSubCategory: String,
         *     PinSubCategoryObject: ObjectReferenceEntity,
         *     PinSubCategoryMemberReference: any,
         *     PinValueType: String,
         *     ContainerType: ObjectReferenceEntity,
         *     bIsReference: Boolean,
         *     bIsConst: Boolean,
         *     bIsWeakPointer: Boolean,
         *     bIsUObjectWrapper: Boolean,
         * }}
         */ this.PinType
        /** @type {PinReferenceEntity[]} */ this.LinkedTo
        /** @type {String} */ this.DefaultValue
        /** @type {String} */ this.AutogeneratedDefaultValue
        /** @type {ObjectReferenceEntity} */ this.DefaultObject
        /** @type {GuidEntity} */ this.PersistentGuid
        /** @type {Boolean} */ this.bHidden
        /** @type {Boolean} */ this.bNotConnectable
        /** @type {Boolean} */ this.bDefaultValueIsReadOnly
        /** @type {Boolean} */ this.bDefaultValueIsIgnored
        /** @type {Boolean} */ this.bAdvancedView
        /** @type {Boolean} */ this.bOrphanedPin
    }

    isInput() {
        return !this.bHidden && this.Direction !== "EGPD_Output"
    }

    isOutput() {
        return !this.bHidden && this.Direction === "EGPD_Output"
    }

    /**
     * 
     * @returns {Boolean}
     */
    isLinked() {
        return this.LinkedTo?.length > 0 ?? false
    }

    /**
     * @param {String} targetObjectName
     * @param {PinEntity} targetPinEntity
     */
    linkTo(targetObjectName, targetPinEntity) {
        /** @type {PinReferenceEntity[]} */
        this.LinkedTo
        const linkFound = this.LinkedTo?.find(pinReferenceEntity => {
            // @ts-ignore
            return pinReferenceEntity.objectName == targetObjectName
                && pinReferenceEntity.pinGuid.valueOf() == targetPinEntity.PinId.valueOf()
        })
        if (!linkFound) {
            (this.LinkedTo ?? (this.LinkedTo = [])).push(new PinReferenceEntity({
                objectName: targetObjectName,
                pinGuid: targetPinEntity.PinId,
            }))
            return true
        }
        return false
    }

    /**
     * @param {String} targetObjectName
     * @param {PinEntity} targetPinEntity
     */
    unlinkFrom(targetObjectName, targetPinEntity) {
        /** @type {PinReferenceEntity[]} */
        this.LinkedTo
        const indexElement = this.LinkedTo.findIndex(pinReferenceEntity => {
            // @ts-expect-error
            return pinReferenceEntity.objectName == targetObjectName
                && pinReferenceEntity.pinGuid == targetPinEntity.PinId
        })
        if (indexElement >= 0) {
            if (this.LinkedTo.length == 1) {
                this.LinkedTo = undefined
            } else {
                this.LinkedTo.splice(indexElement, 1)
            }
            return true
        }
        return false
    }

    getType() {
        return this.PinType.PinCategory
    }
}
