var path = require('path');
var pug = require('pug');

var BasePage = require('../_base/page');

class HomePage extends BasePage {

    getTitle() {
        return 'Home';
    }

    getContent() {
        return pug.renderFile(path.resolve(__dirname, 'content.pug'));
    }

    getScript() {
        return '/dist/home.bundle.js';
    }

    getStyles() {
        return '/dist/home.css';
    }
}

module.exports = HomePage;