import { expect, it, describe, beforeEach, afterAll, vi } from "vitest";
import { SM4 } from "../dist/index";
import toArrayBuffer from "to-arraybuffer";
import { Buffer } from "buffer";

const { ECB, CBC } = SM4.constants;

const key = "0123456789abcdeffedcba9876543210";
const iv = "0123456789abcdeffedcba9876543210";

// Plain message
const data = "无线局域网产品使用的 SMS4 密码算法";

// Expected values
const ecb_expected = Buffer.from(
  "BufAF2TAkzvYB8+zEtMPpOB3zY/FU9h3gwvuQd19gI14VTLV4KWh5Oi5MDznV4A6ACqKTvqGPMrQJKwDALtA0g==",
  "base64"
);
const cbc_expected = Buffer.from(
  "pQYnXOwYouPXvCgJhaWDJsmPv146JNT6OE/Fiz7iO/ZF0blARNa1lUxWoJuJ3ewlSh1wi6lKXc9eIuYr7ZADqA==",
  "base64"
);

describe("SM4", () => {
  it("ECB", () => {
    let cipherData, plainData;

    expect(
      SM4.encrypt(
        "0123456789abcdeffedcba9876543210",
        "0123456789abcdeffedcba9876543210",
        {
          inputEncoding: "hex",
          outputEncoding: "hex",
        }
      ).substring(0, 32)
    ).toBe("681edf34d206965e86b3e94f536e4246");

    // hex
    cipherData = SM4.encrypt(data, key, {
      outputEncoding: "hex",
    });
    plainData = SM4.decrypt(cipherData, key, {
      inputEncoding: "hex",
      outputEncoding: "utf8",
    });
    expect(cipherData).toBe(ecb_expected.toString("hex"));
    expect(plainData).toBe(data);

    // base64
    cipherData = SM4.encrypt(data, key, {
      outputEncoding: "base64",
    });
    plainData = SM4.decrypt(cipherData, key, {
      inputEncoding: "base64",
      outputEncoding: "utf8",
    });
    expect(cipherData).toBe(ecb_expected.toString("base64"));
    expect(plainData).toBe(data);

    // ArrayBuffer
    cipherData = SM4.encrypt(toArrayBuffer(Buffer.from(data, "utf8")), key);
    plainData = SM4.decrypt(cipherData, key);
    expect(Buffer.from(plainData).toString("utf8")).toBe(data);
  });

  it("CBC", () => {
    let cipherData, plainData;

    // hex
    cipherData = SM4.encrypt(data, key, {
      mode: CBC,
      iv,
      outputEncoding: "hex",
    });
    plainData = SM4.decrypt(cipherData, key, {
      mode: CBC,
      iv,
      inputEncoding: "hex",
      outputEncoding: "utf8",
    });
    expect(cipherData).toBe(cbc_expected.toString("hex"));
    expect(plainData).toBe(data);

    // base64
    cipherData = SM4.encrypt(data, key, {
      mode: CBC,
      iv,
      outputEncoding: "base64",
    });
    plainData = SM4.decrypt(cipherData, key, {
      mode: CBC,
      iv,
      inputEncoding: "base64",
      outputEncoding: "utf8",
    });
    expect(cipherData).toBe(cbc_expected.toString("base64"));
    expect(plainData).toBe(data);
  });
});
