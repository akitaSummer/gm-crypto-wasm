# gm-crypto-wasm

![密码行业标准化委员会](./spec_header.png)

This is the wasm version of [gm-crypto](https://github.com/byte-fe/gm-crypto), it has better performance.

- [GM/T0003-2012《SM2 public key cryptographic algorithm based on elliptic curves》](http://www.oscca.gov.cn/sca/xxgk/2010-12/17/content_1002386.shtml)
- [GM/T0004-2012《SM3 cryptographic hash algorithm》](https://www.oscca.gov.cn/sca/xxgk/2010-12/17/content_1002389.shtml)
- [GM/T0002-2012《SM4 block cipher algorithm》(also aliased as SMS4)](http://www.sca.gov.cn/sca/c100061/201611/1002423/files/330480f731f64e1ea75138211ea0dc27.pdf)

## Quick Start

### Install

Using npm:

```bash
$ npm install gm-crypto-wasm
```

Using yarn:

```bash
$ yarn add gm-crypto-wasm
```

Using pnpm:

```bash
$ pnpm add gm-crypto-wasm
```

### Basic Usage

#### SM2

> Public Key Cryptographic Algorithm Based on Elliptic Curves.

```js
import { SM2 } from "gm-crypto-wasm";

const { publicKey, privateKey } = SM2.generateKeyPair();
const originalData = "SM2 椭圆曲线公钥密码算法";

const encryptedData = SM2.encrypt(originalData, publicKey, {
  inputEncoding: "utf8",
  outputEncoding: "base64",
});

const decryptedData = SM2.decrypt(encryptedData, privateKey, {
  inputEncoding: "base64",
  outputEncoding: "utf8",
});
```

#### SM3

> Cryptographic Hash Algorithm.

```js
import { SM3 } from "gm-crypto-wasm";

console.log(SM3.digest("abc"));
console.log(SM3.digest("YWJj", "base64"));
console.log(SM3.digest("616263", "hex", "base64"));
```

#### SM4

> Block Cipher Algorithm.

```js
import { SM4 } from "gm-crypto-wasm";

const key = "0123456789abcdeffedcba9876543210"; // Any string of 32 hexadecimal digits
const originalData = "SM4 国标对称加密";

/**
 * Block cipher modes:
 * - ECB: electronic codebook
 * - CBC: cipher block chaining
 */

let encryptedData, decryptedData;

// ECB
encryptedData = SM4.encrypt(originalData, key, {
  inputEncoding: "utf8",
  outputEncoding: "base64",
});
decryptedData = SM4.decrypt(encryptedData, key, {
  inputEncoding: "base64",
  outputEncoding: "utf8",
});

// CBC
const iv = "0123456789abcdeffedcba9876543210"; // Initialization vector(any string of 32 hexadecimal digits)
encryptedData = SM4.encrypt(originalData, key, {
  iv: iv,
  mode: SM4.constants.CBC,
  inputEncoding: "utf8",
  outputEncoding: "hex",
});
decryptedData = SM4.decrypt(encryptedData, key, {
  iv: iv,
  mode: SM4.constants.CBC,
  inputEncoding: "hex",
  outputEncoding: "utf8",
});
```

#### benchmark

```
// Why is there no sm3?
// Because the calculation amount of sm3 is very small, the speed of js is already fast enough, and the loss of wasm data transmission is much greater than the calculation of js.
// So we used the js version of sm3

// pnpm bench
 DEV  v0.34.6

 ✓ bench/index.benchmark.ts (4) 10171ms
   ✓ sm2 (2) 9418ms
     name       hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · js    19.1045  50.6476  60.2170  52.3436  53.0553  56.0920  60.2170  60.2170  ±0.50%      100
   · wasm  42.6254  21.5548  28.9284  23.4602  24.0769  28.8488  28.9284  28.9284  ±1.14%      100   fastest
   ✓ sm4 (2) 10167ms
     name       hz     min      max     mean      p75      p99     p995     p999     rme  samples
   · js    99.4326  9.6209  10.6127  10.0571  10.2032  10.5983  10.6127  10.6127  ±0.46%      100
   · wasm   136.29  6.3064   8.6758   7.3375   8.1883   8.6321   8.6758   8.6758  ±2.33%      100   fastest


 BENCH  Summary

  wasm - bench/index.benchmark.ts > sm2
    2.23x faster than js

  wasm - bench/index.benchmark.ts > sm4
    1.37x faster than js
```

## API

- [SM2](#api)

  - [.generateKeyPair()](#sm2generatekeypair) ⇒ `object`
  - [.encrypt(data, key[, options]](#sm2encryptdata-key-options) ⇒ `string` | `ArrayBuffer`
  - [.decrypt(data, key[, options])](#sm2decryptdata-key-options) ⇒ `string` | `ArrayBuffer`

- [SM3](#api)

  - [.digest(data[, inputEncoding][, outputEncoding])](#sm3digestdata-inputencoding-outputencoding) ⇒ `string` | `ArrayBuffer`

- [SM4](#api)
  - [.encrypt(data, key[, options])](#sm4encryptdata-key-options) ⇒ `string` | `ArrayBuffer`
  - [.decrypt(data, key[, options])](#sm4decryptdata-key-options) ⇒ `string` | `ArrayBuffer`

### SM2.generateKeyPair()

Generates a new asymmetric key pair.

### SM2.encrypt(data, key[, options])

Encrypt data.

| Param                  | Type                              | Default  | Description                                                                                                                                                                                      |
| ---------------------- | --------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data                   | `string`\|`ArrayBuffer`\|`Buffer` |          | Plain message                                                                                                                                                                                    |
| key                    | `string`                          |          | Public key generated by [SM2.generateKeyPair()](#sm2generatekeypair)                                                                                                                             |
| options                | `object`                          |          | Options                                                                                                                                                                                          |
| options.mode           | `C1C3C2` \| `C1C2C3`              | `C1C3C2` | Concatenation mode                                                                                                                                                                               |
| options.inputEncoding  | `string`                          | `"utf8"` | The encoding of the plain `data` string,if `data` is not a string then `inputEncoding` is ignored.                                                                                               |
| options.outputEncoding | `string`                          |          | If `outputEncoding` is provided, a string will be returned, otherwise a [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) is returned. |
| options.pc             | `boolean`                         | `false`  | Includes `PC` mark as first byte                                                                                                                                                                 |

### SM2.decrypt(data, key[, options])

Decrypt data.

| Param                  | Type                              | Default  | Description                                                                                                                                                                                      |
| ---------------------- | --------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data                   | `string`\|`ArrayBuffer`\|`Buffer` |          | Ciphered data                                                                                                                                                                                    |
| key                    | `string`                          |          | Private key generated by [SM2.generateKeyPair()](#sm2generatekeypair)                                                                                                                            |
| options.mode           | `C1C3C2` \| `C1C2C3`              | `C1C3C2` | Concatenation mode                                                                                                                                                                               |
| options.inputEncoding  | `string`                          |          | The encoding of the plain `data` string,if `data` is not a string then `inputEncoding` is ignored.                                                                                               |
| options.outputEncoding | `string`                          |          | If `outputEncoding` is provided, a string will be returned, otherwise a [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) is returned. |
| options.pc             | `boolean`                         | `false`  | Includes `PC` mark as first byte                                                                                                                                                                 |

### SM3.digest(data, [inputEncoding], [outputEncoding])

Calculates the digest.

| Param          | Type                              | Default  | Description                                                                                                                                                                                      |
| -------------- | --------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data           | `string`\|`ArrayBuffer`\|`Buffer` |          | Data message                                                                                                                                                                                     |
| inputEncoding  | `string`                          | `"utf8"` | The encoding of the `data` string, if `data` is not a string then `inputEncoding` is ignored.                                                                                                    |
| outputEncoding | `string`                          |          | If `outputEncoding` is provided, a string will be returned, otherwise a [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) is returned. |

### SM4.encrypt(data, key[, options])

Encrypt data.

| Param                  | Type                              | Default  | Description                                                                                                                                                                                      |
| ---------------------- | --------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data                   | `string`\|`ArrayBuffer`\|`Buffer` |          | Plain message                                                                                                                                                                                    |
| key                    | `string`                          |          | Cipher key(any string of 32 hexadecimal digits)                                                                                                                                                  |
| options                | `object`                          |          | Options                                                                                                                                                                                          |
| options.mode           | `ECB` \| `CBC`                    | `ECB`    | Block cipher mode                                                                                                                                                                                |
| options.iv             | `string`                          |          | Initialization vector(any string of 32 hexadecimal digits)                                                                                                                                       |
| options.inputEncoding  | `string`                          | `"utf8"` | The encoding of the plain `data` string,if `data` is not a string then `inputEncoding` is ignored.                                                                                               |
| options.outputEncoding | `string`                          |          | If `outputEncoding` is provided, a string will be returned, otherwise a [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) is returned. |

### SM4.decrypt(data, key[, options])

Decrypt data.

| Param                  | Type                              | Default | Description                                                                                                                                                                                      |
| ---------------------- | --------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data                   | `string`\|`ArrayBuffer`\|`Buffer` |         | Ciphered data                                                                                                                                                                                    |
| key                    | `string`                          |         | Cipher key(any string of 32 hexadecimal digits)                                                                                                                                                  |
| options                | `object`                          |         | Options                                                                                                                                                                                          |
| options.mode           | `ECB` \| `CBC`                    | `ECB`   | Block cipher mode                                                                                                                                                                                |
| options.iv             | `string`                          |         | Initialization vector(any string of 32 hexadecimal digits)                                                                                                                                       |
| options.inputEncoding  | `string`                          |         | The encoding of the plain `data` string,if `data` is not a string then `inputEncoding` is ignored.                                                                                               |
| options.outputEncoding | `string`                          |         | If `outputEncoding` is provided, a string will be returned, otherwise a [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) is returned. |
