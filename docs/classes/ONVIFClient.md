[Yellowstone](../README.md) / ONVIFClient

# Class: ONVIFClient

## Hierarchy

- [`RTSPClient`](RTSPClient.md)

  ↳ **`ONVIFClient`**

## Table of contents

### Constructors

- [constructor](ONVIFClient.md#constructor)

### Properties

- [\_cSeq](ONVIFClient.md#_cseq)
- [\_client](ONVIFClient.md#_client)
- [\_keepAliveID](ONVIFClient.md#_keepaliveid)
- [\_nextFreeInterleavedChannel](ONVIFClient.md#_nextfreeinterleavedchannel)
- [\_nextFreeUDPPort](ONVIFClient.md#_nextfreeudpport)
- [\_session](ONVIFClient.md#_session)
- [\_unsupportedExtensions](ONVIFClient.md#_unsupportedextensions)
- [\_url](ONVIFClient.md#_url)
- [clientSSRC](ONVIFClient.md#clientssrc)
- [closed](ONVIFClient.md#closed)
- [headers](ONVIFClient.md#headers)
- [isConnected](ONVIFClient.md#isconnected)
- [messageBytes](ONVIFClient.md#messagebytes)
- [password](ONVIFClient.md#password)
- [readState](ONVIFClient.md#readstate)
- [rtspContentLength](ONVIFClient.md#rtspcontentlength)
- [rtspHeaders](ONVIFClient.md#rtspheaders)
- [rtspPacket](ONVIFClient.md#rtsppacket)
- [rtspPacketLength](ONVIFClient.md#rtsppacketlength)
- [rtspPacketPointer](ONVIFClient.md#rtsppacketpointer)
- [rtspStatusLine](ONVIFClient.md#rtspstatusline)
- [setupResult](ONVIFClient.md#setupresult)
- [tcpSocket](ONVIFClient.md#tcpsocket)
- [username](ONVIFClient.md#username)
- [defaultMaxListeners](ONVIFClient.md#defaultmaxlisteners)

### Methods

- [\_emptyReceiverReport](ONVIFClient.md#_emptyreceiverreport)
- [\_netConnect](ONVIFClient.md#_netconnect)
- [\_onData](ONVIFClient.md#_ondata)
- [\_sendInterleavedData](ONVIFClient.md#_sendinterleaveddata)
- [\_sendUDPData](ONVIFClient.md#_sendudpdata)
- [\_socketWrite](ONVIFClient.md#_socketwrite)
- [addListener](ONVIFClient.md#addlistener)
- [close](ONVIFClient.md#close)
- [connect](ONVIFClient.md#connect)
- [emit](ONVIFClient.md#emit)
- [eventNames](ONVIFClient.md#eventnames)
- [getMaxListeners](ONVIFClient.md#getmaxlisteners)
- [listenerCount](ONVIFClient.md#listenercount)
- [listeners](ONVIFClient.md#listeners)
- [off](ONVIFClient.md#off)
- [on](ONVIFClient.md#on)
- [once](ONVIFClient.md#once)
- [pause](ONVIFClient.md#pause)
- [play](ONVIFClient.md#play)
- [playFrom](ONVIFClient.md#playfrom)
- [playReverse](ONVIFClient.md#playreverse)
- [prependListener](ONVIFClient.md#prependlistener)
- [prependOnceListener](ONVIFClient.md#prependoncelistener)
- [rawListeners](ONVIFClient.md#rawlisteners)
- [removeAllListeners](ONVIFClient.md#removealllisteners)
- [removeListener](ONVIFClient.md#removelistener)
- [request](ONVIFClient.md#request)
- [respond](ONVIFClient.md#respond)
- [sendAudioBackChannel](ONVIFClient.md#sendaudiobackchannel)
- [setMaxListeners](ONVIFClient.md#setmaxlisteners)
- [listenerCount](ONVIFClient.md#listenercount-1)
- [once](ONVIFClient.md#once-1)

## Constructors

### constructor

• **new ONVIFClient**(`username`, `password`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `username` | `string` |
| `password` | `string` |

#### Overrides

[RTSPClient](RTSPClient.md).[constructor](RTSPClient.md#constructor)

#### Defined in

[lib/ONVIFClient.ts:5](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/ONVIFClient.ts#L5)

## Properties

### \_cSeq

• **\_cSeq**: `number` = `0`

#### Inherited from

[RTSPClient](RTSPClient.md).[_cSeq](RTSPClient.md#_cseq)

#### Defined in

[lib/RTSPClient.ts:96](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L96)

___

### \_client

• `Optional` **\_client**: `Socket`

#### Inherited from

[RTSPClient](RTSPClient.md).[_client](RTSPClient.md#_client)

#### Defined in

[lib/RTSPClient.ts:95](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L95)

___

### \_keepAliveID

• `Optional` **\_keepAliveID**: `Timeout`

#### Inherited from

[RTSPClient](RTSPClient.md).[_keepAliveID](RTSPClient.md#_keepaliveid)

#### Defined in

[lib/RTSPClient.ts:100](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L100)

___

### \_nextFreeInterleavedChannel

• **\_nextFreeInterleavedChannel**: `number` = `0`

#### Inherited from

[RTSPClient](RTSPClient.md).[_nextFreeInterleavedChannel](RTSPClient.md#_nextfreeinterleavedchannel)

#### Defined in

[lib/RTSPClient.ts:101](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L101)

___

### \_nextFreeUDPPort

• **\_nextFreeUDPPort**: `number` = `5000`

#### Inherited from

[RTSPClient](RTSPClient.md).[_nextFreeUDPPort](RTSPClient.md#_nextfreeudpport)

#### Defined in

[lib/RTSPClient.ts:102](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L102)

___

### \_session

• `Optional` **\_session**: `string`

#### Inherited from

[RTSPClient](RTSPClient.md).[_session](RTSPClient.md#_session)

#### Defined in

[lib/RTSPClient.ts:99](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L99)

___

### \_unsupportedExtensions

• `Optional` **\_unsupportedExtensions**: `string`[]

#### Inherited from

[RTSPClient](RTSPClient.md).[_unsupportedExtensions](RTSPClient.md#_unsupportedextensions)

#### Defined in

[lib/RTSPClient.ts:97](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L97)

___

### \_url

• `Optional` **\_url**: `string`

#### Inherited from

[RTSPClient](RTSPClient.md).[_url](RTSPClient.md#_url)

#### Defined in

[lib/RTSPClient.ts:94](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L94)

___

### clientSSRC

• **clientSSRC**: `number`

#### Inherited from

[RTSPClient](RTSPClient.md).[clientSSRC](RTSPClient.md#clientssrc)

#### Defined in

[lib/RTSPClient.ts:124](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L124)

___

### closed

• **closed**: `boolean` = `false`

#### Inherited from

[RTSPClient](RTSPClient.md).[closed](RTSPClient.md#closed)

#### Defined in

[lib/RTSPClient.ts:90](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L90)

___

### headers

• **headers**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Inherited from

[RTSPClient](RTSPClient.md).[headers](RTSPClient.md#headers)

#### Defined in

[lib/RTSPClient.ts:87](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L87)

___

### isConnected

• **isConnected**: `boolean` = `false`

#### Inherited from

[RTSPClient](RTSPClient.md).[isConnected](RTSPClient.md#isconnected)

#### Defined in

[lib/RTSPClient.ts:89](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L89)

___

### messageBytes

• **messageBytes**: `number`[] = `[]`

#### Inherited from

[RTSPClient](RTSPClient.md).[messageBytes](RTSPClient.md#messagebytes)

#### Defined in

[lib/RTSPClient.ts:108](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L108)

___

### password

• **password**: `string`

#### Inherited from

[RTSPClient](RTSPClient.md).[password](RTSPClient.md#password)

#### Defined in

[lib/RTSPClient.ts:86](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L86)

___

### readState

• **readState**: `ReadStates` = `ReadStates.SEARCHING`

#### Inherited from

[RTSPClient](RTSPClient.md).[readState](RTSPClient.md#readstate)

#### Defined in

[lib/RTSPClient.ts:104](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L104)

___

### rtspContentLength

• **rtspContentLength**: `number` = `0`

#### Inherited from

[RTSPClient](RTSPClient.md).[rtspContentLength](RTSPClient.md#rtspcontentlength)

#### Defined in

[lib/RTSPClient.ts:113](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L113)

___

### rtspHeaders

• **rtspHeaders**: `Headers` = `{}`

#### Inherited from

[RTSPClient](RTSPClient.md).[rtspHeaders](RTSPClient.md#rtspheaders)

#### Defined in

[lib/RTSPClient.ts:115](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L115)

___

### rtspPacket

• **rtspPacket**: `Buffer`

#### Inherited from

[RTSPClient](RTSPClient.md).[rtspPacket](RTSPClient.md#rtsppacket)

#### Defined in

[lib/RTSPClient.ts:120](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L120)

___

### rtspPacketLength

• **rtspPacketLength**: `number` = `0`

#### Inherited from

[RTSPClient](RTSPClient.md).[rtspPacketLength](RTSPClient.md#rtsppacketlength)

#### Defined in

[lib/RTSPClient.ts:119](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L119)

___

### rtspPacketPointer

• **rtspPacketPointer**: `number` = `0`

#### Inherited from

[RTSPClient](RTSPClient.md).[rtspPacketPointer](RTSPClient.md#rtsppacketpointer)

#### Defined in

[lib/RTSPClient.ts:121](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L121)

___

### rtspStatusLine

• **rtspStatusLine**: `string` = `""`

#### Inherited from

[RTSPClient](RTSPClient.md).[rtspStatusLine](RTSPClient.md#rtspstatusline)

#### Defined in

[lib/RTSPClient.ts:114](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L114)

___

### setupResult

• **setupResult**: `Detail`[] = `[]`

#### Inherited from

[RTSPClient](RTSPClient.md).[setupResult](RTSPClient.md#setupresult)

#### Defined in

[lib/RTSPClient.ts:127](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L127)

___

### tcpSocket

• **tcpSocket**: `Socket`

#### Inherited from

[RTSPClient](RTSPClient.md).[tcpSocket](RTSPClient.md#tcpsocket)

#### Defined in

[lib/RTSPClient.ts:126](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L126)

___

### username

• **username**: `string`

#### Inherited from

[RTSPClient](RTSPClient.md).[username](RTSPClient.md#username)

#### Defined in

[lib/RTSPClient.ts:85](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L85)

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: `number`

#### Inherited from

[RTSPClient](RTSPClient.md).[defaultMaxListeners](RTSPClient.md#defaultmaxlisteners)

#### Defined in

node_modules/@types/node/events.d.ts:20

## Methods

### \_emptyReceiverReport

▸ **_emptyReceiverReport**(): `Buffer`

#### Returns

`Buffer`

#### Inherited from

[RTSPClient](RTSPClient.md).[_emptyReceiverReport](RTSPClient.md#_emptyreceiverreport)

#### Defined in

[lib/RTSPClient.ts:879](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L879)

___

### \_netConnect

▸ **_netConnect**(`hostname`, `port`): `Promise`<[`ONVIFClient`](ONVIFClient.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `hostname` | `string` |
| `port` | `number` |

#### Returns

`Promise`<[`ONVIFClient`](ONVIFClient.md)\>

#### Inherited from

[RTSPClient](RTSPClient.md).[_netConnect](RTSPClient.md#_netconnect)

#### Defined in

[lib/RTSPClient.ts:150](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L150)

___

### \_onData

▸ **_onData**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Buffer` |

#### Returns

`void`

#### Inherited from

[RTSPClient](RTSPClient.md).[_onData](RTSPClient.md#_ondata)

#### Defined in

[lib/RTSPClient.ts:693](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L693)

___

### \_sendInterleavedData

▸ **_sendInterleavedData**(`channel`, `buffer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `channel` | `number` |
| `buffer` | `Buffer` |

#### Returns

`void`

#### Inherited from

[RTSPClient](RTSPClient.md).[_sendInterleavedData](RTSPClient.md#_sendinterleaveddata)

#### Defined in

[lib/RTSPClient.ts:853](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L853)

___

### \_sendUDPData

▸ **_sendUDPData**(`host`, `port`, `buffer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `host` | `string` |
| `port` | `number` |
| `buffer` | `Buffer` |

#### Returns

`void`

#### Inherited from

[RTSPClient](RTSPClient.md).[_sendUDPData](RTSPClient.md#_sendudpdata)

#### Defined in

[lib/RTSPClient.ts:871](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L871)

___

### \_socketWrite

▸ **_socketWrite**(`socket`, `data`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `socket` | `Socket` |
| `data` | `Buffer` |

#### Returns

`Promise`<`any`\>

#### Inherited from

[RTSPClient](RTSPClient.md).[_socketWrite](RTSPClient.md#_socketwrite)

#### Defined in

[lib/RTSPClient.ts:898](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L898)

___

### addListener

▸ **addListener**(`event`, `listener`): [`ONVIFClient`](ONVIFClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ONVIFClient`](ONVIFClient.md)

#### Inherited from

[RTSPClient](RTSPClient.md).[addListener](RTSPClient.md#addlistener)

#### Defined in

node_modules/@types/node/globals.d.ts:554

___

### close

▸ **close**(`isImmediate?`): `Promise`<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `isImmediate` | `boolean` | `false` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[RTSPClient](RTSPClient.md).[close](RTSPClient.md#close)

#### Defined in

[lib/RTSPClient.ts:667](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L667)

___

### connect

▸ **connect**(`url`, `«destructured»?`): `Promise`<`Detail`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `«destructured»` | `Object` |
| › `connection?` | `Connection` |
| › `keepAlive` | `boolean` |

#### Returns

`Promise`<`Detail`[]\>

#### Inherited from

[RTSPClient](RTSPClient.md).[connect](RTSPClient.md#connect)

#### Defined in

[lib/RTSPClient.ts:198](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L198)

___

### emit

▸ **emit**(`event`, `...args`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

#### Inherited from

[RTSPClient](RTSPClient.md).[emit](RTSPClient.md#emit)

#### Defined in

node_modules/@types/node/globals.d.ts:564

___

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

#### Returns

(`string` \| `symbol`)[]

#### Inherited from

[RTSPClient](RTSPClient.md).[eventNames](RTSPClient.md#eventnames)

#### Defined in

node_modules/@types/node/globals.d.ts:569

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

#### Returns

`number`

#### Inherited from

[RTSPClient](RTSPClient.md).[getMaxListeners](RTSPClient.md#getmaxlisteners)

#### Defined in

node_modules/@types/node/globals.d.ts:561

___

### listenerCount

▸ **listenerCount**(`type`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` \| `symbol` |

#### Returns

`number`

#### Inherited from

[RTSPClient](RTSPClient.md).[listenerCount](RTSPClient.md#listenercount)

#### Defined in

node_modules/@types/node/globals.d.ts:565

___

### listeners

▸ **listeners**(`event`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

[RTSPClient](RTSPClient.md).[listeners](RTSPClient.md#listeners)

#### Defined in

node_modules/@types/node/globals.d.ts:562

___

### off

▸ **off**(`event`, `listener`): [`ONVIFClient`](ONVIFClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ONVIFClient`](ONVIFClient.md)

#### Inherited from

[RTSPClient](RTSPClient.md).[off](RTSPClient.md#off)

#### Defined in

node_modules/@types/node/globals.d.ts:558

___

### on

▸ **on**(`event`, `listener`): [`ONVIFClient`](ONVIFClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ONVIFClient`](ONVIFClient.md)

#### Inherited from

[RTSPClient](RTSPClient.md).[on](RTSPClient.md#on)

#### Defined in

node_modules/@types/node/globals.d.ts:555

___

### once

▸ **once**(`event`, `listener`): [`ONVIFClient`](ONVIFClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ONVIFClient`](ONVIFClient.md)

#### Inherited from

[RTSPClient](RTSPClient.md).[once](RTSPClient.md#once)

#### Defined in

node_modules/@types/node/globals.d.ts:556

___

### pause

▸ **pause**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[RTSPClient](RTSPClient.md).[pause](RTSPClient.md#pause)

#### Defined in

[lib/RTSPClient.ts:622](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L622)

___

### play

▸ **play**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

[RTSPClient](RTSPClient.md).[play](RTSPClient.md#play)

#### Defined in

[lib/RTSPClient.ts:614](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L614)

___

### playFrom

▸ **playFrom**(`from`, `to?`): `Promise`<[`ONVIFClient`](ONVIFClient.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `from` | `Date` |
| `to?` | `Date` |

#### Returns

`Promise`<[`ONVIFClient`](ONVIFClient.md)\>

#### Defined in

[lib/ONVIFClient.ts:9](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/ONVIFClient.ts#L9)

___

### playReverse

▸ **playReverse**(`from?`, `to?`): `Promise`<[`ONVIFClient`](ONVIFClient.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `from?` | `Date` |
| `to?` | `Date` |

#### Returns

`Promise`<[`ONVIFClient`](ONVIFClient.md)\>

#### Defined in

[lib/ONVIFClient.ts:24](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/ONVIFClient.ts#L24)

___

### prependListener

▸ **prependListener**(`event`, `listener`): [`ONVIFClient`](ONVIFClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ONVIFClient`](ONVIFClient.md)

#### Inherited from

[RTSPClient](RTSPClient.md).[prependListener](RTSPClient.md#prependlistener)

#### Defined in

node_modules/@types/node/globals.d.ts:567

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [`ONVIFClient`](ONVIFClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ONVIFClient`](ONVIFClient.md)

#### Inherited from

[RTSPClient](RTSPClient.md).[prependOnceListener](RTSPClient.md#prependoncelistener)

#### Defined in

node_modules/@types/node/globals.d.ts:568

___

### rawListeners

▸ **rawListeners**(`event`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

[RTSPClient](RTSPClient.md).[rawListeners](RTSPClient.md#rawlisteners)

#### Defined in

node_modules/@types/node/globals.d.ts:563

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [`ONVIFClient`](ONVIFClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[`ONVIFClient`](ONVIFClient.md)

#### Inherited from

[RTSPClient](RTSPClient.md).[removeAllListeners](RTSPClient.md#removealllisteners)

#### Defined in

node_modules/@types/node/globals.d.ts:559

___

### removeListener

▸ **removeListener**(`event`, `listener`): [`ONVIFClient`](ONVIFClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ONVIFClient`](ONVIFClient.md)

#### Inherited from

[RTSPClient](RTSPClient.md).[removeListener](RTSPClient.md#removelistener)

#### Defined in

node_modules/@types/node/globals.d.ts:557

___

### request

▸ **request**(`requestName`, `headersParam?`, `url?`): `Promise`<`void` \| { `headers`: `Headers` ; `mediaHeaders?`: `string`[]  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `requestName` | `string` |
| `headersParam` | `Headers` |
| `url?` | `string` |

#### Returns

`Promise`<`void` \| { `headers`: `Headers` ; `mediaHeaders?`: `string`[]  }\>

#### Inherited from

[RTSPClient](RTSPClient.md).[request](RTSPClient.md#request)

#### Defined in

[lib/RTSPClient.ts:466](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L466)

___

### respond

▸ **respond**(`status`, `headersParam?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `status` | `string` |
| `headersParam` | `Headers` |

#### Returns

`void`

#### Inherited from

[RTSPClient](RTSPClient.md).[respond](RTSPClient.md#respond)

#### Defined in

[lib/RTSPClient.ts:593](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L593)

___

### sendAudioBackChannel

▸ **sendAudioBackChannel**(`audioChunk`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `audioChunk` | `Buffer` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[RTSPClient](RTSPClient.md).[sendAudioBackChannel](RTSPClient.md#sendaudiobackchannel)

#### Defined in

[lib/RTSPClient.ts:630](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L630)

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [`ONVIFClient`](ONVIFClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[`ONVIFClient`](ONVIFClient.md)

#### Inherited from

[RTSPClient](RTSPClient.md).[setMaxListeners](RTSPClient.md#setmaxlisteners)

#### Defined in

node_modules/@types/node/globals.d.ts:560

___

### listenerCount

▸ `Static` **listenerCount**(`emitter`, `event`): `number`

**`Deprecated`**

since v4.0.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `EventEmitter` |
| `event` | `string` \| `symbol` |

#### Returns

`number`

#### Inherited from

[RTSPClient](RTSPClient.md).[listenerCount](RTSPClient.md#listenercount-1)

#### Defined in

node_modules/@types/node/events.d.ts:17

___

### once

▸ `Static` **once**(`emitter`, `event`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `NodeEventTarget` |
| `event` | `string` \| `symbol` |

#### Returns

`Promise`<`any`[]\>

#### Inherited from

[RTSPClient](RTSPClient.md).[once](RTSPClient.md#once-1)

#### Defined in

node_modules/@types/node/events.d.ts:13

▸ `Static` **once**(`emitter`, `event`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `DOMEventTarget` |
| `event` | `string` |

#### Returns

`Promise`<`any`[]\>

#### Inherited from

[RTSPClient](RTSPClient.md).[once](RTSPClient.md#once-1)

#### Defined in

node_modules/@types/node/events.d.ts:14
