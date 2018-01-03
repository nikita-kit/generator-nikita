# Why Not?

## Why not dropping grunt?

Because it's a clean way to structure build tasks and configs. And it provides a handy file selection logic with globbing.
The npm scripts approach leads to bloated `package.json` files. In large projects, this ends in separated js task files.
Then it's like grunt but without it's features.


## Why don't you put `build/` and/or `dist/` under version control?

Because the output build- and dist-files aren't always exactly the same if you work with multiple OS like Windows, Mac OS and Linux.
This may cause conflicts or will end in commits with a large list of recurrently updated files.
Those are tasks for a release script, and should be made on a build server.
