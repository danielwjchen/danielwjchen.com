# DanielWJChen.com
This repository stores the project that makes up DanielWJChen.com.

## Installation
To create a environment from scratch, install all the following dependencies.

### NVM and NPM
The project runs on Node 24 (pinned by `.nvmrc`).
```
nvm install
npm install
```

### Setup configs.json
Remeber to make appropriate changes.
```
cp configs.example.json configs.json
```

### Start service
Run the following command to start service for development.
```
npm run develop
```

To run the production server (page rendering only — static assets under
`/dist` and `/node_modules` are served by the host):
```
npm start
```

## E2E tests
Visual-regression E2E tests (Playwright) live in `e2e/` and compare the dev
site against production baselines. See `E2E-TESTING.md` for details.

```
cd e2e
npm install
npm test
```
