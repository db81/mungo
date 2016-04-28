var ExtractPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: 'client.js',
    output: {
        path: __dirname + '/build',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel' },
            { test: /\.(png|jpg|gif|svg)$/, loader: 'url?limit=10000&name=[path][name].[ext]' },
            { test: /\.(html|wav|ogg|webm)$/, loader: 'file?name=[path][name].[ext]' },
            { test: /\.sass$/, loader: ExtractPlugin.extract('css!sass?indentedSyntax') },
        ]
    },
    resolve: {
        root: __dirname
    },
    // Resolve import 'config' to null if we're in the browser.
    externals: {
        config: 'null'
    },
    plugins: [
        new ExtractPlugin('bundle.css', { allChunks: true })
    ]
};
