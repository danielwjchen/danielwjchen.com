## Summary
Upgrading an old `angularJS 1.x` project with custom `grunt` tasks to `webpack` requires many changes, but it is absolutely worth it.

## Background and Motivations
A `angularJS 1.x` projectin production  built with `grunt` is slow. The project has over 8mb in source code, and `grunt` takes over 15 seconds to build on my 2012 machine with i5 and 16GB of ram. 

Besides, `angularJS 1.x` is old - it is designed when `JavaScript` did not have a standard to manage dependencies. `angularJS 1.x` has its own dependency injection scheme, and that is completely replaced by ES6 `import/export` in `angular 2+`. A partial rewrite is neccessary in every scenario.

However, I need a game plan and validation before ripping everything apart due to the size of the project. Luckly, I use the same toolchain for both professional and personal projects, and I decided to use [medicr.us](https://medicr.us) as the guinea pig.

## The Problem
[medicr.us](https://medicr.us) is divided into "pages" and "modules". While they both are `angularJS 1.x` modules, each page folder is independent and serves a single purpose, while modules are reusable pieces shared by pages.

```sh
├── src
│   ├── pages
│   │   ├── page1
│   │   │   ├── index.js
│   │   │   ├── template.jade
│   │   │   └── styles.scss
│   │   └── page2
│   │       ├── index.js
│   │       ├── template.jade
│   │       └── styles.scss
│   └── modules
│       ├── module1
│       |   ├── index.js
│       |   ├── feature1.js
│       |   ├── feature1.jade
│       |   ├── feature1.scss
│       |   ├── feature2.js
│       |   ├── feature2.jade
│       |   └── feature2.scss
│       └── module2
│           ├── index.js
│           ├── feature1.js
│           ├── feature1.jade
│           ├── feature1.scss
│           ├── feature2.js
│           ├── feature2.jade
│           └── feature3.scss
└── dist
```

To build the project, custom `grunt` tasks scan the folders for all the javascripts and concatenate them together. The `index.js` is always the first to be concatenated because it contains the `angularJS 1.x` module definition.

`SCSS` files are simply concated into one file with no specific order and passed to the processor.

`angularJS 1.x` templates are stored in separate `jade` files. A custom `grunt` task would read the each inidividual template, process it to `html`, transform the content into `javascript` that wraps everything in a `$templateCache.put()` call, and append the the content to the `index.js` of the folder.

For example:
```pug
h1 Hello {{foo}}!
```

Now becomes:
```js
angular.module('module2').run(function($templateCache) {
    $templateCache.put('feature.jade', '<h1>Hello {{foo}}!</h1>');
});
```

## The Solution

First, all the `javascript` files have to rewritten. ES6 `import/export` statements will be handling the dependencies , instead of relying on `angularJS 1.x` to manage dependency injections. Each `feature.js` file will now export itself.

```js
/**
 * Using feature1.js as example directive
 */
import './styles1.scss';
// jade is renamed pug due to trademark dispute
import template from './template1.pug'; 

export default function() {
    return {
        template: template,
        restrict: 'E',
        scope: {},
        controller: function($scope) {
            // do stuff
        },
    };
};
```

The `index.js` for each module glues all the feature files togther.

```js
/**
 * Using module1 as example
 */
import 'angular';

const MODULE_NAME = 'module1';

import feature1 from './feature1.js';
import feature2 from './feature2.js';
import feature3 from './feature3.js';

angular.module(MODULE_NAME, [])
.directive('feature1', feature1)
.directive('feature2', feature2)
.directive('feature3', feature3)
;

exports default MODULE_NAME;
```

The `index.js` for each page will now serve as the entry.

```js
/**
 * Example webpack config
 */
const path = require('path');

const PAGE_FOLDER = path.resolve(__dirname, 'src', 'pages');

module.exports = {
    entry: {
        'page1': 
            path.resolve(PAGE_FOLDER, 'page1'),
        'page2': 
            path.resolve(PAGE_FOLDER, 'page2'),
    },
};
```

```js
/**
 * Using page1 as an example
 */
import 'angular';
import './styles.scss';

const MODULE_NAME = 'PAGE_1';

import module1 from '../../modules/module1';
import module2 from '../../modules/module2';
import module3 from '../../modules/module3';

angular(MODULE_NAME, [
    module1,
    module2,
    module3,
])
;

exports default MODULE_NAME;
```

## Results
The performance imporvement after eplacing `grunt` and `angularJS 1.x` dependency injection with `webpack` and ES6 `export/import` statement is drastic. [medicr.us](https://medicr.us) is small, so the difference isn't noticeable. However, the ~8mb project that used to take over 15 seconds to build now only take less that 2 seconds for a cold start. Subsequnet builds take less than 500ms! 

This alone is worth the 2 weeks dedicated to rewriting each file. I created a `python` script to help automate most of the rewrite, but the lack of tests proves to be a major bottleneck in getting the project to production shape.