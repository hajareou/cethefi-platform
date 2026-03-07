# Quasar App (cethefi-platform)

A Quasar Project

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

# A repository containing sub - modules

When recloning this main repository on other devices, by default, there will only be empty directories for the sub - modules. You need to use the following commands to initialize and update the code of the sub - modules:

```bash
git submodule update --init --recursive
```

Or directly add the recursive parameter when cloning the main repository for the first time:

```bash
git clone --recurse-submodules <主仓库的Git_URL>
```
