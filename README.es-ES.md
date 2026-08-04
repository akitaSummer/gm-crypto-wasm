

# gm-crypto-wasm

![密码行业标准化委员会](./spec_header.png)

Esta es la versión wasm de [gm-crypto](https://github.com/byte-fe/gm-crypto), la cual ofrece un mejor rendimiento.

- [GM/T0003-2012《Algoritmo criptográfico de clave pública SM2 basado en curvas elípticas》](http://www.oscca.gov.cn/sca/xxgk/2010-12/17/content_1002386.shtml)
- [GM/T0004-2012《Algoritmo de hash criptográfico SM3》](https://www.oscca.gov.cn/sca/xxgk/2010-12/17/content_1002389.shtml)
- [GM/T0002-2012《Algoritmo de cifrado por bloques SM4》(también conocido como SMS4)](http://www.sca.gov.cn/sca/c100061/201611/1002423/files/330480f731f64e1ea75138211ea0dc27.pdf)

## Inicio rápido

### Instalación

Usando npm:

```bash
$ npm install gm-crypto-wasm
```

Usando yarn:

```bash
$ yarn add gm-crypto-wasm
```

Usando pnpm:

```bash
$ pnpm add gm-crypto-wasm
```

### Uso básico

#### SM2

> Algoritmo criptográfico de clave pública basado en curvas elípticas.

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

> Algoritmo de hash criptográfico.

```js
import { SM3 } from "gm-crypto-wasm";

console.log(SM3.digest("abc"));
console.log(SM3.digest("YWJj", "base64"));
console.log(SM3.digest("616263", "hex", "base64"));
```

#### SM4

> Algoritmo de cifrado por bloques.

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

#### Pruebas de rendimiento (benchmark)

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

Genera un nuevo par de claves asimétricas.

### SM2.encrypt(data, key[, options])

Cifra los datos.

| Parámetro                  | Tipo                              | Predeterminado  | Descripción                                                                                                                                                                                      |
| ---------------------- | --------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data                   | `string`\|`ArrayBuffer`\|`Buffer` |          | Mensaje en claro                                                                                                                                                                                    |
| key                    | `string`                          |          | Clave pública generada por [SM2.generateKeyPair()](#sm2generatekeypair)                                                                                                                             |
| options                | `object`                          |          | Opciones                                                                                                                                                                                          |
| options.mode           | `C1C3C2` \| `C1C2C3`              | `C1C3C2` | Modo de concatenación                                                                                                                                                                               |
| options.inputEncoding  | `string`                          | `"utf8"` | La codificación de la cadena `data` en claro. Si `data` no es una cadena, `inputEncoding` se ignora.                                                                                               |
| options.outputEncoding | `string`                          |          | Si se proporciona `outputEncoding`, se devolverá una cadena; de lo contrario, se devolverá un [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). |
| options.pc             | `boolean`                         | `false`  | Incluye la marca `PC` como primer byte                                                                                                                                                                 |

### SM2.decrypt(data, key[, options])

Descifra los datos.

| Parámetro                  | Tipo                              | Predeterminado  | Descripción                                                                                                                                                                                      |
| ---------------------- | --------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data                   | `string`\|`ArrayBuffer`\|`Buffer` |          | Datos cifrados                                                                                                                                                                                    |
| key                    | `string`                          |          | Clave privada generada por [SM2.generateKeyPair()](#sm2generatekeypair)                                                                                                                            |
| options.mode           | `C1C3C2` \| `C1C2C3`              | `C1C3C2` | Modo de concatenación                                                                                                                                                                               |
| options.inputEncoding  | `string`                          |          | La codificación de la cadena `data` en claro. Si `data` no es una cadena, `inputEncoding` se ignora.                                                                                               |
| options.outputEncoding | `string`                          |          | Si se proporciona `outputEncoding`, se devolverá una cadena; de lo contrario, se devolverá un [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). |
| options.pc             | `boolean`                         | `false`  | Incluye la marca `PC` como primer byte                                                                                                                                                                 |

### SM3.digest(data, [inputEncoding], [outputEncoding])

Calcula el resumen (digest).

| Parámetro          | Tipo                              | Predeterminado  | Descripción                                                                                                                                                                                      |
| -------------- | --------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data           | `string`\|`ArrayBuffer`\|`Buffer` |          | Mensaje de datos                                                                                                                                                                                     |
| inputEncoding  | `string`                          | `"utf8"` | La codificación de la cadena `data`. Si `data` no es una cadena, `inputEncoding` se ignora.                                                                                                    |
| outputEncoding | `string`                          |          | Si se proporciona `outputEncoding`, se devolverá una cadena; de lo contrario, se devolverá un [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). |

### SM4.encrypt(data, key[, options])

Cifra los datos.

| Parámetro                  | Tipo                              | Predeterminado  | Descripción                                                                                                                                                                                      |
| ---------------------- | --------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data                   | `string`\|`ArrayBuffer`\|`Buffer` |          | Mensaje en claro                                                                                                                                                                                    |
| key                    | `string`                          |          | Clave de cifrado (cualquier cadena de 32 dígitos hexadecimales)                                                                                                                                                  |
| options                | `object`                          |          | Opciones                                                                                                                                                                                          |
| options.mode           | `ECB` \| `CBC`                    | `ECB`    | Modo de cifrado por bloques                                                                                                                                                                                |
| options.iv             | `string`                          |          | Vector de inicialización (cualquier cadena de 32 dígitos hexadecimales)                                                                                                                                       |
| options.inputEncoding  | `string`                          | `"utf8"` | La codificación de la cadena `data` en claro. Si `data` no es una cadena, `inputEncoding` se ignora.                                                                                               |
| options.outputEncoding | `string`                          |          | Si se proporciona `outputEncoding`, se devolverá una cadena; de lo contrario, se devolverá un [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). |

### SM4.decrypt(data, key[, options])

Descifra los datos.

| Parámetro                  | Tipo                              | Predeterminado | Descripción                                                                                                                                                                                      |
| ---------------------- | --------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data                   | `string`\|`ArrayBuffer`\|`Buffer` |         | Datos cifrados                                                                                                                                                                                    |
| key                    | `string`                          |         | Clave de cifrado (cualquier cadena de 32 dígitos hexadecimales)                                                                                                                                                  |
| options                | `object`                          |         | Opciones                                                                                                                                                                                          |
| options.mode           | `ECB` \| `CBC`                    | `ECB`   | Modo de cifrado por bloques                                                                                                                                                                                |
| options.iv             | `string`                          |         | Vector de inicialización (cualquier cadena de 32 dígitos hexadecimales)                                                                                                                                       |
| options.inputEncoding  | `string`                          |         | La codificación de la cadena `data` en claro. Si `data` no es una cadena, `inputEncoding` se ignora.                                                                                               |
| options.outputEncoding | `string`                          |         | Si se proporciona `outputEncoding`, se devolverá una cadena; de lo contrario, se devolverá un [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). |
