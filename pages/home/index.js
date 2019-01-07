var path = require('path');
var pug = require('pug');

var BasePage = require('../_base');

class HomePage extends BasePage {

    getTitle() {
        return 'Home';
    }

    getContent() {
        return pug.renderFile(path.resolve(__dirname, 'content.pug'));
    }
}

module.exports = HomePage;