# dev

* updated webpack and babel
* updated eslint
* updated stylelint and setup pre commit hook 
* removed bower and ruby sass

# 3.0.0 (2017/05/04)

* replaced sass-lint by stylelint
* added contribution section and project icons to readme
* renamed generator templates to be more clear what it is for
* removed modernizr, use @supports instead
* removed drop console setting from uglify
* replaced require.js by webpack2 and babel
* replaced jshint by eslint with pre commit hook
* added spring boot template
* replaced livereload by Browsersync
* input prompts are always required fields
* all templates can be customized right after choosing the template
* exclude group-css-media-queries from slim build
* dont run bower when rerunning the generator and bower is not included
* added also twig as static page generator
* added script to run non-interactive-generator for builds
* updated lots of npm dependencies
* removed universal.css for IE6

# 2.0.0 (2016/08/02)

* updated lots of lots of npm dependencies
  * we cannot use grunt 1.0.x, yet (since most peer dependencies rely on 0.4.x)
  * we cannot use modernizr > 0.6.1, yet (since custom tests with addTests don't work)
* removed `handlebars-helper-partial` library

# 1.1.0 (2016/08/01)

* replaced scss-lint with sass-lint
* fixed possible Modernizr.testStyles or Modernizr.prefixes is undefined (if no css/js available)
* upgrade to grunt-modernizr 0.6.1
* made bower configurable
* don't aways override the useBuildFolders option when choosing a template
* fixed skip-install option in generator
* moved nikita-css, jsb, logging.js to npm
* pinned npm package versions
* uglify disabled for one-folder-build
* fix license entry to be SPDX conform
* depend on version >= 4.x and < 5 of nodejs
* replaced grunt-autoprefixer by grunt-postcss and autoprefixer
* requirejs uglify disabled
* updated grunt-contrib-imagemin package
* updated grunt-sass package
* fix trailing slash in source folder path
* fixed require js cachebusting
* added tests for custom:libass, custom:compass, slim and default template
* added feature switch for universal stylesheet
* generate setup-dev-env.sh depending on the local grunt/bower setting
* fixed README for projects without compass
* travis builds don't require sudo anymore: faster CI

# 1.0.2 (2015/09/02)

* .gitkeep for sass extends folder added
* updated grunt-svgmin to 2.0.1
* updated grunt-contrib-uglify to 0.9.2

# 1.0.1 (2015/03/31)

* updated grunt-autoprefixer to 2.2.0
* fixed string-replace-task #22

# 1.0.0 (2015/03/18)

* added templates for nikita configuration (default, slim, custom) - saves you from lots of decisions when bootstraping a simple project
* removed grunticon and replaced it with svgcss #20
  * dropped PNG-fallback support!
* fixed tmpPath for grunticon #18
* upgraded to grunticon 2.1.6
* fixed issue, when there are no .svgs in the img/bgs folder #19
* removed px-to-rem mixin
* set `attr-value-double-quotes` and `attr-value-not-empty` to false and added `space-tab-mixed-disabled` in htmlhint options
* pinned handlebars-helper-partial in package.json to version 0.1.2 (there are conficts with 0.2.0)
* removed px-to-rem-usage from _rwd-testing.scss and _buttons.scss #16
* removed px-to-rem-usage from _forms.scss #17

# 0.9.0 (2015/03/10)

* updated to grunt-sass 0.18.0 to get node-sass 2.0.0 (to fix 32bit compatibility issue) #15
* decide whether you want to use local bower/grunt or the global version (saves up to 55MB!)
* made activation of SVG Sprites configurable
* load `svg-sprite.svg` from svgstore with ajax #13
* made the `--target` of `grunt build` and `grunt dist` configurable #10
* added `useBuildFolders` and `sourceFolder` to configure where to put source files
* isFile filter for grunt expand added #14
* updated cssmin version
* removed unecessary trailing `,` in js arrays

# 0.8.0

* removed dependency to `grunt-symlink`
* `bower_components` is now always located at `/` and not at `source/bower_components` as symlink
* removed `copy:bower_components` from dist. If you need it: depend on the things in `_requireconfig.js` or `@import` them to your `styles.scss`

# 0.7.0

* updated grunt-sass to 0.17.0
* updated grunt-autoprefixer to 2.0.0
* updated grunt-concurrent to 1.0.0
* updated grunt-contrib-clean to 0.6.0
* updated grunt-contrib-copy to 0.7.0
* updated grunt-contrib-cssmin to 0.10.0
* updated grunt-contrib-imagemin to 0.9.2
* updated grunt-contrib-jshint to 0.10.0
* updated grunt-contrib-uglify to 0.6.0
* updated grunt-contrib-watch to 0.6.1

# 0.6.0

* added paths variables for `source, build, dist, tmp` to easily configure changing folders
* grunt-contrib-clean: added `force: true` option to allow cleaning folders outside cwd
* escaping gitinfos

# 0.5.0

* removed sass-globbing (+ fileindex) dependency
* do not copy gitinfos.hbs.ejs
* moved tmp files of grunticon/svg-backgrounds into tmp folder
* added cachebuster for .css and .js files (+ requirejs modules!)

# 0.4.0

* added optional gitinfos for the dist-task via grunt-gitinfo
* fixed requirejs yeoman setup
* disabled data-png and png-fallback in svg-background mixin (discontinued IE8 and lower support)
* updated grunt-modernizr to 0.6.0
* updated grunt-sass to 0.16.1
* test for compass is now simple string test
* disable sass in Gemfile if not necessary (if compass is disabled)

# 0.3.0

* added {{autolink}} handlebars helper
* added libSass option, now you can choose between libSass and Compass/Sass
* updated autoprefixer to 1.0.1
* `button`-normalizing migrates from `_buttons.scss` to `_basics.scss`
* empty folders like `fonts` will be copied with a .gitkeep file
* automatically enabling `nikita.css extends` and `nikita.css mixins` if the `formFramework` is enabled
* added explanation for the javascript part
* properly return App instance when returning app.js module
* added initial requirejs workflow
* made generator prompts more meaningful
* adjusted output in string-replace-task and syntax in svg-background-mixin for a better matching
* added `.gitignore` files to folders sass/svg-bg-extends and sass/grunticon to ignore generated scss-files
* renamed sass/icons to sass/svg-bg-extends
* made Browser Reset and Webfonts SASS-partial configurable
* do not add `_z-layers.scss` if layering-mixin isn't included
* made CSS Split configurable
* added clickable links after webserver is started
* fixed port for livereload
* automatically enabling `svgBackgrounds` feature if the `formFramework` is enabled
* added `--port` parameter to override default port 9002
* added `--livereload-port` parameter to override the default port assignment to `--port + 1`
* structured index.js
* made form-framework configurable
* made respond-to-mixin configurable
* made svgBackgrounds configurable
* do not add grunticon dependency if svgBackgrounds are disabled
* moved photobox and phantomas directory to reports-folder
* added reports-folder
* made photobox, phantomas and pagespeed configurable
* made jsDoc and cssStyleGuide configurable
* register partials helper for assemble in gruntfile
* appicons, touchicons and favicons are now located in source/img/appicons
* performance optimization

# 0.9.0

* the grunticon-mixin got a new syntax and was therefore renamed, now you have to use `@include svg-background(name);`
* removed _ib.scss extend
* removed info about pre-release version of compass
* removed source/img/bgs/svgmin/.gitignore
* removed source/img/icons/svgmin/.gitignore

# 0.8.1

* added `bower install` info to the README.md

# 0.8.0

* added nikita.css as bower package
* added bower as package manager
* package.json#private is true now, change it if you REALLY want to publish your entire project to NPM
* faster cleaning of build and dist folder
* use one global tmp folder for both build and dist
* updated grunticon to 1.2.13 (because of strange tmp-folder behaviour!)
* removed `partials/icon-sprite.svg` from source folder, is stored in tmp folder now
* always use sass cache in dev, disable it for dist
* removed unused `compass.fonts_dir` and `compass.javascripts_dir`
* added `*.gif` for `imagemin` task
* `icon-sprite.svg` is part of the gitignore now (since it's generated by `svgmin:dev`/`svgmin:dist`)
* replaced svgmin:bgs + svgmin:icons with svgmin:dist + svgmin:dev
* use build/tmp and dist/tmp folder for temporary svgmin/grunticon svg files
* Added `Gemfile.lock` to `.gitignore`
* Hint in `setup-dev-env.sh` changed to version without `--pre` for sass and compass
* Updated assemble to 0.4.42
* Updated grunt-crontrib-imagemin to 0.8.1

# 0.7.0

* First version with CHANGELOG.md
* Use SASS 3.4
