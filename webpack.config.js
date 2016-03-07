var path = require("path");
var webpack = require("webpack");
var pkg = require("./package.json");

module.exports = {
    cache: true,
    entry: {
        app: "./<%= paths.temp %>/src/components/app.js"
    },
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "/dist/",
        filename: "[name].js",
        chunkFilename: "[chunkhash].js"
    },
    module: {
        loaders: [
            // required to write "require('./style.css')"
            {test: /\.css$/, loader: "style-loader!css-loader"},
            {test: /\.ts(x?)$/, loader: "babel-loader!ts-loader"}
        ]
    },

    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};