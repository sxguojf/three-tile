import { defineConfig } from "vite";

import { join } from "path";
const resolve = (dir: string) => join(__dirname, dir);

export default defineConfig({
    base: "./",
    root: "demo",
    server: {
        host: "0.0.0.0",
        port: 8001,
    },
});
