[Yellowstone](../README.md) / RTSPClient

# Class: RTSPClient

## Hierarchy

- `EventEmitter`

  ↳ **`RTSPClient`**

  ↳↳ [`ONVIFClient`](ONVIFClient.md)

## Table of contents

### Constructors

- [constructor](RTSPClient.md#constructor)

### Properties

- [\_cSeq](RTSPClient.md#_cseq)
- [\_client](RTSPClient.md#_client)
- [\_keepAliveID](RTSPClient.md#_keepaliveid)
- [\_nextFreeInterleavedChannel](RTSPClient.md#_nextfreeinterleavedchannel)
- [\_nextFreeUDPPort](RTSPClient.md#_nextfreeudpport)
- [\_session](RTSPClient.md#_session)
- [\_unsupportedExtensions](RTSPClient.md#_unsupportedextensions)
- [\_url](RTSPClient.md#_url)
- [clientSSRC](RTSPClient.md#clientssrc)
- [closed](RTSPClient.md#closed)
- [headers](RTSPClient.md#headers)
- [isConnected](RTSPClient.md#isconnected)
- [messageBytes](RTSPClient.md#messagebytes)
- [password](RTSPClient.md#password)
- [readState](RTSPClient.md#readstate)
- [rtspContentLength](RTSPClient.md#rtspcontentlength)
- [rtspHeaders](RTSPClient.md#rtspheaders)
- [rtspPacket](RTSPClient.md#rtsppacket)
- [rtspPacketLength](RTSPClient.md#rtsppacketlength)
- [rtspPacketPointer](RTSPClient.md#rtsppacketpointer)
- [rtspStatusLine](RTSPClient.md#rtspstatusline)
- [setupResult](RTSPClient.md#setupresult)
- [tcpSocket](RTSPClient.md#tcpsocket)
- [username](RTSPClient.md#username)
- [defaultMaxListeners](RTSPClient.md#defaultmaxlisteners)

### Methods

- [\_emptyReceiverReport](RTSPClient.md#_emptyreceiverreport)
- [\_netConnect](RTSPClient.md#_netconnect)
- [\_onData](RTSPClient.md#_ondata)
- [\_sendInterleavedData](RTSPClient.md#_sendinterleaveddata)
- [\_sendUDPData](RTSPClient.md#_sendudpdata)
- [\_socketWrite](RTSPClient.md#_socketwrite)
- [addListener](RTSPClient.md#addlistener)
- [close](RTSPClient.md#close)
- [connect](RTSPClient.md#connect)
- [emit](RTSPClient.md#emit)
- [eventNames](RTSPClient.md#eventnames)
- [getMaxListeners](RTSPClient.md#getmaxlisteners)
- [listenerCount](RTSPClient.md#listenercount)
- [listeners](RTSPClient.md#listeners)
- [off](RTSPClient.md#off)
- [on](RTSPClient.md#on)
- [once](RTSPClient.md#once)
- [pause](RTSPClient.md#pause)
- [play](RTSPClient.md#play)
- [prependListener](RTSPClient.md#prependlistener)
- [prependOnceListener](RTSPClient.md#prependoncelistener)
- [rawListeners](RTSPClient.md#rawlisteners)
- [removeAllListeners](RTSPClient.md#removealllisteners)
- [removeListener](RTSPClient.md#removelistener)
- [request](RTSPClient.md#request)
- [respond](RTSPClient.md#respond)
- [sendAudioBackChannel](RTSPClient.md#sendaudiobackchannel)
- [setMaxListeners](RTSPClient.md#setmaxlisteners)
- [listenerCount](RTSPClient.md#listenercount-1)
- [once](RTSPClient.md#once-1)

## Constructors

### constructor

• **new RTSPClient**(`username`, `password`, `headers?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `username` | `string` |
| `password` | `string` |
| `headers?` | `Object` |

#### Overrides

EventEmitter.constructor

#### Defined in

[lib/RTSPClient.ts:128](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L128)

## Properties

### \_cSeq

• **\_cSeq**: `number` = `0`

#### Defined in

[lib/RTSPClient.ts:96](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L96)

___

### \_client

• `Optional` **\_client**: `Socket`

#### Defined in

[lib/RTSPClient.ts:95](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L95)

___

### \_keepAliveID

• `Optional` **\_keepAliveID**: `Timeout`

#### Defined in

[lib/RTSPClient.ts:100](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L100)

___

### \_nextFreeInterleavedChannel

• **\_nextFreeInterleavedChannel**: `number` = `0`

#### Defined in

[lib/RTSPClient.ts:101](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L101)

___

### \_nextFreeUDPPort

• **\_nextFreeUDPPort**: `number` = `5000`

#### Defined in

[lib/RTSPClient.ts:102](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L102)

___

### \_session

• `Optional` **\_session**: `string`

#### Defined in

[lib/RTSPClient.ts:99](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L99)

___

### \_unsupportedExtensions

• `Optional` **\_unsupportedExtensions**: `string`[]

#### Defined in

[lib/RTSPClient.ts:97](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L97)

___

### \_url

• `Optional` **\_url**: `string`

#### Defined in

[lib/RTSPClient.ts:94](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L94)

___

### clientSSRC

• **clientSSRC**: `number`

#### Defined in

[lib/RTSPClient.ts:124](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L124)

___

### closed

• **closed**: `boolean` = `false`

#### Defined in

[lib/RTSPClient.ts:90](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L90)

___

### headers

• **headers**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[lib/RTSPClient.ts:87](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L87)

___

### isConnected

• **isConnected**: `boolean` = `false`

#### Defined in

[lib/RTSPClient.ts:89](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L89)

___

### messageBytes

• **messageBytes**: `number`[] = `[]`

#### Defined in

[lib/RTSPClient.ts:108](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L108)

___

### password

• **password**: `string`

#### Defined in

[lib/RTSPClient.ts:86](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L86)

___

### readState

• **readState**: `ReadStates` = `ReadStates.SEARCHING`

#### Defined in

[lib/RTSPClient.ts:104](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L104)

___

### rtspContentLength

• **rtspContentLength**: `number` = `0`

#### Defined in

[lib/RTSPClient.ts:113](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L113)

___

### rtspHeaders

• **rtspHeaders**: `Headers` = `{}`

#### Defined in

[lib/RTSPClient.ts:115](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L115)

___

### rtspPacket

• **rtspPacket**: `Buffer`

#### Defined in

[lib/RTSPClient.ts:120](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L120)

___

### rtspPacketLength

• **rtspPacketLength**: `number` = `0`

#### Defined in

[lib/RTSPClient.ts:119](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L119)

___

### rtspPacketPointer

• **rtspPacketPointer**: `number` = `0`

#### Defined in

[lib/RTSPClient.ts:121](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L121)

___

### rtspStatusLine

• **rtspStatusLine**: `string` = `""`

#### Defined in

[lib/RTSPClient.ts:114](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L114)

___

### setupResult

• **setupResult**: `Detail`[] = `[]`

#### Defined in

[lib/RTSPClient.ts:127](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L127)

___

### tcpSocket

• **tcpSocket**: `Socket`

#### Defined in

[lib/RTSPClient.ts:126](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L126)

___

### username

• **username**: `string`

#### Defined in

[lib/RTSPClient.ts:85](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L85)

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: `number`

#### Inherited from

EventEmitter.defaultMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:20

## Methods

### \_emptyReceiverReport

▸ **_emptyReceiverReport**(): `Buffer`

#### Returns

`Buffer`

#### Defined in

[lib/RTSPClient.ts:879](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L879)

___

### \_netConnect

▸ **_netConnect**(`hostname`, `port`): `Promise`<[`RTSPClient`](RTSPClient.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `hostname` | `string` |
| `port` | `number` |

#### Returns

`Promise`<[`RTSPClient`](RTSPClient.md)\>

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

#### Defined in

[lib/RTSPClient.ts:898](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L898)

___

### addListener

▸ **addListener**(`event`, `listener`): [`RTSPClient`](RTSPClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`RTSPClient`](RTSPClient.md)

#### Inherited from

EventEmitter.addListener

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

EventEmitter.emit

#### Defined in

node_modules/@types/node/globals.d.ts:564

___

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

#### Returns

(`string` \| `symbol`)[]

#### Inherited from

EventEmitter.eventNames

#### Defined in

node_modules/@types/node/globals.d.ts:569

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

#### Returns

`number`

#### Inherited from

EventEmitter.getMaxListeners

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

EventEmitter.listenerCount

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

EventEmitter.listeners

#### Defined in

node_modules/@types/node/globals.d.ts:562

___

### off

▸ **off**(`event`, `listener`): [`RTSPClient`](RTSPClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`RTSPClient`](RTSPClient.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/globals.d.ts:558

___

### on

▸ **on**(`event`, `listener`): [`RTSPClient`](RTSPClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`RTSPClient`](RTSPClient.md)

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/globals.d.ts:555

___

### once

▸ **once**(`event`, `listener`): [`RTSPClient`](RTSPClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`RTSPClient`](RTSPClient.md)

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/globals.d.ts:556

___

### pause

▸ **pause**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/RTSPClient.ts:622](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L622)

___

### play

▸ **play**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/RTSPClient.ts:614](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L614)

___

### prependListener

▸ **prependListener**(`event`, `listener`): [`RTSPClient`](RTSPClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`RTSPClient`](RTSPClient.md)

#### Inherited from

EventEmitter.prependListener

#### Defined in

node_modules/@types/node/globals.d.ts:567

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [`RTSPClient`](RTSPClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`RTSPClient`](RTSPClient.md)

#### Inherited from

EventEmitter.prependOnceListener

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

EventEmitter.rawListeners

#### Defined in

node_modules/@types/node/globals.d.ts:563

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [`RTSPClient`](RTSPClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[`RTSPClient`](RTSPClient.md)

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/@types/node/globals.d.ts:559

___

### removeListener

▸ **removeListener**(`event`, `listener`): [`RTSPClient`](RTSPClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`RTSPClient`](RTSPClient.md)

#### Inherited from

EventEmitter.removeListener

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

#### Defined in

[lib/RTSPClient.ts:630](https://github.com/mbullington/yellowstone/blob/b881ee4/lib/RTSPClient.ts#L630)

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [`RTSPClient`](RTSPClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[`RTSPClient`](RTSPClient.md)

#### Inherited from

EventEmitter.setMaxListeners

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

EventEmitter.listenerCount

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

EventEmitter.once

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

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:14
