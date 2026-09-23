# DanielWJChen.com
This repository stores the project that makes up DanielWJChen.com.

## Installation
To create a environment from scratch, install all the following dependencies.

### pyenv
```
pyenv install 3.9
pyenv local 3.9
```
### NVM and NPM
```
nvm install 8
npm config set python /path/to/.pyenv/versions/3.9.18/bin/python
```
### NPM global packages
```
npm install -g webpack webpack-cli webpack-dev-server
```

### Install NPM
```
npm install
```

### Setup configs.json
Remeber to make appropriate changes.
```
cp configs.exampe.json configs.json
```

### Start service
Run the following command to start service for development.
```
npm run develop
```

## E2E tests
Visual-regression E2E tests (Playwright) live in `e2e/` and compare the dev
site against production baselines. See `E2E-TESTING.md` for details.

```
cd e2e
npm install
npm test
```
