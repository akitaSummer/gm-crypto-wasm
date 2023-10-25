import toArrayBuffer from "to-arraybuffer";
import { Buffer } from "buffer"; // 兼容浏览器环境
import { sm3_digest } from "../Cargo.toml";

export const digest = (data, inputEncoding, outputEncoding) => {
  if (typeof data === "string") {
    data = Buffer.from(data, inputEncoding || "utf8");
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

  const buff = Buffer.from(sm3_digest(new Uint8Array(data.buffer)), "hex");

  return outputEncoding ? buff.toString(outputEncoding) : toArrayBuffer(buff);
};
