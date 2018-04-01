/**
 * Created by дима on 18.07.2016.
 */

    const buildTest = process.env.buildtest || null; //buildtest=true
var path = require('path');
var webpack = require('webpack');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
module.exports = {
    entry: [
        "./dev/app/index.module"],
    output: {
        path: __dirname + '/production',
        publicPath:'/app/',
        filename: "index.js"
    },
    plugins: [
        new ngAnnotatePlugin({add: true}),
        new webpack.optimize.UglifyJsPlugin({
            warnings: false,
            drop_console: true,
            unsafe: true
        })
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel?presets[]=es2015'//?optional[]=runtime
        }]
    }
};

