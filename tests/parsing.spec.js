import { expect, test } from "@playwright/test"
import Utility from "../js/Utility.js"
import FormatTextEntity from "../js/entity/FormatTextEntity.js"
import GuidEntity from "../js/entity/GuidEntity.js"
import IntegerEntity from "../js/entity/IntegerEntity.js"
import KeyBindingEntity from "../js/entity/KeyBindingEntity.js"
import LinearColorEntity from "../js/entity/LinearColorEntity.js"
import ObjectReferenceEntity from "../js/entity/ObjectReferenceEntity.js"
import PinEntity from "../js/entity/PinEntity.js"
import RotatorEntity from "../js/entity/RotatorEntity.js"
import SimpleSerializationRotatorEntity from "../js/entity/SimpleSerializationRotatorEntity.js"
import SimpleSerializationVector2DEntity from "../js/entity/SimpleSerializationVector2DEntity.js"
import SimpleSerializationVectorEntity from "../js/entity/SimpleSerializationVectorEntity.js"
import SymbolEntity from "../js/entity/SymbolEntity.js"
import UnknownKeysEntity from "../js/entity/UnknownKeysEntity.js"
import Vector2DEntity from "../js/entity/Vector2DEntity.js"
import VectorEntity from "../js/entity/VectorEntity.js"
import Grammar from "../js/serialization/Grammar.js"
import SerializerFactory from "../js/serialization/SerializerFactory.js"
import initializeSerializerFactory from "../js/serialization/initializeSerializerFactory.js"

test.beforeAll(() => initializeSerializerFactory())

test.describe.configure({ mode: "parallel" })

test("Array", () => {
    const serializer = SerializerFactory.getSerializer(Array)

    expect(serializer.read("()")).toStrictEqual([])
    expect(serializer.read("( )")).toStrictEqual([])
    expect(serializer.read("(1, 2, 3, 4, 5, 6)")).toStrictEqual([1, 2, 3, 4, 5, 6])
    expect(serializer.read(`(
        "alpha",
        "beta",
        123,
        3BEF2168446CAA32D5B54289FAB2F0BA,
        Some(a=1, b="2")
    )`)).toStrictEqual([
        "alpha",
        "beta",
        123,
        new GuidEntity("3BEF2168446CAA32D5B54289FAB2F0BA"),
        new UnknownKeysEntity({
            lookbehind: "Some",
            a: 1,
            b: "2",
        })
    ])
    expect(serializer.read(`(
        A(first = (9,8,7,6,5), second = 00000000000000000000000000000000),
        B(key="hello"),
    )`)).toStrictEqual([
        new UnknownKeysEntity({
            lookbehind: "A",
            first: [9, 8, 7, 6, 5],
            second: new GuidEntity("00000000000000000000000000000000"),
        }),
        new UnknownKeysEntity({
            lookbehind: "B",
            key: "hello",
        })
    ])

    // Nested
    expect(serializer.read("((1, 2), (3, 4))")).toStrictEqual([[1, 2], [3, 4]])
    expect(serializer.read('(((1, 2), (3, 4)), 5)')).toStrictEqual([[[1, 2], [3, 4]], 5])
    expect(serializer.read(`(
        One(a = (1,(2,(3,(4)))), b = ()),
    )`)).toStrictEqual([
        new UnknownKeysEntity({
            lookbehind: "One",
            a: [1, [2, [3, [4]]]],
            b: null,
        }),
    ])
})

test("Boolean", () => {
    let serializer = SerializerFactory.getSerializer(Boolean)
    expect(serializer.read("true")).toStrictEqual(true)
    expect(serializer.read("True")).toStrictEqual(true)
    expect(serializer.read("false")).toStrictEqual(false)
    expect(serializer.read("False")).toStrictEqual(false)
})

test("FormatTextEntity", () => {
    let serializer = SerializerFactory.getSerializer(FormatTextEntity)
    expect(
        serializer.read(`LOCGEN_FORMAT_NAMED(NSLOCTEXT("KismetSchema", "SplitPinFriendlyNameFormat", "{PinDisplayName} {ProtoPinDisplayName}"), "PinDisplayName", "Out Hit", "ProtoPinDisplayName", "Blocking Hit")`)
            .toString()
    ).toBe("Out Hit Blocking Hit")
    expect(
        serializer.read(`LOCGEN_FORMAT_NAMED(NSLOCTEXT("KismetSchema", "SplitPinFriendlyNameFormat", "{PinDisplayName} {ProtoPinDisplayName}"), "PinDisplayName", "Out Hit", "ProtoPinDisplayName", "Hit Bone Name")`)
            .toString()
    ).toBe("Out Hit Hit Bone Name")
    expect(
        serializer.read(String.raw`LOCGEN_FORMAT_ORDERED(
                NSLOCTEXT(
                    "PCGSettings",
                    "OverridableParamPinTooltip",
                    "{0}Attribute type is \"{1}\" and its exact name is \"{2}\""
                ),
                "If InRangeMin = InRangeMax, then that density value is mapped to the average of OutRangeMin and OutRangeMax\n",
                "float",
                "InRangeMin"
            )`)
            .toString()

    ).toBe(`If InRangeMin = InRangeMax, then that density value is mapped to the average of OutRangeMin and OutRangeMax\nAttribute type is "float" and its exact name is "InRangeMin"`)
})

test("GuidEntity", () => {
    let serializer = SerializerFactory.getSerializer(GuidEntity)

    let guid = serializer.read("0556a3ecabf648d0a5c07b2478e9dd32")
    expect(guid).toBeInstanceOf(GuidEntity)
    expect(guid.value).toBe("0556a3ecabf648d0a5c07b2478e9dd32")

    guid = serializer.read("64023BC344E0453DBB583FAC411489BC")
    expect(guid).toBeInstanceOf(GuidEntity)
    expect(guid.value).toBe("64023BC344E0453DBB583FAC411489BC")

    guid = serializer.read("6edC4a425ca948da8bC78bA52DED6C6C")
    expect(guid).toBeInstanceOf(GuidEntity)
    expect(guid.value).toBe("6edC4a425ca948da8bC78bA52DED6C6C")

    expect(() => serializer.read("172087193 9B04362973544B3564FDB2C")).toThrow()
    expect(() => serializer.read("E25F14F8F3E9441AB07153E7DA2BA2B")).toThrow()
    expect(() => serializer.read("A78988B0097E48418C8CB87EC5A67ABF7")).toThrow()
})

test("IntegerEntity", () => {
    let serializer = SerializerFactory.getSerializer(IntegerEntity)

    let integer = serializer.read("0")
    expect(integer).toBeInstanceOf(IntegerEntity)
    expect(integer.value).toStrictEqual(0)

    integer = serializer.read("+0")
    expect(integer).toBeInstanceOf(IntegerEntity)
    expect(integer.value).toStrictEqual(0)

    integer = serializer.read("-0")
    expect(integer).toBeInstanceOf(IntegerEntity)
    expect(integer.value).toStrictEqual(0)

    integer = serializer.read("99")
    expect(integer).toBeInstanceOf(IntegerEntity)
    expect(integer.value).toStrictEqual(99)

    integer = serializer.read("-8685")
    expect(integer).toBeInstanceOf(IntegerEntity)
    expect(integer.value).toStrictEqual(-8685)

    integer = serializer.read("+555")
    expect(integer).toBeInstanceOf(IntegerEntity)
    expect(integer.value).toStrictEqual(555)

    integer = serializer.read("1000000000")
    expect(integer).toBeInstanceOf(IntegerEntity)
    expect(integer.value).toStrictEqual(1000000000)

    expect(() => serializer.read("1.2").value).toThrow()
})

test("KeyBindingEntity", () => {
    let serializer = SerializerFactory.getSerializer(KeyBindingEntity)

    let binding = serializer.read("A")
    expect(binding).toBeInstanceOf(KeyBindingEntity)
    expect(binding).toMatchObject({ Key: { value: "A" } })

    binding = serializer.read("(bCtrl=True,Key=A)")
    expect(binding).toBeInstanceOf(KeyBindingEntity)
    expect(binding).toMatchObject({ Key: { value: "A" }, bCtrl: true })

    binding = serializer.read("(bCtrl=false,bShift=false,bCmd=true,bAlt=false,Key=X)")
    expect(binding).toBeInstanceOf(KeyBindingEntity)
    expect(binding).toMatchObject({ Key: { value: "X" }, bAlt: false, bCtrl: false, bCmd: true })

    binding = serializer.read("(       bCtrl=  false  \n,       Key \n\n\n  =Y ,bAlt=true     )")
    expect(binding).toBeInstanceOf(KeyBindingEntity)
    expect(binding).toMatchObject({ Key: { value: "Y" }, bAlt: true, bCtrl: false })
})

test("LinearColorEntity", () => {
    const serializer = SerializerFactory.getSerializer(LinearColorEntity)

    let color = LinearColorEntity.getWhite()
    expect(color.toRGBA()).toStrictEqual([255, 255, 255, 255])
    expect(color.toRGBAString()).toStrictEqual("FFFFFFFF")
    expect(color.toNumber()).toStrictEqual(-1)
    expect(color.toHSVA()).toStrictEqual([0, 0, 1, 1])

    color = serializer.read("(R=1,G=0,B=0)")
    expect(color.toRGBA()).toStrictEqual([255, 0, 0, 255])
    expect(color.toRGBAString()).toStrictEqual("FF0000FF")
    expect(color.toNumber()).toStrictEqual(-16776961)
    expect(color.toHSVA()).toStrictEqual([0, 1, 1, 1])

    color = serializer.read("(R=0.000000,G=0.660000,B=1.000000,A=1.000000)")
    expect(color.toRGBA()).toStrictEqual([0, 168, 255, 255])
    expect(color.toRGBAString()).toStrictEqual("00A8FFFF")
    expect(color.toNumber()).toStrictEqual(11075583)
    expect(color.toHSVA()).toStrictEqual([0.55666666666666666666, 1, 1, 1])

    color = serializer.read("(B=0.04394509003266556,G=0.026789300067696642,A=0.83663232408635,R=0.6884158028074934,)")
    expect(color.toRGBA()).toStrictEqual([176, 7, 11, 213])
    expect(color.toRGBAString()).toStrictEqual("B0070BD5")
    expect(color.toNumber()).toStrictEqual(-1341715499)
    expect(color.toHSVA().map(v => Utility.roundDecimals(v, 3))).toStrictEqual([0.996, 0.961, 0.688, 0.837])

    color = serializer.read(`(
                    A     = 0.327     ,
              R=0.530   ,             G  =      0.685
                ,B
                       =       0.9    ,)`)
    expect(color.toRGBA()).toStrictEqual([135, 175, 230, 83])
    expect(color.toRGBAString()).toStrictEqual("87AFE653")
    expect(color.toNumber()).toStrictEqual(-2018515373)
    expect(color.toHSVA().map(v => Utility.roundDecimals(v, 3))).toStrictEqual([0.597, 0.411, 0.9, 0.327])

    expect(() => serializer.read("(R=0.000000,G=0.660000,A=1.000000)")).toThrow()
    expect(() => serializer.read("(R=0.000000,G=\"hello\",A=1.000000)")).toThrow()
})

test("Null", () => {
    const serializer = SerializerFactory.getSerializer(null)

    expect(serializer.read("()")).toBeNull()
    expect(() => serializer.read("123")).toThrow()
    expect(() => serializer.read("(a)")).toThrow()
    expect(() => serializer.read("(")).toThrow()
})

test("Number", () => {
    const serializer = SerializerFactory.getSerializer(Number)

    expect(serializer.read("0")).toBeCloseTo(0, 0.00001)
    expect(serializer.read("+0")).toBeCloseTo(0, 0.00001)
    expect(serializer.read("-0")).toBeCloseTo(0, 0.00001)
    expect(serializer.read("5")).toBeCloseTo(5, 0.00001)
    expect(serializer.read("0.05")).toBeCloseTo(0.05, 0.00001)
    expect(serializer.read("-999.666")).toBeCloseTo(-999.666, 0.001)
    expect(serializer.read("+45.4545")).toBeCloseTo(45.4545, 0.001)
    expect(serializer.read("+1000000000")).toBeCloseTo(1E9, 0.1)
    expect(serializer.read("inf")).toBe(Number.POSITIVE_INFINITY)
    expect(serializer.read("+inf")).toBe(Number.POSITIVE_INFINITY)
    expect(serializer.read("-inf")).toBe(Number.NEGATIVE_INFINITY)
    expect(() => serializer.read("alpha")).toThrow()
})

test("ObjectReferenceEntity", () => {
    const serializer = SerializerFactory.getSerializer(ObjectReferenceEntity)

    let reference = serializer.read("Class")
    expect(reference).toBeInstanceOf(ObjectReferenceEntity)
    expect(reference).toMatchObject({ type: "Class", path: "" })
    expect(serializer.write(reference)).toBe("Class")

    reference = serializer.read(`Class'/Script/ShooterGame.ShooterGameMode'`)
    expect(reference).toBeInstanceOf(ObjectReferenceEntity)
    expect(reference).toMatchObject({ type: "Class", path: "/Script/ShooterGame.ShooterGameMode" })
    expect(serializer.write(reference)).toBe(`Class'/Script/ShooterGame.ShooterGameMode'`)

    reference = serializer.read(`EdGraphPin'EdGraphPin_45417'`)
    expect(reference).toBeInstanceOf(ObjectReferenceEntity)
    expect(reference).toMatchObject({ type: "EdGraphPin", path: "EdGraphPin_45417" })
    expect(serializer.write(reference)).toBe(`EdGraphPin'EdGraphPin_45417'`)

    reference = serializer.read(`EdGraphPin'"K2Node_DynamicCast_2126.EdGraphPin_3990988"'`)
    expect(reference).toBeInstanceOf(ObjectReferenceEntity)
    expect(reference).toMatchObject({ type: "EdGraphPin", path: "K2Node_DynamicCast_2126.EdGraphPin_3990988" })
    expect(serializer.write(reference)).toBe(`EdGraphPin'"K2Node_DynamicCast_2126.EdGraphPin_3990988"'`)

    reference = serializer.read(
        `"/Script/Engine.MaterialExpressionMaterialFunctionCall'MaterialExpressionMaterialFunctionCall_0'"`
    )
    expect(reference).toBeInstanceOf(ObjectReferenceEntity)
    expect(reference).toMatchObject({
        type: "/Script/Engine.MaterialExpressionMaterialFunctionCall",
        path: "MaterialExpressionMaterialFunctionCall_0",
    })
    expect(serializer.write(reference)).toBe(
        `"/Script/Engine.MaterialExpressionMaterialFunctionCall'MaterialExpressionMaterialFunctionCall_0'"`
    )

    reference = serializer.read(
        `/Script/Engine.EdGraph'"/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:Do N"'`
    )
    expect(reference).toBeInstanceOf(ObjectReferenceEntity)
    expect(reference).toMatchObject({
        type: "/Script/Engine.EdGraph",
        path: "/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:Do N",
    })
    expect(serializer.write(reference)).toBe(
        `/Script/Engine.EdGraph'"/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:Do N"'`
    )

    reference = serializer.read(
        `EdGraphPin'"K2Node_CommutativeAssociativeBinaryOperator_152.EdGraphPin_4045"'`
    )
    expect(reference).toBeInstanceOf(ObjectReferenceEntity)
    expect(reference).toMatchObject({
        type: "EdGraphPin",
        path: "K2Node_CommutativeAssociativeBinaryOperator_152.EdGraphPin_4045",
    })
    expect(serializer.write(reference)).toBe(
        `EdGraphPin'"K2Node_CommutativeAssociativeBinaryOperator_152.EdGraphPin_4045"'`
    )

    reference = serializer.read(
        `Function'"/Game/Mods/CrazyDinos/ElementalDragon/CDElementalDragon_Character_BP.SKEL_CDElementalDragon_Character_BP_C:ROS Change Element"'`
    )
    expect(reference).toBeInstanceOf(ObjectReferenceEntity)
    expect(reference).toMatchObject({
        type: "Function",
        path: "/Game/Mods/CrazyDinos/ElementalDragon/CDElementalDragon_Character_BP.SKEL_CDElementalDragon_Character_BP_C:ROS Change Element",
    })
    expect(serializer.write(reference)).toBe(
        `Function'"/Game/Mods/CrazyDinos/ElementalDragon/CDElementalDragon_Character_BP.SKEL_CDElementalDragon_Character_BP_C:ROS Change Element"'`
    )

    reference = serializer.read(`EdGraph'/Game/Systems/BP_MacroGlobal.BP_MacroGlobal:Or+Branch'`)
    expect(reference).toBeInstanceOf(ObjectReferenceEntity)
    expect(reference).toMatchObject({
        type: "EdGraph",
        path: "/Game/Systems/BP_MacroGlobal.BP_MacroGlobal:Or+Branch",
    })
    expect(serializer.write(reference)).toBe(`EdGraph'/Game/Systems/BP_MacroGlobal.BP_MacroGlobal:Or+Branch'`)

    reference = serializer.read(`/Script/Engine.EdGraph'"+-Weird/2,Macro"'`)
    expect(reference).toBeInstanceOf(ObjectReferenceEntity)
    expect(reference).toMatchObject({ type: "/Script/Engine.EdGraph", path: "+-Weird/2,Macro" })
    expect(serializer.write(reference)).toBe(`/Script/Engine.EdGraph'"+-Weird/2,Macro"'`)

    reference = serializer.read(`/Script/BlueprintGraph.K2Node_VariableGet`)
    expect(reference).toBeInstanceOf(ObjectReferenceEntity)
    expect(reference).toMatchObject({ type: "/Script/BlueprintGraph.K2Node_VariableGet", path: "" })
    expect(serializer.write(reference)).toBe(`/Script/BlueprintGraph.K2Node_VariableGet`)

    reference = serializer.read(
        `/Script/Engine.MaterialExpressionMaterialFunctionCall'MaterialExpressionMaterialFunctionCall_0'`
    )
    expect(reference).toBeInstanceOf(ObjectReferenceEntity)
    expect(reference).toMatchObject({
        type: "/Script/Engine.MaterialExpressionMaterialFunctionCall",
        path: "MaterialExpressionMaterialFunctionCall_0",
    })
    expect(serializer.write(reference)).toBe(
        `/Script/Engine.MaterialExpressionMaterialFunctionCall'MaterialExpressionMaterialFunctionCall_0'`
    )

    reference = serializer.read(
        `/Script/Engine.MaterialExpressionMaterialFunctionCall'/Engine/Transient.Material_0:MaterialGraph_0.MaterialGraphNode_3.MaterialExpressionMaterialFunctionCall_0'`
    )
    expect(reference).toBeInstanceOf(ObjectReferenceEntity)
    expect(reference).toMatchObject({
        type: "/Script/Engine.MaterialExpressionMaterialFunctionCall",
        path: "/Engine/Transient.Material_0:MaterialGraph_0.MaterialGraphNode_3.MaterialExpressionMaterialFunctionCall_0",
    })
    expect(serializer.write(reference)).toBe(
        `/Script/Engine.MaterialExpressionMaterialFunctionCall'/Engine/Transient.Material_0:MaterialGraph_0.MaterialGraphNode_3.MaterialExpressionMaterialFunctionCall_0'`
    )

    reference = serializer.read(`/Script/CoreUObject.Class'"/Script/Engine.GameModeBase"'`)
    expect(reference).toBeInstanceOf(ObjectReferenceEntity)
    expect(reference).toMatchObject({
        type: "/Script/CoreUObject.Class",
        path: "/Script/Engine.GameModeBase",
    })
    expect(serializer.write(reference)).toBe(`/Script/CoreUObject.Class'"/Script/Engine.GameModeBase"'`)

    reference = serializer.read(`"/Game/_YukiritoLib/Textures/T_紫色渐变01.T_紫色渐变01"`)
    expect(reference).toBeInstanceOf(ObjectReferenceEntity)
    expect(reference).toMatchObject({
        type: "/Game/_YukiritoLib/Textures/T_紫色渐变01.T_紫色渐变01",
        path: "",
    })
})

test("PinEntity", () => {
    const serializer = SerializerFactory.getSerializer(PinEntity)

    expect(serializer.read("Pin (PinType.PinSubCategoryMemberReference=())")).toMatchObject({
        "PinType": { "PinSubCategoryMemberReference": null }
    })
})

test("SimpleSerializationRotatorEntity", () => {
    const serializer = SerializerFactory.getSerializer(SimpleSerializationRotatorEntity)

    expect(serializer.read("0, 0, 0")).toEqual(new SimpleSerializationRotatorEntity({
        R: 0,
        P: 0,
        Y: 0,
    }))
    expect(serializer.read("0.65, 1.0, 0.99")).toEqual(new SimpleSerializationRotatorEntity({
        P: 0.65,
        Y: 1.0,
        R: 0.99,
    }))
    expect(serializer.read("7,6,5")).toEqual(new SimpleSerializationRotatorEntity({
        P: 7,
        Y: 6,
        R: 5,
    }))
})

test("SimpleSerializationVector2DEntity", () => {
    const serializer = SerializerFactory.getSerializer(SimpleSerializationVector2DEntity)

    expect(serializer.read("0, 0")).toEqual(new SimpleSerializationVector2DEntity({
        X: 0,
        Y: 0,
    }))
    expect(serializer.read("127.8, 13.3")).toEqual(new SimpleSerializationVector2DEntity({
        X: 127.8,
        Y: 13.3,
    }))
    expect(serializer.read("5,0")).toEqual(new SimpleSerializationVector2DEntity({
        X: 5,
        Y: 0,
    }))
})

test("SimpleSerializationVectorEntity", () => {
    const serializer = SerializerFactory.getSerializer(SimpleSerializationVectorEntity)

    expect(serializer.read("0, 0, 0")).toEqual(new SimpleSerializationVectorEntity({
        X: 0,
        Y: 0,
        Z: 0,
    }))
    expect(serializer.read("1001, 56.4, 0.5")).toEqual(new SimpleSerializationVectorEntity({
        X: 1001,
        Y: 56.4,
        Z: 0.5,
    }))
    expect(serializer.read("-1,-2,-3")).toEqual(new SimpleSerializationVectorEntity({
        X: -1,
        Y: -2,
        Z: -3,
    }))
})

test("String", () => {
    const serializer = SerializerFactory.getSerializer(String)

    expect(serializer.read('""')).toStrictEqual("")
    expect(serializer.read('"hello"')).toStrictEqual("hello")
    expect(serializer.read('"hello world 123 - éèàò@ç ^ ^^^"')).toStrictEqual("hello world 123 - éèàò@ç ^ ^^^")
    expect(serializer.read('"\\""')).toStrictEqual('"')
    expect(() => serializer.read("Hello")).toThrow()

    expect(serializer.write(`"/Script/CoreUObject.Class'/Script/Interhaptics.HapticSource'"`))
        .toBe(String.raw`"\"/Script/CoreUObject.Class'/Script/Interhaptics.HapticSource'\""`)
})

test("UnknownKeysValue", () => {
    const parser = Grammar.unknownValue

    expect(parser.parse('"Hello"').constructor).toStrictEqual(String)
    expect(parser.parse("()")).toBeNull()
    expect(parser.parse("8345").constructor).toStrictEqual(Number)
    expect(parser.parse("True").constructor).toStrictEqual(Boolean)
    expect(parser.parse("False").constructor).toStrictEqual(Boolean)
    expect(parser.parse("F0223D3742E67C0D9FEFB2A64946B7F0").constructor).toStrictEqual(GuidEntity)
    expect(parser.parse("SYMBOL1").constructor).toStrictEqual(SymbolEntity)
    expect(parser.parse("Symbol_2_3_4").constructor).toStrictEqual(SymbolEntity)
    expect(parser.parse("(X=-0.495,  Y=0, )").constructor).toStrictEqual(Vector2DEntity)
    expect(parser.parse("(X=-0.495,Y=+765.0,Z=7)").constructor).toStrictEqual(VectorEntity)
    expect(parser.parse("(R=1.000000,P=7.6,Y=+88.99)").constructor).toStrictEqual(RotatorEntity)
    expect(parser.parse("(R=0.000000,G=0.660000,B=1.000000,A=1.000000)").constructor)
        .toStrictEqual(LinearColorEntity)
    expect(parser.parse(`Class'"/Script/Engine.KismetSystemLibrary"'`).constructor)
        .toStrictEqual(ObjectReferenceEntity)
    expect(parser.parse("(1,2,3,4,5,6,7,8,9)")).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
    expect(parser.parse(`( "Hello",  "World",  )`)).toStrictEqual(["Hello", "World"])
    expect(parser.parse(`( "Alpha", 123, Beta, "Gamma", "Delta", 99  )`))
        .toStrictEqual(["Alpha", 123, new SymbolEntity({ value: "Beta" }), "Gamma", "Delta", 99])
})

test("UnknownKeysEntity", () => {
    const serializer = SerializerFactory.getSerializer(UnknownKeysEntity)

    let unknown = serializer.read('LookbehindValue(FirstKey=1,SecondKey=SOME_SYMBOL2,ThirdKey="Hello")')
    expect(unknown).toBeInstanceOf(UnknownKeysEntity)
    expect(unknown).toMatchObject({
        lookbehind: "LookbehindValue",
        FirstKey: 1,
        SecondKey: new SymbolEntity("SOME_SYMBOL2"),
        ThirdKey: "Hello",
    })

    unknown = serializer.read('(A = (-1,-2,-3),  B = SomeFunction(B1 = "b1", B2 = (X=101,Y=102,Z=103)))')
    expect(unknown).toBeInstanceOf(UnknownKeysEntity)
    expect(unknown).toMatchObject({
        A: [-1, -2, -3],
        B: new UnknownKeysEntity({
            lookbehind: "SomeFunction",
            B1: "b1",
            B2: new VectorEntity({ X: 101, Y: 102, Z: 103 }),
        }),
    })
})

test("VectorEntity", () => {
    const serializer = SerializerFactory.getSerializer(VectorEntity)

    let vector = serializer.read("(X=1,Y=2,Z=3.5)")
    expect(vector).toBeInstanceOf(VectorEntity)
    expect(vector).toStrictEqual(new VectorEntity({
        X: 1,
        Y: 2,
        Z: 3.5,
    }))

    vector = serializer.read("(X=10,Y=+20.88,Z=-30.54,)")
    expect(vector).toBeInstanceOf(VectorEntity)
    expect(vector).toStrictEqual(new VectorEntity({
        X: 10,
        Y: 20.88,
        Z: -30.54,
    }))

    vector = serializer.read(`(
            Z  =   -3.66    ,   
                
                        X
                            =        -1 ,     Y       =
                            
                            
                    -2
  ,
        )`)
    expect(vector).toBeInstanceOf(VectorEntity)
    expect(vector).toStrictEqual(new VectorEntity({
        X: -1,
        Y: -2,
        Z: -3.66,
    }))

    expect(() => serializer.read("(X=1,Y=\"2\",Z=3)")).toThrow()
    expect(() => serializer.read("(X=1,Z=3)")).toThrow()
    expect(() => serializer.read("(X=1,Y=2,Unexpected=6,Z=3.5)")).toThrow()
})

test("Vector2DEntity", () => {
    let serializer = SerializerFactory.getSerializer(Vector2DEntity)

    let vector = serializer.read("(X=78,Y=56.3)")
    expect(vector).toBeInstanceOf(Vector2DEntity)
    expect(vector).toStrictEqual(new Vector2DEntity({
        X: 78,
        Y: 56.3,
    }))

    vector = serializer.read("(X=+4.5,Y=-8.88,)")
    expect(vector).toBeInstanceOf(Vector2DEntity)
    expect(vector).toStrictEqual(new Vector2DEntity({
        X: 4.5,
        Y: -8.88,
    }))

    vector = serializer.read(`(
            Y  =   +93.004    ,   
                
                        X
                            =        0 ,     
        )`)
    expect(vector).toBeInstanceOf(Vector2DEntity)
    expect(vector).toStrictEqual(new Vector2DEntity({
        X: 0,
        Y: 93.004,
    }))

    expect(() => serializer.read("(X=1,Y=\"2\")")).toThrow()
    expect(() => serializer.read("(X=1)")).toThrow()
    expect(() => serializer.read("(X=777, Y=555, Unexpected=6, HH=2)")).toThrow()
})
