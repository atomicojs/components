import pluginMetaUrl from "@uppercod/vite-meta-url";
import { readFile } from "fs/promises";
/**@type {import("vite").UserConfig} */
const config = {
  esbuild: {
    jsxFactory: "_jsx",
    jsxInject: `import {jsx as _jsx} from 'atomico/jsx-runtime'`,
  },
  build: {
    target: "esnext",
  },
  plugins: [
    pluginMetaUrl({
      css: async (path) => ({ inline: await readFile(path) }),
    }),
  ],
};

export default config;
