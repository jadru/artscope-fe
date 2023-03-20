const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // Production 빌드 시, 리액트 코드 트랜스파일링 할 시작점 설정.
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "/build"),
    filename: "[name].[contenthash].js",
    publicPath: "/",
  },

  // webpack Develop 모드 실행 시, 사용될 static 파일들 경로와 관리 방식 설정.
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 3000,
    historyApiFallback: true,
  },

  watchOptions: {
    poll: true,
    ignored: "/.yarn/",
  },

  module: {
    rules: [
      {
        test: /\.([jt]sx?)?$/,
        use: "swc-loader",
        exclude: /.yarn/,
      },
      {
        test: /\.p?css$/i,
        include: path.resolve(__dirname, "src"),
        use: ["style-loader", "css-loader", "postcss-loader" /* 로더 설정 */],
      },
      {
        test: /\.(jpe?g|png|svg|gif|ico|eot|ttf|woff|woff2|mp4|pdf|webm|txt)$/,
        type: "asset/resource",
        generator: {
          filename: "static/chunks/[path][name].[hash][ext]",
        },
      },
    ],
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  // 번들링된 JS 코드를 html 파일과 매핑 및 주입시키기 위한 플러그인 설정.
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join("./public/index.html"),
    }),
  ],
};
