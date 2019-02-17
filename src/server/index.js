require("@babel/register")({
    ignore: [/node_modules/],
    presets: ["@babel/preset-env", "@babel/preset-react"],
    plugins: [
        "@babel/plugin-proposal-class-properties",
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        "@babel/plugin-syntax-dynamic-import",
        "transform-class-properties",
        ["react-css-modules", {
            webpackHotModuleReloading: true,
            generateScopedName: `[name]__[local]___[hash:base64:5]`
        }]
    ]
});
require("@babel/polyfill");
require("./server");
