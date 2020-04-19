# Krossboard UI

![build](https://github.com/2-alchemists/krossboard-ui/workflows/build/badge.svg)

## Initialization

As prerequisites, the following tools must be properly installed:

- [Node.js](https://nodejs.org/en/download/) LTS v12.16.2 - codename `Erbium` (including [npm](https://www.npmjs.com/) v6.14.4)
- [yarn](https://yarnpkg.com/lang/en/)

[Node.js][Node.js] environment can be checked with the following command line:

```sh
> node --version
v12.16.2
```

To ease with [Node.js][Node.js] installation, you can use [nvm](https://github.com/nvm-sh/nvm), a version manager for [Node.js][Node.js], designed to be installed per-user, and invoked per-shell.

Once installed, you can then configure the [Node.js][Node.js] environment this way:

```sh
> nvm install 12.16.2
Now using node v12.16.2 (npm v6.14.4)
```

## Initialization

Install all the dependencies required by the project by typing the following command line (this can take a while):

```sh
> yarn
...
✨  Done in 33.90s.
```

## Start "develop" mode

In develop mode, you'll need a backend to serve the data on port 1519. A mocked one is available by typing the following command:

```sh
> yarn start-server
```

Then launch the front with the following command:

```sh
> yarn develop
```

Open `http://localhost:1234`.

## Build project

```sh
> yarn build

```

Generated files are then available in the `dist` folder.

## Commits

The project follow [Conventional Commits](https://www.conventionalcommits.org/), a set of rules regarding how you should commit your code to bring you the great benefit.

ℹ The type of the commits are used to determine the next version of the product following semantic versionning.

For this, rules are enforced by a pre-commit hook mananaged by [husky](https://github.com/typicode/husky).

## Release

The process of releasing the product is managed by [standard-version](https://github.com/conventional-changelog/standard-version).

The tool is responsible to establish the next release version based on the commits from the previous release made, then bump this version in the `package.json` file and finally tag the repository.

ℹ The version contained in the `package.json` is the previous one (the last available one).

Perform the release is pretty straight-forward:

```sh
> yarn release
```

⚠️ For the very first release, the following command line must be exected instead:

```sh
> yarn release --first-release
```

ℹ Note that a dry mode is available to test the release process safely:

```sh
> yarn release --dry-run
```

[Node.js]: https://nodejs.org/