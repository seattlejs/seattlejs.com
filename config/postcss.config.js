module.exports = (ctx) => ({
  plugins: [
    require('postcss-smart-import')({
      addDependencyTo: ctx.webpack
    }),
    require('postcss-cssnext'),
  ]
});
