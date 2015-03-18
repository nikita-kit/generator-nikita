# DEV

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
* removed `copy:bower_components` from dist. If you need it: depend on the things in `_requireconfig.js`
  or `@import` them to your `styles.scss`

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
