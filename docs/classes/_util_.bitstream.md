[Yellowstone](../README.md) > ["util"](../modules/_util_.md) > [BitStream](../classes/_util_.bitstream.md)

# Class: BitStream

## Hierarchy

**BitStream**

## Index

### Constructors

* [constructor](_util_.bitstream.md#constructor)

### Properties

* [data](_util_.bitstream.md#data)

### Methods

* [AddHexString](_util_.bitstream.md#addhexstring)
* [AddValue](_util_.bitstream.md#addvalue)
* [Read](_util_.bitstream.md#read)
* [ToArray](_util_.bitstream.md#toarray)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new BitStream**(): [BitStream](_util_.bitstream.md)

*Defined in [util.ts:114](https://github.com/mbullington/yellowstone/blob/ac27865/lib/util.ts#L114)*

**Returns:** [BitStream](_util_.bitstream.md)

___

## Properties

<a id="data"></a>

###  data

**● data**: *`number`[]* =  []

*Defined in [util.ts:114](https://github.com/mbullington/yellowstone/blob/ac27865/lib/util.ts#L114)*

___

## Methods

<a id="addhexstring"></a>

###  AddHexString

▸ **AddHexString**(hex_string: *`string`*): `void`

*Defined in [util.ts:129](https://github.com/mbullington/yellowstone/blob/ac27865/lib/util.ts#L129)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| hex_string | `string` |

**Returns:** `void`

___
<a id="addvalue"></a>

###  AddValue

▸ **AddValue**(value: *`number`*, num_bits: *`number`*): `void`

*Defined in [util.ts:122](https://github.com/mbullington/yellowstone/blob/ac27865/lib/util.ts#L122)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `number` |
| num_bits | `number` |

**Returns:** `void`

___
<a id="read"></a>

###  Read

▸ **Read**(num_bits: *`number`*): `number`

*Defined in [util.ts:153](https://github.com/mbullington/yellowstone/blob/ac27865/lib/util.ts#L153)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| num_bits | `number` |

**Returns:** `number`

___
<a id="toarray"></a>

###  ToArray

▸ **ToArray**(): `Buffer`

*Defined in [util.ts:165](https://github.com/mbullington/yellowstone/blob/ac27865/lib/util.ts#L165)*

**Returns:** `Buffer`

___

