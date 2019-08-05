module.exports = {
  mode: "development",
  entry: {
    main: "./_development/js/main.js"
  },
  output:{
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      { 
        test: /\.jsx?$/, 
        exclude: /node_modules/, 
        loader: "babel-loader", 
      }
    ]
  },
  devtool: "inline-source-map"
}