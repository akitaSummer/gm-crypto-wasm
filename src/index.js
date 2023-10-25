if (typeof globalThis !== "undefined") {
  const { webcrypto } = require("node:crypto");
  globalThis.crypto = webcrypto;
}

export * as SM2 from "./sm2";
export * as SM3 from "./sm3";
export * as SM4 from "./sm4";
