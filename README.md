# generator-nikita [![Build Status](https://secure.travis-ci.org/nikita-kit/generator-nikita.png?branch=master)](https://travis-ci.org/nikita-kit/generator-nikita)

Latest Release: [![GitHub version](https://badge.fury.io/gh/nikita-kit%2Fgenerator-nikita.png)](https://github.com/nikita-kit/generator-nikita/releases)

<a href="http://gruntjs.com/">
    <img height="75" src="https://cdn.rawgit.com/nikita-kit/generator-nikita/master/img/grunt.svg" alt="grunt">
</a>
<a href="https://webpack.js.org/">
    <img height="75" src="https://cdn.rawgit.com/nikita-kit/generator-nikita/master/img/webpack.svg" alt="webpack">
</a>
<a href="https://babeljs.io/">
    <img height="65" src="https://cdn.rawgit.com/nikita-kit/generator-nikita/master/img/babel.svg" alt="babel">
</a>
<a href="https://reactjs.org/">
    <img height="75" src="https://cdn.rawgit.com/nikita-kit/generator-nikita/master/img/react.svg" alt="react">
</a>
<a href="https://github.com/sass/node-sass">
    <img height="75" src="https://cdn.rawgit.com/nikita-kit/generator-nikita/master/img/node-sass.svg" alt="sass">
</a>
<a href="http://postcss.org/">
    <img height="76" src="https://cdn.rawgit.com/nikita-kit/generator-nikita/master/img/postcss.svg" alt="postcss">
</a>
<a href="https://facebook.github.io/jest/">
    <img height="79" src="https://cdn.rawgit.com/nikita-kit/generator-nikita/master/img/jest.svg" alt="jest">
</a>
<a href="http://eslint.org/">
    <img height="75" src="https://cdn.rawgit.com/nikita-kit/generator-nikita/master/img/eslint.svg" alt="eslint">
</a>
<a href="https://stylelint.io/">
    <img height="75" src="https://cdn.rawgit.com/nikita-kit/generator-nikita/master/img/stylelint.svg" alt="stylelint">
</a>
<a href="https://browsersync.io/">
    <img height="85" src="https://cdn.rawgit.com/nikita-kit/generator-nikita/master/img/browsersync.svg" alt="browsersync">
</a>


This is our generator to start a new web project from scratch.
It will generate a completely customized version of our nikita-kit project boilerplate for your project.
Feel free to re-run the generator to add or remove features.


## Project-Setup

- [__Grunt__](http://gruntjs.com/) – Javascript task runner
- [__Webpack__](https://webpack.js.org/) – module bundler
- [__Babel__](https://babeljs.io/) – compiler for ES6 Javascript
- [__twigRender__](https://github.com/stefanullinger/grunt-twig-render) – static site generator
- [__React__](https://reactjs.org/) or [__JSB__](https://github.com/DracoBlue/jsb/) - JS framework
- [__SCSS__](http://sass-lang.com/) with [__LibSass__](http://libsass.org/) – css preprocessing
- [__PostCSS__](http://postcss.org/) – css postprocessing
- [__Jest__](https://facebook.github.io/jest/) – JS testing framework
- [__ESLint__](http://eslint.org/) – linter for JS files
- [__stylelint__](https://stylelint.io/) – linter for SCSS files
- [__Browsersync__](https://browsersync.io/) – synchronised browser testing
- [__nikita.html__](https://github.com/nikita-kit/nikita-html) – HTML conventions and coding guidelines
- [__nikita.css__](https://github.com/nikita-kit/nikita-css) – (S)CSS conventions and coding guidelines
- [__nikita.js__](https://github.com/nikita-kit/nikita-js) – JS conventions and coding guidelines
- and many more optional features:
  - svg images as inlined css background images
  - useful scss mixins and extends
  - jQuery, Select2 and Swiper
  - webfonts
  - pre-commit hook for code linting


## Getting Started

### Yeoman

Not every new computer comes with a [Yeoman](http://yeoman.io/) pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```bash
npm install -g yo
```

### Nikita Yeoman Generator

To install or update generator-nikita, run:

```bash
npm install -g generator-nikita
```

Finally, initiate the generator at desired directory and answer the questions:

```bash
yo nikita
```

### Generator main questions

```
Your project name
```

These answer will set the corresponding value in the generated package.json.

&nbsp;

```
Which configuration template do you want to use?
* Web-App setup
* Symfony setup
* Wordpress setup
* Spring Boot setup
```

Here you can choose a config preset for your kind of project.
See [Templates](#templates) section below for further information.

&nbsp;

```
Customize this template?
```

Answer `Yes` to customize the nikita default options.
This will ask you several questions which features, mixins, extends and libraries to add.

&nbsp;

```
Which root folder do you want to use?
```

Here you can just hit enter to keep the template default root folder or enter a custom folder.
In this specified folder, the `src` and `static` folders gets created.


## Templates

### Web-App

This is the standard template for stand-alone web apps. The root folder is your project directory by default.


### Symfony

The Symfony template sets the root folder to `web/`.

To use the nikita build files, just add something like following lines to your base.html.twig file:
```html
<link rel="stylesheet" href="{{ asset('static/generated/styles.css') }}" />
<script src="{{ asset('static/generated/main.js') }}"></script>
```

### Wordpress

The Wordpress template sets the source folder to `web/`.
In addition to nikita generator defaults, jQuery is added.

To use the nikita build files (e.g. `web/static/generated/main.js` and `web/static/generated/styles.css`), just enqueue them in your wordpress theme like this:
```php
wp_enqueue_script('main.js', rtrim(WP_HOME, '/') . '/web/static/generated/main.js', array(), '1.0', false);
wp_enqueue_style('styles.css', rtrim(WP_HOME, '/') . '/web/static/generated/styles.css', array(), '1.0', 'all');
```

### Spring Boot

The Spring Boot template sets the source folder to `src/main/resources/web/`.
In addition, the files `Application.java` and `pom.xml` are generated.
Therefor you were ask for Java groupId, Java version and Spring Boot version.


## Contributing

We welcome contributions to generator nikita. See [CONTRIBUTING.md](CONTRIBUTING.md) for a small guide.


## License

generator-nikita is licensed under [CC0](http://creativecommons.org/publicdomain/zero/1.0/): Public Domain Dedication, please see
[NIKITA-LICENSE.md](NIKITA-LICENSE.md) for further information.
