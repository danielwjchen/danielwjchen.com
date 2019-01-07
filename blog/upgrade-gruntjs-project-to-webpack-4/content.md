# Summary
Medicr.us is built with angularJS 1.5 with custom gruntJS tasks. The goal is replace the custom gruntJS tasks with webpack and CommonJS `module` and `require`.

# Goals
* Replaces gruntJS tasks with webpack
* Implements CommonJS `module` and `require`
* Adds `sourcemap` support
* Upgrades nodeJS and npm

# Background
I built Medicr.us back in the late 2014, and I have not done much updates to the codebase since then. Medicr.us was a practice project to get myself familiar with angularJS 1.x, and npm and gruntJS, which were the hottest technologies back in the days. I finished it, uploaded it to digital ocean, and kind of just moved on.

I actually started using angularJS 1.x back in 2012. I used it to build a internal tool for the company I was working for at the time.

# Motivations
I use the same project setup for both professional and personal projects, and the same GruntJS I used to build medicr.us is in some production projects I maintain for my job, with some minor upgrade every now and then. 

The problems of staying with old tech is find support. The community has moved on, and finding someone that knows how to fix certain issues is hard. Not to mention the lack of support for new developer tools that boots productivity, such as sourcemap.

Now that my day job is looking for a solution to migrate itself from the same tech stack, upgrading medicr.us to webpack is a prefect practice project.

# Goals




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
Since jade is succeeded by pug, I will have to update the syntax to work with pug. 

Medicr.us only has two “pages”, and they are both static htmls serving from `dist/`. With `HtmlWebpackPlugin`, I am able to compile static files with some modifications to the templates.

## Getting Ready for Production
[Webpack has an excellent tutorial on how to set up for production.](https://webpack.js.org/guides/production/) However, there are some additional setups due to medicr.us' unique design.

### Getting `webpack-dev-server` to work with `HtmlWebpackPlugin`
Because `HtmlWebpackPlugin` serves from memory instead of the files written on the `/dist` directory, `HtmlWebpackHarddiskPlugin` is needed to generate the two HTML files.

```
npm install --save-dev html-webpack-harddisk-plugin
```

See: https://stackoverflow.com/questions/49983799/the-affect-of-htmlwebpackplugin-on-webpack-dev-server

# Conclusion
Replacing gruntJS with Webpack 4 truly feels like an end of an era. Web development has come a long way since the I built my first website with `<iframe>` back in 1998. I feel great that an old dinosaur like me can still hang with kids! I had many goals for Medicr.us when I started the project more than 4.5 years ago, e.g. creating an isomorphic JavaScript application. Now with options such as ReactJS, Angular, TypeScript, and NativeScript, I look forward to the next chapter of this saga.

Back in the days, I will have to hunt through several tutorials to put together how to add `uglify` or `cssmin`, or configure `less` or `sass` to minify the output. I am happy `webpack` is becoming the de facto standard.

I am also glad to see `sass` beat out `less` to win the standard war. Not that I have a preference, I have lived through `prototype` vs `jquery`, `bower` vs `npm`, `grunt` vs `gulp`, etc. It's just a huge hassle when the developers have to choose sides. It really cuts into my time to argue how PS4 is so much surperior than XBox One.