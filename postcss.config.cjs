
module.exports = (ctx) =>
{


    const prod = ctx.enx === 'production';

    return {
        map: ctx.options.map,
        parser: ctx.options.parser,
        plugins: {
            "postcss-import": {},
            'postcss-combine-media-query': !prod ? {} : false,
            'postcss-preset-env': {
                autoprefixer: {
                    cascade: false,
                },
                features: {
                    // creates fallback duplicates properties for older browsers
                    // adds ~200 lines to bootstrap mini
                    'custom-properties': true,
                },
            },
            cssnano: !prod ? false : { preset: 'default' },
        }
    };
};