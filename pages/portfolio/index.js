var path = require('path');
var BasePage = require('../_base');

class PortfolioPage extends BasePage {

    get(request, response) {
        response.render(path.resolve(__dirname, 'template.pug'), {
            configs: this.configs,
            title: 'Home',
            request: request,
        });
    }
}

module.exports = PortfolioPage;