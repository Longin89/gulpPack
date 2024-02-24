const config = {
    mode: 'production',
    entry: {
        main: ['./dev/js/components/vars.js', './dev/js/components/functions.js', './dev/js/main.js']
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