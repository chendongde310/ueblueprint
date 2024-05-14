import Configuration from "../Configuration.js"
import Grammar from "./Grammar.js"
import ObjectEntity from "../entity/ObjectEntity.js"
import PinEntity from "../entity/PinEntity.js"
import Serializer from "./Serializer.js"
import SerializerFactory from "./SerializerFactory.js"

/** @extends Serializer<ObjectEntityConstructor> */
export default class ObjectSerializer extends Serializer {

    constructor(entityType = ObjectEntity) {
        super(entityType, undefined, "\n", true, undefined, Serializer.same)
    }

    showProperty(entity, key) {
        switch (key) {
            case "Class":
            case "Name":
            case "Archetype":
            case "ExportPath":
            case "CustomProperties":
                // Serielized separately, check doWrite()
                return false
        }
        return super.showProperty(entity, key)
    }

    /** @param {ObjectEntity} value */
    write(value, insideString = false) {
        return this.doWrite(value, insideString) + "\n"
    }

    /** @param {String} value */
    doRead(value) {

        return Grammar.grammarFor(undefined, this.entityType).parse(value)
    }

    /**
     * @param {String} value
     * @returns {ObjectEntity[]}
     */
    readMultiple(value) {
        return ObjectEntity.getMultipleObjectsGrammar().parse(this.addUntPrefix(value))
    }

    /**
     * @param {ObjectEntity} entity
     * @param {Boolean} insideString
     * @param indentation
     * @param wrap
     * @param attributeSeparator
     * @param trailingSeparator
     * @param attributeValueConjunctionSign
     * @param attributeKeyPrinter
     * @returns {String}
     */
    doWrite(
        entity,
        insideString,
        indentation = "",
        wrap = this.wrap,
        attributeSeparator = this.attributeSeparator,
        trailingSeparator = this.trailingSeparator,
        attributeValueConjunctionSign = this.attributeValueConjunctionSign,
        attributeKeyPrinter = this.attributeKeyPrinter,
    ) {
        const moreIndentation = indentation + Configuration.indentation
        if (!(entity instanceof ObjectEntity)) {
            return super.doWrite(
                entity,
                insideString,
                indentation,
                wrap,
                attributeSeparator,
                trailingSeparator,
                attributeValueConjunctionSign,
                // @ts-expect-error
                key => entity[key] instanceof ObjectEntity ? "" : attributeKeyPrinter(key)
            )
        }
        let result = indentation + "Begin Object"
            + (entity.Class?.type || entity.Class?.path ? ` Class=${this.doWriteValue(entity.Class, insideString)}` : "")
            + (entity.Name ? ` Name=${this.doWriteValue(entity.Name, insideString)}` : "")
            + (entity.Archetype ? ` Archetype=${this.doWriteValue(entity.Archetype, insideString)}` : "")
            + (entity.ExportPath?.type || entity.ExportPath?.path ? ` ExportPath=${this.doWriteValue(entity.ExportPath, insideString)}` : "")
            + "\n"
            + super.doWrite(
                entity,
                insideString,
                moreIndentation,
                wrap,
                attributeSeparator,
                true,
                attributeValueConjunctionSign,
                key => entity[key] instanceof ObjectEntity ? "" : attributeKeyPrinter(key)
            )
            + entity.getCustomproperties().map(pin =>
                moreIndentation
                + attributeKeyPrinter("CustomProperties ")
                + SerializerFactory.getSerializer(PinEntity).doWrite(pin, insideString)
                + this.attributeSeparator
            )
                .join("")
            + indentation + "End Object"
        return this.removeUntPrefix(result)
    }


    escapeRegExp(string) {
        // 转义正则表达式中的特殊字符
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& 表示整个被匹配的字符串
    }


    addUntPrefix(value) {
        const rules = [
            "R=True",
            "G=True",
            "B=True",
            "A=(Expression=",
            "B=(Expression=",
        ];
        let result = value;
        rules.forEach(rule => {
            // 构建一个动态的正则表达式来匹配规则字符串
            const pattern = new RegExp(this.escapeRegExp(rule), 'g');
            // 替换匹配到的字符串，在前面添加_UNT_
            result = result.replace(pattern, `_UNT_${rule}`);
        });

        //移除整行前缀 LocalVariables
        result =  this.removeLinesContainingSpecifiedTexts(result)
        result =  this.removeUnrecognizedContent(result)
        //移除无法识别的无用的内容      ",LinkedTo=()"
        result = result.replace(/NaN/g, '0')


        return result;
    }


    removeUntPrefix(value) {
        // 直接替换所有_UNT_为""，即删除它们
        return value.replace(/_UNT_/g, '');
    }


    removeLinesContainingSpecifiedTexts(text) {
        const textsToRemove = ["LocalVariables(","Children(","CustomProperties UserDefinedPin (","CustomProperties  ("];
        const lines = text.split('\n');  // 将文本拆分为行
        const filteredLines = lines.filter(line =>
            !textsToRemove.some(textToRemove => line.includes(textToRemove))
        );  // 保留不包含任何指定文本的行
        return filteredLines.join('\n');
    }


      removeUnrecognizedContent(text) {
          // 定义要移除的模式
          const patterns = [
              ',LinkedTo=\\(\\)',  // 匹配 ",LinkedTo=()"
              // 在此添加更多模式
          ];

        let result = text;
        patterns.forEach(pattern => {
            // 使用正则表达式创建一个全局搜索模式
            const regex = new RegExp(pattern, 'g');
            result = result.replace(regex, '');  // 移除匹配的内容
        });
        return result;
    }



}
