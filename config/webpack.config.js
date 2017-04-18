const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
  devtool : 'source-map',
  entry   : {
    main: 'main.js',
  },
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
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['es2015', { modules: false }], 'react', 'stage-0'],
            plugins: ['transform-runtime'],
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
        use: [
          { loader: 'style-loader' },
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
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'file-loader'
      },
			{
					test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					loader: "url-loader?limit=10000&minetype=application/font-woff"
			},
			{
					test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					loader: "file-loader"
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
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      }
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      favicon: path.resolve(paths.static, 'favicon.ico'),
      inject: true
    }),
  ],
};
