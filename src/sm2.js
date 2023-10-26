import toArrayBuffer from "to-arraybuffer";
import { Buffer } from "buffer"; // 兼容浏览器环境
import {
  sm2_gen_keypair,
  sm2_encrypt_c1c2c3,
  sm2_encrypt_c1c3c2,
  sm2_decrypt_c1c2c3,
  sm2_decrypt_c1c3c2,
} from "../Cargo.toml";

export const C1C2C3 = 0;
export const C1C3C2 = 1;
export const PC = "04";

export const generateKeyPair = (needPC = true) => {
  const kp = sm2_gen_keypair();
  return {
    privateKey: kp.private_key,
    publicKey: (needPC ? PC : "") + kp.public_key,
  };
};

export const encrypt = (data, publicKey, options) => {
  const {
    mode = C1C3C2,
    inputEncoding,
    outputEncoding,
    pc = false,
  } = options || {};

  if (typeof data === "string") {
    data = Buffer.from(data, inputEncoding || "utf8");
  } else if (Object.prototype.toString.call(data) === "[object ArrayBuffer]") {
    data = Buffer.from(data);
  }
  if (!Buffer.isBuffer(data)) {
    throw new TypeError(
      `Expected "string" | "Buffer" | "ArrayBuffer" but received "${Object.prototype.toString.call(
        data
      )}"`
    );
  }

  const res = Buffer.from(
    mode === C1C2C3
      ? sm2_encrypt_c1c2c3(publicKey, new Uint8Array(data.buffer))
      : sm2_encrypt_c1c3c2(publicKey, new Uint8Array(data.buffer))
  );

  const buff = pc ? Buffer.from("04" + res.toString("hex"), "hex") : res;

  return outputEncoding ? buff.toString(outputEncoding) : toArrayBuffer(buff);
};

export const decrypt = (data, privateKey, options) => {
  const {
    mode = C1C3C2,
    inputEncoding,
    outputEncoding,
    pc = false,
  } = options || {};

  if (typeof data === "string") {
    data = Buffer.from(data, inputEncoding);
  } else if (data instanceof ArrayBuffer) {
    data = Buffer.from(data);
  }
  if (!Buffer.isBuffer(data)) {
    throw new TypeError(
      `Expected "string" | "Buffer" | "ArrayBuffer" but received "${Object.prototype.toString.call(
        data
      )}"`
    );
  }

  data = pc ? Buffer.from(data.toString("hex").substr(2), "hex") : data;

  const res =
    mode === C1C2C3
      ? sm2_decrypt_c1c2c3(privateKey, new Uint8Array(data.buffer))
      : sm2_decrypt_c1c3c2(privateKey, new Uint8Array(data.buffer));

  const buff = Buffer.from(res);

  return outputEncoding ? buff.toString(outputEncoding) : toArrayBuffer(buff);
};

export const constants = { C1C2C3, C1C3C2, PC };
