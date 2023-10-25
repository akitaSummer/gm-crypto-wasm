import { bench, describe } from "vitest";
import { SM2, SM3, SM4 } from "gm-crypto";
import {
  SM2 as SM2_WASM,
  SM3 as SM3_WASM,
  SM4 as SM4_WASM,
} from "../dist/index";

const { publicKey, privateKey } = SM2.generateKeyPair();

const sm4Key = "0123456789abcdeffedcba9876543210";

let data = "abenchmark";

for (let i = 0; i < 5 * 1024; i++) {
  data += "abenchmark";
}

describe("sm2", () => {
  bench(
    "js",
    () => {
      const cipherData = SM2.encrypt(data, publicKey, {
        inputEncoding: "utf8",
        outputEncoding: "hex",
      });
      SM2.decrypt(cipherData, privateKey, {
        inputEncoding: "hex",
        outputEncoding: "utf8",
      });
    },
    { iterations: 100 }
  );

  bench(
    "wasm",
    () => {
      const cipherData = SM2_WASM.encrypt(data, publicKey, {
        inputEncoding: "utf8",
        outputEncoding: "hex",
      });
      SM2_WASM.decrypt(cipherData, privateKey, {
        inputEncoding: "hex",
        outputEncoding: "utf8",
      });
    },
    { iterations: 100 }
  );
});

describe("sm3", () => {
  bench(
    "js",
    () => {
      SM3.digest(
        "61626364616263646162636461626364616263646162636461626364616263646162636461626364616263646162636461626364616263646162636461626364",
        "hex",
        "hex"
      );
    },
    { iterations: 100 }
  );

  bench(
    "wasm",
    () => {
      SM3_WASM.digest(
        "61626364616263646162636461626364616263646162636461626364616263646162636461626364616263646162636461626364616263646162636461626364",
        "hex",
        "hex"
      );
    },
    { iterations: 100 }
  );
});

describe("sm4", () => {
  bench(
    "js",
    () => {
      const cipherData = SM4.encrypt(data, sm4Key, {
        inputEncoding: "utf8",
        outputEncoding: "hex",
      });
      SM4.decrypt(cipherData, sm4Key, {
        inputEncoding: "hex",
        outputEncoding: "utf8",
      });
    },
    { iterations: 100 }
  );

  bench(
    "wasm",
    () => {
      const cipherData = SM4_WASM.encrypt(data, sm4Key, {
        inputEncoding: "utf8",
        outputEncoding: "hex",
      });
      SM4_WASM.decrypt(cipherData, sm4Key, {
        inputEncoding: "hex",
        outputEncoding: "utf8",
      });
    },
    { iterations: 100 }
  );
});
