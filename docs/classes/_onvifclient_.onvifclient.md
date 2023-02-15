[Yellowstone](../README.md) > ["ONVIFClient"](../modules/_onvifclient_.md) > [ONVIFClient](../classes/_onvifclient_.onvifclient.md)

# Class: ONVIFClient

## Hierarchy

↳  [RTSPClient](_rtspclient_.rtspclient.md)

**↳ ONVIFClient**

## Index

### Constructors

* [constructor](_onvifclient_.onvifclient.md#constructor)

### Properties

* [_cSeq](_onvifclient_.onvifclient.md#_cseq)
* [_client](_onvifclient_.onvifclient.md#_client)
* [_keepAliveID](_onvifclient_.onvifclient.md#_keepaliveid)
* [_nextFreeInterleavedChannel](_onvifclient_.onvifclient.md#_nextfreeinterleavedchannel)
* [_nextFreeUDPPort](_onvifclient_.onvifclient.md#_nextfreeudpport)
* [_session](_onvifclient_.onvifclient.md#_session)
* [_unsupportedExtensions](_onvifclient_.onvifclient.md#_unsupportedextensions)
* [_url](_onvifclient_.onvifclient.md#_url)
* [clientSSRC](_onvifclient_.onvifclient.md#clientssrc)
* [headers](_onvifclient_.onvifclient.md#headers)
* [isConnected](_onvifclient_.onvifclient.md#isconnected)
* [messageBytes](_onvifclient_.onvifclient.md#messagebytes)
* [password](_onvifclient_.onvifclient.md#password)
* [readState](_onvifclient_.onvifclient.md#readstate)
* [rtspContentLength](_onvifclient_.onvifclient.md#rtspcontentlength)
* [rtspHeaders](_onvifclient_.onvifclient.md#rtspheaders)
* [rtspPacket](_onvifclient_.onvifclient.md#rtsppacket)
* [rtspPacketLength](_onvifclient_.onvifclient.md#rtsppacketlength)
* [rtspPacketPointer](_onvifclient_.onvifclient.md#rtsppacketpointer)
* [rtspStatusLine](_onvifclient_.onvifclient.md#rtspstatusline)
* [setupResult](_onvifclient_.onvifclient.md#setupresult)
* [tcpSocket](_onvifclient_.onvifclient.md#tcpsocket)
* [username](_onvifclient_.onvifclient.md#username)
* [defaultMaxListeners](_onvifclient_.onvifclient.md#defaultmaxlisteners)

### Methods

* [_emptyReceiverReport](_onvifclient_.onvifclient.md#_emptyreceiverreport)
* [_netConnect](_onvifclient_.onvifclient.md#_netconnect)
* [_onData](_onvifclient_.onvifclient.md#_ondata)
* [_sendInterleavedData](_onvifclient_.onvifclient.md#_sendinterleaveddata)
* [_sendUDPData](_onvifclient_.onvifclient.md#_sendudpdata)
* [_socketWrite](_onvifclient_.onvifclient.md#_socketwrite)
* [addListener](_onvifclient_.onvifclient.md#addlistener)
* [close](_onvifclient_.onvifclient.md#close)
* [connect](_onvifclient_.onvifclient.md#connect)
* [emit](_onvifclient_.onvifclient.md#emit)
* [eventNames](_onvifclient_.onvifclient.md#eventnames)
* [getMaxListeners](_onvifclient_.onvifclient.md#getmaxlisteners)
* [listenerCount](_onvifclient_.onvifclient.md#listenercount)
* [listeners](_onvifclient_.onvifclient.md#listeners)
* [off](_onvifclient_.onvifclient.md#off)
* [on](_onvifclient_.onvifclient.md#on)
* [once](_onvifclient_.onvifclient.md#once)
* [pause](_onvifclient_.onvifclient.md#pause)
* [play](_onvifclient_.onvifclient.md#play)
* [playFrom](_onvifclient_.onvifclient.md#playfrom)
* [playReverse](_onvifclient_.onvifclient.md#playreverse)
* [prependListener](_onvifclient_.onvifclient.md#prependlistener)
* [prependOnceListener](_onvifclient_.onvifclient.md#prependoncelistener)
* [rawListeners](_onvifclient_.onvifclient.md#rawlisteners)
* [removeAllListeners](_onvifclient_.onvifclient.md#removealllisteners)
* [removeListener](_onvifclient_.onvifclient.md#removelistener)
* [request](_onvifclient_.onvifclient.md#request)
* [respond](_onvifclient_.onvifclient.md#respond)
* [sendAudioBackChannel](_onvifclient_.onvifclient.md#sendaudiobackchannel)
* [setMaxListeners](_onvifclient_.onvifclient.md#setmaxlisteners)
* [listenerCount](_onvifclient_.onvifclient.md#listenercount-1)
* [once](_onvifclient_.onvifclient.md#once-1)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ONVIFClient**(username: *`string`*, password: *`string`*): [ONVIFClient](_onvifclient_.onvifclient.md)

*Overrides [RTSPClient](_rtspclient_.rtspclient.md).[constructor](_rtspclient_.rtspclient.md#constructor)*

*Defined in [ONVIFClient.ts:4](https://github.com/mbullington/yellowstone/blob/ac27865/lib/ONVIFClient.ts#L4)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| username | `string` |
| password | `string` |

**Returns:** [ONVIFClient](_onvifclient_.onvifclient.md)

___

## Properties

<a id="_cseq"></a>

###  _cSeq

**● _cSeq**: *`number`* = 0

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[_cSeq](_rtspclient_.rtspclient.md#_cseq)*

*Defined in [RTSPClient.ts:64](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L64)*

___
<a id="_client"></a>

### `<Optional>` _client

**● _client**: *`net.Socket`*

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[_client](_rtspclient_.rtspclient.md#_client)*

*Defined in [RTSPClient.ts:63](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L63)*

___
<a id="_keepaliveid"></a>

### `<Optional>` _keepAliveID

**● _keepAliveID**: *`NodeJS.Timeout`*

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[_keepAliveID](_rtspclient_.rtspclient.md#_keepaliveid)*

*Defined in [RTSPClient.ts:68](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L68)*

___
<a id="_nextfreeinterleavedchannel"></a>

###  _nextFreeInterleavedChannel

**● _nextFreeInterleavedChannel**: *`number`* = 0

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[_nextFreeInterleavedChannel](_rtspclient_.rtspclient.md#_nextfreeinterleavedchannel)*

*Defined in [RTSPClient.ts:69](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L69)*

___
<a id="_nextfreeudpport"></a>

###  _nextFreeUDPPort

**● _nextFreeUDPPort**: *`number`* = 5000

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[_nextFreeUDPPort](_rtspclient_.rtspclient.md#_nextfreeudpport)*

*Defined in [RTSPClient.ts:70](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L70)*

___
<a id="_session"></a>

### `<Optional>` _session

**● _session**: *`undefined` \| `string`*

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[_session](_rtspclient_.rtspclient.md#_session)*

*Defined in [RTSPClient.ts:67](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L67)*

___
<a id="_unsupportedextensions"></a>

### `<Optional>` _unsupportedExtensions

**● _unsupportedExtensions**: *`string`[]*

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[_unsupportedExtensions](_rtspclient_.rtspclient.md#_unsupportedextensions)*

*Defined in [RTSPClient.ts:65](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L65)*

___
<a id="_url"></a>

### `<Optional>` _url

**● _url**: *`undefined` \| `string`*

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[_url](_rtspclient_.rtspclient.md#_url)*

*Defined in [RTSPClient.ts:62](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L62)*

___
<a id="clientssrc"></a>

###  clientSSRC

**● clientSSRC**: *`number`* =  generateSSRC()

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[clientSSRC](_rtspclient_.rtspclient.md#clientssrc)*

*Defined in [RTSPClient.ts:92](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L92)*

___
<a id="headers"></a>

###  headers

**● headers**: *`object`*

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[headers](_rtspclient_.rtspclient.md#headers)*

*Defined in [RTSPClient.ts:56](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L56)*

#### Type declaration

[key: `string`]: `string`

___
<a id="isconnected"></a>

###  isConnected

**● isConnected**: *`boolean`* = false

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[isConnected](_rtspclient_.rtspclient.md#isconnected)*

*Defined in [RTSPClient.ts:58](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L58)*

___
<a id="messagebytes"></a>

###  messageBytes

**● messageBytes**: *`number`[]* =  []

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[messageBytes](_rtspclient_.rtspclient.md#messagebytes)*

*Defined in [RTSPClient.ts:76](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L76)*

___
<a id="password"></a>

###  password

**● password**: *`string`*

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[password](_rtspclient_.rtspclient.md#password)*

*Defined in [RTSPClient.ts:55](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L55)*

___
<a id="readstate"></a>

###  readState

**● readState**: *[ReadStates](../enums/_rtspclient_.readstates.md)* =  ReadStates.SEARCHING

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[readState](_rtspclient_.rtspclient.md#readstate)*

*Defined in [RTSPClient.ts:72](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L72)*

___
<a id="rtspcontentlength"></a>

###  rtspContentLength

**● rtspContentLength**: *`number`* = 0

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[rtspContentLength](_rtspclient_.rtspclient.md#rtspcontentlength)*

*Defined in [RTSPClient.ts:81](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L81)*

___
<a id="rtspheaders"></a>

###  rtspHeaders

**● rtspHeaders**: *[Headers](../modules/_rtspclient_.md#headers)*

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[rtspHeaders](_rtspclient_.rtspclient.md#rtspheaders)*

*Defined in [RTSPClient.ts:83](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L83)*

___
<a id="rtsppacket"></a>

###  rtspPacket

**● rtspPacket**: *`Buffer`* =  new Buffer("")

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[rtspPacket](_rtspclient_.rtspclient.md#rtsppacket)*

*Defined in [RTSPClient.ts:88](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L88)*

___
<a id="rtsppacketlength"></a>

###  rtspPacketLength

**● rtspPacketLength**: *`number`* = 0

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[rtspPacketLength](_rtspclient_.rtspclient.md#rtsppacketlength)*

*Defined in [RTSPClient.ts:87](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L87)*

___
<a id="rtsppacketpointer"></a>

###  rtspPacketPointer

**● rtspPacketPointer**: *`number`* = 0

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[rtspPacketPointer](_rtspclient_.rtspclient.md#rtsppacketpointer)*

*Defined in [RTSPClient.ts:89](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L89)*

___
<a id="rtspstatusline"></a>

###  rtspStatusLine

**● rtspStatusLine**: *`string`* = ""

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[rtspStatusLine](_rtspclient_.rtspclient.md#rtspstatusline)*

*Defined in [RTSPClient.ts:82](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L82)*

___
<a id="setupresult"></a>

###  setupResult

**● setupResult**: *`Array`<`any`>* =  []

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[setupResult](_rtspclient_.rtspclient.md#setupresult)*

*Defined in [RTSPClient.ts:95](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L95)*

___
<a id="tcpsocket"></a>

###  tcpSocket

**● tcpSocket**: *`Socket`* =  new net.Socket()

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[tcpSocket](_rtspclient_.rtspclient.md#tcpsocket)*

*Defined in [RTSPClient.ts:94](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L94)*

___
<a id="username"></a>

###  username

**● username**: *`string`*

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[username](_rtspclient_.rtspclient.md#username)*

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

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[_emptyReceiverReport](_rtspclient_.rtspclient.md#_emptyreceiverreport)*

*Defined in [RTSPClient.ts:837](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L837)*

**Returns:** `Buffer`

___
<a id="_netconnect"></a>

###  _netConnect

▸ **_netConnect**(hostname: *`string`*, port: *`number`*): `Promise`<`this`>

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[_netConnect](_rtspclient_.rtspclient.md#_netconnect)*

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

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[_onData](_rtspclient_.rtspclient.md#_ondata)*

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

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[_sendInterleavedData](_rtspclient_.rtspclient.md#_sendinterleaveddata)*

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

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[_sendUDPData](_rtspclient_.rtspclient.md#_sendudpdata)*

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

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[_socketWrite](_rtspclient_.rtspclient.md#_socketwrite)*

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

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[close](_rtspclient_.rtspclient.md#close)*

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

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[connect](_rtspclient_.rtspclient.md#connect)*

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

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[pause](_rtspclient_.rtspclient.md#pause)*

*Defined in [RTSPClient.ts:580](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L580)*

**Returns:** `Promise`<`this`>

___
<a id="play"></a>

###  play

▸ **play**(): `Promise`<`this`>

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[play](_rtspclient_.rtspclient.md#play)*

*Defined in [RTSPClient.ts:571](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L571)*

**Returns:** `Promise`<`this`>

___
<a id="playfrom"></a>

###  playFrom

▸ **playFrom**(from: *`Date`*, to: *`Date`*): `Promise`<`this`>

*Defined in [ONVIFClient.ts:9](https://github.com/mbullington/yellowstone/blob/ac27865/lib/ONVIFClient.ts#L9)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| from | `Date` |
| `Optional` to | `Date` |

**Returns:** `Promise`<`this`>

___
<a id="playreverse"></a>

###  playReverse

▸ **playReverse**(from: *`Date`*, to: *`Date`*): `Promise`<`this`>

*Defined in [ONVIFClient.ts:24](https://github.com/mbullington/yellowstone/blob/ac27865/lib/ONVIFClient.ts#L24)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` from | `Date` |
| `Optional` to | `Date` |

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

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[request](_rtspclient_.rtspclient.md#request)*

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

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[respond](_rtspclient_.rtspclient.md#respond)*

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

*Inherited from [RTSPClient](_rtspclient_.rtspclient.md).[sendAudioBackChannel](_rtspclient_.rtspclient.md#sendaudiobackchannel)*

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

