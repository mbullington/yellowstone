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

⊕ **new H264Transport**(client: *[RTSPClient](_rtspclient_.rtspclient.md)*, stream: *`Writable`*, details?: *[Details](../interfaces/_transports_h264transport_.details.md)*): [H264Transport](_transports_h264transport_.h264transport.md)

*Defined in [transports/H264Transport.ts:24](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/transports/H264Transport.ts#L24)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| client | [RTSPClient](_rtspclient_.rtspclient.md) |
| stream | `Writable` |
| `Optional` details | [Details](../interfaces/_transports_h264transport_.details.md) |

**Returns:** [H264Transport](_transports_h264transport_.h264transport.md)

___

## Properties

<a id="_headerwritten"></a>

###  _headerWritten

**● _headerWritten**: *`boolean`* = false

*Defined in [transports/H264Transport.ts:24](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/transports/H264Transport.ts#L24)*

___
<a id="client"></a>

###  client

**● client**: *[RTSPClient](_rtspclient_.rtspclient.md)*

*Defined in [transports/H264Transport.ts:19](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/transports/H264Transport.ts#L19)*

___
<a id="rtppackets"></a>

###  rtpPackets

**● rtpPackets**: *`Buffer`[]* =  []

*Defined in [transports/H264Transport.ts:22](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/transports/H264Transport.ts#L22)*

___
<a id="stream"></a>

###  stream

**● stream**: *`Writable`*

*Defined in [transports/H264Transport.ts:20](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/transports/H264Transport.ts#L20)*

___

## Methods

<a id="processconnectiondetails"></a>

###  processConnectionDetails

▸ **processConnectionDetails**(details: *[Details](../interfaces/_transports_h264transport_.details.md)*): `void`

*Defined in [transports/H264Transport.ts:41](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/transports/H264Transport.ts#L41)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| details | [Details](../interfaces/_transports_h264transport_.details.md) |

**Returns:** `void`

___
<a id="processrtpframe"></a>

###  processRTPFrame

▸ **processRTPFrame**(rtpPackets: *`Buffer`[]*): `void`

*Defined in [transports/H264Transport.ts:75](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/transports/H264Transport.ts#L75)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| rtpPackets | `Buffer`[] |

**Returns:** `void`

___
<a id="processrtppacket"></a>

###  processRTPPacket

▸ **processRTPPacket**(packet: *[RTPPacket](../interfaces/_util_.rtppacket.md)*): `void`

*Defined in [transports/H264Transport.ts:64](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/transports/H264Transport.ts#L64)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| packet | [RTPPacket](../interfaces/_util_.rtppacket.md) |

**Returns:** `void`

___

