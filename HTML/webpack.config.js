const webpack = require("webpack");
const path = require("path");
const BannerPlugin = require("webpack").BannerPlugin;
const TerserPlugin = require("terser-webpack-plugin");


const config = {
    mode: "production",
    entry: {
        main: [/*'./node_modules/@splidejs/splide/dist/js/splide.min.js',*/ "./dev/js/components/_vars.js", "./dev/js/components/_functions.js", "./dev/js/components/main.js"]
    },
    output: {
        filename: "main.bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    optimization: {
        minimizer: [new TerserPlugin({
          extractComments: false,
        })],
      },
    module: {
        rules: [{
            test: /\.css$/,
            use: ["style-loader", "css-loader"],
        }, ],
    },
};

const devConfig = {
    mode: "development",
    entry: {
        main: [/*'./node_modules/@splidejs/splide/dist/js/splide.min.js',*/ './dev/js/components/_vars.js', './dev/js/components/_functions.js', './dev/js/components/main.js']
    },
    output: {
        filename: "main.bundle.js",
        path: path.resolve(__dirname, 'dev'),
        iife: false,
        libraryExport: "default"
    },
    devtool: "source-map",
    optimization: {
        minimize: false,
    },
    plugins: [
        new BannerPlugin({
            raw: true,
            entryOnly: true,
            test: /\.js$/,
            include: /dev\/js/,
            banner: (filename) => {
                const name = path.basename(filename);
                return `/* ${name} */\n`;
            },
        }),
    ],
};

module.exports = [config, devConfig];