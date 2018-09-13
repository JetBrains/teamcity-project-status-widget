module.exports = () => ({
  plugins: [
    require('postcss-import')({}),
    require('postcss-modules-values-replace')({}),
    require('postcss-cssnext')({
      features: {
        calc: {
          mediaQueries: true
        },
        customProperties: false
      }
    })
  ]
});
