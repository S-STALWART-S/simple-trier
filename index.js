"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
var globalConfigs = {
  callerName: "unknownCaller",
  canPrintError: true,
};
var Trier = (function () {
  function Trier(callerName) {
    this.callbacks = {
      try: [],
      catch: function () {},
      executeIfNoError: function () {},
      finally: function () {},
    };
    this.configs = __assign(__assign({}, globalConfigs), {
      shouldThrowError: false,
    });
    this.hasError = false;
    this.setConfigs({ callerName: callerName });
  }
  Trier.changeGlobalConfigs = function (newConfigs) {
    if (newConfigs === void 0) {
      newConfigs = globalConfigs;
    }
    Object.entries(globalConfigs).forEach(function (_a) {
      var key = _a[0],
        value = _a[1];
      if (key in newConfigs) globalConfigs[key] = value;
    });
  };
  Trier.prototype.getConfigs = function () {
    return this.configs;
  };
  Trier.prototype.setConfigs = function (newConfigs) {
    if (newConfigs === void 0) {
      newConfigs = this.configs;
    }
    this.configs = __assign(__assign({}, this.getConfigs()), newConfigs);
    return this;
  };
  Trier.prototype.try = function (cb) {
    var _this = this;
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      params[_i - 1] = arguments[_i];
    }
    this.callbacks.try.push({
      type: "sync",
      callback: function () {
        try {
          _this.tryResult = cb.apply(void 0, params);
        } catch (error) {
          _this.handleCatchBlock(error);
        }
      },
    });
    return this;
  };
  Trier.prototype.tryAsync = function (cb) {
    var _this = this;
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      params[_i - 1] = arguments[_i];
    }
    this.callbacks.try.push({
      type: "async",
      callback: function () {
        return __awaiter(_this, void 0, void 0, function () {
          var _a, error_1;
          return __generator(this, function (_b) {
            switch (_b.label) {
              case 0:
                _b.trys.push([0, 2, , 3]);
                _a = this;
                return [4, cb.apply(void 0, params)];
              case 1:
                _a.tryResult = _b.sent();
                return [3, 3];
              case 2:
                error_1 = _b.sent();
                this.handleCatchBlock(error_1);
                return [3, 3];
              case 3:
                return [2];
            }
          });
        });
      },
    });
    return this;
  };
  Trier.prototype.handleCatchBlock = function (error) {
    this.hasError = true;
    this.catchResult = error;
    var canPrintError = this.getConfigs().canPrintError;
    if (canPrintError) this.printError();
  };
  Trier.prototype.printError = function () {
    var callerName = this.getConfigs().callerName;
    console.error("".concat(callerName, " catch, error: "), this.catchResult);
    return this;
  };
  Trier.prototype.throw = function () {
    this.setConfigs({ shouldThrowError: true });
    return this;
  };
  Trier.prototype.executeIfNoError = function (callback) {
    var _this = this;
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      params[_i - 1] = arguments[_i];
    }
    this.callbacks.executeIfNoError = function () {
      if (_this.hasError === false) {
        callback.apply(void 0, __spreadArray([_this.tryResult], params, false));
      }
    };
    return this;
  };
  Trier.prototype.catch = function (callback) {
    var _this = this;
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      params[_i - 1] = arguments[_i];
    }
    this.callbacks.catch = function () {
      if (_this.hasError) {
        _this.catchResult = callback.apply(
          void 0,
          __spreadArray([_this.catchResult], params, false)
        );
      }
    };
    return this;
  };
  Trier.prototype.finally = function (callback) {
    var _this = this;
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      params[_i - 1] = arguments[_i];
    }
    this.callbacks.finally = function () {
      callback.apply(void 0, __spreadArray([_this.tryResult], params, false));
    };
    return this;
  };
  Trier.prototype.run = function () {
    var syncCallbacks = this.callbacks.try.filter(function (i) {
      return i.type === "sync";
    });
    for (
      var _i = 0, syncCallbacks_1 = syncCallbacks;
      _i < syncCallbacks_1.length;
      _i++
    ) {
      var i = syncCallbacks_1[_i];
      if (this.isErrorOccurred()) break;
      i.callback();
    }
    return this.handleOtherTasks();
  };
  Trier.prototype.runAsync = function () {
    return __awaiter(this, void 0, void 0, function () {
      var _i, _a, i;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            (_i = 0), (_a = this.callbacks.try);
            _b.label = 1;
          case 1:
            if (!(_i < _a.length)) return [3, 4];
            i = _a[_i];
            if (this.isErrorOccurred()) return [3, 4];
            return [4, i.callback()];
          case 2:
            _b.sent();
            _b.label = 3;
          case 3:
            _i++;
            return [3, 1];
          case 4:
            return [2, this.handleOtherTasks()];
        }
      });
    });
  };
  Trier.prototype.isErrorOccurred = function () {
    return this.hasError;
  };
  Trier.prototype.handleOtherTasks = function () {
    if (this.isErrorOccurred()) {
      this.callbacks.catch();
      if (this.configs.shouldThrowError) throw this.catchResult;
    }
    if (this.isErrorOccurred() === false) {
      this.callbacks.executeIfNoError();
    }
    this.callbacks.finally();
    return this.getResult();
  };
  Trier.prototype.getResult = function () {
    return this.hasError ? this.catchResult : this.tryResult;
  };
  return Trier;
})();
var trier = function (callerName) {
  return new Trier(callerName);
};
module.exports = {
  trier: trier,
  Trier: Trier,
};
//# sourceMappingURL=index.js.map
