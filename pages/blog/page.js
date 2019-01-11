var fs = require('fs');
var marky = require( "marky-markdown");
var path = require('path');
var pug = require('pug');

var BasePage = require('../_base/page');
var CATALOG_TEMPLATE_PATH = path.resolve(__dirname, 'catalog.pug');
var BLOG_TEMPLATE_PATH = path.resolve(__dirname, 'blog.pug');
var BLOG_FOLDER_PATH = path.resolve(__dirname, '../../', 'blogs');

class BlogPage extends BasePage {

    getTitle() {
        return 'Blog';
    }

    getCatalog() {
        var context = {
            blogs: [],
        };
        fs.readdirSync(BLOG_FOLDER_PATH).forEach(function(blogId) {
            var blogMetaFilePath = path.resolve(BLOG_FOLDER_PATH, blogId, 'meta.json');
            var blogMeta = JSON.parse(fs.readFileSync(blogMetaFilePath));
            if (!blogMeta.published) {
                return;
            }
            context.blogs.push({
                id: blogId,
                summary: blogMeta.summary,
                title: blogMeta.title,
                published: blogMeta.published,
            });
        });
        return pug.renderFile(CATALOG_TEMPLATE_PATH, context);
    }

    getBlog(blogFolder) {
        var context = {};
        var blogMetaFilePath = path.resolve(blogFolder, 'meta.json');
        context.meta = JSON.parse(fs.readFileSync(blogMetaFilePath));
        var blogContentFilePath = path.resolve(blogFolder, 'content.md');
        var markdownContent = fs.readFileSync(blogContentFilePath, "utf8");
        context.content = marky(markdownContent);
        return pug.renderFile(BLOG_TEMPLATE_PATH, context);
    }

    getContent() {
        var blogId = this.request.path.replace('/blog/', '');
        var blogFolder = path.join(BLOG_FOLDER_PATH, blogId);
        if (
            blogId && 
            fs.existsSync(blogFolder)
        ) {
            return this.getBlog(blogFolder);
        } else {
            return this.getCatalog();
        }
    }

    getStyles() {
        return '/dist/blog.css';
    }

    getScript() {
        return '/dist/blog.bundle.js';
    }
}

module.exports = BlogPage;