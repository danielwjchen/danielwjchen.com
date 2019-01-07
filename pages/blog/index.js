var path = require('path');
var BasePage = require('../_base');

class BlogPage extends BasePage {

    getContent() {
        return 'Blog'
    }
}

module.exports = BlogPage;