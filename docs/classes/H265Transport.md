[Yellowstone](../README.md) / H265Transport

# Class: H265Transport

## Table of contents

### Constructors

- [constructor](H265Transport.md#constructor)

### Properties

- [client](H265Transport.md#client)
- [has\_donl](H265Transport.md#has_donl)
- [rtpPackets](H265Transport.md#rtppackets)
- [stream](H265Transport.md#stream)

### Methods

- [processConnectionDetails](H265Transport.md#processconnectiondetails)
- [processRTPFrame](H265Transport.md#processrtpframe)
- [processRTPPacket](H265Transport.md#processrtppacket)

## Constructors

### constructor

• **new H265Transport**(`client`, `stream`, `details`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | [`RTSPClient`](RTSPClient.md) |
| `stream` | `Writable` |
| `details` | `Details` |

#### Defined in

[lib/transports/H265Transport.ts:28](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/H265Transport.ts#L28)

## Properties

### client

• **client**: [`RTSPClient`](RTSPClient.md)

#### Defined in

[lib/transports/H265Transport.ts:22](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/H265Transport.ts#L22)

___

### has\_donl

• **has\_donl**: `boolean` = `false`

#### Defined in

[lib/transports/H265Transport.ts:24](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/H265Transport.ts#L24)

___

### rtpPackets

• **rtpPackets**: `Buffer`[] = `[]`

#### Defined in

[lib/transports/H265Transport.ts:26](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/H265Transport.ts#L26)

___

### stream

• **stream**: `Writable`

#### Defined in

[lib/transports/H265Transport.ts:23](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/H265Transport.ts#L23)

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

[lib/transports/H265Transport.ts:43](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/H265Transport.ts#L43)

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

[lib/transports/H265Transport.ts:77](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/H265Transport.ts#L77)

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

[lib/transports/H265Transport.ts:66](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/H265Transport.ts#L66)
