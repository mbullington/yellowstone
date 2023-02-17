[Yellowstone](../README.md) / ONVIFMetadataTransport

# Class: ONVIFMetadataTransport

## Table of contents

### Constructors

- [constructor](ONVIFMetadataTransport.md#constructor)

### Properties

- [client](ONVIFMetadataTransport.md#client)
- [stream](ONVIFMetadataTransport.md#stream)
- [xml](ONVIFMetadataTransport.md#xml)

### Methods

- [processRTPPacket](ONVIFMetadataTransport.md#processrtppacket)

## Constructors

### constructor

• **new ONVIFMetadataTransport**(`client`, `stream`, `details`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | [`RTSPClient`](RTSPClient.md) |
| `stream` | `Writable` |
| `details` | `Details` |

#### Defined in

[lib/transports/ONVIFMetadataTransport.ts:24](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/ONVIFMetadataTransport.ts#L24)

## Properties

### client

• **client**: [`RTSPClient`](RTSPClient.md)

#### Defined in

[lib/transports/ONVIFMetadataTransport.ts:20](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/ONVIFMetadataTransport.ts#L20)

___

### stream

• **stream**: `Writable`

#### Defined in

[lib/transports/ONVIFMetadataTransport.ts:21](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/ONVIFMetadataTransport.ts#L21)

___

### xml

• **xml**: `string`

#### Defined in

[lib/transports/ONVIFMetadataTransport.ts:22](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/ONVIFMetadataTransport.ts#L22)

## Methods

### processRTPPacket

▸ **processRTPPacket**(`packet`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `packet` | [`RTPPacket`](../interfaces/RTPPacket.md) |

#### Returns

`void`

#### Defined in

[lib/transports/ONVIFMetadataTransport.ts:36](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/ONVIFMetadataTransport.ts#L36)
