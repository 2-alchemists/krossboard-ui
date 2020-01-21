# kube-opex-analytics-mc-frontend

## Initialization

As prerequisites, the following tools must be properly installed:

- [Node.js](https://nodejs.org/en/download/) LTS v10.16.3 (including [npm](https://www.npmjs.com/) v6.9.0)
- [yarn](https://yarnpkg.com/lang/en/)

Type the following command line:

```sh
> yarn

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
