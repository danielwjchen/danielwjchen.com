var path = require('path');

class BasePage {

    constructor(configs) {
        this.configs = configs;
    }

    getNavMenuItems() {
        return [
            {
                name: 'Home',
                url: '/',
            },
            {
                name: 'Portfolio',
                url: '/portfolio/',
            },
            {
                name: 'Blog',
                url: '/blog/',
            },
            {
                name: 'Resume',
                url: '/resume/',
            },
            {
                name: 'Contact',
                url: '/contact/',
            },
        ]
    }

    getScript() {
        return '';
    }

    getStyles() {
        return '';
    }

    getContent() {
        return '';
    }

    getTemplate() {
        return path.resolve(__dirname, 'template.pug');
    }

    getTitle() {
        return '';
    }

    get(request, response) {
        var context = {
            configs: this.configs,
            title: this.getTitle(),
            request: request,
            navMenuItems: this.getNavMenuItems(),
            content: this.getContent(),
            script: this.getScript(),
        };
        if (this.configs.PRODUCTION) {
            context.styles = this.getStyles();
        }
        response.render(this.getTemplate(), context);
    }
};

module.exports = BasePage;