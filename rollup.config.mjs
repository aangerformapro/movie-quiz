// rollup.config.js
import path from "node:path";
import fs from "node:fs";
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import terser from "@rollup/plugin-terser";
import svelte from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import json from '@rollup/plugin-json';
import versionInjector from 'rollup-plugin-version-injector';
import del from 'rollup-plugin-delete';
import postcssConfig from './postcss.config.cjs';


const
    prod = !process.env.ROLLUP_WATCH,
    inputdir = 'src', outputdir = 'public/assets',
    plugins = [
        prod && del({ targets: outputdir + '/*.map' }),
        prod && versionInjector(),
        json(),
        svelte({
            preprocess: sveltePreprocess(),
            emitCss: true,
            compilerOptions: {
                dev: !prod,
                accessors: true,
                hydratable: true,
            }
        }),
        postcss({
            // extract: true ,
            // extract: false,
            extract: 'svelte-app.css',
            sourceMap: !prod,
            plugins: postcssConfig.getPlugins(prod)
        }),


        resolve({
            moduleDirectories: ['node_modules'],
            extensions: ['.js', '.mjs', '.cjs'],
            browser: true,

        }),
        commonjs(),

        prod && terser(),
    ];



const inputFiles = fs.readdirSync('src').filter(
    filename => filename.endsWith('.mjs') && !filename.startsWith('_')
).map(filename =>
{
    const { name } = path.parse(filename);
    return {
        name,
        input: path.join(inputdir, filename),
        output: path.join(outputdir, name + '.js')
    };

});






export default inputFiles.map(item => ({
    watch: {
        exclude: 'node_modules/**',
        include: [inputdir + '/**', 'modules/**']
    },
    context: 'globalThis',
    input: item.input,
    output: [
        {
            format: 'es',
            sourcemap: !prod,
            file: item.output
        }
    ],

    plugins
}));

