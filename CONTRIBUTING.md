# Contributing

From opening a bug report to creating a pull request: every contribution is
appreciated and welcome. If you're planning to implement a new feature or change
an existing one, please create an issue first. This way we can ensure that your precious
work is not in vain.

## Issues

If you have discovered a bug or have a feature suggestion, feel free to create an issue on Github.

## Submitting Changes

### Strategy

1. generate a nikita project from a local checkout of generator-nikita
2. work on that generated project and commit all the changes locally
3. backport the changes the the checkout of generator-nikita
4. generate the project again.
5. if no files are modified and test are passing your done


### Setup

1. fork [generator-nikita](https://github.com/nikita-kit/generator-nikita) on Github

2. clone your fork

```bash
git clone git@github.com:<YOUR-USER>/generator-nikita.git
```

3. make a new branch  and set upstream

```bash
cd generator-nikita
git checkout -b myfeature
git remote add upstream git@github.com:nikita-kit/generator-nikita.git
```

4. install npm and make sure that all tests passing

```bash
npm install
npm test
```

5. generate a nikita project with the forked generator

```bash
cd ..
mkdir nikita-generated
cd nikita-generated
yo ../generator-nikita
```

6. answer the questions in a reasonable way for your feature or fix

7. commit the generated folder to a local git repo

```bash
git init
git add .
git commit -m"initial commit"
```

8. make your changes (don't forget the readme), run grunt for testing and commit all

```bash
grunt
git commit -m"added my feature"
```

9. backport your changes to generator checkout at `generator-nikita` folder

```bash
cd ../generator-nikita
```

10. rerun the generator at the `nikita-generated` folder

```bash
cd ../nikita-generated
yo ../generator-nikita
```

11. answer all questions by hitting enter

12. if nothing is modified, you're nearly done

```bash
git diff
```

13. run the tests at `generator-nikita` folder and update the changelog

```bash
cd ../generator-nikita
npm run test
```

14. if all tests are passing, commit your changes and push them

```bash
git add <YOUR-CHANGES>
git commit -m"added my feature"
git push
```

### Create Pull Request

After getting some feedback, push to your fork and submit a pull request. We
may suggest some changes or improvements or alternatives, but for small changes
your pull request should be accepted quickly.

Some things that will increase the chance that your pull request is accepted:

* update Readme and Changelog
* write tests
* follow the existing coding style
* Write a good commit message
