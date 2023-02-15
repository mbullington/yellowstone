[Yellowstone](../README.md) > ["transports/AACTransport"](../modules/_transports_aactransport_.md) > [AACTransport](../classes/_transports_aactransport_.aactransport.md)

# Class: AACTransport

## Hierarchy

**AACTransport**

## Index

### Constructors

* [constructor](_transports_aactransport_.aactransport.md#constructor)

### Properties

* [ChannelConfiguration](_transports_aactransport_.aactransport.md#channelconfiguration)
* [FrequencyIndex](_transports_aactransport_.aactransport.md#frequencyindex)
* [ObjectType](_transports_aactransport_.aactransport.md#objecttype)
* [client](_transports_aactransport_.aactransport.md#client)
* [stream](_transports_aactransport_.aactransport.md#stream)

### Methods

* [processRTPPacket](_transports_aactransport_.aactransport.md#processrtppacket)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new AACTransport**(client: *[RTSPClient](_rtspclient_.rtspclient.md)*, stream: *`Writable`*, details: *[Details](../interfaces/_transports_aactransport_.details.md)*): [AACTransport](_transports_aactransport_.aactransport.md)

*Defined in [transports/AACTransport.ts:24](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/AACTransport.ts#L24)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| client | [RTSPClient](_rtspclient_.rtspclient.md) |
| stream | `Writable` |
| details | [Details](../interfaces/_transports_aactransport_.details.md) |

**Returns:** [AACTransport](_transports_aactransport_.aactransport.md)

___

## Properties

<a id="channelconfiguration"></a>

###  ChannelConfiguration

**● ChannelConfiguration**: *`number`* = 0

*Defined in [transports/AACTransport.ts:24](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/AACTransport.ts#L24)*

___
<a id="frequencyindex"></a>

###  FrequencyIndex

**● FrequencyIndex**: *`number`* = 0

*Defined in [transports/AACTransport.ts:23](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/AACTransport.ts#L23)*

___
<a id="objecttype"></a>

###  ObjectType

**● ObjectType**: *`number`* = 0

*Defined in [transports/AACTransport.ts:22](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/AACTransport.ts#L22)*

___
<a id="client"></a>

###  client

**● client**: *[RTSPClient](_rtspclient_.rtspclient.md)*

*Defined in [transports/AACTransport.ts:19](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/AACTransport.ts#L19)*

___
<a id="stream"></a>

###  stream

**● stream**: *`Writable`*

*Defined in [transports/AACTransport.ts:20](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/AACTransport.ts#L20)*

___

## Methods

<a id="processrtppacket"></a>

###  processRTPPacket

▸ **processRTPPacket**(packet: *[RTPPacket](../interfaces/_util_.rtppacket.md)*): `void`

*Defined in [transports/AACTransport.ts:65](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/AACTransport.ts#L65)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| packet | [RTPPacket](../interfaces/_util_.rtppacket.md) |

**Returns:** `void`

___

