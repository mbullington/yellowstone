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
* [username](_rtspclient_.rtspclient.md#username)
* [defaultMaxListeners](_rtspclient_.rtspclient.md#defaultmaxlisteners)

### Methods

* [_emptyReceiverReport](_rtspclient_.rtspclient.md#_emptyreceiverreport)
* [_netConnect](_rtspclient_.rtspclient.md#_netconnect)
* [_onData](_rtspclient_.rtspclient.md#_ondata)
* [_sendInterleavedData](_rtspclient_.rtspclient.md#_sendinterleaveddata)
* [_sendUDPData](_rtspclient_.rtspclient.md#_sendudpdata)
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
* [setMaxListeners](_rtspclient_.rtspclient.md#setmaxlisteners)
* [listenerCount](_rtspclient_.rtspclient.md#listenercount-1)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new RTSPClient**(username: *`string`*, password: *`string`*, headers: *`object`*): [RTSPClient](_rtspclient_.rtspclient.md)

*Defined in [RTSPClient.ts:75](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L75)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| username | `string` |
| password | `string` |
| headers | `object` |

**Returns:** [RTSPClient](_rtspclient_.rtspclient.md)

___

## Properties

<a id="_cseq"></a>

###  _cSeq

**● _cSeq**: *`number`* = 0

*Defined in [RTSPClient.ts:49](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L49)*

___
<a id="_client"></a>

### `<Optional>` _client

**● _client**: *`net.Socket`*

*Defined in [RTSPClient.ts:48](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L48)*

___
<a id="_keepaliveid"></a>

### `<Optional>` _keepAliveID

**● _keepAliveID**: *`any`*

*Defined in [RTSPClient.ts:53](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L53)*

___
<a id="_session"></a>

### `<Optional>` _session

**● _session**: *`undefined` \| `string`*

*Defined in [RTSPClient.ts:52](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L52)*

___
<a id="_unsupportedextensions"></a>

### `<Optional>` _unsupportedExtensions

**● _unsupportedExtensions**: *`string`[]*

*Defined in [RTSPClient.ts:50](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L50)*

___
<a id="_url"></a>

### `<Optional>` _url

**● _url**: *`undefined` \| `string`*

*Defined in [RTSPClient.ts:47](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L47)*

___
<a id="clientssrc"></a>

###  clientSSRC

**● clientSSRC**: *`number`* =  generateSSRC()

*Defined in [RTSPClient.ts:75](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L75)*

___
<a id="headers"></a>

###  headers

**● headers**: *`object`*

*Defined in [RTSPClient.ts:41](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L41)*

#### Type declaration

[key: `string`]: `string`

___
<a id="isconnected"></a>

###  isConnected

**● isConnected**: *`boolean`* = false

*Defined in [RTSPClient.ts:43](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L43)*

___
<a id="messagebytes"></a>

###  messageBytes

**● messageBytes**: *`number`[]* =  []

*Defined in [RTSPClient.ts:59](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L59)*

___
<a id="password"></a>

###  password

**● password**: *`string`*

*Defined in [RTSPClient.ts:40](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L40)*

___
<a id="readstate"></a>

###  readState

**● readState**: *[ReadStates](../enums/_rtspclient_.readstates.md)* =  ReadStates.SEARCHING

*Defined in [RTSPClient.ts:55](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L55)*

___
<a id="rtspcontentlength"></a>

###  rtspContentLength

**● rtspContentLength**: *`number`* = 0

*Defined in [RTSPClient.ts:64](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L64)*

___
<a id="rtspheaders"></a>

###  rtspHeaders

**● rtspHeaders**: *[Headers](../modules/_rtspclient_.md#headers)*

*Defined in [RTSPClient.ts:66](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L66)*

___
<a id="rtsppacket"></a>

###  rtspPacket

**● rtspPacket**: *`Buffer`* =  new Buffer("")

*Defined in [RTSPClient.ts:71](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L71)*

___
<a id="rtsppacketlength"></a>

###  rtspPacketLength

**● rtspPacketLength**: *`number`* = 0

*Defined in [RTSPClient.ts:70](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L70)*

___
<a id="rtsppacketpointer"></a>

###  rtspPacketPointer

**● rtspPacketPointer**: *`number`* = 0

*Defined in [RTSPClient.ts:72](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L72)*

___
<a id="rtspstatusline"></a>

###  rtspStatusLine

**● rtspStatusLine**: *`string`* = ""

*Defined in [RTSPClient.ts:65](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L65)*

___
<a id="username"></a>

###  username

**● username**: *`string`*

*Defined in [RTSPClient.ts:39](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L39)*

___
<a id="defaultmaxlisteners"></a>

### `<Static>` defaultMaxListeners

**● defaultMaxListeners**: *`number`*

*Inherited from EventEmitter.defaultMaxListeners*

*Defined in /home/michael/Projects/yellowstone/node_modules/@types/node/index.d.ts:1110*

___

## Methods

<a id="_emptyreceiverreport"></a>

###  _emptyReceiverReport

▸ **_emptyReceiverReport**(): `Buffer`

*Defined in [RTSPClient.ts:603](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L603)*

**Returns:** `Buffer`

___
<a id="_netconnect"></a>

###  _netConnect

▸ **_netConnect**(hostname: *`string`*, port: *`number`*): `Promise`<`Object`>

*Defined in [RTSPClient.ts:95](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L95)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| hostname | `string` |
| port | `number` |

**Returns:** `Promise`<`Object`>

___
<a id="_ondata"></a>

###  _onData

▸ **_onData**(data: *`Buffer`*): `void`

*Defined in [RTSPClient.ts:435](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L435)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| data | `Buffer` |

**Returns:** `void`

___
<a id="_sendinterleaveddata"></a>

###  _sendInterleavedData

▸ **_sendInterleavedData**(channel: *`number`*, buffer: *`Buffer`*): `void`

*Defined in [RTSPClient.ts:577](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L577)*

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

*Defined in [RTSPClient.ts:595](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L595)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| host | `string` |
| port | `number` |
| buffer | `Buffer` |

**Returns:** `void`

___
<a id="addlistener"></a>

###  addListener

▸ **addListener**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.addListener*

*Overrides EventEmitter.addListener*

*Defined in /home/michael/Projects/yellowstone/node_modules/@types/node/index.d.ts:1112*

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

*Defined in [RTSPClient.ts:410](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L410)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` isImmediate | `boolean` | false |

**Returns:** `Promise`<`this`>

___
<a id="connect"></a>

###  connect

▸ **connect**(url: *`string`*, options?: *`object`*): `Promise`<`object`>

*Defined in [RTSPClient.ts:143](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L143)*

**Parameters:**

**url: `string`**

**`Default value` options: `object`**

| Name | Type |
| ------ | ------ |
| connection | [Connection](../modules/_rtspclient_.md#connection) |
| keepAlive | `boolean` |

**Returns:** `Promise`<`object`>

___
<a id="emit"></a>

###  emit

▸ **emit**(event: *`string` \| `symbol`*, ...args: *`any`[]*): `boolean`

*Inherited from EventEmitter.emit*

*Overrides EventEmitter.emit*

*Defined in /home/michael/Projects/yellowstone/node_modules/@types/node/index.d.ts:1124*

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

*Overrides EventEmitter.eventNames*

*Defined in /home/michael/Projects/yellowstone/node_modules/@types/node/index.d.ts:1125*

**Returns:** `Array`<`string` \| `symbol`>

___
<a id="getmaxlisteners"></a>

###  getMaxListeners

▸ **getMaxListeners**(): `number`

*Inherited from EventEmitter.getMaxListeners*

*Overrides EventEmitter.getMaxListeners*

*Defined in /home/michael/Projects/yellowstone/node_modules/@types/node/index.d.ts:1121*

**Returns:** `number`

___
<a id="listenercount"></a>

###  listenerCount

▸ **listenerCount**(type: *`string` \| `symbol`*): `number`

*Inherited from EventEmitter.listenerCount*

*Overrides EventEmitter.listenerCount*

*Defined in /home/michael/Projects/yellowstone/node_modules/@types/node/index.d.ts:1126*

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

*Overrides EventEmitter.listeners*

*Defined in /home/michael/Projects/yellowstone/node_modules/@types/node/index.d.ts:1122*

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

*Overrides EventEmitter.off*

*Defined in /home/michael/Projects/yellowstone/node_modules/@types/node/index.d.ts:1118*

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

*Overrides EventEmitter.on*

*Defined in /home/michael/Projects/yellowstone/node_modules/@types/node/index.d.ts:1113*

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

*Overrides EventEmitter.once*

*Defined in /home/michael/Projects/yellowstone/node_modules/@types/node/index.d.ts:1114*

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

*Defined in [RTSPClient.ts:401](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L401)*

**Returns:** `Promise`<`this`>

___
<a id="play"></a>

###  play

▸ **play**(): `Promise`<`this`>

*Defined in [RTSPClient.ts:392](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L392)*

**Returns:** `Promise`<`this`>

___
<a id="prependlistener"></a>

###  prependListener

▸ **prependListener**(event: *`string` \| `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.prependListener*

*Overrides EventEmitter.prependListener*

*Defined in /home/michael/Projects/yellowstone/node_modules/@types/node/index.d.ts:1115*

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

*Overrides EventEmitter.prependOnceListener*

*Defined in /home/michael/Projects/yellowstone/node_modules/@types/node/index.d.ts:1116*

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

*Overrides EventEmitter.rawListeners*

*Defined in /home/michael/Projects/yellowstone/node_modules/@types/node/index.d.ts:1123*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |

**Returns:** `Function`[]

___
<a id="removealllisteners"></a>

###  removeAllListeners

▸ **removeAllListeners**(event?: *`string` \| `symbol`*): `this`

*Inherited from EventEmitter.removeAllListeners*

*Overrides EventEmitter.removeAllListeners*

*Defined in /home/michael/Projects/yellowstone/node_modules/@types/node/index.d.ts:1119*

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

*Overrides EventEmitter.removeListener*

*Defined in /home/michael/Projects/yellowstone/node_modules/@types/node/index.d.ts:1117*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` \| `symbol` |
| listener | `function` |

**Returns:** `this`

___
<a id="request"></a>

###  request

▸ **request**(requestName: *`string`*, headersParam?: *[Headers](../modules/_rtspclient_.md#headers)*, url?: *`undefined` \| `string`*): `Promise`<`object` \| `void`>

*Defined in [RTSPClient.ts:267](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L267)*

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

*Defined in [RTSPClient.ts:371](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L371)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| status | `string` | - |
| `Default value` headersParam | [Headers](../modules/_rtspclient_.md#headers) |  {} |

**Returns:** `void`

___
<a id="setmaxlisteners"></a>

###  setMaxListeners

▸ **setMaxListeners**(n: *`number`*): `this`

*Inherited from EventEmitter.setMaxListeners*

*Overrides EventEmitter.setMaxListeners*

*Defined in /home/michael/Projects/yellowstone/node_modules/@types/node/index.d.ts:1120*

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

*Defined in /home/michael/Projects/yellowstone/node_modules/@types/node/index.d.ts:1109*

*__deprecated__*:
 since v4.0.0

**Parameters:**

| Name | Type |
| ------ | ------ |
| emitter | `EventEmitter` |
| event | `string` \| `symbol` |

**Returns:** `number`

___

