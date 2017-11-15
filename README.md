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
<a href="https://github.com/sass/node-sass">
    <img height="75" src="https://cdn.rawgit.com/nikita-kit/generator-nikita/master/img/node-sass.svg" alt="sass">
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


This is our generator to start a new project from scratch.
It will generate a completely customized version of our nikita-kit project boilerplate for your project.
Feel free to re-run the generator to add or remove features.


## Project-Setup

- [__Grunt__](http://gruntjs.com/) – Javascript task runner
- [__Webpack__](https://webpack.js.org/) – module bundler
- [__Babel__](https://babeljs.io/) – compiler for ES6 Javascript
- [__twigRender__](https://github.com/stefanullinger/grunt-twig-render) or [__Assemble__](http://assemble.io/) – static site generator
- [__EJS__](http://ejs.co/) - client side templates
- [__SASS__](http://sass-lang.com/) with [__LibSass__](http://libsass.org/) – css preprocessing
- [__Jest__](https://facebook.github.io/jest/) – JS testing framework
- [__ESLint__](http://eslint.org/) – linter for JS files
- [__stylelint__](https://stylelint.io/) – linter for SCSS files
- [__Browsersync__](https://browsersync.io/) – synchronised browser testing
- [__nikita.html__](https://github.com/nikita-kit/nikita-html) – HTML conventions and coding guidelines
- [__nikita.css__](https://github.com/nikita-kit/nikita-css) – (S)CSS conventions and coding guidelines
- [__nikita.js__](https://github.com/nikita-kit/nikita-js) – JS conventions and coding guidelines


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
Is this project private?
```

These answers will set the corresponding values in the generated package.json.

&nbsp;

```
Which configuration template do you want to use?
* Web-App setup
* Symfony setup
* Wordpress setup
* Spring Boot setup
```

Here you can choose a config preset for your kind of project.
See `Templates` section below for further information.

&nbsp;

```
Customize this template?
```

Answer `Yes` to customize the nikita default options.
This will ask you several questions which Features, Mixins, Extends and Librarys to add.

&nbsp;

```
Do you want to use source+build+dist folders or one custom source folder?
```

This question appears only when you chose `Web-App setup` before.
Here it is recommended to answer `Yes` because using source+build+dist folders provides a better separation of concerns.
If you answer `No` you get asked for the custom source folder path later on.


## Templates

### Web-App

This is the standard template for stand-alone web apps.
You can choose if you want to use `source+build+dist` folders or one custom source folder.

### Symfony

The Symfony template sets the source folder to `web/static`.

To use the nikita build files, just add something like following lines to your base.html.twig file:
```html
<link rel="stylesheet" href="{{ asset('generated/styles.css') }}" />
<script src="{{ asset('generated/main.js') }}"></script>
```

### Wordpress

The Wordpress template sets the source folder to `static/`.
In addition to nikita generator defaults, jQuery is added.

To use the nikita build files, just enqueue them in your wordpress tamplate like this:
```php
wp_enqueue_script('main.js', rtrim(WP_HOME, '/') . '/static/generated/main.js', array(), '1.0', false);
wp_enqueue_style('styles.css', rtrim(WP_HOME, '/') . '/static/generated/styles.css', array(), '1.0', 'all');
```

### Spring Boot

The Spring Boot template sets the source folder to `src/main/resources/static`.
In addition, the files `Application.java` and `pom.xml` are generated.
Therefor you were ask for Java groupId, Java version and Spring Boot version.


## Contributing

We welcome contributions to generator nikita. See [CONTRIBUTING.md](CONTRIBUTING.md) for a small guide.


## License

`generator-nikita` is licensed under [CC0](http://creativecommons.org/publicdomain/zero/1.0/): Public Domain Dedication, please see
[NIKITA-LICENSE.md](NIKITA-LICENSE.md) for further information.
