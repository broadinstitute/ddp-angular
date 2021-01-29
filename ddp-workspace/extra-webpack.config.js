module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        main: {
          maxSize: 512000
        }
      }
    }
  }
};
