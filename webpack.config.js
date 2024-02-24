const config = {
    mode: 'production',
    entry: {
        main: ['./dev/js/components/_vars.js', './dev/js/components/_functions.js', './dev/js/main.js']
    },
    output: {
        filename: 'main.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
        ],
    },
};

module.exports = config;