[Yellowstone](../README.md) > ["transports/ONVIFMetadataTransport"](../modules/_transports_onvifmetadatatransport_.md) > [ONVIFMetadataTransport](../classes/_transports_onvifmetadatatransport_.onvifmetadatatransport.md)

# Class: ONVIFMetadataTransport

## Hierarchy

**ONVIFMetadataTransport**

## Index

### Constructors

* [constructor](_transports_onvifmetadatatransport_.onvifmetadatatransport.md#constructor)

### Properties

* [client](_transports_onvifmetadatatransport_.onvifmetadatatransport.md#client)
* [stream](_transports_onvifmetadatatransport_.onvifmetadatatransport.md#stream)
* [xml](_transports_onvifmetadatatransport_.onvifmetadatatransport.md#xml)

### Methods

* [processRTPPacket](_transports_onvifmetadatatransport_.onvifmetadatatransport.md#processrtppacket)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ONVIFMetadataTransport**(client: *[RTSPClient](_rtspclient_.rtspclient.md)*, stream: *`Writable`*, details: *[Details](../interfaces/_transports_onvifmetadatatransport_.details.md)*): [ONVIFMetadataTransport](_transports_onvifmetadatatransport_.onvifmetadatatransport.md)

*Defined in [transports/ONVIFMetadataTransport.ts:22](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/ONVIFMetadataTransport.ts#L22)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| client | [RTSPClient](_rtspclient_.rtspclient.md) |
| stream | `Writable` |
| details | [Details](../interfaces/_transports_onvifmetadatatransport_.details.md) |

**Returns:** [ONVIFMetadataTransport](_transports_onvifmetadatatransport_.onvifmetadatatransport.md)

___

## Properties

<a id="client"></a>

###  client

**● client**: *[RTSPClient](_rtspclient_.rtspclient.md)*

*Defined in [transports/ONVIFMetadataTransport.ts:20](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/ONVIFMetadataTransport.ts#L20)*

___
<a id="stream"></a>

###  stream

**● stream**: *`Writable`*

*Defined in [transports/ONVIFMetadataTransport.ts:21](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/ONVIFMetadataTransport.ts#L21)*

___
<a id="xml"></a>

###  xml

**● xml**: *`string`*

*Defined in [transports/ONVIFMetadataTransport.ts:22](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/ONVIFMetadataTransport.ts#L22)*

___

## Methods

<a id="processrtppacket"></a>

###  processRTPPacket

▸ **processRTPPacket**(packet: *[RTPPacket](../interfaces/_util_.rtppacket.md)*): `void`

*Defined in [transports/ONVIFMetadataTransport.ts:36](https://github.com/mbullington/yellowstone/blob/ac27865/lib/transports/ONVIFMetadataTransport.ts#L36)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| packet | [RTPPacket](../interfaces/_util_.rtppacket.md) |

**Returns:** `void`

___

