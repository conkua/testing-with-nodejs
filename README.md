# Testing with Node.js

## Prerequisites

* Install [Node.js](https://nodejs.org/en/download/package-manager/)
* Checkouts source code from github:
  ```shell
  git clone https://github.com/conkua/testing-with-nodejs.git
  ```
* Changes to project home directory:
  ```shell
  cd testing-with-nodejs
  ```
* Installs dependencies using `npm`:
  ```shell
  npm install
  ```

## Lessons

### 01. Using Promise

Runs lab #01 examples (all of examples):

```
EXAMPLE=0,1,2,3 node lab/simple-promise-example/simple-example-using-setTimeout.js
```

Runs an individual example:

```
EXAMPLE=1 node lab/simple-promise-example/simple-example-using-setTimeout.js
```

#### a. Handle exceptions using Promise

Runs lab #01 examples (all of examples):

```
EXAMPLE=0,1,2,3 node lab/simple-promise-example/simple-example-using-setTimeout-with-handle-error.js
```

Runs an individual example:

```
EXAMPLE=1 node lab/simple-promise-example/simple-example-using-setTimeout-with-handle-error.js
```

### 02. Start/stop servers for testing

The example `promise-start-stop-servers` is used to demonstrate how to start/stop servers for testing. The testcase script should start server programmatically and waiting for starting completed before run the testing code.

To run this example, use the following command line:

```shell
cd lab/promise-start-stop-servers

npm install

DEBUG=tdd* node_modules/.bin/mocha test/tdd/web-server-test.js
```

### 03. Log message collection

Launches this example as the following:

```shell
cd lab/log-message-collection

npm install

DEBUG=tdd*,bdd* node_modules/.bin/mocha test/bdd/web-server-test.js
```
