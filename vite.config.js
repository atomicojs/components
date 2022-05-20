import atomico from "@atomico/plugin-vite";
import { defineConfig } from "vite";
import glob from "fast-glob";

const ROOT = "./src";

export default defineConfig({
    root: ROOT,
    build: {
        outDir: "../public",
        rollupOptions: {
            input: await glob(
                [
                    `${ROOT || "."}/**/*.html`,
                    "!node_modules",
                    "!dist",
                    "index.html",
                ],
                {
                    absolute: true,
                }
            ),
        },
    },
    test: {
        environment: "happy-dom",
    },
    plugins: [
        atomico({
            cssLiterals: { minify: true, postcss: true },
        }),
    ],
});
