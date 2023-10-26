import { expect, it, describe, beforeEach, afterAll, vi } from "vitest";
import { SM3 } from "../dist/index";
import toArrayBuffer from "to-arraybuffer";
import { Buffer } from "buffer";

describe("SM3", () => {
  it("Calculates digest values", () => {
    expect(SM3.digest("abc", "utf8", "hex")).toBe(
      "66c7f0f462eeedd9d1f2d46bdc10e4e24167c4875cf2f7a2297da02b8f4ba8e0"
    );
    expect(
      SM3.digest(
        "61626364616263646162636461626364616263646162636461626364616263646162636461626364616263646162636461626364616263646162636461626364",
        "hex",
        "hex"
      )
    ).toBe("debe9ff92275b8a138604889c18e5a4d6fdb70e5387e5765293dcba39c0c5732");

    expect(SM3.digest("YWJj", "base64", "hex")).toBe(
      "66c7f0f462eeedd9d1f2d46bdc10e4e24167c4875cf2f7a2297da02b8f4ba8e0"
    );

    expect(SM3.digest(Buffer.from("abc"), "", "base64")).toBe(
      "Zsfw9GLu7dnR8tRr3BDk4kFnxIdc8veiKX2gK49LqOA="
    );

    expect(SM3.digest(toArrayBuffer(Buffer.from("abc")), "x", "base64")).toBe(
      "Zsfw9GLu7dnR8tRr3BDk4kFnxIdc8veiKX2gK49LqOA="
    );
  });

  it("Input size exceeds 56 bytes", () => {
    expect(
      SM3.digest(
        "hello world!hello world!hello world!hello world!hello worl", // Buffer.alloc(58, 'hello world!', 'utf8')
        "",
        "base64"
      )
    ).toBe("PLP9zs97R3Knzfb9AC5rs4oa573F8wxapycMP1b8sKE=");
  });
});
