# Why Not?

## Why don't you put `build/` and/or `dist/` under version control?

Because the output build- and dist-files aren't always exactly the same if you work with multiple OS like Windows, Mac OS and Linux. This may cause conflicts or will end in commits with a large list of recurrently updated files.

Those are tasks for a release script, and should be made on a build server.


## Why not call assemble-folder "templates"?

Because pages, partials etc. is way more explicit.
