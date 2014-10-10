# Why Not?

## Why don't you put `build/` and/or `dist/` under version control?

Because the output build- and dist-files aren't always exactly the same if you work with multiple OS like Windows, Mac OS and Linux. This may cause conflicts or will end in commits with a large list of recurrently updated files.

Those are tasks for a release script, and should be made on a build server.

## Why do you use Compass, do we need it at all?

At the moment I use Compass because of the feature to require SASS Globbing and SCSS Lint. If I could, I would use [grunt-sass](https://github.com/sindresorhus/grunt-sass) which ist based on [libsass](https://github.com/hcatlin/libsass) to get an immense performance boost in compiling SCSS to CSS. I hope the devs out there will implement a better partial-inclusion soon. Another issue: libsass won't properly compile @extends. :(

## Why not call assemble-folder "templates"?

Because pages, partials etc. is way more explicit.
