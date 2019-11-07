const path = require("path");

module.exports = ({ config }) => {
    config.module.rules.push({
        test: /\.(scss|css)$/,
        exclude: /\node_modules/,
        use: [
            { loader: "style-loader" },
            { loader: "css-loader" },
            {
                loader: "postcss-loader",
                options: { plugins: () => [require("autoprefixer")] }
            },
            { loader: "sass-loader" }
        ]
    });

    config.resolve.extensions.push(".scss");

    return config;
};
