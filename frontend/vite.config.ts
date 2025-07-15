import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import { resolve } from "node:path";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        legacy({
            targets: ["defaults", "not IE 11"],
            additionalLegacyPolyfills: ["regenerator-runtime/runtime"], // 추가 Polyfills 필요 시
        }),
    ],
    resolve: {
        alias: {
            src: resolve(__dirname, "src"),
        },
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:23416/api/v1",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/v1/, ""),
            },
        },
    },
    // assetsInclude: ["**/*.wasm", "**/*.data", "**/*.js"],
});
