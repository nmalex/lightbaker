const path = require('path');

module.exports = {
    entry: './src/app.js',
    mode: 'development',
    target: 'node',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs2'
    },
    devServer: {
        contentBase: path.join(__dirname),
        compress: true,
        port: 3000,
    },
};