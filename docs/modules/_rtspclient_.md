[Yellowstone](../README.md) > ["RTSPClient"](../modules/_rtspclient_.md)

# External module: "RTSPClient"

## Index

### Enumerations

* [ReadStates](../enums/_rtspclient_.readstates.md)

### Classes

* [RTSPClient](../classes/_rtspclient_.rtspclient.md)

### Type aliases

* [Connection](_rtspclient_.md#connection)
* [Detail](_rtspclient_.md#detail)
* [Headers](_rtspclient_.md#headers)

### Variables

* [RTP_AVP](_rtspclient_.md#rtp_avp)
* [STATUS_OK](_rtspclient_.md#status_ok)
* [STATUS_UNAUTH](_rtspclient_.md#status_unauth)
* [WWW_AUTH](_rtspclient_.md#www_auth)
* [WWW_AUTH_REGEX](_rtspclient_.md#www_auth_regex)

---

## Type aliases

<a id="connection"></a>

###  Connection

**Ƭ Connection**: *"udp" \| "tcp"*

*Defined in [RTSPClient.ts:32](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L32)*

___
<a id="detail"></a>

###  Detail

**Ƭ Detail**: *`object`*

*Defined in [RTSPClient.ts:44](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L44)*

#### Type declaration

 codec: `string`

 isH264: `boolean`

 mediaSource: `any`

 rtcpChannel: `any`

 rtpChannel: `any`

 transport: `any`

___
<a id="headers"></a>

###  Headers

**Ƭ Headers**: *`object`*

*Defined in [RTSPClient.ts:34](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L34)*

#### Type declaration

[key: `string`]: `string` \| `number` \| `undefined`

`Optional`  CSeq: `undefined` \| `number`

`Optional`  Location: `undefined` \| `string`

`Optional`  Session: `undefined` \| `string`

`Optional`  Transport: `undefined` \| `string`

`Optional`  Unsupported: `undefined` \| `string`

`Optional`  WWW-Authenticate: `undefined` \| `string`

___

## Variables

<a id="rtp_avp"></a>

### `<Const>` RTP_AVP

**● RTP_AVP**: *"RTP/AVP"* = "RTP/AVP"

*Defined in [RTSPClient.ts:16](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L16)*

___
<a id="status_ok"></a>

### `<Const>` STATUS_OK

**● STATUS_OK**: *`200`* = 200

*Defined in [RTSPClient.ts:18](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L18)*

___
<a id="status_unauth"></a>

### `<Const>` STATUS_UNAUTH

**● STATUS_UNAUTH**: *`401`* = 401

*Defined in [RTSPClient.ts:19](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L19)*

___
<a id="www_auth"></a>

### `<Const>` WWW_AUTH

**● WWW_AUTH**: *"WWW-Authenticate"* = "WWW-Authenticate"

*Defined in [RTSPClient.ts:21](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L21)*

___
<a id="www_auth_regex"></a>

### `<Const>` WWW_AUTH_REGEX

**● WWW_AUTH_REGEX**: *`RegExp`* =  new RegExp('([a-zA-Z]+)\s*=\s*"?((?<=").*?(?=")|.*?(?=,?\s*[a-zA-Z]+\s*\=)|.+[^=])', "g")

*Defined in [RTSPClient.ts:22](https://github.com/mbullington/yellowstone/blob/ac27865/lib/RTSPClient.ts#L22)*

___

