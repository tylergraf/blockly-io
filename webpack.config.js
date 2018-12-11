const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MinifyPlugin = require("babel-minify-webpack-plugin");

const config = {
  mode: "development",
  entry: './src/index.js',
  output: {
    "path": __dirname + '/public/dist',
    "filename": "[name]-bundle.js"
  },
  module: {
    rules: [
      {
        test: /(client-modes|game-core).*\.mjs$/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
};

module.exports = (env, argv) => {

  if (argv.mode === 'development') {
    config.devtool = 'source-map';
    // config.watch = true;
  }

  if (argv.mode === 'production') {
    config.plugins = [
      // new MinifyPlugin()
    ]
  }

  return config;
};
