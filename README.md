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
EXAMPLE=0,1,2,3 node lab/promise/simple-example-using-setTimeout.js
```

Runs an individual example:

```
EXAMPLE=1 node lab/promise/simple-example-using-setTimeout.js
```
