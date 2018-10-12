# Summary
Medicr.us is built with angularJS 1.5 with custom gruntJS tasks. The goal is replace the custom gruntJS tasks with webpack and commonJS require().

# Background
I built Medicr.us back in the late 2014, and I have not done much updates to the codebase since then. Medicr.us was a practice project to get myself familiar with angularJS 1.x, and npm and gruntJS, which were the hottest technologies back in the days. I finished it, uploaded it to digital ocean, and kind of just moved on.

I actually started using angularJS 1.x back in 2012. I used it to build a internal tool for the company I was working for at the time.

I am still using the same project setup to this day, with some minor upgrade every now and then. Now that my day job is looking for a solution to migrate itself from the same tech stack, this is a perfect opportunity to dust off some ancient pet project and give it a facelift.




nodeJS
npm


0.10.42
3.7.5

## Architecture
Medicr.us is organized by features with 3 static pages as “apps” with the admin never completed. Stylesheets, images, and JavaScripts are separated into each folder. The gruntJS tasks simply list all the javascripts and concat them together into 1 giant file and minify. There is no dependency resolution, and there is only 1 packaged script file for the entire site.

angularJS templates are stored in separate jade files and manually added to the app’s jade template. That means each every time I want to include a directive, I will have to make sure I include the template file as well. It would be nice to use the pug-loader and have the template included automatically.

I am removing the admin app and replacing it with django’s built-in admin site.

Instead, I am going to utilize webpack’s multiple entry and named exports feature and create a bundle for each individual app.
Install nvm and the latest node lts
nvm is kind of similar to pip and virtualenv. The difference is, nvm does not support multiple environment of the same minor version. This only becomes a problem when there are two projects of the same version of node, and each project requires different version of the same package. 

`nvm install 8`
### Setup webpack
We are going to install the most current webpack available to out at the moment which is version 4.

`npm install --save-dev webpack webpack-cli`
 
### Install `source-map-loader` to help development

`npm install --save-dev  source-map-loader `

Configure
Install source-map-loader to help development

Migrate to webpack
I start with the home page first, which is the `/src/modules/Welcome/Module.js`. The first problem I ran into was the existing architecture. The website is served as static HTML from the `/dist` folder,  and the `<script>` tags have to be modified to refer to the new bundles. To apply the changes with `<script>` tags, I will have to run gruntJS tasks, and the gruntJS tasks fail because of the CommonJS `module.exports` statement.

To solve this problem, I decided to disable the jshint and uglify gruntJS tasks.  

## Passing Variables to pug templates
Medicr.us only has two “pages”, and they are both static htmls serving from dist/. With HtmlWebpackPlugin, I am able to compile static files with some modifications to the templates.

Since jade is succeeded by pug, I will have to update the syntax to work with pug. 
# Conclusion
Replacing gruntJS with Webpack 4 truly feels like an end of an era. Web development has come a long way since the I built my first website with `<iframe>` back in 1998. I feel great that an old dinosaur like me can still hang with kids! I had many goals for Medicr.us when I started the project more than 4.5 years ago, e.g. creating an isomorphic JavaScript application. Now with options such as ReactJS, Angular, TypeScript, and NativeScript, I look forward to the next chapter of this saga.


