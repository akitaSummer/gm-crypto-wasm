import { set_panic_hook } from "../Cargo.toml";

set_panic_hook();

if (typeof globalThis !== "undefined" && typeof window === "undefined") {
  const { webcrypto } = require("crypto");
  globalThis.crypto = webcrypto;
}

export * as SM2 from "./sm2";
export * as SM3 from "./sm3";
export * as SM4 from "./sm4";
