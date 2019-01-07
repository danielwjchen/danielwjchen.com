var BasePage = require('../_base/page');

class ContactPage extends BasePage {

    getTitle() {
        return 'Contact';
    }

    getContent() {
        return 'Contact'
    }
}

module.exports = ContactPage;