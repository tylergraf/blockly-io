module.exports = {
  mode: "development",
  entry: {
    game: "./game-client.js",
    toast: './src/index.js'
  },
  output: {
    "path": __dirname + '/public/dist',
    "filename": "[name]-bundle.js"
  },
  watch: true,
  "devtool": "source-map",
  // "module": {
  //   "rules": [{
  //     "test": /\.js$/,
  //     "exclude": /node_modules/,
  //     "use": {
  //       "loader": "babel-loader",
  //       "options": {
  //         "presets": [
  //           "env"
  //         ]
  //       }
  //     }
  //   }]
  // }
}
