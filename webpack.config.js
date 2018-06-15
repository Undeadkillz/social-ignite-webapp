const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
    context: __dirname + "/src/app",
    entry: {
        app: [
            "babel-polyfill",
            "./bootstrap.js",
        ],
    },
    output: {
        path: __dirname + "/dist/",
        filename: "[name].js"
    },

    plugins: [
        new HardSourceWebpackPlugin(),
        new webpack.DefinePlugin({
            "API": JSON.stringify("https://api.socialignite.media"),
            "ASSETS": JSON.stringify("https://assets.socialignite.media"),
            "SOCKET": JSON.stringify("https://api.socialignite.media"),
        }),
        new UglifyJsPlugin({
            parallel: 4,
            sourceMap: true
        })
    ],

    resolve: {
        extensions: [".json", ".js"],
        modules: [
            "node_modules",
            "src/app"
        ]
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                }
            },
            {test: require.resolve("moment"), loader: "expose-loader?moment"},

            {
                use: [{
                    loader: "expose-loader",
                    options: "wait"
                }]
            },

        ]
    },
};