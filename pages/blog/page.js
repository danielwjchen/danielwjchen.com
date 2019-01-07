var BasePage = require('../_base/page');

class BlogPage extends BasePage {

    getTitle() {
        return 'Blog';
    }

    getContent() {
        return 'Blog';
    }
}

module.exports = BlogPage;