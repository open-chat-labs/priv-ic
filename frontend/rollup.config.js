/* eslint-disable no-undef */
import svelte from "rollup-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";
import dfxJson from "../dfx.json";
import inject from "rollup-plugin-inject";
import dev from "rollup-plugin-dev";
import json from "@rollup/plugin-json";
import analyze from "rollup-plugin-analyzer";
import filesize from "rollup-plugin-filesize";
import dotenv from "dotenv";
import replace from "@rollup/plugin-replace";

dotenv.config();

const production = !process.env.ROLLUP_WATCH;

console.log("PROD", production);
console.log("URL", process.env.INTERNET_IDENTITY_URL);

function serve() {
    return dev({
        dirs: ["./public"],
        proxy: {
            "/api/*": `http://${dfxJson.networks.local.bind}`,
        },
        spa: "./public/index.html",
        port: 5000,
    });
}

export default {
    input: "./src/main.ts",
    output: {
        sourcemap: true,
        format: "es",
        name: "app",
        dir: "public/build",
    },
    plugins: [
        svelte({
            preprocess: sveltePreprocess({
                sourceMap: !production,
                scss: {
                    prependData: `@import 'src/styles/mixins.scss';`,
                },
            }),
            compilerOptions: {
                dev: !production,
            },
        }),

        css({ output: "main.css" }),

        resolve({
            preferBuiltins: false,
            browser: true,
            dedupe: ["svelte"],
        }),
        commonjs(),
        typescript({
            sourceMap: !production,
            inlineSources: !production,
        }),
        inject({
            Buffer: ["buffer", "Buffer"],
            process: "process/browser",
        }),
        json(),

        replace({
            preventAssignment: true,
            "process.env.INTERNET_IDENTITY_URL": JSON.stringify(process.env.INTERNET_IDENTITY_URL),
            "process.env.NODE_ENV": process.env.NODE_ENV,
            "process.env.IDENTITY_CANISTER_ID": process.env.IDENTITY_CANISTER_ID,
            "process.env.MOCK_SERVICES": !production && process.env.MOCK_SERVICES, // make double sure we don't release with mock data
        }),

        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production && serve(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload("public"),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser(),

        production && analyze({ summaryOnly: true }),

        production && filesize(),
    ],
    watch: {
        clearScreen: false,
    },
};
