var path = require('path');

class BasePage {

    constructor(configs) {
        this.configs = configs;
    }

    getContent() {
        return ''
    }

    getTemplate() {
        return path.resolve(__dirname, 'template.pug');
    }

    getTitle() {
        return ''
    }

    get(request, response) {
        response.render(this.getTemplate(), {
            configs: this.configs,
            title: this.getTitle(),
            request: request,
            content: this.getContent(),
        });
    }
};

module.exports = BasePage;