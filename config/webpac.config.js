var webpack = require("webpack");
var path = require("path");
let entryJs = path.resolve(__dirname, '../app.js');
let BUILD_PATH = path.resolve(__dirname, '../dist')

module.exports = {
    resolve: {
        modules: [path.resolve(__dirname, 'node_modules')]
    },
    entry: entryJs,
    output: {
        path: BUILD_PATH,
        publicPath: BUILD_PATH,
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: ["babel-loader?cacheDirectory"],
            },
        ]
    },
    plugins: [
    ]
}