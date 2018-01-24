'use strict';

var Promise = require('bluebird');

// -- utilities --
var choose = function (num) {
  var ex = (process.env.EXAMPLE || '1').split(',');
  return ex.indexOf(num) >= 0;
}
// ---------------

var withoutPromise = function () {
  console.log(' - without promise - step#1');

  setTimeout(function () {
    console.log(' - without promise - step#2');
  }, 2000);

  console.log(' - without promise - step#3');

  setTimeout(function () {
    console.log(' - without promise - step#4');
  }, 1000);

  console.log(' - without promise - step#5');
}

choose('0') && withoutPromise();

/*
output will be:
 - without promise - step#1
 - without promise - step#3
 - without promise - step#5
 - without promise - step#4
 - without promise - step#2
*/

var usingPromise_1 = function () {
  console.log(' - using promise 1 - step#1');

  Promise.resolve()
    .then(function () {
      return new Promise(function (onResolved) {
        setTimeout(function () {
          console.log(' - using promise 1 - step#2');
          onResolved();
        }, 2000);
      })
    })
    .then(function () {
      console.log(' - using promise 1 - step#3');
      return null;
    })
    .then(function () {
      console.log(' - using promise 1 - step error');
      throw new Error("Something went wrong!!!");
    })
    .then(function () {
      return new Promise(function (onResolved) {
        setTimeout(function () {
          console.log(' - using promise 1 - step#4');
          onResolved();
        }, 1000);
      })
    })
    .then(function () {
      console.log(' - using promise 1 - step#5');
      return null;
    })
    .catch(function (error) {
      console.log(' - using promised function 2 - handle error:', error.toString());
    })
}

choose('1') && usingPromise_1();

/*
 - using promise - step#1
 - using promise - step#2
 - using promise - step#3
 - using promise - step#4
 - using promise - step#5
*/

var usingPromise_2 = function () {
  var _step1 = function () {
    console.log(' - using promised function 2 - step#1');
    return Promise.resolve();
  }
  var _step2 = function () {
    return new Promise(function (onResolved) {
      setTimeout(function () {
        console.log(' - using promised function 2 - step#2');
        onResolved();
      }, 2000);
    })
  }
  var _step3 = function () {
    console.log(' - using promised function 2 - step#3');
    return Promise.resolve();
  }
  var _step4 = function () {
    return new Promise(function (onResolved) {
      setTimeout(function () {
        console.log(' - using promised function 2 - step#4');
        onResolved();
      }, 1000);
    })
  }
  var _step5 = function () {
    console.log(' - using promised function 2 - step#5');
    return Promise.resolve();
  }

  var _error_step = function () {
    console.log(' - using promised function 2 - error step');
    return Promise.reject("Something went wrong!!!")
  }

  var _handle_error = function (error) {
    console.log(' - using promised function 2 - handle error:', error.toString());
  }


  return Promise.resolve()
    .then(_step1)
    .then(_step2)
    .then(_step3)
    .then(_step4)
    .then(_error_step)
    .then(_step5)
    .catch(_handle_error)
}

choose('2') && usingPromise_2();

/*
 - using promised function - step#1
 - using promised function - step#2
 - using promised function - step#3
 - using promised function - step#4
 - using promised function - step#5
*/

var usingPromise_3 = function () {
  var _step1 = function () {
    console.log(' - using promised function 3 - step#1');
    return Promise.resolve();
  }
  var _step2 = function () {
    return new Promise(function (onResolved) {
      setTimeout(function () {
        console.log(' - using promised function 3- step#2');
        onResolved();
      }, 2000);
    })
  }
  var _step3 = function () {
    console.log(' - using promised function 3- step#3');
    return Promise.resolve();
  }
  var _step4 = function () {
    return new Promise(function (onResolved) {
      setTimeout(function () {
        console.log(' - using promised function 3- step#4');
        onResolved();
      }, 1000);
    })
  }
  var _step5 = function () {
    console.log(' - using promised function 3- step#5');
    return Promise.resolve();
  }

  var _error_step = function () {
    console.log(' - using promised function 3- error step');
    return Promise.reject("Something went wrong!!!")
  }

  var _handle_error = function (error) {
    console.log(' - using promised function 3 - handle error:', error.toString());
  }

  return Promise.mapSeries([_step1, _step2, _step3, _step4, _step5, _error_step], function (f) {
    return f();
  }).catch(_handle_error)
}

choose('3') && usingPromise_3();

/*
 - using promised function - step#1
 - using promised function - step#2
 - using promised function - step#3
 - using promised function - step#4
 - using promised function - step#5
*/
