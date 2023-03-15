const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Path = require("path");

module.exports = defineConfig({
  transpileDependencies: true,

  productionSourceMap: (process.env.NODE_ENV === "development"),

  devServer: {
    port: 3000,
  },

  configureWebpack: {
    mode: process.env.NODE_ENV,
    plugins: [
      new NodePolyfillPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          { from: Path.resolve("./node_modules/cesium/Build/Cesium/Workers"), to: "Workers" },
          { from: Path.resolve("./node_modules/cesium/Build/Cesium/Assets"), to: "Assets" },
          { from: Path.resolve("./node_modules/cesium/Build/Cesium/Widgets"), to: "Widgets" },
          { from: Path.resolve("./node_modules/cesium/Build/Cesium/ThirdParty"), to: "ThirdParty" },
        ]
      }),
    ]
  },

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
});