import { defineConfig } from "vitest/config";
import RollupPluginNodeResolve from "@rollup/plugin-node-resolve";
import RollupPluginCommonjs from "@rollup/plugin-commonjs";
import nodePolyfills from "rollup-plugin-polyfill-node";

export default defineConfig({
  test: {
    environment: "jsdom",
    benchmark: { include: ["**/*.{bench,benchmark}.?(c|m)[jt]s?(x)"] },
  },
  // @ts-ignore
  plugins: [RollupPluginCommonjs(), nodePolyfills(), RollupPluginNodeResolve()],
});
