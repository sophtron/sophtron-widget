module.exports = {
    configureWebpack: {
      devServer: {
        headers: { "Access-Control-Allow-Origin": "*" }
      },
    },
    publicPath: '/static/',
    outputDir: 'dist',
    filenameHashing: false,
    devServer: {
      disableHostCheck: true
    }
  };