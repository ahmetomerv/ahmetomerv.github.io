---
title: Migrating Webpack from v1 to v5
date: "2021-03-01T21:33:03.284Z"
description: Webpack migration including Babel, CSS/LESS and file loaders with custom configurations
---

I'd recently upgraded the Webpack version in one of our projects at work from `1.13.2` to `5.23.0` (the latest as of 2021‑02‑22). The JavaScript bundle in production was roughly a 2 MB file which was way larger than it supposed to be, resulting in long download times. So, as a first step to optimize the initial loading experience, it was necessary to first upgrade the Webpack version and then split the JavaScript into two entries: main source code and node modules (there are advanced techniques I've yet managed to apply, maybe in a future post).

As the mentioned project is a real-world software used in production, this post will also include updating necessary modules such as Babel and CSS/LESS/file loaders, with configurations for both production and development environments.

#### Short introduction

- **Webpack** is a tool that takes many files with different types of modules (ES6 or CSS imports) and converts them into static assets (JS, HTML etc.) for browsers to load.
- **Babel** is a tool for compiling modern ES6+ code to older versions of EcmaScript that are compatible with older browsers and environments.

### Upgrade Webpack

For the first step, we can run the following command to install Webpack version 5. For my case, I've installed the version `5.23.0`.

```
$ npm install webpack@5.23.0 --save-dev
```

The `--save-dev` flag is to save Webpack as a development environment dependency. Also, it's important to install it locally (not installing it globally by using `-g`) so that it's easier to update projects individually. 

### Upgrade Babel

If your project has an older version of Babel, delete it from your `package.json` file. The package name most likely will be `babel-core`. Webpack 5 requires Babel version 7, so we need to install it like the following:

```
$ npm install @babel/core --save-dev
```

I had installed version `7.12.16` for our project, but anything with version 7 or higher should be fine.

#### Upgrade plugins and presets

Using Webpack v1, you probably are using `babel-preset-es2015` with your Babel configuration. By upgrading our Webpack and Babel versions, [babel-preset-es2015](https://babeljs.io/docs/en/babel-preset-es2015/) becomes obselete as it is depreceated for Babel v6 and higher.

Instead, we should use `@babel/preset-env` (don't forget deleting `babel-preset-es2015` from your `package.json` and `.babelrc` files).

Install it by:

```
$ npm install @babel/preset-env --save-dev
```

Then, in the `.babelrc` file, add it to the presets list:

```json
{
  ...
  "presets": [
    "@babel/preset-env",
  ]
  ...
}
```

We used to use the [ExtractTextPlugin](https://www.npmjs.com/package/extract-text-webpack-plugin) to extract CSS into seperate files but Webpack v5 now requires [MiniCssExtractPlugin](https://webpack.js.org/plugins/mini-css-extract-plugin) instead. Delete the old package and use the following to install the new one:

```
$ npm install mini-css-extract-plugin --save-dev
```

---

Depending on your code base and the modules you're using, when splitting your bundle files, you might encounter the following error:

```
Error: ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ###
```

I've struggled a lot with this issue, it seemed to only happen when splitting my main bundle file into multiple chunks (for example bundle.js and vendors.js). Two top answers on [this StackOverflow question](https://stackoverflow.com/questions/42449999/webpack-import-module-exports-in-the-same-module-caused-error) said that this happened because we can't mix `import` and `module.exports` syntax, the other explainded this was caused by unexpected CommonJS `require` tree down the stream and suggested adding `"sourceType": "unambiguous"` to the Babel configuration. Both didn't solve my problem (you don't have to do the next step if the answers above work for you).


What solved it for me was using the [@babel/plugin-transform-modules-commonjs](https://babeljs.io/docs/en/babel-plugin-transform-modules-commonjs) plugin.

You can install it as the following: (my version is `7.12.13`)
```
$ npm install @babel/plugin-transform-modules-commonjs --save-dev
```

Next, add it to the plugins list in `.babelrc`:
```json
...
"plugins": [
  "@babel/plugin-transform-modules-commonjs",
]
...
```

### File Loaders and CSS/LESS

We need to run the `.less` files and their modules by Babel and compile them before bundling them up with Webpack. JavaScript and other file types (e.g ttf, woff, jpeg etc.) also need to be loaded.

The next command will install the necessary packages that are required by Babel and Webpack to load and compile the files mentioned above:

```
$ npm install less less-loader css-loader file-loader babel-loader
```

If one of these packages' latest version don't work for you, you can use the next command to install the versions that currently work with my configuration of Webpack v5 and Babel v7:

```
$ npm install css-loader@3.2.0 file-loader@6.2.0 less@3.0.0 less-loader@8.0.0 style-loader@0.20.3 babel-loader@8.2.2
```

_Note:_ Their usage we'll be added in the configuration section.

### Configurations

Webpack supports bunding by passing arguments, without having to create config files, but for mid-to-large projects it's best to manage configurations of development and production environments in seperate files. See Webpack's [options](https://webpack.js.org/configuration/#options) documentation to see what settings are available and example values.

For ease of use, we can add the following scripts to our `package.json` for starting or building our project which will be pointing to different configuration files depending on environment:

```json

"scripts": {
  ...
  "clean": "rimraf dist",
  "build:webpack": "cross-env NODE_ENV=production webpack --config webpack.config.prod.js",
  "build": "npm run clean && npm run build:webpack",
  "build-dev:webpack": "cross-env NODE_ENV=development webpack --config webpack.config.dev.js",
  "build-dev": "npm run clean && npm run build-dev:webpack",
  "start:webpack": "webpack --watch --config webpack.config.dev.js",
  "start": "npm run start:webpack",
  ...
}
```

_Note:_  Configuration files of Webpack and Babel and `package.json` should be in the root of your project. Otherwise change the paths accordingly.


`rimraf` is a simple package for deleting modules, and the `clean` script is run before building our project. You can install that by running: `npm install rimraf --save-dev`.

`cross-env` is used for managing environment variable settings across different platforms. Doing only `NODE_ENV=production` will break on some platforms, this package allows you to do that without running into issues. You can install that by running: `npm install cross-env --save-dev`.

#### Common Configurations
Beside development and production configuration files, we can have a common file that will include some settings that can be used in both.

In the root of your project, create `webpack.config.common.js`. Here we'll add common settings. (refer to the end of the post to see the project structure, and change your configuration settings according to that)

```js
const path = require('path');
const mainPath = path.join(__dirname, './assets');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  resolve: {
    extensions: ['.js'],
    alias: {
      assets: mainPath,
      js: path.join(mainPath, 'js'),
      less: path.join(mainPath, 'less'),
      img: path.join(mainPath, 'img'),
      fonts: path.join(mainPath, 'fonts')
    },
  },

  module: {
    rules: [
      {
        test: /\.jsx?/,
        include: path.join(__dirname, 'assets'),
        use: { loader: 'babel-loader' },
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2|gif|png|jpe?g)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: { loader: 'file-loader' }
      },
      {
        test: /\.less$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader', 'less-loader' ],
      },
    ],
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
        },
      },
    },
  },

};
```

Then we can import and use the common config in other files.

#### Production Configuration

In this config file, we'll manage custom settings needed for production environment. Create the file `webpack.config.prod.js` and add the following:

```js
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const commonConfig = require('./webpack.config.common');
const srcPath = path.join(__dirname, './src');
const mainPath = path.join(__dirname, './assets');
const distPath = path.join(__dirname, './dist');

module.exports = {
  mode: 'production',
  stats: 'errors-only',
  resolve: commonConfig.resolve,

  entry: {
    bundle: {
      import: './assets/index',
    }
  },

  output: {
    path: distPath,
    filename: '[name].js',
    publicPath: './',
  },

  module: {
    rules: [
      ...commonConfig.module.rules,
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: 'style.css' }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
  ],

  optimization: commonConfig.optimization,

};
```

For minifying JavaScript, we used to use the [terser-webpack-plugin](https://github.com/webpack-contrib/terser-webpack-plugin) but it is no longer required in Webpack v4 or above. Setting `mode: production` will enable it by default. You can delete the package if you have it installed.

#### Development Configuration

Create a file named `webpack.config.dev.js` and use the following settings:

```js
var path = require('path');
var webpack = require('webpack');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var commonConfig = require('./webpack.config.common');
const mainPath = path.join(__dirname, './assets');
const distPath = path.join(__dirname, './dist');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  stats: 'verbose',
  resolve: commonConfig.resolve,

  entry: {
    bundle: {
      import: './assets/index',
    }
  },

  output: {
    path: distPath,
    filename: '[name].js',
    publicPath: './',
  },

  module: {
    rules: [
      ...commonConfig.module.rules,
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
  ],

  optimization: commonConfig.optimization,

};

```

All that's left now is to run the scripts we defined eariler in `package.json`.

Webpack has a very rich API with many options, check the official [documentation](https://webpack.js.org/concepts/) for more details. And let me know if anything went wrong with this guide.

---

_Project structure used in this post for reference:_

```
├─ dist
│  ├─ bundle.js
│  └─ vendor.js
│
├─ assets
│  ├─ fonts
│  ├─ img
│  ├─ js
│  ├─ less
│  └─ index.js
│
├─ package.json
├─ webpack.config.common.js
├─ webpack.config.dev.js
├─ webpack.config.prod.js
└─ .babelrc  
```