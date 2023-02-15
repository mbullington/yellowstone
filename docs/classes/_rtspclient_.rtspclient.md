[Yellowstone](../README.md) > ["RTSPClient"](../modules/_rtspclient_.md) > [RTSPClient](../classes/_rtspclient_.rtspclient.md)

# Class: RTSPClient

## Hierarchy

 `EventEmitter`

**↳ RTSPClient**

↳  [ONVIFClient](_onvifclient_.onvifclient.md)

## Index

### Constructors

* [constructor](_rtspclient_.rtspclient.md#constructor)

### Properties

* [_cSeq](_rtspclient_.rtspclient.md#_cseq)
* [_client](_rtspclient_.rtspclient.md#_client)
* [_keepAliveID](_rtspclient_.rtspclient.md#_keepaliveid)
* [_nextFreeInterleavedChannel](_rtspclient_.rtspclient.md#_nextfreeinterleavedchannel)
* [_nextFreeUDPPort](_rtspclient_.rtspclient.md#_nextfreeudpport)
* [_session](_rtspclient_.rtspclient.md#_session)
* [_unsupportedExtensions](_rtspclient_.rtspclient.md#_unsupportedextensions)
* [_url](_rtspclient_.rtspclient.md#_url)
* [clientSSRC](_rtspclient_.rtspclient.md#clientssrc)
* [headers](_rtspclient_.rtspclient.md#headers)
* [isConnected](_rtspclient_.rtspclient.md#isconnected)
* [messageBytes](_rtspclient_.rtspclient.md#messagebytes)
* [password](_rtspclient_.rtspclient.md#password)
* [readState](_rtspclient_.rtspclient.md#readstate)
* [rtspContentLength](_rtspclient_.rtspclient.md#rtspcontentlength)
* [rtspHeaders](_rtspclient_.rtspclient.md#rtspheaders)
* [rtspPacket](_rtspclient_.rtspclient.md#rtsppacket)
* [rtspPacketLength](_rtspclient_.rtspclient.md#rtsppacketlength)
* [rtspPacketPointer](_rtspclient_.rtspclient.md#rtsppacketpointer)
* [rtspStatusLine](_rtspclient_.rtspclient.md#rtspstatusline)
* [setupResult](_rtspclient_.rtspclient.md#setupresult)
* [tcpSocket](_rtspclient_.rtspclient.md#tcpsocket)
* [username](_rtspclient_.rtspclient.md#username)
* [defaultMaxListeners](_rtspclient_.rtspclient.md#defaultmaxlisteners)

### Methods

* [_emptyReceiverReport](_rtspclient_.rtspclient.md#_emptyreceiverreport)
* [_netConnect](_rtspclient_.rtspclient.md#_netconnect)
* [_onData](_rtspclient_.rtspclient.md#_ondata)
* [_sendInterleavedData](_rtspclient_.rtspclient.md#_sendinterleaveddata)
* [_sendUDPData](_rtspclient_.rtspclient.md#_sendudpdata)
* [_socketWrite](_rtspclient_.rtspclient.md#_socketwrite)
* [addListener](_rtspclient_.rtspclient.md#addlistener)
* [close](_rtspclient_.rtspclient.md#close)
* [connect](_rtspclient_.rtspclient.md#connect)
* [emit](_rtspclient_.rtspclient.md#emit)
* [eventNames](_rtspclient_.rtspclient.md#eventnames)
* [getMaxListeners](_rtspclient_.rtspclient.md#getmaxlisteners)
* [listenerCount](_rtspclient_.rtspclient.md#listenercount)
* [listeners](_rtspclient_.rtspclient.md#listeners)
* [off](_rtspclient_.rtspclient.md#off)
* [on](_rtspclient_.rtspclient.md#on)
* [once](_rtspclient_.rtspclient.md#once)
* [pause](_rtspclient_.rtspclient.md#pause)
* [play](_rtspclient_.rtspclient.md#play)
* [prependListener](_rtspclient_.rtspclient.md#prependlistener)
* [prependOnceListener](_rtspclient_.rtspclient.md#prependoncelistener)
* [rawListeners](_rtspclient_.rtspclient.md#rawlisteners)
* [removeAllListeners](_rtspclient_.rtspclient.md#removealllisteners)
* [removeListener](_rtspclient_.rtspclient.md#removelistener)
* [request](_rtspclient_.rtspclient.md#request)
* [respond](_rtspclient_.rtspclient.md#respond)
* [sendAudioBackChannel](_rtspclient_.rtspclient.md#sendaudiobackchannel)
* [setMaxListeners](_rtspclient_.rtspclient.md#setmaxlisteners)
* [listenerCount](_rtspclient_.rtspclient.md#listenercount-1)
* [once](_rtspclient_.rtspclient.md#once-1)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new RTSPClient**(username: *`string`*, password: *`string`*, headers: *`undefined` \| `object`*): [RTSPClient](_rtspclient_.rtspclient.md)

*Overrides EventEmitter.__constructor*

*Defined in [RTSPClient.ts:95](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L95)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| username | `string` |
| password | `string` |
| `Optional` headers | `undefined` \| `object` |

**Returns:** [RTSPClient](_rtspclient_.rtspclient.md)

___

## Properties

<a id="_cseq"></a>

###  _cSeq

**● _cSeq**: *`number`* = 0

*Defined in [RTSPClient.ts:64](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L64)*

___
<a id="_client"></a>

### `<Optional>` _client

**● _client**: *`net.Socket`*

*Defined in [RTSPClient.ts:63](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L63)*

___
<a id="_keepaliveid"></a>

### `<Optional>` _keepAliveID

**● _keepAliveID**: *`NodeJS.Timeout`*

*Defined in [RTSPClient.ts:68](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L68)*

___
<a id="_nextfreeinterleavedchannel"></a>

###  _nextFreeInterleavedChannel

**● _nextFreeInterleavedChannel**: *`number`* = 0

*Defined in [RTSPClient.ts:69](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L69)*

___
<a id="_nextfreeudpport"></a>

###  _nextFreeUDPPort

**● _nextFreeUDPPort**: *`number`* = 5000

*Defined in [RTSPClient.ts:70](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L70)*

___
<a id="_session"></a>

### `<Optional>` _session

**● _session**: *`undefined` \| `string`*

*Defined in [RTSPClient.ts:67](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L67)*

___
<a id="_unsupportedextensions"></a>

### `<Optional>` _unsupportedExtensions

**● _unsupportedExtensions**: *`string`[]*

*Defined in [RTSPClient.ts:65](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L65)*

___
<a id="_url"></a>

### `<Optional>` _url

**● _url**: *`undefined` \| `string`*

*Defined in [RTSPClient.ts:62](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L62)*

___
<a id="clientssrc"></a>

###  clientSSRC

**● clientSSRC**: *`number`* =  generateSSRC()

*Defined in [RTSPClient.ts:92](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L92)*

___
<a id="headers"></a>

###  headers

**● headers**: *`object`*

*Defined in [RTSPClient.ts:56](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L56)*

#### Type declaration

[key: `string`]: `string`

___
<a id="isconnected"></a>

###  isConnected

**● isConnected**: *`boolean`* = false

*Defined in [RTSPClient.ts:58](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L58)*

___
<a id="messagebytes"></a>

###  messageBytes

**● messageBytes**: *`number`[]* =  []

*Defined in [RTSPClient.ts:76](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L76)*

___
<a id="password"></a>

###  password

**● password**: *`string`*

*Defined in [RTSPClient.ts:55](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L55)*

___
<a id="readstate"></a>

###  readState

**● readState**: *[ReadStates](../enums/_rtspclient_.readstates.md)* =  ReadStates.SEARCHING

*Defined in [RTSPClient.ts:72](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L72)*

___
<a id="rtspcontentlength"></a>

###  rtspContentLength

**● rtspContentLength**: *`number`* = 0

*Defined in [RTSPClient.ts:81](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L81)*

___
<a id="rtspheaders"></a>

###  rtspHeaders

**● rtspHeaders**: *[Headers](../modules/_rtspclient_.md#headers)*

*Defined in [RTSPClient.ts:83](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L83)*

___
<a id="rtsppacket"></a>

###  rtspPacket

**● rtspPacket**: *`Buffer`* =  new Buffer("")

*Defined in [RTSPClient.ts:88](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L88)*

___
<a id="rtsppacketlength"></a>

###  rtspPacketLength

**● rtspPacketLength**: *`number`* = 0

*Defined in [RTSPClient.ts:87](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L87)*

___
<a id="rtsppacketpointer"></a>

###  rtspPacketPointer

**● rtspPacketPointer**: *`number`* = 0

*Defined in [RTSPClient.ts:89](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L89)*

___
<a id="rtspstatusline"></a>

###  rtspStatusLine

**● rtspStatusLine**: *`string`* = ""

*Defined in [RTSPClient.ts:82](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L82)*

___
<a id="setupresult"></a>

###  setupResult

**● setupResult**: *`Array`<`any`>* =  []

*Defined in [RTSPClient.ts:95](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L95)*

___
<a id="tcpsocket"></a>

###  tcpSocket

**● tcpSocket**: *`Socket`* =  new net.Socket()

*Defined in [RTSPClient.ts:94](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L94)*

___
<a id="username"></a>

###  username

**● username**: *`string`*

*Defined in [RTSPClient.ts:54](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L54)*

___
<a id="defaultmaxlisteners"></a>

### `<Static>` defaultMaxListeners

**● defaultMaxListeners**: *`number`*

*Inherited from EventEmitter.defaultMaxListeners*

*Defined in C:/Users/roger/source/yellowstone/node_modules/@types/node/events.d.ts:20*

___

## Methods

<a id="_emptyreceiverreport"></a>

###  _emptyReceiverReport

▸ **_emptyReceiverReport**(): `Buffer`

*Defined in [RTSPClient.ts:837](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L837)*

**Returns:** `Buffer`

___
<a id="_netconnect"></a>

###  _netConnect

▸ **_netConnect**(hostname: *`string`*, port: *`number`*): `Promise`<`this`>

*Defined in [RTSPClient.ts:118](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L118)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| hostname | `string` |
| port | `number` |

**Returns:** `Promise`<`this`>

___
<a id="_ondata"></a>

###  _onData

▸ **_onData**(data: *`Buffer`*): `void`

*Defined in [RTSPClient.ts:652](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L652)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| data | `Buffer` |

**Returns:** `void`

___
<a id="_sendinterleaveddata"></a>

###  _sendInterleavedData

▸ **_sendInterleavedData**(channel: *`number`*, buffer: *`Buffer`*): `void`

*Defined in [RTSPClient.ts:812](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L812)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| channel | `number` |
| buffer | `Buffer` |

**Returns:** `void`

___
<a id="_sendudpdata"></a>

###  _sendUDPData

▸ **_sendUDPData**(host: *`string`*, port: *`number`*, buffer: *`Buffer`*): `void`

*Defined in [RTSPClient.ts:830](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L830)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| host | `string` |
| port | `number` |
| buffer | `Buffer` |

**Returns:** `void`

___
<a id="_socketwrite"></a>

###  _socketWrite

▸ **_socketWrite**(socket: *`Socket`*, data: *`Buffer`*): `Promise`<`any`>

*Defined in [RTSPClient.ts:856](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L856)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| socket | `Socket` |
| data | `Buffer` |

**Returns:** `Promise`<`any`>

___
<a id="addlistener"></a>

###  addListener

▸ **addListener**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.addListener*

*Defined in C:/Users/roger/source/yellowstone/node_modules/@types/node/globals.d.ts:554*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="close"></a>

###  close

▸ **close**(isImmediate?: *`boolean`*): `Promise`<`this`>

*Defined in [RTSPClient.ts:627](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L627)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` isImmediate | `boolean` | false |

**Returns:** `Promise`<`this`>

___
<a id="connect"></a>

###  connect

▸ **connect**(url: *`string`*, __namedParameters?: *`object`*): `Promise`<`object`[]>

*Defined in [RTSPClient.ts:167](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L167)*

**Parameters:**

**url: `string`**

**`Default value` __namedParameters: `object`**

| Name | Type | Default value |
| ------ | ------ | ------ |
| connection | "udp" \| "tcp" | &quot;udp&quot; |
| keepAlive | `boolean` | true |

**Returns:** `Promise`<`object`[]>

___
<a id="emit"></a>

###  emit

▸ **emit**(event: *`string` \| `symbol`*, args: *`any`[]*): `boolean`

*Inherited from EventEmitter.emit*

*Defined in C:/Users/roger/source/yellowstone/node_modules/@types/node/globals.d.ts:564*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| `Rest` args | `any`[] |

**Returns:** `boolean`

___
<a id="eventnames"></a>

###  eventNames

▸ **eventNames**(): `Array`<`string` \| `symbol`>

*Inherited from EventEmitter.eventNames*

*Defined in C:/Users/roger/source/yellowstone/node_modules/@types/node/globals.d.ts:569*

**Returns:** `Array`<`string` \| `symbol`>

___
<a id="getmaxlisteners"></a>

###  getMaxListeners

▸ **getMaxListeners**(): `number`

*Inherited from EventEmitter.getMaxListeners*

*Defined in C:/Users/roger/source/yellowstone/node_modules/@types/node/globals.d.ts:561*

**Returns:** `number`

___
<a id="listenercount"></a>

###  listenerCount

▸ **listenerCount**(type: *`string` \| `symbol`*): `number`

*Inherited from EventEmitter.listenerCount*

*Defined in C:/Users/roger/source/yellowstone/node_modules/@types/node/globals.d.ts:565*

**Parameters:**

| Name | Type |
| ------ | ------ |
| type | `string` \| `symbol` |

**Returns:** `number`

___
<a id="listeners"></a>

###  listeners

▸ **listeners**(event: *`string` \| `symbol`*): `Function`[]

*Inherited from EventEmitter.listeners*

*Defined in C:/Users/roger/source/yellowstone/node_modules/@types/node/globals.d.ts:562*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |

**Returns:** `Function`[]

___
<a id="off"></a>

###  off

▸ **off**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.off*

*Defined in C:/Users/roger/source/yellowstone/node_modules/@types/node/globals.d.ts:558*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="on"></a>

###  on

▸ **on**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.on*

*Defined in C:/Users/roger/source/yellowstone/node_modules/@types/node/globals.d.ts:555*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="once"></a>

###  once

▸ **once**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.once*

*Defined in C:/Users/roger/source/yellowstone/node_modules/@types/node/globals.d.ts:556*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="pause"></a>

###  pause

▸ **pause**(): `Promise`<`this`>

*Defined in [RTSPClient.ts:580](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L580)*

**Returns:** `Promise`<`this`>

___
<a id="play"></a>

###  play

▸ **play**(): `Promise`<`this`>

*Defined in [RTSPClient.ts:571](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L571)*

**Returns:** `Promise`<`this`>

___
<a id="prependlistener"></a>

###  prependListener

▸ **prependListener**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.prependListener*

*Defined in C:/Users/roger/source/yellowstone/node_modules/@types/node/globals.d.ts:567*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="prependoncelistener"></a>

###  prependOnceListener

▸ **prependOnceListener**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.prependOnceListener*

*Defined in C:/Users/roger/source/yellowstone/node_modules/@types/node/globals.d.ts:568*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="rawlisteners"></a>

###  rawListeners

▸ **rawListeners**(event: *`string` \| `symbol`*): `Function`[]

*Inherited from EventEmitter.rawListeners*

*Defined in C:/Users/roger/source/yellowstone/node_modules/@types/node/globals.d.ts:563*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |

**Returns:** `Function`[]

___
<a id="removealllisteners"></a>

###  removeAllListeners

▸ **removeAllListeners**(event: *`string` \| `symbol`*): `this`

*Inherited from EventEmitter.removeAllListeners*

*Defined in C:/Users/roger/source/yellowstone/node_modules/@types/node/globals.d.ts:559*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` event | `string` \| `symbol` |

**Returns:** `this`

___
<a id="removelistener"></a>

###  removeListener

▸ **removeListener**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.removeListener*

*Defined in C:/Users/roger/source/yellowstone/node_modules/@types/node/globals.d.ts:557*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="request"></a>

###  request

▸ **request**(requestName: *`string`*, headersParam?: *[Headers](../modules/_rtspclient_.md#headers)*, url: *`undefined` \| `string`*): `Promise`<`object` \| `void`>

*Defined in [RTSPClient.ts:423](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L423)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| requestName | `string` | - |
| `Default value` headersParam | [Headers](../modules/_rtspclient_.md#headers) |  {} |
| `Optional` url | `undefined` \| `string` | - |

**Returns:** `Promise`<`object` \| `void`>

___
<a id="respond"></a>

###  respond

▸ **respond**(status: *`string`*, headersParam?: *[Headers](../modules/_rtspclient_.md#headers)*): `void`

*Defined in [RTSPClient.ts:550](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L550)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| status | `string` | - |
| `Default value` headersParam | [Headers](../modules/_rtspclient_.md#headers) |  {} |

**Returns:** `void`

___
<a id="sendaudiobackchannel"></a>

###  sendAudioBackChannel

▸ **sendAudioBackChannel**(audioChunk: *`Buffer`*): `Promise`<`void`>

*Defined in [RTSPClient.ts:589](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L589)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| audioChunk | `Buffer` |

**Returns:** `Promise`<`void`>

___
<a id="setmaxlisteners"></a>

###  setMaxListeners

▸ **setMaxListeners**(n: *`number`*): `this`

*Inherited from EventEmitter.setMaxListeners*

*Defined in C:/Users/roger/source/yellowstone/node_modules/@types/node/globals.d.ts:560*

**Parameters:**

| Name | Type |
| ------ | ------ |
| n | `number` |

**Returns:** `this`

___
<a id="listenercount-1"></a>

### `<Static>` listenerCount

▸ **listenerCount**(emitter: *`EventEmitter`*, event: *`string` \| `symbol`*): `number`

*Inherited from EventEmitter.listenerCount*

*Defined in C:/Users/roger/source/yellowstone/node_modules/@types/node/events.d.ts:17*

**Parameters:**

| Name | Type |
| ------ | ------ |
| emitter | `EventEmitter` |
| event | `string` \| `symbol` |

**Returns:** `number`

___
<a id="once-1"></a>

### `<Static>` once

▸ **once**(emitter: *`NodeEventTarget`*, event: *`string` \| `symbol`*): `Promise`<`any`[]>

▸ **once**(emitter: *`DOMEventTarget`*, event: *`string`*): `Promise`<`any`[]>

*Inherited from EventEmitter.once*

*Defined in C:/Users/roger/source/yellowstone/node_modules/@types/node/events.d.ts:13*

**Parameters:**

| Name | Type |
| ------ | ------ |
| emitter | `NodeEventTarget` |
| event | `string` \| `symbol` |

**Returns:** `Promise`<`any`[]>

*Inherited from EventEmitter.once*

*Defined in C:/Users/roger/source/yellowstone/node_modules/@types/node/events.d.ts:14*

**Parameters:**

| Name | Type |
| ------ | ------ |
| emitter | `DOMEventTarget` |
| event | `string` |

**Returns:** `Promise`<`any`[]>

___

