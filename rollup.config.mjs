// rollup.config.js
import path from "node:path";
import fs from "node:fs";
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import { babel } from '@rollup/plugin-babel';
import terser from "@rollup/plugin-terser";
import svelte from 'rollup-plugin-svelte';
import json from '@rollup/plugin-json';
import versionInjector from 'rollup-plugin-version-injector';

const
    prod = !process.env.ROLLUP_WATCH,
    USE_BABEL = false,
    inputdir = 'src', outputdir = 'public/assets',
    plugins = [
        prod && versionInjector(),
        json(),
        svelte({
            compilerOptions: {
                dev: !prod,
                accessors: true,
                // hydratable: true,
            }
        }),
        postcss({
            // extract: true ,
            extract: false,
        }),
        resolve({
            moduleDirectories: ['node_modules'],
            extensions: ['.js', '.mjs', '.cjs'],
            browser: true,

        }),
        commonjs(),
    ];



const inputFiles = fs.readdirSync('src').filter(filename => filename.endsWith('.mjs') && !filename.startsWith('_')).map(filename =>
{
    const { name } = path.parse(filename);
    return {
        name,
        input: path.join(inputdir, filename),
        output: path.join(outputdir, name + '.js')
    };

});



if (prod)
{

    if (USE_BABEL)
    {
        plugins.unshift(babel({
            presets: [
                [
                    '@babel/preset-env', {
                        targets: { esmodules: true },
                        loose: true, modules: false
                    }

                ]
            ], babelHelpers: 'bundled'
        }));
    }


    plugins.push(terser());

}


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

