import terser from "@rollup/plugin-terser";
import RollupPluginNodeResolve from "@rollup/plugin-node-resolve";
import RollupPluginCommonjs from "@rollup/plugin-commonjs";
import nodePolyfills from "rollup-plugin-polyfill-node";
import rust from "@wasm-tool/rollup-plugin-rust";

export default {
  input: "src/index.js",
  output: [
    {
      name: "gm-crypto",
      file: "dist/index.js",
      format: "es",
      plugins: [terser()],
    },
  ],
  plugins: [
    rust({
      inlineWasm: true,
      experimental: { directExports: true, synchronous: true },
      debug: true,
    }),
    RollupPluginCommonjs(),
    nodePolyfills(),
    RollupPluginNodeResolve(),
  ],
};
