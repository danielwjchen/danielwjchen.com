var fs = require('fs');
var path = require('path');
var pug = require('pug');

var BasePage = require('../_base/page');

var CONTENT_FILE_PATH = path.resolve(__dirname, 'content.pug');
var PROJECTS_FOLDER_PATH = path.resolve(__dirname, '../../', 'projects');

class PortfolioPage extends BasePage {

    getTitle() {
        return 'Portfolio';
    }

    getContent() {
        var context = {
            portfolio: [],
        };
        fs.readdirSync(PROJECTS_FOLDER_PATH).forEach(function(id) {
            var metaFilePath = path.resolve(PROJECTS_FOLDER_PATH, id, 'meta.json');
            if (!fs.existsSync(metaFilePath)) {
                return;
            }
            var meta = JSON.parse(fs.readFileSync(metaFilePath));
            if (!meta.published) {
                return;
            }
            context.portfolio.push({
                id: id,
                meta: meta,
            });
        });
        return pug.renderFile(CONTENT_FILE_PATH, context);
    }

}

module.exports = PortfolioPage;