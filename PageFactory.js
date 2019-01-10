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
    app.get('/', function(request, response) {
        var homePageInstance = new HomePageClass(configs, request);
        homePageInstance.get(response)
    });

    fs.readdirSync(directory).forEach(function(item) {
        if (item.startsWith('\.') || item.startsWith('_')) {
            return ;
        }

        var PageClass = require(path.resolve(directory, item, 'page'));

        ['get', 'post',].forEach(function(method) {
            if (
                !PageClass.prototype[method] ||
                typeof PageClass.prototype[method] !== 'function'
            ) {
                return;
            }
            app[method](
                new RegExp('^\/' + item + '\/(?!images\/)*'), 
                function(request, response) {
                    var pageInstance = new PageClass(configs, request);
                    pageInstance[method](response);
                }
            )
        });
    });
};
