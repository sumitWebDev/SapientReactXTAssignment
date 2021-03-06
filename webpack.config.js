const path = require('path');

module.exports = {
    entry: './public/scripts/app.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, './public/dist'),
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
        ],
    }
};