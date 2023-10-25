import { expect, it, describe, beforeEach, afterAll, vi } from "vitest";
import { SM2 } from "../dist/index";

const { publicKey, privateKey } = SM2.generateKeyPair();
const data = "SM2 椭圆曲线公钥密码算法";

describe("SM2", () => {
  it("generateKeyPair", async () => {
    expect(Buffer.from(privateKey, "hex").length).toBe(32);
    expect(Buffer.from(publicKey, "hex").length).toBe(65);
  });

  it("C1C3C2", async () => {
    let cipherData, plainData;

    // hex
    cipherData = SM2.encrypt(data, publicKey, {
      inputEncoding: "utf8",
      outputEncoding: "hex",
    });

    plainData = SM2.decrypt(cipherData, privateKey, {
      inputEncoding: "hex",
      outputEncoding: "utf8",
    });
    expect(plainData).toBe(data);

    // base64
    cipherData = SM2.encrypt(data, publicKey, {
      inputEncoding: "utf8",
      outputEncoding: "base64",
    });
    plainData = SM2.decrypt(cipherData, privateKey, {
      inputEncoding: "base64",
      outputEncoding: "utf8",
    });
    expect(plainData).toBe(data);

    // ArrayBuffer
    cipherData = SM2.encrypt(data, publicKey, {
      inputEncoding: "utf8",
    });
    plainData = SM2.decrypt(cipherData, privateKey, {
      outputEncoding: "utf8",
    });
    expect(plainData).toBe(data);
  });
});
