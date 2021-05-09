/**@type {import("vite").UserConfig} */
const config = {
  esbuild: {
    jsxFactory: "_jsx",
    jsxInject: `import {jsx as _jsx} from 'atomico/jsx-runtime'`,
  },
  build: {
    target: "esnext",
  },
};

export default config;
