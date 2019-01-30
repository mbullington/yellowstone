[Yellowstone](../README.md) > ["RTSPClient"](../modules/_rtspclient_.md)

# External module: "RTSPClient"

## Index

### Enumerations

* [ReadStates](../enums/_rtspclient_.readstates.md)

### Classes

* [RTSPClient](../classes/_rtspclient_.rtspclient.md)

### Type aliases

* [Connection](_rtspclient_.md#connection)
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

*Defined in [RTSPClient.ts:26](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L26)*

___
<a id="headers"></a>

###  Headers

**Ƭ Headers**: *`object`*

*Defined in [RTSPClient.ts:28](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L28)*

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

*Defined in [RTSPClient.ts:10](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L10)*

___
<a id="status_ok"></a>

### `<Const>` STATUS_OK

**● STATUS_OK**: *`200`* = 200

*Defined in [RTSPClient.ts:12](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L12)*

___
<a id="status_unauth"></a>

### `<Const>` STATUS_UNAUTH

**● STATUS_UNAUTH**: *`401`* = 401

*Defined in [RTSPClient.ts:13](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L13)*

___
<a id="www_auth"></a>

### `<Const>` WWW_AUTH

**● WWW_AUTH**: *"WWW-Authenticate"* = "WWW-Authenticate"

*Defined in [RTSPClient.ts:15](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L15)*

___
<a id="www_auth_regex"></a>

### `<Const>` WWW_AUTH_REGEX

**● WWW_AUTH_REGEX**: *`RegExp`* =  new RegExp('([a-zA-Z]+)\s*=\s*"?((?<=").*?(?=")|.*?(?=,?\s*[a-zA-Z]+\s*\=)|.+[^=])', "g")

*Defined in [RTSPClient.ts:16](https://github.com/mbullington/yellowstone/blob/c6fe1af/lib/RTSPClient.ts#L16)*

___

