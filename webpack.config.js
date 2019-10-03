const path = require("path");
const HtmlWebPackagePlugin = require("html-webpack-plugin");

module.exports = {
    entry: ['babel-polyfill', './src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    // Auto saving and reload
    devServer: {
        contentBase: './dist',
    },
    // For bundles HTML
    plugins: [
        new HtmlWebPackagePlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};