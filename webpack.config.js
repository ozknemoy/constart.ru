

var path = require('path');
var webpack = require('webpack');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

module.exports = {
    entry: ["webpack-dev-server/client?http://localhost:8000",
        'webpack/hot/dev-server',
        "./dev/app/index.module"],
    output: {
        path: __dirname + '/production',
        publicPath:'/app/',
        filename: "index.js"
    },
    historyApiFallback: true,
    devtool: "none",
    //devtool: NODE_ENV == 'development' ? "cheap-inline-module-source-map": null,// cheap-inline-module-source-map не для продакшена

    plugins: [
        new ngAnnotatePlugin({add: true}),
        new webpack.HotModuleReplacementPlugin(),
        //new webpack.EnvironmentPlugin("data['@@SERVER_URL']"),
        /*new webpack.SourceMapDevToolPlugin({
            filename: '[file].map'
        })*/
    ],
    module: {
        loaders: [
            //{ test: /\.js$/, loader: 'webpack-traceur?sourceMaps&experimental' },
            {
            test: /\.js/,
            //include: __dirname+'/dev/app', тогда не компилит головной файл
            exclude: /(node_modules|bower_components|assets|webpack-dev-server|webpack)/,
            loader: 'babel?presets[]=es2015'//?optional[]=runtimecacheDirectory&
            },
            /*{
                test: /\.html$/,
                loader: "html"
            }*/
        ]
    },
   devServer: {
       historyApiFallback: true,
        host: 'localhost',
        port: 8000,
        hot: true,
        contentBase: __dirname+'/dev',
       watchOptions: {
           aggregateTimeout: 300,
           poll: 1000
       }
    }
};
