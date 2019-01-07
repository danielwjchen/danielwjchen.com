/**
 * Defines ExpressJS app.js
 */
var setApiProxy = require('./api-proxy');
var express = require('express');
var cookieParser = require('cookie-parser');
var getConfigs = require('./getConfigs.js');
var pages = require('./getPages')();
var request = require('request');

var app = express();
var configs = getConfigs('./configs.json');

var port = 3000;
var hostname = '127.0.0.1';
    
app.set('view engine', 'jade');
app.set('views', './src/pages/');
app.use(cookieParser());

// proxies HangarA calls
setApiProxy(app, configs.hangarA, configs.DEBUG);


var getUseSession = function(cookies, callback) {
    var options = {
        url: configs.hangarA.url + 
             '/api/v1/user-session/' +
             '?api_key=' +
             configs.hangarA.api_key +
             '&api_secret=' +
             configs.hangarA.api_secret,
        method: 'get',
        headers: {
            authorization: 'Token ' + cookies.auth_token_key,
        },
        json: true,
    };
    return request.get(options, callback)

};

pages.forEach(function(page) {
    app.get(page.route, function(clientRequest, clientResponse) {
        if (configs.DEBUG) {
            console.log(clientRequest.path);
        }
        getUseSession(clientRequest.cookies, function(error, serverResponse) {
            var isLoggedIn = error === null && serverResponse.body.id;

            // visitor is not logged in and the page is user only
            if (
                !isLoggedIn &&
                page.data.permission.length === 1 &&
                page.data.permission[0] === 'user'
            ) {
                if (
                    clientRequest.cookies !== null &&
                    typeof clientRequest.cookies === 'object'
                ) {
                    Object.keys(clientRequest.cookies).forEach(function(key) {
                        clientResponse.clearCookie(key);
                    });
                }
                clientResponse.redirect('/?redirect=' +
                                        encodeURIComponent(clientRequest.originalUrl));
                return;
            }

            // visitor is not logged in and the page is guest only
            if (
                isLoggedIn &&
                page.data.permission.length === 1 &&
                page.data.permission[0] === 'guest'
            ) {
                clientResponse.redirect('/dashboard/');
                return;
            }
            clientResponse.render(page.template, {
                configs: configs,
                hostname: clientRequest.hostname,
                user: serverResponse ? serverResponse.body : null,
                path: page.path,
                ngApp: page.ngApp,
                cssClass: page.cssClass,
                page: page.data,
            });
        });
    });
});

// handles robots.txt
app.get('/robots.txt', function(request, response) {
    if (configs.PRODUCTION) {
        response.send('User-Agent: * \nAllow: / ');
    } else {
        response.send('User-Agent: * \nDisallow: /');
    }
});

// handles bad request
app.use(function(request, response, next) {
    response.status(404);
    if (request.accepts('html')) {
        response.render('NotFound/page', {
            timestamp: new Date().getTime(),
            configs: configs,
            hostname: request.hostname,
            path: 'not-found',
            ngApp: 'page.NotFound',
            cssClass: 'not-found-page',
            page: require('./src/pages/NotFound/page.json'),
        });
    } else {
        response.send('Bad request');
    }
});

var server = app.listen(port, hostname, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
});
