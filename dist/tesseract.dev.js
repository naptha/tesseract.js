(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Tesseract"] = factory();
	else
		root["Tesseract"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/is-electron/index.js":
/*!*******************************************!*\
  !*** ./node_modules/is-electron/index.js ***!
  \*******************************************/
/***/ ((module) => {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

// https://github.com/electron/electron/issues/2288
function isElectron() {
  // Renderer process
  if (typeof window !== 'undefined' && _typeof(window.process) === 'object' && window.process.type === 'renderer') {
    return true;
  } // Main process


  if (typeof process !== 'undefined' && _typeof(process.versions) === 'object' && !!process.versions.electron) {
    return true;
  } // Detect the user agent when the `nodeIntegration` option is set to true


  if ((typeof navigator === "undefined" ? "undefined" : _typeof(navigator)) === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
    return true;
  }

  return false;
}

module.exports = isElectron;

/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var runtime = function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.

  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }

  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.

    generator._invoke = makeInvokeMethod(innerFn, self, context);
    return generator;
  }

  exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.

  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.

  var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.


  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  exports.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }

    genFun.prototype = Object.create(Gp);
    return genFun;
  }; // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.


  exports.awrap = function (arg) {
    return {
      __await: arg
    };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;

        if (value && _typeof(value) === "object" && hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function (error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    } // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).


    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.

  exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;
    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        } // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;

        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);

          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;
        var record = tryCatch(innerFn, self, context);

        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted; // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.

          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  } // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.


  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

      context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.

      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    } // The delegate iterator is finished, so forget it and continue with
    // the outer generator.


    context.delegate = null;
    return ContinueSentinel;
  } // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.


  defineIteratorMethods(Gp);
  define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.

  define(Gp, iteratorSymbol, function () {
    return this;
  });
  define(Gp, "toString", function () {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{
      tryLoc: "root"
    }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function (object) {
    var keys = [];

    for (var key in object) {
      keys.push(key);
    }

    keys.reverse(); // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.

    return function next() {
      while (keys.length) {
        var key = keys.pop();

        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      } // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.


      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];

      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;
          return next;
        };

        return next.next = next;
      }
    } // Return an iterator with no values.


    return {
      next: doneResult
    };
  }

  exports.values = values;

  function doneResult() {
    return {
      value: undefined,
      done: true
    };
  }

  Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0; // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.

      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = undefined;
      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },
    stop: function stop() {
      this.done = true;
      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;

      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;

      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      } // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.


      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  }; // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.

  return exports;
}( // If this script is executing as a CommonJS module, use module.exports
// as the regeneratorRuntime namespace. Otherwise create a new empty
// object. Either way, the resulting object will be used to initialize
// the regeneratorRuntime variable at the top of this file.
( false ? 0 : _typeof(module)) === "object" ? module.exports : {});

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if ((typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis)) === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

/***/ }),

/***/ "./node_modules/resolve-url/resolve-url.js":
/*!*************************************************!*\
  !*** ./node_modules/resolve-url/resolve-url.js ***!
  \*************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

// Copyright 2014 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)
void function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(this, function () {
  function
    /* ...urls */
  resolveUrl() {
    var numUrls = arguments.length;

    if (numUrls === 0) {
      throw new Error("resolveUrl requires at least one argument; got none.");
    }

    var base = document.createElement("base");
    base.href = arguments[0];

    if (numUrls === 1) {
      return base.href;
    }

    var head = document.getElementsByTagName("head")[0];
    head.insertBefore(base, head.firstChild);
    var a = document.createElement("a");
    var resolved;

    for (var index = 1; index < numUrls; index++) {
      a.href = arguments[index];
      resolved = a.href;
      base.href = resolved;
    }

    head.removeChild(base);
    return resolved;
  }

  return resolveUrl;
});

/***/ }),

/***/ "./src/Tesseract.js":
/*!**************************!*\
  !*** ./src/Tesseract.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var createWorker = __webpack_require__(/*! ./createWorker */ "./src/createWorker.js");

var recognize = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(image, langs, options) {
    var worker;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            worker = createWorker(options);
            _context2.next = 3;
            return worker.load();

          case 3:
            _context2.next = 5;
            return worker.loadLanguage(langs);

          case 5:
            _context2.next = 7;
            return worker.initialize(langs);

          case 7:
            return _context2.abrupt("return", worker.recognize(image).finally( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
              return _regeneratorRuntime().wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return worker.terminate();

                    case 2:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            }))));

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function recognize(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var detect = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(image, options) {
    var worker;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            worker = createWorker(options);
            _context4.next = 3;
            return worker.load();

          case 3:
            _context4.next = 5;
            return worker.loadLanguage('osd');

          case 5:
            _context4.next = 7;
            return worker.initialize('osd');

          case 7:
            return _context4.abrupt("return", worker.detect(image).finally( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
              return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2;
                      return worker.terminate();

                    case 2:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3);
            }))));

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function detect(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

module.exports = {
  recognize: recognize,
  detect: detect
};

/***/ }),

/***/ "./src/constants/OEM.js":
/*!******************************!*\
  !*** ./src/constants/OEM.js ***!
  \******************************/
/***/ ((module) => {

/*
 * OEM = OCR Engine Mode, and there are 4 possible modes.
 *
 * By default tesseract.js uses LSTM_ONLY mode.
 *
 */
module.exports = {
  TESSERACT_ONLY: 0,
  LSTM_ONLY: 1,
  TESSERACT_LSTM_COMBINED: 2,
  DEFAULT: 3
};

/***/ }),

/***/ "./src/constants/PSM.js":
/*!******************************!*\
  !*** ./src/constants/PSM.js ***!
  \******************************/
/***/ ((module) => {

/*
 * PSM = Page Segmentation Mode
 */
module.exports = {
  OSD_ONLY: '0',
  AUTO_OSD: '1',
  AUTO_ONLY: '2',
  AUTO: '3',
  SINGLE_COLUMN: '4',
  SINGLE_BLOCK_VERT_TEXT: '5',
  SINGLE_BLOCK: '6',
  SINGLE_LINE: '7',
  SINGLE_WORD: '8',
  CIRCLE_WORD: '9',
  SINGLE_CHAR: '10',
  SPARSE_TEXT: '11',
  SPARSE_TEXT_OSD: '12'
};

/***/ }),

/***/ "./src/constants/config.js":
/*!*********************************!*\
  !*** ./src/constants/config.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var OEM = __webpack_require__(/*! ./OEM */ "./src/constants/OEM.js");

module.exports = {
  defaultOEM: OEM.DEFAULT
};

/***/ }),

/***/ "./src/constants/defaultOptions.js":
/*!*****************************************!*\
  !*** ./src/constants/defaultOptions.js ***!
  \*****************************************/
/***/ ((module) => {

module.exports = {
  /*
   * default path for downloading *.traineddata
   */
  langPath: 'https://tessdata.projectnaptha.com/4.0.0',

  /*
   * Use BlobURL for worker script by default
   * TODO: remove this option
   *
   */
  workerBlobURL: true,
  logger: function logger() {}
};

/***/ }),

/***/ "./src/constants/languages.js":
/*!************************************!*\
  !*** ./src/constants/languages.js ***!
  \************************************/
/***/ ((module) => {

/*
 * languages with existing tesseract traineddata
 * https://tesseract-ocr.github.io/tessdoc/Data-Files#data-files-for-version-400-november-29-2016
 */

/**
 * @typedef {object} Languages
 * @property {string} AFR Afrikaans
 * @property {string} AMH Amharic
 * @property {string} ARA Arabic
 * @property {string} ASM Assamese
 * @property {string} AZE Azerbaijani
 * @property {string} AZE_CYRL Azerbaijani - Cyrillic
 * @property {string} BEL Belarusian
 * @property {string} BEN Bengali
 * @property {string} BOD Tibetan
 * @property {string} BOS Bosnian
 * @property {string} BUL Bulgarian
 * @property {string} CAT Catalan; Valencian
 * @property {string} CEB Cebuano
 * @property {string} CES Czech
 * @property {string} CHI_SIM Chinese - Simplified
 * @property {string} CHI_TRA Chinese - Traditional
 * @property {string} CHR Cherokee
 * @property {string} CYM Welsh
 * @property {string} DAN Danish
 * @property {string} DEU German
 * @property {string} DZO Dzongkha
 * @property {string} ELL Greek, Modern (1453-)
 * @property {string} ENG English
 * @property {string} ENM English, Middle (1100-1500)
 * @property {string} EPO Esperanto
 * @property {string} EST Estonian
 * @property {string} EUS Basque
 * @property {string} FAS Persian
 * @property {string} FIN Finnish
 * @property {string} FRA French
 * @property {string} FRK German Fraktur
 * @property {string} FRM French, Middle (ca. 1400-1600)
 * @property {string} GLE Irish
 * @property {string} GLG Galician
 * @property {string} GRC Greek, Ancient (-1453)
 * @property {string} GUJ Gujarati
 * @property {string} HAT Haitian; Haitian Creole
 * @property {string} HEB Hebrew
 * @property {string} HIN Hindi
 * @property {string} HRV Croatian
 * @property {string} HUN Hungarian
 * @property {string} IKU Inuktitut
 * @property {string} IND Indonesian
 * @property {string} ISL Icelandic
 * @property {string} ITA Italian
 * @property {string} ITA_OLD Italian - Old
 * @property {string} JAV Javanese
 * @property {string} JPN Japanese
 * @property {string} KAN Kannada
 * @property {string} KAT Georgian
 * @property {string} KAT_OLD Georgian - Old
 * @property {string} KAZ Kazakh
 * @property {string} KHM Central Khmer
 * @property {string} KIR Kirghiz; Kyrgyz
 * @property {string} KOR Korean
 * @property {string} KUR Kurdish
 * @property {string} LAO Lao
 * @property {string} LAT Latin
 * @property {string} LAV Latvian
 * @property {string} LIT Lithuanian
 * @property {string} MAL Malayalam
 * @property {string} MAR Marathi
 * @property {string} MKD Macedonian
 * @property {string} MLT Maltese
 * @property {string} MSA Malay
 * @property {string} MYA Burmese
 * @property {string} NEP Nepali
 * @property {string} NLD Dutch; Flemish
 * @property {string} NOR Norwegian
 * @property {string} ORI Oriya
 * @property {string} PAN Panjabi; Punjabi
 * @property {string} POL Polish
 * @property {string} POR Portuguese
 * @property {string} PUS Pushto; Pashto
 * @property {string} RON Romanian; Moldavian; Moldovan
 * @property {string} RUS Russian
 * @property {string} SAN Sanskrit
 * @property {string} SIN Sinhala; Sinhalese
 * @property {string} SLK Slovak
 * @property {string} SLV Slovenian
 * @property {string} SPA Spanish; Castilian
 * @property {string} SPA_OLD Spanish; Castilian - Old
 * @property {string} SQI Albanian
 * @property {string} SRP Serbian
 * @property {string} SRP_LATN Serbian - Latin
 * @property {string} SWA Swahili
 * @property {string} SWE Swedish
 * @property {string} SYR Syriac
 * @property {string} TAM Tamil
 * @property {string} TEL Telugu
 * @property {string} TGK Tajik
 * @property {string} TGL Tagalog
 * @property {string} THA Thai
 * @property {string} TIR Tigrinya
 * @property {string} TUR Turkish
 * @property {string} UIG Uighur; Uyghur
 * @property {string} UKR Ukrainian
 * @property {string} URD Urdu
 * @property {string} UZB Uzbek
 * @property {string} UZB_CYRL Uzbek - Cyrillic
 * @property {string} VIE Vietnamese
 * @property {string} YID Yiddish
 */

/**
  * @type {Languages}
  */
module.exports = {
  AFR: 'afr',
  AMH: 'amh',
  ARA: 'ara',
  ASM: 'asm',
  AZE: 'aze',
  AZE_CYRL: 'aze_cyrl',
  BEL: 'bel',
  BEN: 'ben',
  BOD: 'bod',
  BOS: 'bos',
  BUL: 'bul',
  CAT: 'cat',
  CEB: 'ceb',
  CES: 'ces',
  CHI_SIM: 'chi_sim',
  CHI_TRA: 'chi_tra',
  CHR: 'chr',
  CYM: 'cym',
  DAN: 'dan',
  DEU: 'deu',
  DZO: 'dzo',
  ELL: 'ell',
  ENG: 'eng',
  ENM: 'enm',
  EPO: 'epo',
  EST: 'est',
  EUS: 'eus',
  FAS: 'fas',
  FIN: 'fin',
  FRA: 'fra',
  FRK: 'frk',
  FRM: 'frm',
  GLE: 'gle',
  GLG: 'glg',
  GRC: 'grc',
  GUJ: 'guj',
  HAT: 'hat',
  HEB: 'heb',
  HIN: 'hin',
  HRV: 'hrv',
  HUN: 'hun',
  IKU: 'iku',
  IND: 'ind',
  ISL: 'isl',
  ITA: 'ita',
  ITA_OLD: 'ita_old',
  JAV: 'jav',
  JPN: 'jpn',
  KAN: 'kan',
  KAT: 'kat',
  KAT_OLD: 'kat_old',
  KAZ: 'kaz',
  KHM: 'khm',
  KIR: 'kir',
  KOR: 'kor',
  KUR: 'kur',
  LAO: 'lao',
  LAT: 'lat',
  LAV: 'lav',
  LIT: 'lit',
  MAL: 'mal',
  MAR: 'mar',
  MKD: 'mkd',
  MLT: 'mlt',
  MSA: 'msa',
  MYA: 'mya',
  NEP: 'nep',
  NLD: 'nld',
  NOR: 'nor',
  ORI: 'ori',
  PAN: 'pan',
  POL: 'pol',
  POR: 'por',
  PUS: 'pus',
  RON: 'ron',
  RUS: 'rus',
  SAN: 'san',
  SIN: 'sin',
  SLK: 'slk',
  SLV: 'slv',
  SPA: 'spa',
  SPA_OLD: 'spa_old',
  SQI: 'sqi',
  SRP: 'srp',
  SRP_LATN: 'srp_latn',
  SWA: 'swa',
  SWE: 'swe',
  SYR: 'syr',
  TAM: 'tam',
  TEL: 'tel',
  TGK: 'tgk',
  TGL: 'tgl',
  THA: 'tha',
  TIR: 'tir',
  TUR: 'tur',
  UIG: 'uig',
  UKR: 'ukr',
  URD: 'urd',
  UZB: 'uzb',
  UZB_CYRL: 'uzb_cyrl',
  VIE: 'vie',
  YID: 'yid'
};

/***/ }),

/***/ "./src/createJob.js":
/*!**************************!*\
  !*** ./src/createJob.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getId = __webpack_require__(/*! ./utils/getId */ "./src/utils/getId.js");

var jobCounter = 0;

module.exports = function (_ref) {
  var _id = _ref.id,
      action = _ref.action,
      _ref$payload = _ref.payload,
      payload = _ref$payload === void 0 ? {} : _ref$payload;
  var id = _id;

  if (typeof id === 'undefined') {
    id = getId('Job', jobCounter);
    jobCounter += 1;
  }

  return {
    id: id,
    action: action,
    payload: payload
  };
};

/***/ }),

/***/ "./src/createScheduler.js":
/*!********************************!*\
  !*** ./src/createScheduler.js ***!
  \********************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var _this = this;

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var createJob = __webpack_require__(/*! ./createJob */ "./src/createJob.js");

var _require = __webpack_require__(/*! ./utils/log */ "./src/utils/log.js"),
    log = _require.log;

var getId = __webpack_require__(/*! ./utils/getId */ "./src/utils/getId.js");

var schedulerCounter = 0;

module.exports = function () {
  var id = getId('Scheduler', schedulerCounter);
  var workers = {};
  var runningWorkers = {};
  var jobQueue = [];
  schedulerCounter += 1;

  var getQueueLen = function getQueueLen() {
    return jobQueue.length;
  };

  var getNumWorkers = function getNumWorkers() {
    return Object.keys(workers).length;
  };

  var dequeue = function dequeue() {
    if (jobQueue.length !== 0) {
      var wIds = Object.keys(workers);

      for (var i = 0; i < wIds.length; i += 1) {
        if (typeof runningWorkers[wIds[i]] === 'undefined') {
          jobQueue[0](workers[wIds[i]]);
          break;
        }
      }
    }
  };

  var queue = function queue(action, payload) {
    return new Promise(function (resolve, reject) {
      var job = createJob({
        action: action,
        payload: payload
      });
      jobQueue.push( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(w) {
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  jobQueue.shift();
                  runningWorkers[w.id] = job;
                  _context.prev = 2;
                  _context.t0 = resolve;
                  _context.next = 6;
                  return w[action].apply(_this, [].concat(_toConsumableArray(payload), [job.id]));

                case 6:
                  _context.t1 = _context.sent;
                  (0, _context.t0)(_context.t1);
                  _context.next = 13;
                  break;

                case 10:
                  _context.prev = 10;
                  _context.t2 = _context["catch"](2);
                  reject(_context.t2);

                case 13:
                  _context.prev = 13;
                  delete runningWorkers[w.id];
                  dequeue();
                  return _context.finish(13);

                case 17:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[2, 10, 13, 17]]);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
      log("[".concat(id, "]: Add ").concat(job.id, " to JobQueue"));
      log("[".concat(id, "]: JobQueue length=").concat(jobQueue.length));
      dequeue();
    });
  };

  var addWorker = function addWorker(w) {
    workers[w.id] = w;
    log("[".concat(id, "]: Add ").concat(w.id));
    log("[".concat(id, "]: Number of workers=").concat(getNumWorkers()));
    dequeue();
    return w.id;
  };

  var addJob = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(action) {
      var _len,
          payload,
          _key,
          _args2 = arguments;

      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(getNumWorkers() === 0)) {
                _context2.next = 2;
                break;
              }

              throw Error("[".concat(id, "]: You need to have at least one worker before adding jobs"));

            case 2:
              for (_len = _args2.length, payload = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                payload[_key - 1] = _args2[_key];
              }

              return _context2.abrupt("return", queue(action, payload));

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function addJob(_x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  var terminate = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              Object.keys(workers).forEach( /*#__PURE__*/function () {
                var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(wid) {
                  return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _context3.next = 2;
                          return workers[wid].terminate();

                        case 2:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _callee3);
                }));

                return function (_x3) {
                  return _ref4.apply(this, arguments);
                };
              }());
              jobQueue = [];

            case 2:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function terminate() {
      return _ref3.apply(this, arguments);
    };
  }();

  return {
    addWorker: addWorker,
    addJob: addJob,
    terminate: terminate,
    getQueueLen: getQueueLen,
    getNumWorkers: getNumWorkers
  };
};

/***/ }),

/***/ "./src/createWorker.js":
/*!*****************************!*\
  !*** ./src/createWorker.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var _excluded = ["logger", "errorHandler"];

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var resolvePaths = __webpack_require__(/*! ./utils/resolvePaths */ "./src/utils/resolvePaths.js");

var circularize = __webpack_require__(/*! ./utils/circularize */ "./src/utils/circularize.js");

var createJob = __webpack_require__(/*! ./createJob */ "./src/createJob.js");

var _require = __webpack_require__(/*! ./utils/log */ "./src/utils/log.js"),
    log = _require.log;

var getId = __webpack_require__(/*! ./utils/getId */ "./src/utils/getId.js");

var _require2 = __webpack_require__(/*! ./constants/config */ "./src/constants/config.js"),
    defaultOEM = _require2.defaultOEM;

var _require3 = __webpack_require__(/*! ./worker/node */ "./src/worker/browser/index.js"),
    defaultOptions = _require3.defaultOptions,
    spawnWorker = _require3.spawnWorker,
    terminateWorker = _require3.terminateWorker,
    onMessage = _require3.onMessage,
    loadImage = _require3.loadImage,
    send = _require3.send;

var workerCounter = 0;

module.exports = function () {
  var _options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var id = getId('Worker', workerCounter);

  var _resolvePaths = resolvePaths(_objectSpread(_objectSpread({}, defaultOptions), _options)),
      logger = _resolvePaths.logger,
      errorHandler = _resolvePaths.errorHandler,
      options = _objectWithoutProperties(_resolvePaths, _excluded);

  var resolves = {};
  var rejects = {};
  var worker = spawnWorker(options);
  workerCounter += 1;

  var setResolve = function setResolve(action, res) {
    resolves[action] = res;
  };

  var setReject = function setReject(action, rej) {
    rejects[action] = rej;
  };

  var startJob = function startJob(_ref) {
    var jobId = _ref.id,
        action = _ref.action,
        payload = _ref.payload;
    return new Promise(function (resolve, reject) {
      log("[".concat(id, "]: Start ").concat(jobId, ", action=").concat(action));
      setResolve(action, resolve);
      setReject(action, reject);
      send(worker, {
        workerId: id,
        jobId: jobId,
        action: action,
        payload: payload
      });
    });
  };

  var load = function load(jobId) {
    return startJob(createJob({
      id: jobId,
      action: 'load',
      payload: {
        options: options
      }
    }));
  };

  var writeText = function writeText(path, text, jobId) {
    return startJob(createJob({
      id: jobId,
      action: 'FS',
      payload: {
        method: 'writeFile',
        args: [path, text]
      }
    }));
  };

  var readText = function readText(path, jobId) {
    return startJob(createJob({
      id: jobId,
      action: 'FS',
      payload: {
        method: 'readFile',
        args: [path, {
          encoding: 'utf8'
        }]
      }
    }));
  };

  var removeFile = function removeFile(path, jobId) {
    return startJob(createJob({
      id: jobId,
      action: 'FS',
      payload: {
        method: 'unlink',
        args: [path]
      }
    }));
  };

  var FS = function FS(method, args, jobId) {
    return startJob(createJob({
      id: jobId,
      action: 'FS',
      payload: {
        method: method,
        args: args
      }
    }));
  };

  var loadLanguage = function loadLanguage() {
    var langs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'eng';
    var jobId = arguments.length > 1 ? arguments[1] : undefined;
    return startJob(createJob({
      id: jobId,
      action: 'loadLanguage',
      payload: {
        langs: langs,
        options: options
      }
    }));
  };

  var initialize = function initialize() {
    var langs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'eng';
    var oem = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultOEM;
    var jobId = arguments.length > 2 ? arguments[2] : undefined;
    return startJob(createJob({
      id: jobId,
      action: 'initialize',
      payload: {
        langs: langs,
        oem: oem
      }
    }));
  };

  var setParameters = function setParameters() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var jobId = arguments.length > 1 ? arguments[1] : undefined;
    return startJob(createJob({
      id: jobId,
      action: 'setParameters',
      payload: {
        params: params
      }
    }));
  };

  var recognize = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(image) {
      var opts,
          jobId,
          _args = arguments;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              opts = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
              jobId = _args.length > 2 ? _args[2] : undefined;
              _context.t0 = startJob;
              _context.t1 = createJob;
              _context.t2 = jobId;
              _context.next = 7;
              return loadImage(image);

            case 7:
              _context.t3 = _context.sent;
              _context.t4 = opts;
              _context.t5 = {
                image: _context.t3,
                options: _context.t4
              };
              _context.t6 = {
                id: _context.t2,
                action: 'recognize',
                payload: _context.t5
              };
              _context.t7 = (0, _context.t1)(_context.t6);
              return _context.abrupt("return", (0, _context.t0)(_context.t7));

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function recognize(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  var getPDF = function getPDF() {
    var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Tesseract OCR Result';
    var textonly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var jobId = arguments.length > 2 ? arguments[2] : undefined;
    return startJob(createJob({
      id: jobId,
      action: 'getPDF',
      payload: {
        title: title,
        textonly: textonly
      }
    }));
  };

  var detect = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(image, jobId) {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.t0 = startJob;
              _context2.t1 = createJob;
              _context2.t2 = jobId;
              _context2.next = 5;
              return loadImage(image);

            case 5:
              _context2.t3 = _context2.sent;
              _context2.t4 = {
                image: _context2.t3
              };
              _context2.t5 = {
                id: _context2.t2,
                action: 'detect',
                payload: _context2.t4
              };
              _context2.t6 = (0, _context2.t1)(_context2.t5);
              return _context2.abrupt("return", (0, _context2.t0)(_context2.t6));

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function detect(_x2, _x3) {
      return _ref3.apply(this, arguments);
    };
  }();

  var terminate = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (worker !== null) {
                /*
                await startJob(createJob({
                  id: jobId,
                  action: 'terminate',
                }));
                */
                terminateWorker(worker);
                worker = null;
              }

              return _context3.abrupt("return", Promise.resolve());

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function terminate() {
      return _ref4.apply(this, arguments);
    };
  }();

  onMessage(worker, function (_ref5) {
    var workerId = _ref5.workerId,
        jobId = _ref5.jobId,
        status = _ref5.status,
        action = _ref5.action,
        data = _ref5.data;

    if (status === 'resolve') {
      log("[".concat(workerId, "]: Complete ").concat(jobId));
      var d = data;

      if (action === 'recognize') {
        d = circularize(data);
      } else if (action === 'getPDF') {
        d = Array.from(_objectSpread(_objectSpread({}, data), {}, {
          length: Object.keys(data).length
        }));
      }

      resolves[action]({
        jobId: jobId,
        data: d
      });
    } else if (status === 'reject') {
      rejects[action](data);

      if (errorHandler) {
        errorHandler(data);
      } else {
        throw Error(data);
      }
    } else if (status === 'progress') {
      logger(_objectSpread(_objectSpread({}, data), {}, {
        userJobId: jobId
      }));
    }
  });
  return {
    id: id,
    worker: worker,
    setResolve: setResolve,
    setReject: setReject,
    load: load,
    writeText: writeText,
    readText: readText,
    removeFile: removeFile,
    FS: FS,
    loadLanguage: loadLanguage,
    initialize: initialize,
    setParameters: setParameters,
    recognize: recognize,
    getPDF: getPDF,
    detect: detect,
    terminate: terminate
  };
};

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 *
 * Entry point for tesseract.js, should be the entry when bundling.
 *
 * @fileoverview entry point for tesseract.js
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */
__webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");

var createScheduler = __webpack_require__(/*! ./createScheduler */ "./src/createScheduler.js");

var createWorker = __webpack_require__(/*! ./createWorker */ "./src/createWorker.js");

var Tesseract = __webpack_require__(/*! ./Tesseract */ "./src/Tesseract.js");

var languages = __webpack_require__(/*! ./constants/languages */ "./src/constants/languages.js");

var OEM = __webpack_require__(/*! ./constants/OEM */ "./src/constants/OEM.js");

var PSM = __webpack_require__(/*! ./constants/PSM */ "./src/constants/PSM.js");

var _require = __webpack_require__(/*! ./utils/log */ "./src/utils/log.js"),
    setLogging = _require.setLogging;

module.exports = _objectSpread({
  languages: languages,
  OEM: OEM,
  PSM: PSM,
  createScheduler: createScheduler,
  createWorker: createWorker,
  setLogging: setLogging
}, Tesseract);

/***/ }),

/***/ "./src/utils/circularize.js":
/*!**********************************!*\
  !*** ./src/utils/circularize.js ***!
  \**********************************/
/***/ ((module) => {

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * In the recognition result of tesseract, there
 * is a deep JSON object for details, it has around
 *
 * The result of dump.js is a big JSON tree
 * which can be easily serialized (for instance
 * to be sent from a webworker to the main app
 * or through Node's IPC), but we want
 * a (circular) DOM-like interface for walking
 * through the data.
 *
 * @fileoverview DOM-like interface for walking through data
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */
module.exports = function (page) {
  var blocks = [];
  var paragraphs = [];
  var lines = [];
  var words = [];
  var symbols = [];
  page.blocks.forEach(function (block) {
    block.paragraphs.forEach(function (paragraph) {
      paragraph.lines.forEach(function (line) {
        line.words.forEach(function (word) {
          word.symbols.forEach(function (sym) {
            symbols.push(_objectSpread(_objectSpread({}, sym), {}, {
              page: page,
              block: block,
              paragraph: paragraph,
              line: line,
              word: word
            }));
          });
          words.push(_objectSpread(_objectSpread({}, word), {}, {
            page: page,
            block: block,
            paragraph: paragraph,
            line: line
          }));
        });
        lines.push(_objectSpread(_objectSpread({}, line), {}, {
          page: page,
          block: block,
          paragraph: paragraph
        }));
      });
      paragraphs.push(_objectSpread(_objectSpread({}, paragraph), {}, {
        page: page,
        block: block
      }));
    });
    blocks.push(_objectSpread(_objectSpread({}, block), {}, {
      page: page
    }));
  });
  return _objectSpread(_objectSpread({}, page), {}, {
    blocks: blocks,
    paragraphs: paragraphs,
    lines: lines,
    words: words,
    symbols: symbols
  });
};

/***/ }),

/***/ "./src/utils/getEnvironment.js":
/*!*************************************!*\
  !*** ./src/utils/getEnvironment.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var isElectron = __webpack_require__(/*! is-electron */ "./node_modules/is-electron/index.js");

module.exports = function (key) {
  var env = {};

  if (typeof WorkerGlobalScope !== 'undefined') {
    env.type = 'webworker';
  } else if (isElectron()) {
    env.type = 'electron';
  } else if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object') {
    env.type = 'browser';
  } else if ((typeof process === "undefined" ? "undefined" : _typeof(process)) === 'object' && "function" === 'function') {
    env.type = 'node';
  }

  if (typeof key === 'undefined') {
    return env;
  }

  return env[key];
};

/***/ }),

/***/ "./src/utils/getId.js":
/*!****************************!*\
  !*** ./src/utils/getId.js ***!
  \****************************/
/***/ ((module) => {

module.exports = function (prefix, cnt) {
  return "".concat(prefix, "-").concat(cnt, "-").concat(Math.random().toString(16).slice(3, 8));
};

/***/ }),

/***/ "./src/utils/log.js":
/*!**************************!*\
  !*** ./src/utils/log.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports) {

var _this = this;

var logging = false;
exports.logging = logging;

exports.setLogging = function (_logging) {
  logging = _logging;
};

exports.log = function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return logging ? console.log.apply(_this, args) : null;
};

/***/ }),

/***/ "./src/utils/resolvePaths.js":
/*!***********************************!*\
  !*** ./src/utils/resolvePaths.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var isBrowser = __webpack_require__(/*! ./getEnvironment */ "./src/utils/getEnvironment.js")('type') === 'browser';
var resolveURL = isBrowser ? __webpack_require__(/*! resolve-url */ "./node_modules/resolve-url/resolve-url.js") : function (s) {
  return s;
}; // eslint-disable-line

module.exports = function (options) {
  var opts = _objectSpread({}, options);

  ['corePath', 'workerPath', 'langPath'].forEach(function (key) {
    if (options[key]) {
      opts[key] = resolveURL(opts[key]);
    }
  });
  return opts;
};

/***/ }),

/***/ "./src/worker/browser/defaultOptions.js":
/*!**********************************************!*\
  !*** ./src/worker/browser/defaultOptions.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var resolveURL = __webpack_require__(/*! resolve-url */ "./node_modules/resolve-url/resolve-url.js");

var _require = __webpack_require__(/*! ../../../package.json */ "./package.json"),
    version = _require.version;

var defaultOptions = __webpack_require__(/*! ../../constants/defaultOptions */ "./src/constants/defaultOptions.js");
/*
 * Default options for browser worker
 */


module.exports = _objectSpread(_objectSpread({}, defaultOptions), {}, {
  workerPath: typeof process !== 'undefined' && "development" === 'development' ? resolveURL("/dist/worker.dev.js?nocache=".concat(Math.random().toString(36).slice(3))) : "https://unpkg.com/tesseract.js@v".concat(version, "/dist/worker.min.js"),

  /*
   * If browser doesn't support WebAssembly,
   * load ASM version instead
   */
  corePath: null
});

/***/ }),

/***/ "./src/worker/browser/index.js":
/*!*************************************!*\
  !*** ./src/worker/browser/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 *
 * Tesseract Worker adapter for browser
 *
 * @fileoverview Tesseract Worker adapter for browser
 * @author Kevin Kwok <antimatter15@gmail.com>
 * @author Guillermo Webster <gui@mit.edu>
 * @author Jerome Wu <jeromewus@gmail.com>
 */
var defaultOptions = __webpack_require__(/*! ./defaultOptions */ "./src/worker/browser/defaultOptions.js");

var spawnWorker = __webpack_require__(/*! ./spawnWorker */ "./src/worker/browser/spawnWorker.js");

var terminateWorker = __webpack_require__(/*! ./terminateWorker */ "./src/worker/browser/terminateWorker.js");

var onMessage = __webpack_require__(/*! ./onMessage */ "./src/worker/browser/onMessage.js");

var send = __webpack_require__(/*! ./send */ "./src/worker/browser/send.js");

var loadImage = __webpack_require__(/*! ./loadImage */ "./src/worker/browser/loadImage.js");

module.exports = {
  defaultOptions: defaultOptions,
  spawnWorker: spawnWorker,
  terminateWorker: terminateWorker,
  onMessage: onMessage,
  send: send,
  loadImage: loadImage
};

/***/ }),

/***/ "./src/worker/browser/loadImage.js":
/*!*****************************************!*\
  !*** ./src/worker/browser/loadImage.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var resolveURL = __webpack_require__(/*! resolve-url */ "./node_modules/resolve-url/resolve-url.js");
/**
 * readFromBlobOrFile
 *
 * @name readFromBlobOrFile
 * @function
 * @access private
 */


var readFromBlobOrFile = function readFromBlobOrFile(blob) {
  return new Promise(function (resolve, reject) {
    var fileReader = new FileReader();

    fileReader.onload = function () {
      resolve(fileReader.result);
    };

    fileReader.onerror = function (_ref) {
      var code = _ref.target.error.code;
      reject(Error("File could not be read! Code=".concat(code)));
    };

    fileReader.readAsArrayBuffer(blob);
  });
};
/**
 * loadImage
 *
 * @name loadImage
 * @function load image from different source
 * @access private
 */


var loadImage = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(image) {
    var data, resp;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            data = image;

            if (!(typeof image === 'undefined')) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt("return", 'undefined');

          case 3:
            if (!(typeof image === 'string')) {
              _context2.next = 16;
              break;
            }

            if (!/data:image\/([a-zA-Z]*);base64,([^"]*)/.test(image)) {
              _context2.next = 8;
              break;
            }

            data = atob(image.split(',')[1]).split('').map(function (c) {
              return c.charCodeAt(0);
            });
            _context2.next = 14;
            break;

          case 8:
            _context2.next = 10;
            return fetch(resolveURL(image));

          case 10:
            resp = _context2.sent;
            _context2.next = 13;
            return resp.arrayBuffer();

          case 13:
            data = _context2.sent;

          case 14:
            _context2.next = 34;
            break;

          case 16:
            if (!(image instanceof HTMLElement)) {
              _context2.next = 30;
              break;
            }

            if (!(image.tagName === 'IMG')) {
              _context2.next = 21;
              break;
            }

            _context2.next = 20;
            return loadImage(image.src);

          case 20:
            data = _context2.sent;

          case 21:
            if (!(image.tagName === 'VIDEO')) {
              _context2.next = 25;
              break;
            }

            _context2.next = 24;
            return loadImage(image.poster);

          case 24:
            data = _context2.sent;

          case 25:
            if (!(image.tagName === 'CANVAS')) {
              _context2.next = 28;
              break;
            }

            _context2.next = 28;
            return new Promise(function (resolve) {
              image.toBlob( /*#__PURE__*/function () {
                var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(blob) {
                  return _regeneratorRuntime().wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return readFromBlobOrFile(blob);

                        case 2:
                          data = _context.sent;
                          resolve();

                        case 4:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                return function (_x2) {
                  return _ref3.apply(this, arguments);
                };
              }());
            });

          case 28:
            _context2.next = 34;
            break;

          case 30:
            if (!(image instanceof File || image instanceof Blob)) {
              _context2.next = 34;
              break;
            }

            _context2.next = 33;
            return readFromBlobOrFile(image);

          case 33:
            data = _context2.sent;

          case 34:
            return _context2.abrupt("return", new Uint8Array(data));

          case 35:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function loadImage(_x) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = loadImage;

/***/ }),

/***/ "./src/worker/browser/onMessage.js":
/*!*****************************************!*\
  !*** ./src/worker/browser/onMessage.js ***!
  \*****************************************/
/***/ ((module) => {

module.exports = function (worker, handler) {
  worker.onmessage = function (_ref) {
    var data = _ref.data;
    // eslint-disable-line
    handler(data);
  };
};

/***/ }),

/***/ "./src/worker/browser/send.js":
/*!************************************!*\
  !*** ./src/worker/browser/send.js ***!
  \************************************/
/***/ ((module) => {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * send
 *
 * @name send
 * @function send packet to worker and create a job
 * @access public
 */
module.exports = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(worker, packet) {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            worker.postMessage(packet);

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/***/ }),

/***/ "./src/worker/browser/spawnWorker.js":
/*!*******************************************!*\
  !*** ./src/worker/browser/spawnWorker.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * spawnWorker
 *
 * @name spawnWorker
 * @function create a new Worker in browser
 * @access public
 */
module.exports = function (_ref) {
  var workerPath = _ref.workerPath,
      workerBlobURL = _ref.workerBlobURL;
  var worker;

  if (Blob && URL && workerBlobURL) {
    var blob = new Blob(["importScripts(\"".concat(workerPath, "\");")], {
      type: 'application/javascript'
    });
    worker = new Worker(URL.createObjectURL(blob));
  } else {
    worker = new Worker(workerPath);
  }

  return worker;
};

/***/ }),

/***/ "./src/worker/browser/terminateWorker.js":
/*!***********************************************!*\
  !*** ./src/worker/browser/terminateWorker.js ***!
  \***********************************************/
/***/ ((module) => {

/**
 * terminateWorker
 *
 * @name terminateWorker
 * @function terminate worker
 * @access public
 */
module.exports = function (worker) {
  worker.terminate();
};

/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"tesseract.js","version":"3.0.2","description":"Pure Javascript Multilingual OCR","main":"src/index.js","types":"src/index.d.ts","unpkg":"dist/tesseract.min.js","jsdelivr":"dist/tesseract.min.js","scripts":{"start":"node scripts/server.js","build":"rimraf dist && webpack --config scripts/webpack.config.prod.js","profile:tesseract":"webpack-bundle-analyzer dist/tesseract-stats.json","profile:worker":"webpack-bundle-analyzer dist/worker-stats.json","prepublishOnly":"npm run build","wait":"rimraf dist && wait-on http://localhost:3000/dist/tesseract.dev.js","test":"npm-run-all -p -r start test:all","test:all":"npm-run-all wait test:browser:* test:node:all","test:node":"nyc mocha --exit --bail --require ./scripts/test-helper.js","test:node:all":"npm run test:node -- ./tests/*.test.js","test:browser-tpl":"mocha-headless-chrome -a incognito -a no-sandbox -a disable-setuid-sandbox -a disable-logging -t 300000","test:browser:detect":"npm run test:browser-tpl -- -f ./tests/detect.test.html","test:browser:recognize":"npm run test:browser-tpl -- -f ./tests/recognize.test.html","test:browser:scheduler":"npm run test:browser-tpl -- -f ./tests/scheduler.test.html","test:browser:FS":"npm run test:browser-tpl -- -f ./tests/FS.test.html","lint":"eslint src","lint:fix":"eslint --fix src","postinstall":"opencollective-postinstall || true"},"browser":{"./src/worker/node/index.js":"./src/worker/browser/index.js"},"author":"","contributors":["jeromewu"],"license":"Apache-2.0","devDependencies":{"@babel/core":"^7.18.7","@babel/preset-env":"^7.18.7","acorn":"^6.4.0","babel-loader":"^8.2.0","buffer":"^6.0.3","cors":"^2.8.5","eslint":"^7.2.0","eslint-config-airbnb-base":"^14.2.0","eslint-plugin-import":"^2.22.1","expect.js":"^0.3.1","express":"^4.17.1","mocha":"^8.1.3","mocha-headless-chrome":"^2.0.3","npm-run-all":"^4.1.5","nyc":"^15.1.0","rimraf":"^2.7.1","wait-on":"^3.3.0","webpack":"^5.74.0","webpack-bundle-analyzer":"^4.6.0","webpack-cli":"^4.10.0","webpack-dev-middleware":"^5.3.3"},"dependencies":{"babel-eslint":"^10.1.0","bmp-js":"^0.1.0","file-type":"^12.4.1","idb-keyval":"^3.2.0","is-electron":"^2.2.0","is-url":"^1.2.4","node-fetch":"^2.6.0","opencollective-postinstall":"^2.0.2","regenerator-runtime":"^0.13.3","resolve-url":"^0.2.1","tesseract.js-core":"^3.0.1","wasm-feature-detect":"^1.2.11","zlibjs":"^0.3.1"},"repository":{"type":"git","url":"https://github.com/naptha/tesseract.js.git"},"bugs":{"url":"https://github.com/naptha/tesseract.js/issues"},"homepage":"https://github.com/naptha/tesseract.js","collective":{"type":"opencollective","url":"https://opencollective.com/tesseractjs"}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDekJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1VFSkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9UZXNzZXJhY3Qvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1Rlc3NlcmFjdC8uL25vZGVfbW9kdWxlcy9pcy1lbGVjdHJvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly9UZXNzZXJhY3QvLi9ub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwid2VicGFjazovL1Rlc3NlcmFjdC8uL25vZGVfbW9kdWxlcy9yZXNvbHZlLXVybC9yZXNvbHZlLXVybC5qcyIsIndlYnBhY2s6Ly9UZXNzZXJhY3QvLi9zcmMvVGVzc2VyYWN0LmpzIiwid2VicGFjazovL1Rlc3NlcmFjdC8uL3NyYy9jb25zdGFudHMvT0VNLmpzIiwid2VicGFjazovL1Rlc3NlcmFjdC8uL3NyYy9jb25zdGFudHMvUFNNLmpzIiwid2VicGFjazovL1Rlc3NlcmFjdC8uL3NyYy9jb25zdGFudHMvY29uZmlnLmpzIiwid2VicGFjazovL1Rlc3NlcmFjdC8uL3NyYy9jb25zdGFudHMvZGVmYXVsdE9wdGlvbnMuanMiLCJ3ZWJwYWNrOi8vVGVzc2VyYWN0Ly4vc3JjL2NvbnN0YW50cy9sYW5ndWFnZXMuanMiLCJ3ZWJwYWNrOi8vVGVzc2VyYWN0Ly4vc3JjL2NyZWF0ZUpvYi5qcyIsIndlYnBhY2s6Ly9UZXNzZXJhY3QvLi9zcmMvY3JlYXRlU2NoZWR1bGVyLmpzIiwid2VicGFjazovL1Rlc3NlcmFjdC8uL3NyYy9jcmVhdGVXb3JrZXIuanMiLCJ3ZWJwYWNrOi8vVGVzc2VyYWN0Ly4vc3JjL2luZGV4LmpzIiwid2VicGFjazovL1Rlc3NlcmFjdC8uL3NyYy91dGlscy9jaXJjdWxhcml6ZS5qcyIsIndlYnBhY2s6Ly9UZXNzZXJhY3QvLi9zcmMvdXRpbHMvZ2V0RW52aXJvbm1lbnQuanMiLCJ3ZWJwYWNrOi8vVGVzc2VyYWN0Ly4vc3JjL3V0aWxzL2dldElkLmpzIiwid2VicGFjazovL1Rlc3NlcmFjdC8uL3NyYy91dGlscy9sb2cuanMiLCJ3ZWJwYWNrOi8vVGVzc2VyYWN0Ly4vc3JjL3V0aWxzL3Jlc29sdmVQYXRocy5qcyIsIndlYnBhY2s6Ly9UZXNzZXJhY3QvLi9zcmMvd29ya2VyL2Jyb3dzZXIvZGVmYXVsdE9wdGlvbnMuanMiLCJ3ZWJwYWNrOi8vVGVzc2VyYWN0Ly4vc3JjL3dvcmtlci9icm93c2VyL2luZGV4LmpzIiwid2VicGFjazovL1Rlc3NlcmFjdC8uL3NyYy93b3JrZXIvYnJvd3Nlci9sb2FkSW1hZ2UuanMiLCJ3ZWJwYWNrOi8vVGVzc2VyYWN0Ly4vc3JjL3dvcmtlci9icm93c2VyL29uTWVzc2FnZS5qcyIsIndlYnBhY2s6Ly9UZXNzZXJhY3QvLi9zcmMvd29ya2VyL2Jyb3dzZXIvc2VuZC5qcyIsIndlYnBhY2s6Ly9UZXNzZXJhY3QvLi9zcmMvd29ya2VyL2Jyb3dzZXIvc3Bhd25Xb3JrZXIuanMiLCJ3ZWJwYWNrOi8vVGVzc2VyYWN0Ly4vc3JjL3dvcmtlci9icm93c2VyL3Rlcm1pbmF0ZVdvcmtlci5qcyIsIndlYnBhY2s6Ly9UZXNzZXJhY3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vVGVzc2VyYWN0L3dlYnBhY2svcnVudGltZS9ub2RlIG1vZHVsZSBkZWNvcmF0b3IiLCJ3ZWJwYWNrOi8vVGVzc2VyYWN0L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vVGVzc2VyYWN0L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9UZXNzZXJhY3Qvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlRlc3NlcmFjdFwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJUZXNzZXJhY3RcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uL2VsZWN0cm9uL2lzc3Vlcy8yMjg4XG5mdW5jdGlvbiBpc0VsZWN0cm9uKCkge1xuICAgIC8vIFJlbmRlcmVyIHByb2Nlc3NcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdy5wcm9jZXNzID09PSAnb2JqZWN0JyAmJiB3aW5kb3cucHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIE1haW4gcHJvY2Vzc1xuICAgIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHByb2Nlc3MudmVyc2lvbnMgPT09ICdvYmplY3QnICYmICEhcHJvY2Vzcy52ZXJzaW9ucy5lbGVjdHJvbikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBEZXRlY3QgdGhlIHVzZXIgYWdlbnQgd2hlbiB0aGUgYG5vZGVJbnRlZ3JhdGlvbmAgb3B0aW9uIGlzIHNldCB0byB0cnVlXG4gICAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgPT09ICdvYmplY3QnICYmIHR5cGVvZiBuYXZpZ2F0b3IudXNlckFnZW50ID09PSAnc3RyaW5nJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0VsZWN0cm9uJykgPj0gMCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNFbGVjdHJvbjtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxudmFyIHJ1bnRpbWUgPSAoZnVuY3Rpb24gKGV4cG9ydHMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgdmFyIGhhc093biA9IE9wLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyICRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2wgOiB7fTtcbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcbiAgdmFyIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgXCJAQGFzeW5jSXRlcmF0b3JcIjtcbiAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblxuICBmdW5jdGlvbiBkZWZpbmUob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gb2JqW2tleV07XG4gIH1cbiAgdHJ5IHtcbiAgICAvLyBJRSA4IGhhcyBhIGJyb2tlbiBPYmplY3QuZGVmaW5lUHJvcGVydHkgdGhhdCBvbmx5IHdvcmtzIG9uIERPTSBvYmplY3RzLlxuICAgIGRlZmluZSh7fSwgXCJcIik7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGRlZmluZSA9IGZ1bmN0aW9uKG9iaiwga2V5LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIG9ialtrZXldID0gdmFsdWU7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIGV4cG9ydHMud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIGRlZmluZShJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG5cbiAgdmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7XG4gIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJlxuICAgICAgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmXG4gICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7XG4gICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcbiAgICAvLyBvZiB0aGUgcG9seWZpbGwuXG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTtcbiAgfVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9XG4gICAgR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgZGVmaW5lKEdwLCBcImNvbnN0cnVjdG9yXCIsIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgZGVmaW5lKEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLCBcImNvbnN0cnVjdG9yXCIsIEdlbmVyYXRvckZ1bmN0aW9uKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBkZWZpbmUoXG4gICAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUsXG4gICAgdG9TdHJpbmdUYWdTeW1ib2wsXG4gICAgXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICk7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgZGVmaW5lKHByb3RvdHlwZSwgbWV0aG9kLCBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIGV4cG9ydHMubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgZGVmaW5lKGdlbkZ1biwgdG9TdHJpbmdUYWdTeW1ib2wsIFwiR2VuZXJhdG9yRnVuY3Rpb25cIik7XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIGV4cG9ydHMuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvciwgUHJvbWlzZUltcGwpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgLy8gSWYgYSByZWplY3RlZCBQcm9taXNlIHdhcyB5aWVsZGVkLCB0aHJvdyB0aGUgcmVqZWN0aW9uIGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gc28gaXQgY2FuIGJlIGhhbmRsZWQgdGhlcmUuXG4gICAgICAgICAgcmV0dXJuIGludm9rZShcInRocm93XCIsIGVycm9yLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZUltcGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBkZWZpbmUoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUsIGFzeW5jSXRlcmF0b3JTeW1ib2wsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG4gIGV4cG9ydHMuQXN5bmNJdGVyYXRvciA9IEFzeW5jSXRlcmF0b3I7XG5cbiAgLy8gTm90ZSB0aGF0IHNpbXBsZSBhc3luYyBmdW5jdGlvbnMgYXJlIGltcGxlbWVudGVkIG9uIHRvcCBvZlxuICAvLyBBc3luY0l0ZXJhdG9yIG9iamVjdHM7IHRoZXkganVzdCByZXR1cm4gYSBQcm9taXNlIGZvciB0aGUgdmFsdWUgb2ZcbiAgLy8gdGhlIGZpbmFsIHJlc3VsdCBwcm9kdWNlZCBieSB0aGUgaXRlcmF0b3IuXG4gIGV4cG9ydHMuYXN5bmMgPSBmdW5jdGlvbihpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCwgUHJvbWlzZUltcGwpIHtcbiAgICBpZiAoUHJvbWlzZUltcGwgPT09IHZvaWQgMCkgUHJvbWlzZUltcGwgPSBQcm9taXNlO1xuXG4gICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcihcbiAgICAgIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpLFxuICAgICAgUHJvbWlzZUltcGxcbiAgICApO1xuXG4gICAgcmV0dXJuIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKVxuICAgICAgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICAgICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcbiAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG4gIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG4gICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIC8vIE5vdGU6IFtcInJldHVyblwiXSBtdXN0IGJlIHVzZWQgZm9yIEVTMyBwYXJzaW5nIGNvbXBhdGliaWxpdHkuXG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvcltcInJldHVyblwiXSkge1xuICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXG4gICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIC8vIElmIG1heWJlSW52b2tlRGVsZWdhdGUoY29udGV4dCkgY2hhbmdlZCBjb250ZXh0Lm1ldGhvZCBmcm9tXG4gICAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cbiAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICd0aHJvdycgbWV0aG9kXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXG4gICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG5cbiAgICBpZiAoISBpbmZvKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0XCIpO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAvLyBBc3NpZ24gdGhlIHJlc3VsdCBvZiB0aGUgZmluaXNoZWQgZGVsZWdhdGUgdG8gdGhlIHRlbXBvcmFyeVxuICAgICAgLy8gdmFyaWFibGUgc3BlY2lmaWVkIGJ5IGRlbGVnYXRlLnJlc3VsdE5hbWUgKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuXG4gICAgICAvLyBSZXN1bWUgZXhlY3V0aW9uIGF0IHRoZSBkZXNpcmVkIGxvY2F0aW9uIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuXG4gICAgICAvLyBJZiBjb250ZXh0Lm1ldGhvZCB3YXMgXCJ0aHJvd1wiIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGVcbiAgICAgIC8vIGV4Y2VwdGlvbiwgbGV0IHRoZSBvdXRlciBnZW5lcmF0b3IgcHJvY2VlZCBub3JtYWxseS4gSWZcbiAgICAgIC8vIGNvbnRleHQubWV0aG9kIHdhcyBcIm5leHRcIiwgZm9yZ2V0IGNvbnRleHQuYXJnIHNpbmNlIGl0IGhhcyBiZWVuXG4gICAgICAvLyBcImNvbnN1bWVkXCIgYnkgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yLiBJZiBjb250ZXh0Lm1ldGhvZCB3YXNcbiAgICAgIC8vIFwicmV0dXJuXCIsIGFsbG93IHRoZSBvcmlnaW5hbCAucmV0dXJuIGNhbGwgdG8gY29udGludWUgaW4gdGhlXG4gICAgICAvLyBvdXRlciBnZW5lcmF0b3IuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmUteWllbGQgdGhlIHJlc3VsdCByZXR1cm5lZCBieSB0aGUgZGVsZWdhdGUgbWV0aG9kLlxuICAgICAgcmV0dXJuIGluZm87XG4gICAgfVxuXG4gICAgLy8gVGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGlzIGZpbmlzaGVkLCBzbyBmb3JnZXQgaXQgYW5kIGNvbnRpbnVlIHdpdGhcbiAgICAvLyB0aGUgb3V0ZXIgZ2VuZXJhdG9yLlxuICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIGRlZmluZShHcCwgdG9TdHJpbmdUYWdTeW1ib2wsIFwiR2VuZXJhdG9yXCIpO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgZGVmaW5lKEdwLCBpdGVyYXRvclN5bWJvbCwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuXG4gIGRlZmluZShHcCwgXCJ0b1N0cmluZ1wiLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBleHBvcnRzLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgZXhwb3J0cy52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcbiAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcbiAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXG4gICAgICAgIGlmIChjYXVnaHQpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlXG4gIC8vIG9yIG5vdCwgcmV0dXJuIHRoZSBydW50aW1lIG9iamVjdCBzbyB0aGF0IHdlIGNhbiBkZWNsYXJlIHRoZSB2YXJpYWJsZVxuICAvLyByZWdlbmVyYXRvclJ1bnRpbWUgaW4gdGhlIG91dGVyIHNjb3BlLCB3aGljaCBhbGxvd3MgdGhpcyBtb2R1bGUgdG8gYmVcbiAgLy8gaW5qZWN0ZWQgZWFzaWx5IGJ5IGBiaW4vcmVnZW5lcmF0b3IgLS1pbmNsdWRlLXJ1bnRpbWUgc2NyaXB0LmpzYC5cbiAgcmV0dXJuIGV4cG9ydHM7XG5cbn0oXG4gIC8vIElmIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZSwgdXNlIG1vZHVsZS5leHBvcnRzXG4gIC8vIGFzIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgbmFtZXNwYWNlLiBPdGhlcndpc2UgY3JlYXRlIGEgbmV3IGVtcHR5XG4gIC8vIG9iamVjdC4gRWl0aGVyIHdheSwgdGhlIHJlc3VsdGluZyBvYmplY3Qgd2lsbCBiZSB1c2VkIHRvIGluaXRpYWxpemVcbiAgLy8gdGhlIHJlZ2VuZXJhdG9yUnVudGltZSB2YXJpYWJsZSBhdCB0aGUgdG9wIG9mIHRoaXMgZmlsZS5cbiAgdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiA/IG1vZHVsZS5leHBvcnRzIDoge31cbikpO1xuXG50cnkge1xuICByZWdlbmVyYXRvclJ1bnRpbWUgPSBydW50aW1lO1xufSBjYXRjaCAoYWNjaWRlbnRhbFN0cmljdE1vZGUpIHtcbiAgLy8gVGhpcyBtb2R1bGUgc2hvdWxkIG5vdCBiZSBydW5uaW5nIGluIHN0cmljdCBtb2RlLCBzbyB0aGUgYWJvdmVcbiAgLy8gYXNzaWdubWVudCBzaG91bGQgYWx3YXlzIHdvcmsgdW5sZXNzIHNvbWV0aGluZyBpcyBtaXNjb25maWd1cmVkLiBKdXN0XG4gIC8vIGluIGNhc2UgcnVudGltZS5qcyBhY2NpZGVudGFsbHkgcnVucyBpbiBzdHJpY3QgbW9kZSwgaW4gbW9kZXJuIGVuZ2luZXNcbiAgLy8gd2UgY2FuIGV4cGxpY2l0bHkgYWNjZXNzIGdsb2JhbFRoaXMuIEluIG9sZGVyIGVuZ2luZXMgd2UgY2FuIGVzY2FwZVxuICAvLyBzdHJpY3QgbW9kZSB1c2luZyBhIGdsb2JhbCBGdW5jdGlvbiBjYWxsLiBUaGlzIGNvdWxkIGNvbmNlaXZhYmx5IGZhaWxcbiAgLy8gaWYgYSBDb250ZW50IFNlY3VyaXR5IFBvbGljeSBmb3JiaWRzIHVzaW5nIEZ1bmN0aW9uLCBidXQgaW4gdGhhdCBjYXNlXG4gIC8vIHRoZSBwcm9wZXIgc29sdXRpb24gaXMgdG8gZml4IHRoZSBhY2NpZGVudGFsIHN0cmljdCBtb2RlIHByb2JsZW0uIElmXG4gIC8vIHlvdSd2ZSBtaXNjb25maWd1cmVkIHlvdXIgYnVuZGxlciB0byBmb3JjZSBzdHJpY3QgbW9kZSBhbmQgYXBwbGllZCBhXG4gIC8vIENTUCB0byBmb3JiaWQgRnVuY3Rpb24sIGFuZCB5b3UncmUgbm90IHdpbGxpbmcgdG8gZml4IGVpdGhlciBvZiB0aG9zZVxuICAvLyBwcm9ibGVtcywgcGxlYXNlIGRldGFpbCB5b3VyIHVuaXF1ZSBwcmVkaWNhbWVudCBpbiBhIEdpdEh1YiBpc3N1ZS5cbiAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSBcIm9iamVjdFwiKSB7XG4gICAgZ2xvYmFsVGhpcy5yZWdlbmVyYXRvclJ1bnRpbWUgPSBydW50aW1lO1xuICB9IGVsc2Uge1xuICAgIEZ1bmN0aW9uKFwiclwiLCBcInJlZ2VuZXJhdG9yUnVudGltZSA9IHJcIikocnVudGltZSk7XG4gIH1cbn1cbiIsIi8vIENvcHlyaWdodCAyMDE0IFNpbW9uIEx5ZGVsbFxyXG4vLyBYMTEgKOKAnE1JVOKAnSkgTGljZW5zZWQuIChTZWUgTElDRU5TRS4pXHJcblxyXG52b2lkIChmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XHJcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICBkZWZpbmUoZmFjdG9yeSlcclxuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKVxyXG4gIH0gZWxzZSB7XHJcbiAgICByb290LnJlc29sdmVVcmwgPSBmYWN0b3J5KClcclxuICB9XHJcbn0odGhpcywgZnVuY3Rpb24oKSB7XHJcblxyXG4gIGZ1bmN0aW9uIHJlc29sdmVVcmwoLyogLi4udXJscyAqLykge1xyXG4gICAgdmFyIG51bVVybHMgPSBhcmd1bWVudHMubGVuZ3RoXHJcblxyXG4gICAgaWYgKG51bVVybHMgPT09IDApIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwicmVzb2x2ZVVybCByZXF1aXJlcyBhdCBsZWFzdCBvbmUgYXJndW1lbnQ7IGdvdCBub25lLlwiKVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBiYXNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJhc2VcIilcclxuICAgIGJhc2UuaHJlZiA9IGFyZ3VtZW50c1swXVxyXG5cclxuICAgIGlmIChudW1VcmxzID09PSAxKSB7XHJcbiAgICAgIHJldHVybiBiYXNlLmhyZWZcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXVxyXG4gICAgaGVhZC5pbnNlcnRCZWZvcmUoYmFzZSwgaGVhZC5maXJzdENoaWxkKVxyXG5cclxuICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIilcclxuICAgIHZhciByZXNvbHZlZFxyXG5cclxuICAgIGZvciAodmFyIGluZGV4ID0gMTsgaW5kZXggPCBudW1VcmxzOyBpbmRleCsrKSB7XHJcbiAgICAgIGEuaHJlZiA9IGFyZ3VtZW50c1tpbmRleF1cclxuICAgICAgcmVzb2x2ZWQgPSBhLmhyZWZcclxuICAgICAgYmFzZS5ocmVmID0gcmVzb2x2ZWRcclxuICAgIH1cclxuXHJcbiAgICBoZWFkLnJlbW92ZUNoaWxkKGJhc2UpXHJcblxyXG4gICAgcmV0dXJuIHJlc29sdmVkXHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzb2x2ZVVybFxyXG5cclxufSkpO1xyXG4iLCJjb25zdCBjcmVhdGVXb3JrZXIgPSByZXF1aXJlKCcuL2NyZWF0ZVdvcmtlcicpO1xyXG5cclxuY29uc3QgcmVjb2duaXplID0gYXN5bmMgKGltYWdlLCBsYW5ncywgb3B0aW9ucykgPT4ge1xyXG4gIGNvbnN0IHdvcmtlciA9IGNyZWF0ZVdvcmtlcihvcHRpb25zKTtcclxuICBhd2FpdCB3b3JrZXIubG9hZCgpO1xyXG4gIGF3YWl0IHdvcmtlci5sb2FkTGFuZ3VhZ2UobGFuZ3MpO1xyXG4gIGF3YWl0IHdvcmtlci5pbml0aWFsaXplKGxhbmdzKTtcclxuICByZXR1cm4gd29ya2VyLnJlY29nbml6ZShpbWFnZSlcclxuICAgIC5maW5hbGx5KGFzeW5jICgpID0+IHtcclxuICAgICAgYXdhaXQgd29ya2VyLnRlcm1pbmF0ZSgpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBkZXRlY3QgPSBhc3luYyAoaW1hZ2UsIG9wdGlvbnMpID0+IHtcclxuICBjb25zdCB3b3JrZXIgPSBjcmVhdGVXb3JrZXIob3B0aW9ucyk7XHJcbiAgYXdhaXQgd29ya2VyLmxvYWQoKTtcclxuICBhd2FpdCB3b3JrZXIubG9hZExhbmd1YWdlKCdvc2QnKTtcclxuICBhd2FpdCB3b3JrZXIuaW5pdGlhbGl6ZSgnb3NkJyk7XHJcbiAgcmV0dXJuIHdvcmtlci5kZXRlY3QoaW1hZ2UpXHJcbiAgICAuZmluYWxseShhc3luYyAoKSA9PiB7XHJcbiAgICAgIGF3YWl0IHdvcmtlci50ZXJtaW5hdGUoKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgcmVjb2duaXplLFxyXG4gIGRldGVjdCxcclxufTtcclxuIiwiLypcclxuICogT0VNID0gT0NSIEVuZ2luZSBNb2RlLCBhbmQgdGhlcmUgYXJlIDQgcG9zc2libGUgbW9kZXMuXHJcbiAqXHJcbiAqIEJ5IGRlZmF1bHQgdGVzc2VyYWN0LmpzIHVzZXMgTFNUTV9PTkxZIG1vZGUuXHJcbiAqXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBURVNTRVJBQ1RfT05MWTogMCxcclxuICBMU1RNX09OTFk6IDEsXHJcbiAgVEVTU0VSQUNUX0xTVE1fQ09NQklORUQ6IDIsXHJcbiAgREVGQVVMVDogMyxcclxufTtcclxuIiwiLypcclxuICogUFNNID0gUGFnZSBTZWdtZW50YXRpb24gTW9kZVxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgT1NEX09OTFk6ICcwJyxcclxuICBBVVRPX09TRDogJzEnLFxyXG4gIEFVVE9fT05MWTogJzInLFxyXG4gIEFVVE86ICczJyxcclxuICBTSU5HTEVfQ09MVU1OOiAnNCcsXHJcbiAgU0lOR0xFX0JMT0NLX1ZFUlRfVEVYVDogJzUnLFxyXG4gIFNJTkdMRV9CTE9DSzogJzYnLFxyXG4gIFNJTkdMRV9MSU5FOiAnNycsXHJcbiAgU0lOR0xFX1dPUkQ6ICc4JyxcclxuICBDSVJDTEVfV09SRDogJzknLFxyXG4gIFNJTkdMRV9DSEFSOiAnMTAnLFxyXG4gIFNQQVJTRV9URVhUOiAnMTEnLFxyXG4gIFNQQVJTRV9URVhUX09TRDogJzEyJyxcclxufTtcclxuIiwiY29uc3QgT0VNID0gcmVxdWlyZSgnLi9PRU0nKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGRlZmF1bHRPRU06IE9FTS5ERUZBVUxULFxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAvKlxyXG4gICAqIGRlZmF1bHQgcGF0aCBmb3IgZG93bmxvYWRpbmcgKi50cmFpbmVkZGF0YVxyXG4gICAqL1xyXG4gIGxhbmdQYXRoOiAnaHR0cHM6Ly90ZXNzZGF0YS5wcm9qZWN0bmFwdGhhLmNvbS80LjAuMCcsXHJcbiAgLypcclxuICAgKiBVc2UgQmxvYlVSTCBmb3Igd29ya2VyIHNjcmlwdCBieSBkZWZhdWx0XHJcbiAgICogVE9ETzogcmVtb3ZlIHRoaXMgb3B0aW9uXHJcbiAgICpcclxuICAgKi9cclxuICB3b3JrZXJCbG9iVVJMOiB0cnVlLFxyXG4gIGxvZ2dlcjogKCkgPT4ge30sXHJcbn07XHJcbiIsIi8qXHJcbiAqIGxhbmd1YWdlcyB3aXRoIGV4aXN0aW5nIHRlc3NlcmFjdCB0cmFpbmVkZGF0YVxyXG4gKiBodHRwczovL3Rlc3NlcmFjdC1vY3IuZ2l0aHViLmlvL3Rlc3Nkb2MvRGF0YS1GaWxlcyNkYXRhLWZpbGVzLWZvci12ZXJzaW9uLTQwMC1ub3ZlbWJlci0yOS0yMDE2XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIHtvYmplY3R9IExhbmd1YWdlc1xyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gQUZSIEFmcmlrYWFuc1xyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gQU1IIEFtaGFyaWNcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IEFSQSBBcmFiaWNcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IEFTTSBBc3NhbWVzZVxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gQVpFIEF6ZXJiYWlqYW5pXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBBWkVfQ1lSTCBBemVyYmFpamFuaSAtIEN5cmlsbGljXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBCRUwgQmVsYXJ1c2lhblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gQkVOIEJlbmdhbGlcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IEJPRCBUaWJldGFuXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBCT1MgQm9zbmlhblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gQlVMIEJ1bGdhcmlhblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gQ0FUIENhdGFsYW47IFZhbGVuY2lhblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gQ0VCIENlYnVhbm9cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IENFUyBDemVjaFxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gQ0hJX1NJTSBDaGluZXNlIC0gU2ltcGxpZmllZFxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gQ0hJX1RSQSBDaGluZXNlIC0gVHJhZGl0aW9uYWxcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IENIUiBDaGVyb2tlZVxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gQ1lNIFdlbHNoXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBEQU4gRGFuaXNoXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBERVUgR2VybWFuXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBEWk8gRHpvbmdraGFcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IEVMTCBHcmVlaywgTW9kZXJuICgxNDUzLSlcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IEVORyBFbmdsaXNoXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBFTk0gRW5nbGlzaCwgTWlkZGxlICgxMTAwLTE1MDApXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBFUE8gRXNwZXJhbnRvXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBFU1QgRXN0b25pYW5cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IEVVUyBCYXNxdWVcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IEZBUyBQZXJzaWFuXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBGSU4gRmlubmlzaFxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gRlJBIEZyZW5jaFxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gRlJLIEdlcm1hbiBGcmFrdHVyXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBGUk0gRnJlbmNoLCBNaWRkbGUgKGNhLiAxNDAwLTE2MDApXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBHTEUgSXJpc2hcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IEdMRyBHYWxpY2lhblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gR1JDIEdyZWVrLCBBbmNpZW50ICgtMTQ1MylcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IEdVSiBHdWphcmF0aVxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gSEFUIEhhaXRpYW47IEhhaXRpYW4gQ3Jlb2xlXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBIRUIgSGVicmV3XHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBISU4gSGluZGlcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IEhSViBDcm9hdGlhblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gSFVOIEh1bmdhcmlhblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gSUtVIEludWt0aXR1dFxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gSU5EIEluZG9uZXNpYW5cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IElTTCBJY2VsYW5kaWNcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IElUQSBJdGFsaWFuXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBJVEFfT0xEIEl0YWxpYW4gLSBPbGRcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IEpBViBKYXZhbmVzZVxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gSlBOIEphcGFuZXNlXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBLQU4gS2FubmFkYVxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gS0FUIEdlb3JnaWFuXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBLQVRfT0xEIEdlb3JnaWFuIC0gT2xkXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBLQVogS2F6YWtoXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBLSE0gQ2VudHJhbCBLaG1lclxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gS0lSIEtpcmdoaXo7IEt5cmd5elxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gS09SIEtvcmVhblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gS1VSIEt1cmRpc2hcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IExBTyBMYW9cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IExBVCBMYXRpblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gTEFWIExhdHZpYW5cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IExJVCBMaXRodWFuaWFuXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBNQUwgTWFsYXlhbGFtXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBNQVIgTWFyYXRoaVxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gTUtEIE1hY2Vkb25pYW5cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IE1MVCBNYWx0ZXNlXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBNU0EgTWFsYXlcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IE1ZQSBCdXJtZXNlXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBORVAgTmVwYWxpXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBOTEQgRHV0Y2g7IEZsZW1pc2hcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IE5PUiBOb3J3ZWdpYW5cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IE9SSSBPcml5YVxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gUEFOIFBhbmphYmk7IFB1bmphYmlcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFBPTCBQb2xpc2hcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFBPUiBQb3J0dWd1ZXNlXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBQVVMgUHVzaHRvOyBQYXNodG9cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFJPTiBSb21hbmlhbjsgTW9sZGF2aWFuOyBNb2xkb3ZhblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gUlVTIFJ1c3NpYW5cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFNBTiBTYW5za3JpdFxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gU0lOIFNpbmhhbGE7IFNpbmhhbGVzZVxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gU0xLIFNsb3Zha1xyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gU0xWIFNsb3ZlbmlhblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gU1BBIFNwYW5pc2g7IENhc3RpbGlhblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gU1BBX09MRCBTcGFuaXNoOyBDYXN0aWxpYW4gLSBPbGRcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFNRSSBBbGJhbmlhblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gU1JQIFNlcmJpYW5cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFNSUF9MQVROIFNlcmJpYW4gLSBMYXRpblxyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gU1dBIFN3YWhpbGlcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFNXRSBTd2VkaXNoXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBTWVIgU3lyaWFjXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBUQU0gVGFtaWxcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFRFTCBUZWx1Z3VcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFRHSyBUYWppa1xyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gVEdMIFRhZ2Fsb2dcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFRIQSBUaGFpXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBUSVIgVGlncmlueWFcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFRVUiBUdXJraXNoXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBVSUcgVWlnaHVyOyBVeWdodXJcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFVLUiBVa3JhaW5pYW5cclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFVSRCBVcmR1XHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBVWkIgVXpiZWtcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFVaQl9DWVJMIFV6YmVrIC0gQ3lyaWxsaWNcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFZJRSBWaWV0bmFtZXNlXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBZSUQgWWlkZGlzaFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gICogQHR5cGUge0xhbmd1YWdlc31cclxuICAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBBRlI6ICdhZnInLFxyXG4gIEFNSDogJ2FtaCcsXHJcbiAgQVJBOiAnYXJhJyxcclxuICBBU006ICdhc20nLFxyXG4gIEFaRTogJ2F6ZScsXHJcbiAgQVpFX0NZUkw6ICdhemVfY3lybCcsXHJcbiAgQkVMOiAnYmVsJyxcclxuICBCRU46ICdiZW4nLFxyXG4gIEJPRDogJ2JvZCcsXHJcbiAgQk9TOiAnYm9zJyxcclxuICBCVUw6ICdidWwnLFxyXG4gIENBVDogJ2NhdCcsXHJcbiAgQ0VCOiAnY2ViJyxcclxuICBDRVM6ICdjZXMnLFxyXG4gIENISV9TSU06ICdjaGlfc2ltJyxcclxuICBDSElfVFJBOiAnY2hpX3RyYScsXHJcbiAgQ0hSOiAnY2hyJyxcclxuICBDWU06ICdjeW0nLFxyXG4gIERBTjogJ2RhbicsXHJcbiAgREVVOiAnZGV1JyxcclxuICBEWk86ICdkem8nLFxyXG4gIEVMTDogJ2VsbCcsXHJcbiAgRU5HOiAnZW5nJyxcclxuICBFTk06ICdlbm0nLFxyXG4gIEVQTzogJ2VwbycsXHJcbiAgRVNUOiAnZXN0JyxcclxuICBFVVM6ICdldXMnLFxyXG4gIEZBUzogJ2ZhcycsXHJcbiAgRklOOiAnZmluJyxcclxuICBGUkE6ICdmcmEnLFxyXG4gIEZSSzogJ2ZyaycsXHJcbiAgRlJNOiAnZnJtJyxcclxuICBHTEU6ICdnbGUnLFxyXG4gIEdMRzogJ2dsZycsXHJcbiAgR1JDOiAnZ3JjJyxcclxuICBHVUo6ICdndWonLFxyXG4gIEhBVDogJ2hhdCcsXHJcbiAgSEVCOiAnaGViJyxcclxuICBISU46ICdoaW4nLFxyXG4gIEhSVjogJ2hydicsXHJcbiAgSFVOOiAnaHVuJyxcclxuICBJS1U6ICdpa3UnLFxyXG4gIElORDogJ2luZCcsXHJcbiAgSVNMOiAnaXNsJyxcclxuICBJVEE6ICdpdGEnLFxyXG4gIElUQV9PTEQ6ICdpdGFfb2xkJyxcclxuICBKQVY6ICdqYXYnLFxyXG4gIEpQTjogJ2pwbicsXHJcbiAgS0FOOiAna2FuJyxcclxuICBLQVQ6ICdrYXQnLFxyXG4gIEtBVF9PTEQ6ICdrYXRfb2xkJyxcclxuICBLQVo6ICdrYXonLFxyXG4gIEtITTogJ2tobScsXHJcbiAgS0lSOiAna2lyJyxcclxuICBLT1I6ICdrb3InLFxyXG4gIEtVUjogJ2t1cicsXHJcbiAgTEFPOiAnbGFvJyxcclxuICBMQVQ6ICdsYXQnLFxyXG4gIExBVjogJ2xhdicsXHJcbiAgTElUOiAnbGl0JyxcclxuICBNQUw6ICdtYWwnLFxyXG4gIE1BUjogJ21hcicsXHJcbiAgTUtEOiAnbWtkJyxcclxuICBNTFQ6ICdtbHQnLFxyXG4gIE1TQTogJ21zYScsXHJcbiAgTVlBOiAnbXlhJyxcclxuICBORVA6ICduZXAnLFxyXG4gIE5MRDogJ25sZCcsXHJcbiAgTk9SOiAnbm9yJyxcclxuICBPUkk6ICdvcmknLFxyXG4gIFBBTjogJ3BhbicsXHJcbiAgUE9MOiAncG9sJyxcclxuICBQT1I6ICdwb3InLFxyXG4gIFBVUzogJ3B1cycsXHJcbiAgUk9OOiAncm9uJyxcclxuICBSVVM6ICdydXMnLFxyXG4gIFNBTjogJ3NhbicsXHJcbiAgU0lOOiAnc2luJyxcclxuICBTTEs6ICdzbGsnLFxyXG4gIFNMVjogJ3NsdicsXHJcbiAgU1BBOiAnc3BhJyxcclxuICBTUEFfT0xEOiAnc3BhX29sZCcsXHJcbiAgU1FJOiAnc3FpJyxcclxuICBTUlA6ICdzcnAnLFxyXG4gIFNSUF9MQVROOiAnc3JwX2xhdG4nLFxyXG4gIFNXQTogJ3N3YScsXHJcbiAgU1dFOiAnc3dlJyxcclxuICBTWVI6ICdzeXInLFxyXG4gIFRBTTogJ3RhbScsXHJcbiAgVEVMOiAndGVsJyxcclxuICBUR0s6ICd0Z2snLFxyXG4gIFRHTDogJ3RnbCcsXHJcbiAgVEhBOiAndGhhJyxcclxuICBUSVI6ICd0aXInLFxyXG4gIFRVUjogJ3R1cicsXHJcbiAgVUlHOiAndWlnJyxcclxuICBVS1I6ICd1a3InLFxyXG4gIFVSRDogJ3VyZCcsXHJcbiAgVVpCOiAndXpiJyxcclxuICBVWkJfQ1lSTDogJ3V6Yl9jeXJsJyxcclxuICBWSUU6ICd2aWUnLFxyXG4gIFlJRDogJ3lpZCcsXHJcbn07XHJcbiIsImNvbnN0IGdldElkID0gcmVxdWlyZSgnLi91dGlscy9nZXRJZCcpO1xyXG5cclxubGV0IGpvYkNvdW50ZXIgPSAwO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAoe1xyXG4gIGlkOiBfaWQsXHJcbiAgYWN0aW9uLFxyXG4gIHBheWxvYWQgPSB7fSxcclxufSkgPT4ge1xyXG4gIGxldCBpZCA9IF9pZDtcclxuICBpZiAodHlwZW9mIGlkID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgaWQgPSBnZXRJZCgnSm9iJywgam9iQ291bnRlcik7XHJcbiAgICBqb2JDb3VudGVyICs9IDE7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaWQsXHJcbiAgICBhY3Rpb24sXHJcbiAgICBwYXlsb2FkLFxyXG4gIH07XHJcbn07XHJcbiIsImNvbnN0IGNyZWF0ZUpvYiA9IHJlcXVpcmUoJy4vY3JlYXRlSm9iJyk7XHJcbmNvbnN0IHsgbG9nIH0gPSByZXF1aXJlKCcuL3V0aWxzL2xvZycpO1xyXG5jb25zdCBnZXRJZCA9IHJlcXVpcmUoJy4vdXRpbHMvZ2V0SWQnKTtcclxuXHJcbmxldCBzY2hlZHVsZXJDb3VudGVyID0gMDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xyXG4gIGNvbnN0IGlkID0gZ2V0SWQoJ1NjaGVkdWxlcicsIHNjaGVkdWxlckNvdW50ZXIpO1xyXG4gIGNvbnN0IHdvcmtlcnMgPSB7fTtcclxuICBjb25zdCBydW5uaW5nV29ya2VycyA9IHt9O1xyXG4gIGxldCBqb2JRdWV1ZSA9IFtdO1xyXG5cclxuICBzY2hlZHVsZXJDb3VudGVyICs9IDE7XHJcblxyXG4gIGNvbnN0IGdldFF1ZXVlTGVuID0gKCkgPT4gam9iUXVldWUubGVuZ3RoO1xyXG4gIGNvbnN0IGdldE51bVdvcmtlcnMgPSAoKSA9PiBPYmplY3Qua2V5cyh3b3JrZXJzKS5sZW5ndGg7XHJcblxyXG4gIGNvbnN0IGRlcXVldWUgPSAoKSA9PiB7XHJcbiAgICBpZiAoam9iUXVldWUubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgIGNvbnN0IHdJZHMgPSBPYmplY3Qua2V5cyh3b3JrZXJzKTtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3SWRzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBydW5uaW5nV29ya2Vyc1t3SWRzW2ldXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIGpvYlF1ZXVlWzBdKHdvcmtlcnNbd0lkc1tpXV0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgcXVldWUgPSAoYWN0aW9uLCBwYXlsb2FkKSA9PiAoXHJcbiAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IGpvYiA9IGNyZWF0ZUpvYih7IGFjdGlvbiwgcGF5bG9hZCB9KTtcclxuICAgICAgam9iUXVldWUucHVzaChhc3luYyAodykgPT4ge1xyXG4gICAgICAgIGpvYlF1ZXVlLnNoaWZ0KCk7XHJcbiAgICAgICAgcnVubmluZ1dvcmtlcnNbdy5pZF0gPSBqb2I7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIHJlc29sdmUoYXdhaXQgd1thY3Rpb25dLmFwcGx5KHRoaXMsIFsuLi5wYXlsb2FkLCBqb2IuaWRdKSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgICAgZGVsZXRlIHJ1bm5pbmdXb3JrZXJzW3cuaWRdO1xyXG4gICAgICAgICAgZGVxdWV1ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIGxvZyhgWyR7aWR9XTogQWRkICR7am9iLmlkfSB0byBKb2JRdWV1ZWApO1xyXG4gICAgICBsb2coYFske2lkfV06IEpvYlF1ZXVlIGxlbmd0aD0ke2pvYlF1ZXVlLmxlbmd0aH1gKTtcclxuICAgICAgZGVxdWV1ZSgpO1xyXG4gICAgfSlcclxuICApO1xyXG5cclxuICBjb25zdCBhZGRXb3JrZXIgPSAodykgPT4ge1xyXG4gICAgd29ya2Vyc1t3LmlkXSA9IHc7XHJcbiAgICBsb2coYFske2lkfV06IEFkZCAke3cuaWR9YCk7XHJcbiAgICBsb2coYFske2lkfV06IE51bWJlciBvZiB3b3JrZXJzPSR7Z2V0TnVtV29ya2VycygpfWApO1xyXG4gICAgZGVxdWV1ZSgpO1xyXG4gICAgcmV0dXJuIHcuaWQ7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgYWRkSm9iID0gYXN5bmMgKGFjdGlvbiwgLi4ucGF5bG9hZCkgPT4ge1xyXG4gICAgaWYgKGdldE51bVdvcmtlcnMoKSA9PT0gMCkge1xyXG4gICAgICB0aHJvdyBFcnJvcihgWyR7aWR9XTogWW91IG5lZWQgdG8gaGF2ZSBhdCBsZWFzdCBvbmUgd29ya2VyIGJlZm9yZSBhZGRpbmcgam9ic2ApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHF1ZXVlKGFjdGlvbiwgcGF5bG9hZCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgdGVybWluYXRlID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgT2JqZWN0LmtleXMod29ya2VycykuZm9yRWFjaChhc3luYyAod2lkKSA9PiB7XHJcbiAgICAgIGF3YWl0IHdvcmtlcnNbd2lkXS50ZXJtaW5hdGUoKTtcclxuICAgIH0pO1xyXG4gICAgam9iUXVldWUgPSBbXTtcclxuICB9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgYWRkV29ya2VyLFxyXG4gICAgYWRkSm9iLFxyXG4gICAgdGVybWluYXRlLFxyXG4gICAgZ2V0UXVldWVMZW4sXHJcbiAgICBnZXROdW1Xb3JrZXJzLFxyXG4gIH07XHJcbn07XHJcbiIsImNvbnN0IHJlc29sdmVQYXRocyA9IHJlcXVpcmUoJy4vdXRpbHMvcmVzb2x2ZVBhdGhzJyk7XHJcbmNvbnN0IGNpcmN1bGFyaXplID0gcmVxdWlyZSgnLi91dGlscy9jaXJjdWxhcml6ZScpO1xyXG5jb25zdCBjcmVhdGVKb2IgPSByZXF1aXJlKCcuL2NyZWF0ZUpvYicpO1xyXG5jb25zdCB7IGxvZyB9ID0gcmVxdWlyZSgnLi91dGlscy9sb2cnKTtcclxuY29uc3QgZ2V0SWQgPSByZXF1aXJlKCcuL3V0aWxzL2dldElkJyk7XHJcbmNvbnN0IHsgZGVmYXVsdE9FTSB9ID0gcmVxdWlyZSgnLi9jb25zdGFudHMvY29uZmlnJyk7XHJcbmNvbnN0IHtcclxuICBkZWZhdWx0T3B0aW9ucyxcclxuICBzcGF3bldvcmtlcixcclxuICB0ZXJtaW5hdGVXb3JrZXIsXHJcbiAgb25NZXNzYWdlLFxyXG4gIGxvYWRJbWFnZSxcclxuICBzZW5kLFxyXG59ID0gcmVxdWlyZSgnLi93b3JrZXIvbm9kZScpO1xyXG5cclxubGV0IHdvcmtlckNvdW50ZXIgPSAwO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAoX29wdGlvbnMgPSB7fSkgPT4ge1xyXG4gIGNvbnN0IGlkID0gZ2V0SWQoJ1dvcmtlcicsIHdvcmtlckNvdW50ZXIpO1xyXG4gIGNvbnN0IHtcclxuICAgIGxvZ2dlcixcclxuICAgIGVycm9ySGFuZGxlcixcclxuICAgIC4uLm9wdGlvbnNcclxuICB9ID0gcmVzb2x2ZVBhdGhzKHtcclxuICAgIC4uLmRlZmF1bHRPcHRpb25zLFxyXG4gICAgLi4uX29wdGlvbnMsXHJcbiAgfSk7XHJcbiAgY29uc3QgcmVzb2x2ZXMgPSB7fTtcclxuICBjb25zdCByZWplY3RzID0ge307XHJcbiAgbGV0IHdvcmtlciA9IHNwYXduV29ya2VyKG9wdGlvbnMpO1xyXG5cclxuICB3b3JrZXJDb3VudGVyICs9IDE7XHJcblxyXG4gIGNvbnN0IHNldFJlc29sdmUgPSAoYWN0aW9uLCByZXMpID0+IHtcclxuICAgIHJlc29sdmVzW2FjdGlvbl0gPSByZXM7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgc2V0UmVqZWN0ID0gKGFjdGlvbiwgcmVqKSA9PiB7XHJcbiAgICByZWplY3RzW2FjdGlvbl0gPSByZWo7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgc3RhcnRKb2IgPSAoeyBpZDogam9iSWQsIGFjdGlvbiwgcGF5bG9hZCB9KSA9PiAoXHJcbiAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGxvZyhgWyR7aWR9XTogU3RhcnQgJHtqb2JJZH0sIGFjdGlvbj0ke2FjdGlvbn1gKTtcclxuICAgICAgc2V0UmVzb2x2ZShhY3Rpb24sIHJlc29sdmUpO1xyXG4gICAgICBzZXRSZWplY3QoYWN0aW9uLCByZWplY3QpO1xyXG4gICAgICBzZW5kKHdvcmtlciwge1xyXG4gICAgICAgIHdvcmtlcklkOiBpZCxcclxuICAgICAgICBqb2JJZCxcclxuICAgICAgICBhY3Rpb24sXHJcbiAgICAgICAgcGF5bG9hZCxcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICk7XHJcblxyXG4gIGNvbnN0IGxvYWQgPSAoam9iSWQpID0+IChcclxuICAgIHN0YXJ0Sm9iKGNyZWF0ZUpvYih7XHJcbiAgICAgIGlkOiBqb2JJZCwgYWN0aW9uOiAnbG9hZCcsIHBheWxvYWQ6IHsgb3B0aW9ucyB9LFxyXG4gICAgfSkpXHJcbiAgKTtcclxuXHJcbiAgY29uc3Qgd3JpdGVUZXh0ID0gKHBhdGgsIHRleHQsIGpvYklkKSA9PiAoXHJcbiAgICBzdGFydEpvYihjcmVhdGVKb2Ioe1xyXG4gICAgICBpZDogam9iSWQsXHJcbiAgICAgIGFjdGlvbjogJ0ZTJyxcclxuICAgICAgcGF5bG9hZDogeyBtZXRob2Q6ICd3cml0ZUZpbGUnLCBhcmdzOiBbcGF0aCwgdGV4dF0gfSxcclxuICAgIH0pKVxyXG4gICk7XHJcblxyXG4gIGNvbnN0IHJlYWRUZXh0ID0gKHBhdGgsIGpvYklkKSA9PiAoXHJcbiAgICBzdGFydEpvYihjcmVhdGVKb2Ioe1xyXG4gICAgICBpZDogam9iSWQsXHJcbiAgICAgIGFjdGlvbjogJ0ZTJyxcclxuICAgICAgcGF5bG9hZDogeyBtZXRob2Q6ICdyZWFkRmlsZScsIGFyZ3M6IFtwYXRoLCB7IGVuY29kaW5nOiAndXRmOCcgfV0gfSxcclxuICAgIH0pKVxyXG4gICk7XHJcblxyXG4gIGNvbnN0IHJlbW92ZUZpbGUgPSAocGF0aCwgam9iSWQpID0+IChcclxuICAgIHN0YXJ0Sm9iKGNyZWF0ZUpvYih7XHJcbiAgICAgIGlkOiBqb2JJZCxcclxuICAgICAgYWN0aW9uOiAnRlMnLFxyXG4gICAgICBwYXlsb2FkOiB7IG1ldGhvZDogJ3VubGluaycsIGFyZ3M6IFtwYXRoXSB9LFxyXG4gICAgfSkpXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgRlMgPSAobWV0aG9kLCBhcmdzLCBqb2JJZCkgPT4gKFxyXG4gICAgc3RhcnRKb2IoY3JlYXRlSm9iKHtcclxuICAgICAgaWQ6IGpvYklkLFxyXG4gICAgICBhY3Rpb246ICdGUycsXHJcbiAgICAgIHBheWxvYWQ6IHsgbWV0aG9kLCBhcmdzIH0sXHJcbiAgICB9KSlcclxuICApO1xyXG5cclxuICBjb25zdCBsb2FkTGFuZ3VhZ2UgPSAobGFuZ3MgPSAnZW5nJywgam9iSWQpID0+IChcclxuICAgIHN0YXJ0Sm9iKGNyZWF0ZUpvYih7XHJcbiAgICAgIGlkOiBqb2JJZCxcclxuICAgICAgYWN0aW9uOiAnbG9hZExhbmd1YWdlJyxcclxuICAgICAgcGF5bG9hZDogeyBsYW5ncywgb3B0aW9ucyB9LFxyXG4gICAgfSkpXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgaW5pdGlhbGl6ZSA9IChsYW5ncyA9ICdlbmcnLCBvZW0gPSBkZWZhdWx0T0VNLCBqb2JJZCkgPT4gKFxyXG4gICAgc3RhcnRKb2IoY3JlYXRlSm9iKHtcclxuICAgICAgaWQ6IGpvYklkLFxyXG4gICAgICBhY3Rpb246ICdpbml0aWFsaXplJyxcclxuICAgICAgcGF5bG9hZDogeyBsYW5ncywgb2VtIH0sXHJcbiAgICB9KSlcclxuICApO1xyXG5cclxuICBjb25zdCBzZXRQYXJhbWV0ZXJzID0gKHBhcmFtcyA9IHt9LCBqb2JJZCkgPT4gKFxyXG4gICAgc3RhcnRKb2IoY3JlYXRlSm9iKHtcclxuICAgICAgaWQ6IGpvYklkLFxyXG4gICAgICBhY3Rpb246ICdzZXRQYXJhbWV0ZXJzJyxcclxuICAgICAgcGF5bG9hZDogeyBwYXJhbXMgfSxcclxuICAgIH0pKVxyXG4gICk7XHJcblxyXG4gIGNvbnN0IHJlY29nbml6ZSA9IGFzeW5jIChpbWFnZSwgb3B0cyA9IHt9LCBqb2JJZCkgPT4gKFxyXG4gICAgc3RhcnRKb2IoY3JlYXRlSm9iKHtcclxuICAgICAgaWQ6IGpvYklkLFxyXG4gICAgICBhY3Rpb246ICdyZWNvZ25pemUnLFxyXG4gICAgICBwYXlsb2FkOiB7IGltYWdlOiBhd2FpdCBsb2FkSW1hZ2UoaW1hZ2UpLCBvcHRpb25zOiBvcHRzIH0sXHJcbiAgICB9KSlcclxuICApO1xyXG5cclxuICBjb25zdCBnZXRQREYgPSAodGl0bGUgPSAnVGVzc2VyYWN0IE9DUiBSZXN1bHQnLCB0ZXh0b25seSA9IGZhbHNlLCBqb2JJZCkgPT4gKFxyXG4gICAgc3RhcnRKb2IoY3JlYXRlSm9iKHtcclxuICAgICAgaWQ6IGpvYklkLFxyXG4gICAgICBhY3Rpb246ICdnZXRQREYnLFxyXG4gICAgICBwYXlsb2FkOiB7IHRpdGxlLCB0ZXh0b25seSB9LFxyXG4gICAgfSkpXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgZGV0ZWN0ID0gYXN5bmMgKGltYWdlLCBqb2JJZCkgPT4gKFxyXG4gICAgc3RhcnRKb2IoY3JlYXRlSm9iKHtcclxuICAgICAgaWQ6IGpvYklkLFxyXG4gICAgICBhY3Rpb246ICdkZXRlY3QnLFxyXG4gICAgICBwYXlsb2FkOiB7IGltYWdlOiBhd2FpdCBsb2FkSW1hZ2UoaW1hZ2UpIH0sXHJcbiAgICB9KSlcclxuICApO1xyXG5cclxuICBjb25zdCB0ZXJtaW5hdGUgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBpZiAod29ya2VyICE9PSBudWxsKSB7XHJcbiAgICAgIC8qXHJcbiAgICAgIGF3YWl0IHN0YXJ0Sm9iKGNyZWF0ZUpvYih7XHJcbiAgICAgICAgaWQ6IGpvYklkLFxyXG4gICAgICAgIGFjdGlvbjogJ3Rlcm1pbmF0ZScsXHJcbiAgICAgIH0pKTtcclxuICAgICAgKi9cclxuICAgICAgdGVybWluYXRlV29ya2VyKHdvcmtlcik7XHJcbiAgICAgIHdvcmtlciA9IG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgfTtcclxuXHJcbiAgb25NZXNzYWdlKHdvcmtlciwgKHtcclxuICAgIHdvcmtlcklkLCBqb2JJZCwgc3RhdHVzLCBhY3Rpb24sIGRhdGEsXHJcbiAgfSkgPT4ge1xyXG4gICAgaWYgKHN0YXR1cyA9PT0gJ3Jlc29sdmUnKSB7XHJcbiAgICAgIGxvZyhgWyR7d29ya2VySWR9XTogQ29tcGxldGUgJHtqb2JJZH1gKTtcclxuICAgICAgbGV0IGQgPSBkYXRhO1xyXG4gICAgICBpZiAoYWN0aW9uID09PSAncmVjb2duaXplJykge1xyXG4gICAgICAgIGQgPSBjaXJjdWxhcml6ZShkYXRhKTtcclxuICAgICAgfSBlbHNlIGlmIChhY3Rpb24gPT09ICdnZXRQREYnKSB7XHJcbiAgICAgICAgZCA9IEFycmF5LmZyb20oeyAuLi5kYXRhLCBsZW5ndGg6IE9iamVjdC5rZXlzKGRhdGEpLmxlbmd0aCB9KTtcclxuICAgICAgfVxyXG4gICAgICByZXNvbHZlc1thY3Rpb25dKHsgam9iSWQsIGRhdGE6IGQgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gJ3JlamVjdCcpIHtcclxuICAgICAgcmVqZWN0c1thY3Rpb25dKGRhdGEpO1xyXG4gICAgICBpZiAoZXJyb3JIYW5kbGVyKSB7XHJcbiAgICAgICAgZXJyb3JIYW5kbGVyKGRhdGEpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IEVycm9yKGRhdGEpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gJ3Byb2dyZXNzJykge1xyXG4gICAgICBsb2dnZXIoeyAuLi5kYXRhLCB1c2VySm9iSWQ6IGpvYklkIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaWQsXHJcbiAgICB3b3JrZXIsXHJcbiAgICBzZXRSZXNvbHZlLFxyXG4gICAgc2V0UmVqZWN0LFxyXG4gICAgbG9hZCxcclxuICAgIHdyaXRlVGV4dCxcclxuICAgIHJlYWRUZXh0LFxyXG4gICAgcmVtb3ZlRmlsZSxcclxuICAgIEZTLFxyXG4gICAgbG9hZExhbmd1YWdlLFxyXG4gICAgaW5pdGlhbGl6ZSxcclxuICAgIHNldFBhcmFtZXRlcnMsXHJcbiAgICByZWNvZ25pemUsXHJcbiAgICBnZXRQREYsXHJcbiAgICBkZXRlY3QsXHJcbiAgICB0ZXJtaW5hdGUsXHJcbiAgfTtcclxufTtcclxuIiwiLyoqXHJcbiAqXHJcbiAqIEVudHJ5IHBvaW50IGZvciB0ZXNzZXJhY3QuanMsIHNob3VsZCBiZSB0aGUgZW50cnkgd2hlbiBidW5kbGluZy5cclxuICpcclxuICogQGZpbGVvdmVydmlldyBlbnRyeSBwb2ludCBmb3IgdGVzc2VyYWN0LmpzXHJcbiAqIEBhdXRob3IgS2V2aW4gS3dvayA8YW50aW1hdHRlcjE1QGdtYWlsLmNvbT5cclxuICogQGF1dGhvciBHdWlsbGVybW8gV2Vic3RlciA8Z3VpQG1pdC5lZHU+XHJcbiAqIEBhdXRob3IgSmVyb21lIFd1IDxqZXJvbWV3dXNAZ21haWwuY29tPlxyXG4gKi9cclxucmVxdWlyZSgncmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lJyk7XHJcbmNvbnN0IGNyZWF0ZVNjaGVkdWxlciA9IHJlcXVpcmUoJy4vY3JlYXRlU2NoZWR1bGVyJyk7XHJcbmNvbnN0IGNyZWF0ZVdvcmtlciA9IHJlcXVpcmUoJy4vY3JlYXRlV29ya2VyJyk7XHJcbmNvbnN0IFRlc3NlcmFjdCA9IHJlcXVpcmUoJy4vVGVzc2VyYWN0Jyk7XHJcbmNvbnN0IGxhbmd1YWdlcyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzL2xhbmd1YWdlcycpO1xyXG5jb25zdCBPRU0gPSByZXF1aXJlKCcuL2NvbnN0YW50cy9PRU0nKTtcclxuY29uc3QgUFNNID0gcmVxdWlyZSgnLi9jb25zdGFudHMvUFNNJyk7XHJcbmNvbnN0IHsgc2V0TG9nZ2luZyB9ID0gcmVxdWlyZSgnLi91dGlscy9sb2cnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGxhbmd1YWdlcyxcclxuICBPRU0sXHJcbiAgUFNNLFxyXG4gIGNyZWF0ZVNjaGVkdWxlcixcclxuICBjcmVhdGVXb3JrZXIsXHJcbiAgc2V0TG9nZ2luZyxcclxuICAuLi5UZXNzZXJhY3QsXHJcbn07XHJcbiIsIi8qKlxyXG4gKiBJbiB0aGUgcmVjb2duaXRpb24gcmVzdWx0IG9mIHRlc3NlcmFjdCwgdGhlcmVcclxuICogaXMgYSBkZWVwIEpTT04gb2JqZWN0IGZvciBkZXRhaWxzLCBpdCBoYXMgYXJvdW5kXHJcbiAqXHJcbiAqIFRoZSByZXN1bHQgb2YgZHVtcC5qcyBpcyBhIGJpZyBKU09OIHRyZWVcclxuICogd2hpY2ggY2FuIGJlIGVhc2lseSBzZXJpYWxpemVkIChmb3IgaW5zdGFuY2VcclxuICogdG8gYmUgc2VudCBmcm9tIGEgd2Vid29ya2VyIHRvIHRoZSBtYWluIGFwcFxyXG4gKiBvciB0aHJvdWdoIE5vZGUncyBJUEMpLCBidXQgd2Ugd2FudFxyXG4gKiBhIChjaXJjdWxhcikgRE9NLWxpa2UgaW50ZXJmYWNlIGZvciB3YWxraW5nXHJcbiAqIHRocm91Z2ggdGhlIGRhdGEuXHJcbiAqXHJcbiAqIEBmaWxlb3ZlcnZpZXcgRE9NLWxpa2UgaW50ZXJmYWNlIGZvciB3YWxraW5nIHRocm91Z2ggZGF0YVxyXG4gKiBAYXV0aG9yIEtldmluIEt3b2sgPGFudGltYXR0ZXIxNUBnbWFpbC5jb20+XHJcbiAqIEBhdXRob3IgR3VpbGxlcm1vIFdlYnN0ZXIgPGd1aUBtaXQuZWR1PlxyXG4gKiBAYXV0aG9yIEplcm9tZSBXdSA8amVyb21ld3VzQGdtYWlsLmNvbT5cclxuICovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IChwYWdlKSA9PiB7XHJcbiAgY29uc3QgYmxvY2tzID0gW107XHJcbiAgY29uc3QgcGFyYWdyYXBocyA9IFtdO1xyXG4gIGNvbnN0IGxpbmVzID0gW107XHJcbiAgY29uc3Qgd29yZHMgPSBbXTtcclxuICBjb25zdCBzeW1ib2xzID0gW107XHJcblxyXG4gIHBhZ2UuYmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB7XHJcbiAgICBibG9jay5wYXJhZ3JhcGhzLmZvckVhY2goKHBhcmFncmFwaCkgPT4ge1xyXG4gICAgICBwYXJhZ3JhcGgubGluZXMuZm9yRWFjaCgobGluZSkgPT4ge1xyXG4gICAgICAgIGxpbmUud29yZHMuZm9yRWFjaCgod29yZCkgPT4ge1xyXG4gICAgICAgICAgd29yZC5zeW1ib2xzLmZvckVhY2goKHN5bSkgPT4ge1xyXG4gICAgICAgICAgICBzeW1ib2xzLnB1c2goe1xyXG4gICAgICAgICAgICAgIC4uLnN5bSwgcGFnZSwgYmxvY2ssIHBhcmFncmFwaCwgbGluZSwgd29yZCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHdvcmRzLnB1c2goe1xyXG4gICAgICAgICAgICAuLi53b3JkLCBwYWdlLCBibG9jaywgcGFyYWdyYXBoLCBsaW5lLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGluZXMucHVzaCh7XHJcbiAgICAgICAgICAuLi5saW5lLCBwYWdlLCBibG9jaywgcGFyYWdyYXBoLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgcGFyYWdyYXBocy5wdXNoKHtcclxuICAgICAgICAuLi5wYXJhZ3JhcGgsIHBhZ2UsIGJsb2NrLFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgYmxvY2tzLnB1c2goe1xyXG4gICAgICAuLi5ibG9jaywgcGFnZSxcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgLi4ucGFnZSwgYmxvY2tzLCBwYXJhZ3JhcGhzLCBsaW5lcywgd29yZHMsIHN5bWJvbHMsXHJcbiAgfTtcclxufTtcclxuIiwiY29uc3QgaXNFbGVjdHJvbiA9IHJlcXVpcmUoJ2lzLWVsZWN0cm9uJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IChrZXkpID0+IHtcclxuICBjb25zdCBlbnYgPSB7fTtcclxuXHJcbiAgaWYgKHR5cGVvZiBXb3JrZXJHbG9iYWxTY29wZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIGVudi50eXBlID0gJ3dlYndvcmtlcic7XHJcbiAgfSBlbHNlIGlmIChpc0VsZWN0cm9uKCkpIHtcclxuICAgIGVudi50eXBlID0gJ2VsZWN0cm9uJztcclxuICB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSB7XHJcbiAgICBlbnYudHlwZSA9ICdicm93c2VyJztcclxuICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgZW52LnR5cGUgPSAnbm9kZSc7XHJcbiAgfVxyXG5cclxuICBpZiAodHlwZW9mIGtleSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIHJldHVybiBlbnY7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZW52W2tleV07XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gKHByZWZpeCwgY250KSA9PiAoXHJcbiAgYCR7cHJlZml4fS0ke2NudH0tJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDE2KS5zbGljZSgzLCA4KX1gXHJcbik7XHJcbiIsImxldCBsb2dnaW5nID0gZmFsc2U7XHJcblxyXG5leHBvcnRzLmxvZ2dpbmcgPSBsb2dnaW5nO1xyXG5cclxuZXhwb3J0cy5zZXRMb2dnaW5nID0gKF9sb2dnaW5nKSA9PiB7XHJcbiAgbG9nZ2luZyA9IF9sb2dnaW5nO1xyXG59O1xyXG5cclxuZXhwb3J0cy5sb2cgPSAoLi4uYXJncykgPT4gKGxvZ2dpbmcgPyBjb25zb2xlLmxvZy5hcHBseSh0aGlzLCBhcmdzKSA6IG51bGwpO1xyXG4iLCJjb25zdCBpc0Jyb3dzZXIgPSByZXF1aXJlKCcuL2dldEVudmlyb25tZW50JykoJ3R5cGUnKSA9PT0gJ2Jyb3dzZXInO1xyXG5jb25zdCByZXNvbHZlVVJMID0gaXNCcm93c2VyID8gcmVxdWlyZSgncmVzb2x2ZS11cmwnKSA6IHMgPT4gczsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAob3B0aW9ucykgPT4ge1xyXG4gIGNvbnN0IG9wdHMgPSB7IC4uLm9wdGlvbnMgfTtcclxuICBbJ2NvcmVQYXRoJywgJ3dvcmtlclBhdGgnLCAnbGFuZ1BhdGgnXS5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgIGlmIChvcHRpb25zW2tleV0pIHtcclxuICAgICAgb3B0c1trZXldID0gcmVzb2x2ZVVSTChvcHRzW2tleV0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybiBvcHRzO1xyXG59O1xyXG4iLCJjb25zdCByZXNvbHZlVVJMID0gcmVxdWlyZSgncmVzb2x2ZS11cmwnKTtcclxuY29uc3QgeyB2ZXJzaW9uIH0gPSByZXF1aXJlKCcuLi8uLi8uLi9wYWNrYWdlLmpzb24nKTtcclxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMvZGVmYXVsdE9wdGlvbnMnKTtcclxuXHJcbi8qXHJcbiAqIERlZmF1bHQgb3B0aW9ucyBmb3IgYnJvd3NlciB3b3JrZXJcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIC4uLmRlZmF1bHRPcHRpb25zLFxyXG4gIHdvcmtlclBhdGg6ICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5lbnYuVEVTU19FTlYgPT09ICdkZXZlbG9wbWVudCcpXHJcbiAgICA/IHJlc29sdmVVUkwoYC9kaXN0L3dvcmtlci5kZXYuanM/bm9jYWNoZT0ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDMpfWApXHJcbiAgICA6IGBodHRwczovL3VucGtnLmNvbS90ZXNzZXJhY3QuanNAdiR7dmVyc2lvbn0vZGlzdC93b3JrZXIubWluLmpzYCxcclxuICAvKlxyXG4gICAqIElmIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IFdlYkFzc2VtYmx5LFxyXG4gICAqIGxvYWQgQVNNIHZlcnNpb24gaW5zdGVhZFxyXG4gICAqL1xyXG4gIGNvcmVQYXRoOiBudWxsLFxyXG59O1xyXG4iLCIvKipcclxuICpcclxuICogVGVzc2VyYWN0IFdvcmtlciBhZGFwdGVyIGZvciBicm93c2VyXHJcbiAqXHJcbiAqIEBmaWxlb3ZlcnZpZXcgVGVzc2VyYWN0IFdvcmtlciBhZGFwdGVyIGZvciBicm93c2VyXHJcbiAqIEBhdXRob3IgS2V2aW4gS3dvayA8YW50aW1hdHRlcjE1QGdtYWlsLmNvbT5cclxuICogQGF1dGhvciBHdWlsbGVybW8gV2Vic3RlciA8Z3VpQG1pdC5lZHU+XHJcbiAqIEBhdXRob3IgSmVyb21lIFd1IDxqZXJvbWV3dXNAZ21haWwuY29tPlxyXG4gKi9cclxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSByZXF1aXJlKCcuL2RlZmF1bHRPcHRpb25zJyk7XHJcbmNvbnN0IHNwYXduV29ya2VyID0gcmVxdWlyZSgnLi9zcGF3bldvcmtlcicpO1xyXG5jb25zdCB0ZXJtaW5hdGVXb3JrZXIgPSByZXF1aXJlKCcuL3Rlcm1pbmF0ZVdvcmtlcicpO1xyXG5jb25zdCBvbk1lc3NhZ2UgPSByZXF1aXJlKCcuL29uTWVzc2FnZScpO1xyXG5jb25zdCBzZW5kID0gcmVxdWlyZSgnLi9zZW5kJyk7XHJcbmNvbnN0IGxvYWRJbWFnZSA9IHJlcXVpcmUoJy4vbG9hZEltYWdlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBkZWZhdWx0T3B0aW9ucyxcclxuICBzcGF3bldvcmtlcixcclxuICB0ZXJtaW5hdGVXb3JrZXIsXHJcbiAgb25NZXNzYWdlLFxyXG4gIHNlbmQsXHJcbiAgbG9hZEltYWdlLFxyXG59O1xyXG4iLCJjb25zdCByZXNvbHZlVVJMID0gcmVxdWlyZSgncmVzb2x2ZS11cmwnKTtcclxuXHJcbi8qKlxyXG4gKiByZWFkRnJvbUJsb2JPckZpbGVcclxuICpcclxuICogQG5hbWUgcmVhZEZyb21CbG9iT3JGaWxlXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAYWNjZXNzIHByaXZhdGVcclxuICovXHJcbmNvbnN0IHJlYWRGcm9tQmxvYk9yRmlsZSA9IChibG9iKSA9PiAoXHJcbiAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgY29uc3QgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICBmaWxlUmVhZGVyLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgcmVzb2x2ZShmaWxlUmVhZGVyLnJlc3VsdCk7XHJcbiAgICB9O1xyXG4gICAgZmlsZVJlYWRlci5vbmVycm9yID0gKHsgdGFyZ2V0OiB7IGVycm9yOiB7IGNvZGUgfSB9IH0pID0+IHtcclxuICAgICAgcmVqZWN0KEVycm9yKGBGaWxlIGNvdWxkIG5vdCBiZSByZWFkISBDb2RlPSR7Y29kZX1gKSk7XHJcbiAgICB9O1xyXG4gICAgZmlsZVJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKTtcclxuICB9KVxyXG4pO1xyXG5cclxuLyoqXHJcbiAqIGxvYWRJbWFnZVxyXG4gKlxyXG4gKiBAbmFtZSBsb2FkSW1hZ2VcclxuICogQGZ1bmN0aW9uIGxvYWQgaW1hZ2UgZnJvbSBkaWZmZXJlbnQgc291cmNlXHJcbiAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gKi9cclxuY29uc3QgbG9hZEltYWdlID0gYXN5bmMgKGltYWdlKSA9PiB7XHJcbiAgbGV0IGRhdGEgPSBpbWFnZTtcclxuICBpZiAodHlwZW9mIGltYWdlID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgcmV0dXJuICd1bmRlZmluZWQnO1xyXG4gIH1cclxuXHJcbiAgaWYgKHR5cGVvZiBpbWFnZSA9PT0gJ3N0cmluZycpIHtcclxuICAgIC8vIEJhc2U2NCBJbWFnZVxyXG4gICAgaWYgKC9kYXRhOmltYWdlXFwvKFthLXpBLVpdKik7YmFzZTY0LChbXlwiXSopLy50ZXN0KGltYWdlKSkge1xyXG4gICAgICBkYXRhID0gYXRvYihpbWFnZS5zcGxpdCgnLCcpWzFdKVxyXG4gICAgICAgIC5zcGxpdCgnJylcclxuICAgICAgICAubWFwKChjKSA9PiBjLmNoYXJDb2RlQXQoMCkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IGZldGNoKHJlc29sdmVVUkwoaW1hZ2UpKTtcclxuICAgICAgZGF0YSA9IGF3YWl0IHJlc3AuYXJyYXlCdWZmZXIoKTtcclxuICAgIH1cclxuICB9IGVsc2UgaWYgKGltYWdlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgIGlmIChpbWFnZS50YWdOYW1lID09PSAnSU1HJykge1xyXG4gICAgICBkYXRhID0gYXdhaXQgbG9hZEltYWdlKGltYWdlLnNyYyk7XHJcbiAgICB9XHJcbiAgICBpZiAoaW1hZ2UudGFnTmFtZSA9PT0gJ1ZJREVPJykge1xyXG4gICAgICBkYXRhID0gYXdhaXQgbG9hZEltYWdlKGltYWdlLnBvc3Rlcik7XHJcbiAgICB9XHJcbiAgICBpZiAoaW1hZ2UudGFnTmFtZSA9PT0gJ0NBTlZBUycpIHtcclxuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICBpbWFnZS50b0Jsb2IoYXN5bmMgKGJsb2IpID0+IHtcclxuICAgICAgICAgIGRhdGEgPSBhd2FpdCByZWFkRnJvbUJsb2JPckZpbGUoYmxvYik7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAoaW1hZ2UgaW5zdGFuY2VvZiBGaWxlIHx8IGltYWdlIGluc3RhbmNlb2YgQmxvYikge1xyXG4gICAgZGF0YSA9IGF3YWl0IHJlYWRGcm9tQmxvYk9yRmlsZShpbWFnZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoZGF0YSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxvYWRJbWFnZTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSAod29ya2VyLCBoYW5kbGVyKSA9PiB7XHJcbiAgd29ya2VyLm9ubWVzc2FnZSA9ICh7IGRhdGEgfSkgPT4geyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICBoYW5kbGVyKGRhdGEpO1xyXG4gIH07XHJcbn07XHJcbiIsIi8qKlxyXG4gKiBzZW5kXHJcbiAqXHJcbiAqIEBuYW1lIHNlbmRcclxuICogQGZ1bmN0aW9uIHNlbmQgcGFja2V0IHRvIHdvcmtlciBhbmQgY3JlYXRlIGEgam9iXHJcbiAqIEBhY2Nlc3MgcHVibGljXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFzeW5jICh3b3JrZXIsIHBhY2tldCkgPT4ge1xyXG4gIHdvcmtlci5wb3N0TWVzc2FnZShwYWNrZXQpO1xyXG59O1xyXG4iLCIvKipcclxuICogc3Bhd25Xb3JrZXJcclxuICpcclxuICogQG5hbWUgc3Bhd25Xb3JrZXJcclxuICogQGZ1bmN0aW9uIGNyZWF0ZSBhIG5ldyBXb3JrZXIgaW4gYnJvd3NlclxyXG4gKiBAYWNjZXNzIHB1YmxpY1xyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAoeyB3b3JrZXJQYXRoLCB3b3JrZXJCbG9iVVJMIH0pID0+IHtcclxuICBsZXQgd29ya2VyO1xyXG4gIGlmIChCbG9iICYmIFVSTCAmJiB3b3JrZXJCbG9iVVJMKSB7XHJcbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW2BpbXBvcnRTY3JpcHRzKFwiJHt3b3JrZXJQYXRofVwiKTtgXSwge1xyXG4gICAgICB0eXBlOiAnYXBwbGljYXRpb24vamF2YXNjcmlwdCcsXHJcbiAgICB9KTtcclxuICAgIHdvcmtlciA9IG5ldyBXb3JrZXIoVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdvcmtlciA9IG5ldyBXb3JrZXIod29ya2VyUGF0aCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gd29ya2VyO1xyXG59O1xyXG4iLCIvKipcclxuICogdGVybWluYXRlV29ya2VyXHJcbiAqXHJcbiAqIEBuYW1lIHRlcm1pbmF0ZVdvcmtlclxyXG4gKiBAZnVuY3Rpb24gdGVybWluYXRlIHdvcmtlclxyXG4gKiBAYWNjZXNzIHB1YmxpY1xyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAod29ya2VyKSA9PiB7XHJcbiAgd29ya2VyLnRlcm1pbmF0ZSgpO1xyXG59O1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5tZCA9IChtb2R1bGUpID0+IHtcblx0bW9kdWxlLnBhdGhzID0gW107XG5cdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0cmV0dXJuIG1vZHVsZTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCIiXSwibmFtZXMiOlsiaXNFbGVjdHJvbiIsIndpbmRvdyIsInByb2Nlc3MiLCJ0eXBlIiwidmVyc2lvbnMiLCJlbGVjdHJvbiIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsImluZGV4T2YiLCJtb2R1bGUiLCJleHBvcnRzIiwicnVudGltZSIsIk9wIiwiT2JqZWN0IiwicHJvdG90eXBlIiwiaGFzT3duIiwiaGFzT3duUHJvcGVydHkiLCJ1bmRlZmluZWQiLCIkU3ltYm9sIiwiU3ltYm9sIiwiaXRlcmF0b3JTeW1ib2wiLCJpdGVyYXRvciIsImFzeW5jSXRlcmF0b3JTeW1ib2wiLCJhc3luY0l0ZXJhdG9yIiwidG9TdHJpbmdUYWdTeW1ib2wiLCJ0b1N0cmluZ1RhZyIsImRlZmluZSIsIm9iaiIsImtleSIsInZhbHVlIiwiZGVmaW5lUHJvcGVydHkiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJlcnIiLCJ3cmFwIiwiaW5uZXJGbiIsIm91dGVyRm4iLCJzZWxmIiwidHJ5TG9jc0xpc3QiLCJwcm90b0dlbmVyYXRvciIsIkdlbmVyYXRvciIsImdlbmVyYXRvciIsImNyZWF0ZSIsImNvbnRleHQiLCJDb250ZXh0IiwiX2ludm9rZSIsIm1ha2VJbnZva2VNZXRob2QiLCJ0cnlDYXRjaCIsImZuIiwiYXJnIiwiY2FsbCIsIkdlblN0YXRlU3VzcGVuZGVkU3RhcnQiLCJHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkIiwiR2VuU3RhdGVFeGVjdXRpbmciLCJHZW5TdGF0ZUNvbXBsZXRlZCIsIkNvbnRpbnVlU2VudGluZWwiLCJHZW5lcmF0b3JGdW5jdGlvbiIsIkdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlIiwiSXRlcmF0b3JQcm90b3R5cGUiLCJnZXRQcm90byIsImdldFByb3RvdHlwZU9mIiwiTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUiLCJ2YWx1ZXMiLCJHcCIsImRpc3BsYXlOYW1lIiwiZGVmaW5lSXRlcmF0b3JNZXRob2RzIiwiZm9yRWFjaCIsIm1ldGhvZCIsImlzR2VuZXJhdG9yRnVuY3Rpb24iLCJnZW5GdW4iLCJjdG9yIiwiY29uc3RydWN0b3IiLCJuYW1lIiwibWFyayIsInNldFByb3RvdHlwZU9mIiwiX19wcm90b19fIiwiYXdyYXAiLCJfX2F3YWl0IiwiQXN5bmNJdGVyYXRvciIsIlByb21pc2VJbXBsIiwiaW52b2tlIiwicmVzb2x2ZSIsInJlamVjdCIsInJlY29yZCIsInJlc3VsdCIsInRoZW4iLCJ1bndyYXBwZWQiLCJlcnJvciIsInByZXZpb3VzUHJvbWlzZSIsImVucXVldWUiLCJjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyIsImFzeW5jIiwiUHJvbWlzZSIsIml0ZXIiLCJuZXh0IiwiZG9uZSIsInN0YXRlIiwiRXJyb3IiLCJkb25lUmVzdWx0IiwiZGVsZWdhdGUiLCJkZWxlZ2F0ZVJlc3VsdCIsIm1heWJlSW52b2tlRGVsZWdhdGUiLCJzZW50IiwiX3NlbnQiLCJkaXNwYXRjaEV4Y2VwdGlvbiIsImFicnVwdCIsIlR5cGVFcnJvciIsImluZm8iLCJyZXN1bHROYW1lIiwibmV4dExvYyIsInB1c2hUcnlFbnRyeSIsImxvY3MiLCJlbnRyeSIsInRyeUxvYyIsImNhdGNoTG9jIiwiZmluYWxseUxvYyIsImFmdGVyTG9jIiwidHJ5RW50cmllcyIsInB1c2giLCJyZXNldFRyeUVudHJ5IiwiY29tcGxldGlvbiIsInJlc2V0Iiwia2V5cyIsIm9iamVjdCIsInJldmVyc2UiLCJsZW5ndGgiLCJwb3AiLCJpdGVyYWJsZSIsIml0ZXJhdG9yTWV0aG9kIiwiaXNOYU4iLCJpIiwic2tpcFRlbXBSZXNldCIsInByZXYiLCJjaGFyQXQiLCJzbGljZSIsInN0b3AiLCJyb290RW50cnkiLCJyb290UmVjb3JkIiwicnZhbCIsImV4Y2VwdGlvbiIsImhhbmRsZSIsImxvYyIsImNhdWdodCIsImhhc0NhdGNoIiwiaGFzRmluYWxseSIsImZpbmFsbHlFbnRyeSIsImNvbXBsZXRlIiwiZmluaXNoIiwidGhyb3duIiwiZGVsZWdhdGVZaWVsZCIsInJlZ2VuZXJhdG9yUnVudGltZSIsImFjY2lkZW50YWxTdHJpY3RNb2RlIiwiZ2xvYmFsVGhpcyIsIkZ1bmN0aW9uIiwicm9vdCIsImZhY3RvcnkiLCJhbWQiLCJyZXNvbHZlVXJsIiwibnVtVXJscyIsImFyZ3VtZW50cyIsImJhc2UiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJocmVmIiwiaGVhZCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiaW5zZXJ0QmVmb3JlIiwiZmlyc3RDaGlsZCIsImEiLCJyZXNvbHZlZCIsImluZGV4IiwicmVtb3ZlQ2hpbGQiLCJjcmVhdGVXb3JrZXIiLCJyZXF1aXJlIiwicmVjb2duaXplIiwiaW1hZ2UiLCJsYW5ncyIsIm9wdGlvbnMiLCJ3b3JrZXIiLCJsb2FkIiwibG9hZExhbmd1YWdlIiwiaW5pdGlhbGl6ZSIsImZpbmFsbHkiLCJ0ZXJtaW5hdGUiLCJkZXRlY3QiLCJURVNTRVJBQ1RfT05MWSIsIkxTVE1fT05MWSIsIlRFU1NFUkFDVF9MU1RNX0NPTUJJTkVEIiwiREVGQVVMVCIsIk9TRF9PTkxZIiwiQVVUT19PU0QiLCJBVVRPX09OTFkiLCJBVVRPIiwiU0lOR0xFX0NPTFVNTiIsIlNJTkdMRV9CTE9DS19WRVJUX1RFWFQiLCJTSU5HTEVfQkxPQ0siLCJTSU5HTEVfTElORSIsIlNJTkdMRV9XT1JEIiwiQ0lSQ0xFX1dPUkQiLCJTSU5HTEVfQ0hBUiIsIlNQQVJTRV9URVhUIiwiU1BBUlNFX1RFWFRfT1NEIiwiT0VNIiwiZGVmYXVsdE9FTSIsImxhbmdQYXRoIiwid29ya2VyQmxvYlVSTCIsImxvZ2dlciIsIkFGUiIsIkFNSCIsIkFSQSIsIkFTTSIsIkFaRSIsIkFaRV9DWVJMIiwiQkVMIiwiQkVOIiwiQk9EIiwiQk9TIiwiQlVMIiwiQ0FUIiwiQ0VCIiwiQ0VTIiwiQ0hJX1NJTSIsIkNISV9UUkEiLCJDSFIiLCJDWU0iLCJEQU4iLCJERVUiLCJEWk8iLCJFTEwiLCJFTkciLCJFTk0iLCJFUE8iLCJFU1QiLCJFVVMiLCJGQVMiLCJGSU4iLCJGUkEiLCJGUksiLCJGUk0iLCJHTEUiLCJHTEciLCJHUkMiLCJHVUoiLCJIQVQiLCJIRUIiLCJISU4iLCJIUlYiLCJIVU4iLCJJS1UiLCJJTkQiLCJJU0wiLCJJVEEiLCJJVEFfT0xEIiwiSkFWIiwiSlBOIiwiS0FOIiwiS0FUIiwiS0FUX09MRCIsIktBWiIsIktITSIsIktJUiIsIktPUiIsIktVUiIsIkxBTyIsIkxBVCIsIkxBViIsIkxJVCIsIk1BTCIsIk1BUiIsIk1LRCIsIk1MVCIsIk1TQSIsIk1ZQSIsIk5FUCIsIk5MRCIsIk5PUiIsIk9SSSIsIlBBTiIsIlBPTCIsIlBPUiIsIlBVUyIsIlJPTiIsIlJVUyIsIlNBTiIsIlNJTiIsIlNMSyIsIlNMViIsIlNQQSIsIlNQQV9PTEQiLCJTUUkiLCJTUlAiLCJTUlBfTEFUTiIsIlNXQSIsIlNXRSIsIlNZUiIsIlRBTSIsIlRFTCIsIlRHSyIsIlRHTCIsIlRIQSIsIlRJUiIsIlRVUiIsIlVJRyIsIlVLUiIsIlVSRCIsIlVaQiIsIlVaQl9DWVJMIiwiVklFIiwiWUlEIiwiZ2V0SWQiLCJqb2JDb3VudGVyIiwiX2lkIiwiaWQiLCJhY3Rpb24iLCJwYXlsb2FkIiwiY3JlYXRlSm9iIiwibG9nIiwic2NoZWR1bGVyQ291bnRlciIsIndvcmtlcnMiLCJydW5uaW5nV29ya2VycyIsImpvYlF1ZXVlIiwiZ2V0UXVldWVMZW4iLCJnZXROdW1Xb3JrZXJzIiwiZGVxdWV1ZSIsIndJZHMiLCJxdWV1ZSIsImpvYiIsInciLCJzaGlmdCIsImFwcGx5IiwiYWRkV29ya2VyIiwiYWRkSm9iIiwid2lkIiwicmVzb2x2ZVBhdGhzIiwiY2lyY3VsYXJpemUiLCJkZWZhdWx0T3B0aW9ucyIsInNwYXduV29ya2VyIiwidGVybWluYXRlV29ya2VyIiwib25NZXNzYWdlIiwibG9hZEltYWdlIiwic2VuZCIsIndvcmtlckNvdW50ZXIiLCJfb3B0aW9ucyIsImVycm9ySGFuZGxlciIsInJlc29sdmVzIiwicmVqZWN0cyIsInNldFJlc29sdmUiLCJyZXMiLCJzZXRSZWplY3QiLCJyZWoiLCJzdGFydEpvYiIsImpvYklkIiwid29ya2VySWQiLCJ3cml0ZVRleHQiLCJwYXRoIiwidGV4dCIsImFyZ3MiLCJyZWFkVGV4dCIsImVuY29kaW5nIiwicmVtb3ZlRmlsZSIsIkZTIiwib2VtIiwic2V0UGFyYW1ldGVycyIsInBhcmFtcyIsIm9wdHMiLCJnZXRQREYiLCJ0aXRsZSIsInRleHRvbmx5Iiwic3RhdHVzIiwiZGF0YSIsImQiLCJBcnJheSIsImZyb20iLCJ1c2VySm9iSWQiLCJjcmVhdGVTY2hlZHVsZXIiLCJUZXNzZXJhY3QiLCJsYW5ndWFnZXMiLCJQU00iLCJzZXRMb2dnaW5nIiwicGFnZSIsImJsb2NrcyIsInBhcmFncmFwaHMiLCJsaW5lcyIsIndvcmRzIiwic3ltYm9scyIsImJsb2NrIiwicGFyYWdyYXBoIiwibGluZSIsIndvcmQiLCJzeW0iLCJlbnYiLCJXb3JrZXJHbG9iYWxTY29wZSIsInByZWZpeCIsImNudCIsIk1hdGgiLCJyYW5kb20iLCJ0b1N0cmluZyIsImxvZ2dpbmciLCJfbG9nZ2luZyIsImNvbnNvbGUiLCJpc0Jyb3dzZXIiLCJyZXNvbHZlVVJMIiwicyIsInZlcnNpb24iLCJ3b3JrZXJQYXRoIiwiVEVTU19FTlYiLCJjb3JlUGF0aCIsInJlYWRGcm9tQmxvYk9yRmlsZSIsImJsb2IiLCJmaWxlUmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsIm9uZXJyb3IiLCJjb2RlIiwidGFyZ2V0IiwicmVhZEFzQXJyYXlCdWZmZXIiLCJ0ZXN0IiwiYXRvYiIsInNwbGl0IiwibWFwIiwiYyIsImNoYXJDb2RlQXQiLCJmZXRjaCIsInJlc3AiLCJhcnJheUJ1ZmZlciIsIkhUTUxFbGVtZW50IiwidGFnTmFtZSIsInNyYyIsInBvc3RlciIsInRvQmxvYiIsIkZpbGUiLCJCbG9iIiwiVWludDhBcnJheSIsImhhbmRsZXIiLCJvbm1lc3NhZ2UiLCJwYWNrZXQiLCJwb3N0TWVzc2FnZSIsIlVSTCIsIldvcmtlciIsImNyZWF0ZU9iamVjdFVSTCJdLCJzb3VyY2VSb290IjoiIn0=