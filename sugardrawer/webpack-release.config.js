const TerserPlugin = require("terser-webpack-plugin");
let path = require("path");
let fileName = "js/main.js";
let src = path.resolve(__dirname, "src");
let dist = path.resolve(__dirname, "dist");
let HtmlWebpackPlugin = require("html-webpack-plugin");
const environment = process.env.NODE_ENV || "release";
module.exports = {
    mode: 'production',
    entry: {
        app: path.join(src, fileName)
    },
    output: {
        path: dist,
        filename: "[name].bundle.js"
    },
    devtool: "source-map",
    module: { rules: [
            {
                //BabelでJSコードをES2015+ -> ES5変換
                test: /\.js$/,
                exclude: /node_module | bower_components/,
                loader: "babel-loader",
                //リリースの際はコメント情報を完全除去する
                options: {
                    comments: false,
                    compact: true
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css']
            },
            {
                test: /\.(jpg|png)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[path][hash].[ext]",
                            outputPath: "/"
                        }
                    }
                ]
            },
            {
                //EaselJSの読み込み,
                test: require.resolve("createjs-easeljs"),
                use: ['imports-loader?this=>window', 'exports-loader?window.createjs']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(src, "index.html"),
            filename: "index.html"
        }),
        ],
    optimization: {
      splitChunks: { chunks: 'all' },
      minimizer: [
        ]
    },
    resolve: {
        extensions: [".js", ".jsx"],
        alias: {
            APIConfig: path.join(__dirname, `/src/js/config/${environment}.js`)
        }
    }
};
