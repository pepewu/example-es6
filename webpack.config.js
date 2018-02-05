var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var webpack = require('webpack');

module.exports = {
    'entry': './src/app.ts',
    'output': {
        'path': path.join(__dirname, 'dist'),
        'filename': 'bundle.js'
    },
    'resolve': {
        // Add `.ts` and `.tsx` as a resolvable extension.
        'extensions': ['.ts', '.tsx', '.js']
    },
    'module': {
        'rules': [
            // ts-loader: convert typescript (es6) to javascript (es6),
            // babel-loader: converts javascript (es6) to javascript (es5)
            {
                'test': /\.tsx?$/,
                'loaders': ['babel-loader', 'ts-loader'],
                'exclude': /node_modules/
            }
            // babel-loader for pure javascript (es6) => javascript (es5)
            // {
            //     'test': /\.(jsx?)$/,
            //     'loaders': ['babel'],
            //     'exclude': [/node_modules/, nodeModulesPath]
            // }
        ]
    }
};