const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const base = path.resolve(__dirname, '..');
const paths = {
  base,
  src     : path.resolve(base, 'src'),
  dist    : path.resolve(base, 'dist'),
  static  : path.resolve(base, 'src', 'static'),
  config  : path.resolve(base, 'config'),
};

module.exports = {
  performance : {
    hints: false,
  },
  target  : 'web',
  entry   : 'main.js',
  context : paths.src,
  output  : {
    filename: "[name].[hash].js",
    path: paths.dist,
    publicPath: '/',
  },
  resolve : {
    extensions: ['.js'],
    modules: [
      paths.src,
      'node_modules'
    ],
  },
  // HACK: workaround for https://github.com/webpack-contrib/css-loader/issues/454
  // fix is incoming soonish
  node: {
    "Buffer": false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['es2015', { modules: false }], 'stage-0'],
            plugins: [
              ['transform-runtime', {
                "regenerator": false,
              }],
              'syntax-jsx',
              ['transform-react-jsx', { pragma: 'h'}],
              'transform-react-display-name'
            ],
          }
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: "[local]__[path][name]__[hash:base64:5]",
                importLoader: 1
              }
            },
            { loader: 'postcss-loader',
              options: {
                config: path.resolve(paths.config, 'postcss.config.js'),
              }
            },
          ]
        })
      },
      {
        test: /\.(png|jpe?g)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            }
          },
					{
						loader: 'image-webpack-loader',
						query: {
							progressive: true,
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
							pngquant: {
								quality: '65-90',
								speed: 4
							}
						}
					}
        ]
      },
			{
					test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					loader: "url-loader?limit=10000&minetype=application/font-woff"
			},
			{
					test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					loader: "file-loader"
			},
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: [
          { loader: "raw-loader" },
          { loader: "image-webpack-loader",
            options: {
              bypassOnDebug: true
            }
          }
        ]
      },
      {
        test: /CNAME/,
        exclude: /node_modules/,
        use: [
          { loader: 'file-loader',
            options: {
              name: '[name]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin({
      filename: '[name].[hash].css'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      }
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
      favicon: path.resolve(paths.static, 'favicon.ico'),
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: "home.html",
      favicon: path.resolve(paths.static, 'favicon.ico'),
      inject: true
    })
  ],
};
