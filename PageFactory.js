/**
 * Get pages
 */
'use strict';
var fs = require('fs');
var path = require('path');

var directory = path.resolve(__dirname, 'pages');
var configs = require('./configs.json');

module.exports = function(app) {
    app.set('view engine', 'pug');
    app.set('views', './pages/');

    var HomePageClass = require(path.resolve(directory, 'home', 'page'));
    var homePageInstance = new HomePageClass(configs);
    app.get('/', homePageInstance.get.bind(homePageInstance));

    fs.readdirSync(directory).forEach(function(item) {
        if (item.startsWith('\.') || item.startsWith('_')) {
            return ;
        }

        var PageClass = require(path.resolve(directory, item, 'page'));
        var pageInstance = new PageClass(configs);

        ['get', 'post',].forEach(function(method) {
            if (
                !pageInstance[method] ||
                typeof pageInstance[method] !== 'function'
            ) {
                return;
            }
            app[method](
                '/' + item + '/', 
                pageInstance[method].bind(pageInstance)
            )
        });
    });
};
