[Yellowstone](../README.md) > ["transports/H265Transport"](../modules/_transports_h265transport_.md) > [H265Transport](../classes/_transports_h265transport_.h265transport.md)

# Class: H265Transport

## Hierarchy

**H265Transport**

## Index

### Constructors

* [constructor](_transports_h265transport_.h265transport.md#constructor)

### Properties

* [_headerWritten](_transports_h265transport_.h265transport.md#_headerwritten)
* [client](_transports_h265transport_.h265transport.md#client)
* [has_donl](_transports_h265transport_.h265transport.md#has_donl)
* [rtpPackets](_transports_h265transport_.h265transport.md#rtppackets)
* [stream](_transports_h265transport_.h265transport.md#stream)

### Methods

* [processConnectionDetails](_transports_h265transport_.h265transport.md#processconnectiondetails)
* [processRTPFrame](_transports_h265transport_.h265transport.md#processrtpframe)
* [processRTPPacket](_transports_h265transport_.h265transport.md#processrtppacket)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new H265Transport**(client: *[RTSPClient](_rtspclient_.rtspclient.md)*, stream: *`Writable`*, details: *[Details](../interfaces/_transports_h265transport_.details.md)*): [H265Transport](_transports_h265transport_.h265transport.md)

*Defined in [transports/H265Transport.ts:28](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/H265Transport.ts#L28)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| client | [RTSPClient](_rtspclient_.rtspclient.md) |
| stream | `Writable` |
| details | [Details](../interfaces/_transports_h265transport_.details.md) |

**Returns:** [H265Transport](_transports_h265transport_.h265transport.md)

___

## Properties

<a id="_headerwritten"></a>

###  _headerWritten

**● _headerWritten**: *`boolean`* = false

*Defined in [transports/H265Transport.ts:28](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/H265Transport.ts#L28)*

___
<a id="client"></a>

###  client

**● client**: *[RTSPClient](_rtspclient_.rtspclient.md)*

*Defined in [transports/H265Transport.ts:22](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/H265Transport.ts#L22)*

___
<a id="has_donl"></a>

###  has_donl

**● has_donl**: *`boolean`* = false

*Defined in [transports/H265Transport.ts:24](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/H265Transport.ts#L24)*

___
<a id="rtppackets"></a>

###  rtpPackets

**● rtpPackets**: *`Buffer`[]* =  []

*Defined in [transports/H265Transport.ts:26](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/H265Transport.ts#L26)*

___
<a id="stream"></a>

###  stream

**● stream**: *`Writable`*

*Defined in [transports/H265Transport.ts:23](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/H265Transport.ts#L23)*

___

## Methods

<a id="processconnectiondetails"></a>

###  processConnectionDetails

▸ **processConnectionDetails**(details: *[Details](../interfaces/_transports_h265transport_.details.md)*): `void`

*Defined in [transports/H265Transport.ts:45](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/H265Transport.ts#L45)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| details | [Details](../interfaces/_transports_h265transport_.details.md) |

**Returns:** `void`

___
<a id="processrtpframe"></a>

###  processRTPFrame

▸ **processRTPFrame**(rtpPackets: *`Buffer`[]*): `void`

*Defined in [transports/H265Transport.ts:81](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/H265Transport.ts#L81)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| rtpPackets | `Buffer`[] |

**Returns:** `void`

___
<a id="processrtppacket"></a>

###  processRTPPacket

▸ **processRTPPacket**(packet: *[RTPPacket](../interfaces/_util_.rtppacket.md)*): `void`

*Defined in [transports/H265Transport.ts:70](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/H265Transport.ts#L70)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| packet | [RTPPacket](../interfaces/_util_.rtppacket.md) |

**Returns:** `void`

___

