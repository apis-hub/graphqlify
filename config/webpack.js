import path from 'path';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';

const webPackConfig = {
  entry: path.resolve(__dirname, '..', 'views', 'console.jsx'),
  resolve: {
    extensions: [ '', '.js', '.jsx' ]
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        test: /\.(js|jsx|es6)$/,
        query: {
          presets: [ 'es2015', 'stage-0', 'react' ]
        }
      }
    ]
  },
  output: {
    filename: 'console.js',
    path: '/assets'
  }
};

const compiler = webpack(webPackConfig);

export default webpackMiddleware(compiler);
