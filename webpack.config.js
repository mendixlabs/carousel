var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/com/mendix/widget/carousel/CarouselRenderer.ts",
    output: {
        path: __dirname + "/dist/tmp",
        filename: "src/com/mendix/widget/carousel/CarouselRenderer.js",
        libraryTarget:  "umd",
    },
    resolve: {
        extensions: [ "", ".ts", ".tsx", ".js", ".json" ]
    },
    errorDetails: true,
    module: {
        loaders: [
            { test: /\.tsx?$/, loaders: [ "ts-loader" ] },
            { test: /\.json$/, loader: "json" }
        ]
    },
    devtool: "source-map",
    externals: [],
    plugins: [
        new CopyWebpackPlugin([
            { from: "src/**/*.js" },
            { from: "src/**/*.xml" },
            { from: "src/**/*.css" },

        ], {
            copyUnmodified: true
        })
    ]
};
