[Yellowstone](../README.md) > ["transports/H264Transport"](../modules/_transports_h264transport_.md) > [H264Transport](../classes/_transports_h264transport_.h264transport.md)

# Class: H264Transport

## Hierarchy

**H264Transport**

## Index

### Constructors

* [constructor](_transports_h264transport_.h264transport.md#constructor)

### Properties

* [_headerWritten](_transports_h264transport_.h264transport.md#_headerwritten)
* [client](_transports_h264transport_.h264transport.md#client)
* [rtpPackets](_transports_h264transport_.h264transport.md#rtppackets)
* [stream](_transports_h264transport_.h264transport.md#stream)

### Methods

* [processConnectionDetails](_transports_h264transport_.h264transport.md#processconnectiondetails)
* [processRTPFrame](_transports_h264transport_.h264transport.md#processrtpframe)
* [processRTPPacket](_transports_h264transport_.h264transport.md#processrtppacket)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new H264Transport**(client: *[RTSPClient](_rtspclient_.rtspclient.md)*, stream: *`Writable`*, details: *[Details](../interfaces/_transports_h264transport_.details.md)*): [H264Transport](_transports_h264transport_.h264transport.md)

*Defined in [transports/H264Transport.ts:27](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/H264Transport.ts#L27)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| client | [RTSPClient](_rtspclient_.rtspclient.md) |
| stream | `Writable` |
| details | [Details](../interfaces/_transports_h264transport_.details.md) |

**Returns:** [H264Transport](_transports_h264transport_.h264transport.md)

___

## Properties

<a id="_headerwritten"></a>

###  _headerWritten

**● _headerWritten**: *`boolean`* = false

*Defined in [transports/H264Transport.ts:27](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/H264Transport.ts#L27)*

___
<a id="client"></a>

###  client

**● client**: *[RTSPClient](_rtspclient_.rtspclient.md)*

*Defined in [transports/H264Transport.ts:22](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/H264Transport.ts#L22)*

___
<a id="rtppackets"></a>

###  rtpPackets

**● rtpPackets**: *`Buffer`[]* =  []

*Defined in [transports/H264Transport.ts:25](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/H264Transport.ts#L25)*

___
<a id="stream"></a>

###  stream

**● stream**: *`Writable`*

*Defined in [transports/H264Transport.ts:23](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/H264Transport.ts#L23)*

___

## Methods

<a id="processconnectiondetails"></a>

###  processConnectionDetails

▸ **processConnectionDetails**(details: *[Details](../interfaces/_transports_h264transport_.details.md)*): `void`

*Defined in [transports/H264Transport.ts:44](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/H264Transport.ts#L44)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| details | [Details](../interfaces/_transports_h264transport_.details.md) |

**Returns:** `void`

___
<a id="processrtpframe"></a>

###  processRTPFrame

▸ **processRTPFrame**(rtpPackets: *`Buffer`[]*): `void`

*Defined in [transports/H264Transport.ts:78](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/H264Transport.ts#L78)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| rtpPackets | `Buffer`[] |

**Returns:** `void`

___
<a id="processrtppacket"></a>

###  processRTPPacket

▸ **processRTPPacket**(packet: *[RTPPacket](../interfaces/_util_.rtppacket.md)*): `void`

*Defined in [transports/H264Transport.ts:67](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/H264Transport.ts#L67)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| packet | [RTPPacket](../interfaces/_util_.rtppacket.md) |

**Returns:** `void`

___

