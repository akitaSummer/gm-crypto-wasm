import { expect, it, describe, beforeEach, afterAll, vi } from "vitest";
import { SM2 } from "../dist/index";

const { publicKey, privateKey } = SM2.generateKeyPair();
const data = "SM2 椭圆曲线公钥密码算法";
const { C1C2C3, C1C3C2 } = SM2.constants;

describe("SM2", () => {
  it("generateKeyPair", () => {
    expect(Buffer.from(privateKey, "hex").length).toBe(32);
    expect(Buffer.from(publicKey, "hex").length).toBe(65);
  });

  it("C1C3C2", () => {
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

  it("C1C2C3", () => {
    let cipherData, plainData;

    // hex
    cipherData = SM2.encrypt(data, publicKey, {
      mode: C1C2C3,
      inputEncoding: "utf8",
      outputEncoding: "hex",
    });
    plainData = SM2.decrypt(cipherData, privateKey, {
      mode: C1C2C3,
      inputEncoding: "hex",
      outputEncoding: "utf8",
    });
    expect(plainData).toBe(data);

    // base64
    cipherData = SM2.encrypt(data, publicKey, {
      mode: C1C2C3,
      inputEncoding: "utf8",
      outputEncoding: "base64",
    });
    plainData = SM2.decrypt(cipherData, privateKey, {
      mode: C1C2C3,
      inputEncoding: "base64",
      outputEncoding: "utf8",
    });
    expect(plainData).toBe(data);

    // ArrayBuffer
    cipherData = SM2.encrypt(data, publicKey, {
      mode: C1C2C3,
      inputEncoding: "utf8",
    });
    plainData = SM2.decrypt(cipherData, privateKey, {
      mode: C1C2C3,
      outputEncoding: "utf8",
    });
    expect(plainData).toBe(data);
  });

  it("C1 with PC", () => {
    let cipherData, plainData;

    // hex
    cipherData = SM2.encrypt(data, publicKey, {
      inputEncoding: "utf8",
      outputEncoding: "hex",
    });
    plainData = SM2.decrypt("04" + cipherData, privateKey, {
      inputEncoding: "hex",
      outputEncoding: "utf8",
      pc: true,
    });
    expect(plainData).toBe(data);

    // base64
    cipherData = SM2.encrypt(data, publicKey, {
      inputEncoding: "utf8",
      outputEncoding: "hex",
      pc: true,
    });
    plainData = SM2.decrypt(cipherData.substr(2), privateKey, {
      inputEncoding: "hex",
      outputEncoding: "utf8",
    });
    expect(plainData).toBe(data);
  });
});
