
function getPlugins(prod)
{
    return [
        require("postcss-import")(),
        !prod && require('postcss-combine-media-query')(),
        require('postcss-preset-env')({
            autoprefixer: {
                cascade: false,
            },
            features: {
                'custom-properties': true,
            },
        }),
        !!prod && require('cssnano')({ preset: 'default' })
    ];
};


function postcss(ctx) 
{

    return {
        map: ctx.options.map,
        parser: ctx.options.parser,
        plugins: getPlugins(ctx.env === 'production'),
    };
};


postcss.getPlugins = getPlugins;


module.exports = postcss;