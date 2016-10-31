const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/com/mendix/widget/carousel/Carousel.ts",
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: "src/com/mendix/widget/carousel/Carousel.js",
        libraryTarget:  "umd",
        umdNamedDefine: true,
        library: "com.mendix.widget.carousel.Carousel"
    },
    resolve: {
        extensions: [ "", ".ts", ".js", ".json" ]
    },
    errorDetails: true,
    module: {
        loaders: [
            { test: /\.ts?$/, loader: "ts-loader" },
            { test: /\.json$/, loader: "json" }
        ],
        postLoaders: [ {
            test: /\.ts$/,
            loader: "istanbul-instrumenter",
            include: path.resolve(__dirname, "src"),
            exclude: /\.(spec)\.ts$/
        } ]
    },
    devtool: "source-map",
    externals: [ "mxui/widget/_WidgetBase", "dojo/_base/declare" ],
    plugins: [
        new CopyWebpackPlugin([
            { from: "src/**/*.js" },
            { from: "src/**/*.xml" },
            { from: "src/**/*.css" }
        ], {
            copyUnmodified: true
        })
    ],
    watch: true
};
