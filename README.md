# Veedgee API
> Veedgee's API

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/rafaelcamargo/veedgee-api/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/rafaelcamargo/veedgee-api/tree/main)
[![Coverage Status](https://coveralls.io/repos/github/rafaelcamargo/veedgee-api/badge.svg?branch=main)](https://coveralls.io/github/rafaelcamargo/veedgee-api?branch=main)

## Contributing

1. Install [Node](https://nodejs.org/en/) 18.x (Use of [NVM](https://github.com/nvm-sh/nvm) is recommended)

2. Install PostgreSQL 14.x

3. Clone the repo:
``` bash
git clone git@github.com:rafaelcamargo/veedgee-api.git
```

4. Go to the project directory
``` bash
cd veedgee-api
```

5. Install the project dependencies
``` bash
npm install
```

6. Create and prepare the database with the following command:
```
npm run db:setup
```

7. Check your changes running the command below and accessing `http://localhost:9000`:
``` bash
npm run start
```

## Tests

1. In case you have changed the API behavior, ensure that all changes are covered with automated tests:
``` bash
npm run test
```

2. You can optionally generate a coverage report while running tests:
``` bash
npm run test -- --coverage
```
