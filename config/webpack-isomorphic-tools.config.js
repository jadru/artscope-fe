const WebpackIsomorphicToolsPlugin = require("webpack-isomorphic-tools/plugin");

module.exports = {
  assets: {
    videos: {
      extensions: ["webm", "mp4"],
      parser: WebpackIsomorphicToolsPlugin.url_loader_parser,
    },
  },
};
