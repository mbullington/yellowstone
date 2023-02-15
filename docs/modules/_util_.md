[Yellowstone](../README.md) > ["util"](../modules/_util_.md)

# External module: "util"

## Index

### Classes

* [BitStream](../classes/_util_.bitstream.md)

### Interfaces

* [RTCPPacket](../interfaces/_util_.rtcppacket.md)
* [RTPPacket](../interfaces/_util_.rtppacket.md)
* [Transport](../interfaces/_util_.transport.md)

### Functions

* [generateSSRC](_util_.md#generatessrc)
* [getMD5Hash](_util_.md#getmd5hash)
* [parseRTCPPacket](_util_.md#parsertcppacket)
* [parseRTPPacket](_util_.md#parsertppacket)
* [parseTransport](_util_.md#parsetransport)
* [randInclusive](_util_.md#randinclusive)

---

## Functions

<a id="generatessrc"></a>

###  generateSSRC

▸ **generateSSRC**(): `number`

*Defined in [util.ts:105](https://github.com/mbullington/yellowstone/blob/ac27865/lib/util.ts#L105)*

**Returns:** `number`

___
<a id="getmd5hash"></a>

###  getMD5Hash

▸ **getMD5Hash**(str: *`string`*): `string`

*Defined in [util.ts:66](https://github.com/mbullington/yellowstone/blob/ac27865/lib/util.ts#L66)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| str | `string` |

**Returns:** `string`

___
<a id="parsertcppacket"></a>

###  parseRTCPPacket

▸ **parseRTCPPacket**(buffer: *`Buffer`*): [RTCPPacket](../interfaces/_util_.rtcppacket.md)

*Defined in [util.ts:54](https://github.com/mbullington/yellowstone/blob/ac27865/lib/util.ts#L54)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| buffer | `Buffer` |

**Returns:** [RTCPPacket](../interfaces/_util_.rtcppacket.md)

___
<a id="parsertppacket"></a>

###  parseRTPPacket

▸ **parseRTPPacket**(buffer: *`Buffer`*): [RTPPacket](../interfaces/_util_.rtppacket.md)

*Defined in [util.ts:18](https://github.com/mbullington/yellowstone/blob/ac27865/lib/util.ts#L18)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| buffer | `Buffer` |

**Returns:** [RTPPacket](../interfaces/_util_.rtppacket.md)

___
<a id="parsetransport"></a>

###  parseTransport

▸ **parseTransport**(transport: *`string`*): [Transport](../interfaces/_util_.transport.md)

*Defined in [util.ts:78](https://github.com/mbullington/yellowstone/blob/ac27865/lib/util.ts#L78)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transport | `string` |

**Returns:** [Transport](../interfaces/_util_.transport.md)

___
<a id="randinclusive"></a>

###  randInclusive

▸ **randInclusive**(min: *`number`*, max: *`number`*): `number`

*Defined in [util.ts:99](https://github.com/mbullington/yellowstone/blob/ac27865/lib/util.ts#L99)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| min | `number` |
| max | `number` |

**Returns:** `number`

___

