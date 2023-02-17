[Yellowstone](../README.md) / AACTransport

# Class: AACTransport

## Table of contents

### Constructors

- [constructor](AACTransport.md#constructor)

### Properties

- [ChannelConfiguration](AACTransport.md#channelconfiguration)
- [FrequencyIndex](AACTransport.md#frequencyindex)
- [ObjectType](AACTransport.md#objecttype)
- [client](AACTransport.md#client)
- [stream](AACTransport.md#stream)

### Methods

- [processRTPPacket](AACTransport.md#processrtppacket)

## Constructors

### constructor

• **new AACTransport**(`client`, `stream`, `details`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | [`RTSPClient`](RTSPClient.md) |
| `stream` | `Writable` |
| `details` | `Details` |

#### Defined in

[lib/transports/AACTransport.ts:26](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/AACTransport.ts#L26)

## Properties

### ChannelConfiguration

• **ChannelConfiguration**: `number` = `0`

#### Defined in

[lib/transports/AACTransport.ts:24](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/AACTransport.ts#L24)

___

### FrequencyIndex

• **FrequencyIndex**: `number` = `0`

#### Defined in

[lib/transports/AACTransport.ts:23](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/AACTransport.ts#L23)

___

### ObjectType

• **ObjectType**: `number` = `0`

#### Defined in

[lib/transports/AACTransport.ts:22](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/AACTransport.ts#L22)

___

### client

• **client**: [`RTSPClient`](RTSPClient.md)

#### Defined in

[lib/transports/AACTransport.ts:19](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/AACTransport.ts#L19)

___

### stream

• **stream**: `Writable`

#### Defined in

[lib/transports/AACTransport.ts:20](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/AACTransport.ts#L20)

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

[lib/transports/AACTransport.ts:65](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/transports/AACTransport.ts#L65)
