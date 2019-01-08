var path = require('path');
var pug = require('pug');

var BasePage = require('../_base/page');

var experience = require('./../../data/experience.json');

class HomePage extends BasePage {

    getTitle() {
        return 'Home';
    }

    getContent() {
        return pug.renderFile(
            path.resolve(__dirname, 'content.pug'),
            {
                experience: experience,
            }
        );
    }

    getScript() {
        return '/dist/home.bundle.js';
    }

    getStyles() {
        return '/dist/home.css';
    }
}

module.exports = HomePage;