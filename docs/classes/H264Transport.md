[Yellowstone](../README.md) / H264Transport

# Class: H264Transport

## Table of contents

### Constructors

- [constructor](H264Transport.md#constructor)

### Properties

- [\_headerWritten](H264Transport.md#_headerwritten)
- [client](H264Transport.md#client)
- [rtpPackets](H264Transport.md#rtppackets)
- [stream](H264Transport.md#stream)

### Methods

- [processConnectionDetails](H264Transport.md#processconnectiondetails)
- [processRTPFrame](H264Transport.md#processrtpframe)
- [processRTPPacket](H264Transport.md#processrtppacket)

## Constructors

### constructor

• **new H264Transport**(`client`, `stream`, `details`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | [`RTSPClient`](RTSPClient.md) |
| `stream` | `Writable` |
| `details` | `Details` |

#### Defined in

[lib/transports/H264Transport.ts:29](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/H264Transport.ts#L29)

## Properties

### \_headerWritten

• **\_headerWritten**: `boolean` = `false`

#### Defined in

[lib/transports/H264Transport.ts:27](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/H264Transport.ts#L27)

___

### client

• **client**: [`RTSPClient`](RTSPClient.md)

#### Defined in

[lib/transports/H264Transport.ts:22](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/H264Transport.ts#L22)

___

### rtpPackets

• **rtpPackets**: `Buffer`[] = `[]`

#### Defined in

[lib/transports/H264Transport.ts:25](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/H264Transport.ts#L25)

___

### stream

• **stream**: `Writable`

#### Defined in

[lib/transports/H264Transport.ts:23](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/H264Transport.ts#L23)

## Methods

### processConnectionDetails

▸ **processConnectionDetails**(`details`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `details` | `Details` |

#### Returns

`void`

#### Defined in

[lib/transports/H264Transport.ts:44](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/H264Transport.ts#L44)

___

### processRTPFrame

▸ **processRTPFrame**(`rtpPackets`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rtpPackets` | `Buffer`[] |

#### Returns

`void`

#### Defined in

[lib/transports/H264Transport.ts:78](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/H264Transport.ts#L78)

___

### processRTPPacket

▸ **processRTPPacket**(`packet`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `packet` | [`RTPPacket`](../interfaces/RTPPacket.md) |

#### Returns

`void`

#### Defined in

[lib/transports/H264Transport.ts:67](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/H264Transport.ts#L67)
