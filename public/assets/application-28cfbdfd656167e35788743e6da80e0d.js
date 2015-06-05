(function (window, document, undefined) {
  'use strict';
  function minErr(module, ErrorConstructor) {
    ErrorConstructor = ErrorConstructor || Error;
    return function () {
      var SKIP_INDEXES = 2;
      var templateArgs = arguments, code = templateArgs[0], message = '[' + (module ? module + ':' : '') + code + '] ', template = templateArgs[1], paramPrefix, i;
      message += template.replace(/\{\d+\}/g, function (match) {
        var index = +match.slice(1, -1), shiftedIndex = index + SKIP_INDEXES;
        if (shiftedIndex < templateArgs.length) {
          return toDebugString(templateArgs[shiftedIndex]);
        }
        return match;
      });
      message += '\nhttp://errors.angularjs.org/1.4.0/' + (module ? module + '/' : '') + code;
      for (i = SKIP_INDEXES, paramPrefix = '?'; i < templateArgs.length; i++, paramPrefix = '&') {
        message += paramPrefix + 'p' + (i - SKIP_INDEXES) + '=' + encodeURIComponent(toDebugString(templateArgs[i]));
      }
      return new ErrorConstructor(message);
    };
  }
  var REGEX_STRING_REGEXP = /^\/(.+)\/([a-z]*)$/;
  var VALIDITY_STATE_PROPERTY = 'validity';
  var lowercase = function (string) {
    return isString(string) ? string.toLowerCase() : string;
  };
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var uppercase = function (string) {
    return isString(string) ? string.toUpperCase() : string;
  };
  var manualLowercase = function (s) {
    return isString(s) ? s.replace(/[A-Z]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) | 32);
    }) : s;
  };
  var manualUppercase = function (s) {
    return isString(s) ? s.replace(/[a-z]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) & ~32);
    }) : s;
  };
  if ('i' !== 'I'.toLowerCase()) {
    lowercase = manualLowercase;
    uppercase = manualUppercase;
  }
  var msie, jqLite, jQuery, slice = [].slice, splice = [].splice, push = [].push, toString = Object.prototype.toString, getPrototypeOf = Object.getPrototypeOf, ngMinErr = minErr('ng'), angular = window.angular || (window.angular = {}), angularModule, uid = 0;
  msie = document.documentMode;
  function isArrayLike(obj) {
    if (obj == null || isWindow(obj)) {
      return false;
    }
    var length = 'length' in Object(obj) && obj.length;
    if (obj.nodeType === NODE_TYPE_ELEMENT && length) {
      return true;
    }
    return isString(obj) || isArray(obj) || length === 0 || typeof length === 'number' && length > 0 && length - 1 in obj;
  }
  function forEach(obj, iterator, context) {
    var key, length;
    if (obj) {
      if (isFunction(obj)) {
        for (key in obj) {
          if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else if (isArray(obj) || isArrayLike(obj)) {
        var isPrimitive = typeof obj !== 'object';
        for (key = 0, length = obj.length; key < length; key++) {
          if (isPrimitive || key in obj) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else if (obj.forEach && obj.forEach !== forEach) {
        obj.forEach(iterator, context, obj);
      } else if (isBlankObject(obj)) {
        for (key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      } else if (typeof obj.hasOwnProperty === 'function') {
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else {
        for (key in obj) {
          if (hasOwnProperty.call(obj, key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      }
    }
    return obj;
  }
  function forEachSorted(obj, iterator, context) {
    var keys = Object.keys(obj).sort();
    for (var i = 0; i < keys.length; i++) {
      iterator.call(context, obj[keys[i]], keys[i]);
    }
    return keys;
  }
  function reverseParams(iteratorFn) {
    return function (value, key) {
      iteratorFn(key, value);
    };
  }
  function nextUid() {
    return ++uid;
  }
  function setHashKey(obj, h) {
    if (h) {
      obj.$$hashKey = h;
    } else {
      delete obj.$$hashKey;
    }
  }
  function baseExtend(dst, objs, deep) {
    var h = dst.$$hashKey;
    for (var i = 0, ii = objs.length; i < ii; ++i) {
      var obj = objs[i];
      if (!isObject(obj) && !isFunction(obj))
        continue;
      var keys = Object.keys(obj);
      for (var j = 0, jj = keys.length; j < jj; j++) {
        var key = keys[j];
        var src = obj[key];
        if (deep && isObject(src)) {
          if (!isObject(dst[key]))
            dst[key] = isArray(src) ? [] : {};
          baseExtend(dst[key], [src], true);
        } else {
          dst[key] = src;
        }
      }
    }
    setHashKey(dst, h);
    return dst;
  }
  function extend(dst) {
    return baseExtend(dst, slice.call(arguments, 1), false);
  }
  function merge(dst) {
    return baseExtend(dst, slice.call(arguments, 1), true);
  }
  function toInt(str) {
    return parseInt(str, 10);
  }
  function inherit(parent, extra) {
    return extend(Object.create(parent), extra);
  }
  function noop() {
  }
  noop.$inject = [];
  function identity($) {
    return $;
  }
  identity.$inject = [];
  function valueFn(value) {
    return function () {
      return value;
    };
  }
  function isUndefined(value) {
    return typeof value === 'undefined';
  }
  function isDefined(value) {
    return typeof value !== 'undefined';
  }
  function isObject(value) {
    return value !== null && typeof value === 'object';
  }
  function isBlankObject(value) {
    return value !== null && typeof value === 'object' && !getPrototypeOf(value);
  }
  function isString(value) {
    return typeof value === 'string';
  }
  function isNumber(value) {
    return typeof value === 'number';
  }
  function isDate(value) {
    return toString.call(value) === '[object Date]';
  }
  var isArray = Array.isArray;
  function isFunction(value) {
    return typeof value === 'function';
  }
  function isRegExp(value) {
    return toString.call(value) === '[object RegExp]';
  }
  function isWindow(obj) {
    return obj && obj.window === obj;
  }
  function isScope(obj) {
    return obj && obj.$evalAsync && obj.$watch;
  }
  function isFile(obj) {
    return toString.call(obj) === '[object File]';
  }
  function isFormData(obj) {
    return toString.call(obj) === '[object FormData]';
  }
  function isBlob(obj) {
    return toString.call(obj) === '[object Blob]';
  }
  function isBoolean(value) {
    return typeof value === 'boolean';
  }
  function isPromiseLike(obj) {
    return obj && isFunction(obj.then);
  }
  var TYPED_ARRAY_REGEXP = /^\[object (Uint8(Clamped)?)|(Uint16)|(Uint32)|(Int8)|(Int16)|(Int32)|(Float(32)|(64))Array\]$/;
  function isTypedArray(value) {
    return TYPED_ARRAY_REGEXP.test(toString.call(value));
  }
  var trim = function (value) {
    return isString(value) ? value.trim() : value;
  };
  var escapeForRegexp = function (s) {
    return s.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').replace(/\x08/g, '\\x08');
  };
  function isElement(node) {
    return !!(node && (node.nodeName || node.prop && node.attr && node.find));
  }
  function makeMap(str) {
    var obj = {}, items = str.split(','), i;
    for (i = 0; i < items.length; i++) {
      obj[items[i]] = true;
    }
    return obj;
  }
  function nodeName_(element) {
    return lowercase(element.nodeName || element[0] && element[0].nodeName);
  }
  function includes(array, obj) {
    return Array.prototype.indexOf.call(array, obj) != -1;
  }
  function arrayRemove(array, value) {
    var index = array.indexOf(value);
    if (index >= 0) {
      array.splice(index, 1);
    }
    return index;
  }
  function copy(source, destination, stackSource, stackDest) {
    if (isWindow(source) || isScope(source)) {
      throw ngMinErr('cpws', 'Can\'t copy! Making copies of Window or Scope instances is not supported.');
    }
    if (isTypedArray(destination)) {
      throw ngMinErr('cpta', 'Can\'t copy! TypedArray destination cannot be mutated.');
    }
    if (!destination) {
      destination = source;
      if (source) {
        if (isArray(source)) {
          destination = copy(source, [], stackSource, stackDest);
        } else if (isTypedArray(source)) {
          destination = new source.constructor(source);
        } else if (isDate(source)) {
          destination = new Date(source.getTime());
        } else if (isRegExp(source)) {
          destination = new RegExp(source.source, source.toString().match(/[^\/]*$/)[0]);
          destination.lastIndex = source.lastIndex;
        } else if (isObject(source)) {
          var emptyObject = Object.create(getPrototypeOf(source));
          destination = copy(source, emptyObject, stackSource, stackDest);
        }
      }
    } else {
      if (source === destination)
        throw ngMinErr('cpi', 'Can\'t copy! Source and destination are identical.');
      stackSource = stackSource || [];
      stackDest = stackDest || [];
      if (isObject(source)) {
        var index = stackSource.indexOf(source);
        if (index !== -1)
          return stackDest[index];
        stackSource.push(source);
        stackDest.push(destination);
      }
      var result, key;
      if (isArray(source)) {
        destination.length = 0;
        for (var i = 0; i < source.length; i++) {
          result = copy(source[i], null, stackSource, stackDest);
          if (isObject(source[i])) {
            stackSource.push(source[i]);
            stackDest.push(result);
          }
          destination.push(result);
        }
      } else {
        var h = destination.$$hashKey;
        if (isArray(destination)) {
          destination.length = 0;
        } else {
          forEach(destination, function (value, key) {
            delete destination[key];
          });
        }
        if (isBlankObject(source)) {
          for (key in source) {
            putValue(key, source[key], destination, stackSource, stackDest);
          }
        } else if (source && typeof source.hasOwnProperty === 'function') {
          for (key in source) {
            if (source.hasOwnProperty(key)) {
              putValue(key, source[key], destination, stackSource, stackDest);
            }
          }
        } else {
          for (key in source) {
            if (hasOwnProperty.call(source, key)) {
              putValue(key, source[key], destination, stackSource, stackDest);
            }
          }
        }
        setHashKey(destination, h);
      }
    }
    return destination;
    function putValue(key, val, destination, stackSource, stackDest) {
      var result = copy(val, null, stackSource, stackDest);
      if (isObject(val)) {
        stackSource.push(val);
        stackDest.push(result);
      }
      destination[key] = result;
    }
  }
  function shallowCopy(src, dst) {
    if (isArray(src)) {
      dst = dst || [];
      for (var i = 0, ii = src.length; i < ii; i++) {
        dst[i] = src[i];
      }
    } else if (isObject(src)) {
      dst = dst || {};
      for (var key in src) {
        if (!(key.charAt(0) === '$' && key.charAt(1) === '$')) {
          dst[key] = src[key];
        }
      }
    }
    return dst || src;
  }
  function equals(o1, o2) {
    if (o1 === o2)
      return true;
    if (o1 === null || o2 === null)
      return false;
    if (o1 !== o1 && o2 !== o2)
      return true;
    var t1 = typeof o1, t2 = typeof o2, length, key, keySet;
    if (t1 == t2) {
      if (t1 == 'object') {
        if (isArray(o1)) {
          if (!isArray(o2))
            return false;
          if ((length = o1.length) == o2.length) {
            for (key = 0; key < length; key++) {
              if (!equals(o1[key], o2[key]))
                return false;
            }
            return true;
          }
        } else if (isDate(o1)) {
          if (!isDate(o2))
            return false;
          return equals(o1.getTime(), o2.getTime());
        } else if (isRegExp(o1)) {
          return isRegExp(o2) ? o1.toString() == o2.toString() : false;
        } else {
          if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) || isArray(o2) || isDate(o2) || isRegExp(o2))
            return false;
          keySet = createMap();
          for (key in o1) {
            if (key.charAt(0) === '$' || isFunction(o1[key]))
              continue;
            if (!equals(o1[key], o2[key]))
              return false;
            keySet[key] = true;
          }
          for (key in o2) {
            if (!(key in keySet) && key.charAt(0) !== '$' && o2[key] !== undefined && !isFunction(o2[key]))
              return false;
          }
          return true;
        }
      }
    }
    return false;
  }
  var csp = function () {
    if (isDefined(csp.isActive_))
      return csp.isActive_;
    var active = !!(document.querySelector('[ng-csp]') || document.querySelector('[data-ng-csp]'));
    if (!active) {
      try {
        new Function('');
      } catch (e) {
        active = true;
      }
    }
    return csp.isActive_ = active;
  };
  var jq = function () {
    if (isDefined(jq.name_))
      return jq.name_;
    var el;
    var i, ii = ngAttrPrefixes.length, prefix, name;
    for (i = 0; i < ii; ++i) {
      prefix = ngAttrPrefixes[i];
      if (el = document.querySelector('[' + prefix.replace(':', '\\:') + 'jq]')) {
        name = el.getAttribute(prefix + 'jq');
        break;
      }
    }
    return jq.name_ = name;
  };
  function concat(array1, array2, index) {
    return array1.concat(slice.call(array2, index));
  }
  function sliceArgs(args, startIndex) {
    return slice.call(args, startIndex || 0);
  }
  function bind(self, fn) {
    var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
    if (isFunction(fn) && !(fn instanceof RegExp)) {
      return curryArgs.length ? function () {
        return arguments.length ? fn.apply(self, concat(curryArgs, arguments, 0)) : fn.apply(self, curryArgs);
      } : function () {
        return arguments.length ? fn.apply(self, arguments) : fn.call(self);
      };
    } else {
      return fn;
    }
  }
  function toJsonReplacer(key, value) {
    var val = value;
    if (typeof key === 'string' && key.charAt(0) === '$' && key.charAt(1) === '$') {
      val = undefined;
    } else if (isWindow(value)) {
      val = '$WINDOW';
    } else if (value && document === value) {
      val = '$DOCUMENT';
    } else if (isScope(value)) {
      val = '$SCOPE';
    }
    return val;
  }
  function toJson(obj, pretty) {
    if (typeof obj === 'undefined')
      return undefined;
    if (!isNumber(pretty)) {
      pretty = pretty ? 2 : null;
    }
    return JSON.stringify(obj, toJsonReplacer, pretty);
  }
  function fromJson(json) {
    return isString(json) ? JSON.parse(json) : json;
  }
  function timezoneToOffset(timezone, fallback) {
    var requestedTimezoneOffset = Date.parse('Jan 01, 1970 00:00:00 ' + timezone) / 60000;
    return isNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset;
  }
  function addDateMinutes(date, minutes) {
    date = new Date(date.getTime());
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  }
  function convertTimezoneToLocal(date, timezone, reverse) {
    reverse = reverse ? -1 : 1;
    var timezoneOffset = timezoneToOffset(timezone, date.getTimezoneOffset());
    return addDateMinutes(date, reverse * (timezoneOffset - date.getTimezoneOffset()));
  }
  function startingTag(element) {
    element = jqLite(element).clone();
    try {
      element.empty();
    } catch (e) {
    }
    var elemHtml = jqLite('<div>').append(element).html();
    try {
      return element[0].nodeType === NODE_TYPE_TEXT ? lowercase(elemHtml) : elemHtml.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/, function (match, nodeName) {
        return '<' + lowercase(nodeName);
      });
    } catch (e) {
      return lowercase(elemHtml);
    }
  }
  function tryDecodeURIComponent(value) {
    try {
      return decodeURIComponent(value);
    } catch (e) {
    }
  }
  function parseKeyValue(keyValue) {
    var obj = {}, key_value, key;
    forEach((keyValue || '').split('&'), function (keyValue) {
      if (keyValue) {
        key_value = keyValue.replace(/\+/g, '%20').split('=');
        key = tryDecodeURIComponent(key_value[0]);
        if (isDefined(key)) {
          var val = isDefined(key_value[1]) ? tryDecodeURIComponent(key_value[1]) : true;
          if (!hasOwnProperty.call(obj, key)) {
            obj[key] = val;
          } else if (isArray(obj[key])) {
            obj[key].push(val);
          } else {
            obj[key] = [
              obj[key],
              val
            ];
          }
        }
      }
    });
    return obj;
  }
  function toKeyValue(obj) {
    var parts = [];
    forEach(obj, function (value, key) {
      if (isArray(value)) {
        forEach(value, function (arrayValue) {
          parts.push(encodeUriQuery(key, true) + (arrayValue === true ? '' : '=' + encodeUriQuery(arrayValue, true)));
        });
      } else {
        parts.push(encodeUriQuery(key, true) + (value === true ? '' : '=' + encodeUriQuery(value, true)));
      }
    });
    return parts.length ? parts.join('&') : '';
  }
  function encodeUriSegment(val) {
    return encodeUriQuery(val, true).replace(/%26/gi, '&').replace(/%3D/gi, '=').replace(/%2B/gi, '+');
  }
  function encodeUriQuery(val, pctEncodeSpaces) {
    return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%3B/gi, ';').replace(/%20/g, pctEncodeSpaces ? '%20' : '+');
  }
  var ngAttrPrefixes = [
      'ng-',
      'data-ng-',
      'ng:',
      'x-ng-'
    ];
  function getNgAttribute(element, ngAttr) {
    var attr, i, ii = ngAttrPrefixes.length;
    for (i = 0; i < ii; ++i) {
      attr = ngAttrPrefixes[i] + ngAttr;
      if (isString(attr = element.getAttribute(attr))) {
        return attr;
      }
    }
    return null;
  }
  function angularInit(element, bootstrap) {
    var appElement, module, config = {};
    forEach(ngAttrPrefixes, function (prefix) {
      var name = prefix + 'app';
      if (!appElement && element.hasAttribute && element.hasAttribute(name)) {
        appElement = element;
        module = element.getAttribute(name);
      }
    });
    forEach(ngAttrPrefixes, function (prefix) {
      var name = prefix + 'app';
      var candidate;
      if (!appElement && (candidate = element.querySelector('[' + name.replace(':', '\\:') + ']'))) {
        appElement = candidate;
        module = candidate.getAttribute(name);
      }
    });
    if (appElement) {
      config.strictDi = getNgAttribute(appElement, 'strict-di') !== null;
      bootstrap(appElement, module ? [module] : [], config);
    }
  }
  function bootstrap(element, modules, config) {
    if (!isObject(config))
      config = {};
    var defaultConfig = { strictDi: false };
    config = extend(defaultConfig, config);
    var doBootstrap = function () {
      element = jqLite(element);
      if (element.injector()) {
        var tag = element[0] === document ? 'document' : startingTag(element);
        throw ngMinErr('btstrpd', 'App Already Bootstrapped with this Element \'{0}\'', tag.replace(/</, '&lt;').replace(/>/, '&gt;'));
      }
      modules = modules || [];
      modules.unshift([
        '$provide',
        function ($provide) {
          $provide.value('$rootElement', element);
        }
      ]);
      if (config.debugInfoEnabled) {
        modules.push([
          '$compileProvider',
          function ($compileProvider) {
            $compileProvider.debugInfoEnabled(true);
          }
        ]);
      }
      modules.unshift('ng');
      var injector = createInjector(modules, config.strictDi);
      injector.invoke([
        '$rootScope',
        '$rootElement',
        '$compile',
        '$injector',
        function bootstrapApply(scope, element, compile, injector) {
          scope.$apply(function () {
            element.data('$injector', injector);
            compile(element)(scope);
          });
        }
      ]);
      return injector;
    };
    var NG_ENABLE_DEBUG_INFO = /^NG_ENABLE_DEBUG_INFO!/;
    var NG_DEFER_BOOTSTRAP = /^NG_DEFER_BOOTSTRAP!/;
    if (window && NG_ENABLE_DEBUG_INFO.test(window.name)) {
      config.debugInfoEnabled = true;
      window.name = window.name.replace(NG_ENABLE_DEBUG_INFO, '');
    }
    if (window && !NG_DEFER_BOOTSTRAP.test(window.name)) {
      return doBootstrap();
    }
    window.name = window.name.replace(NG_DEFER_BOOTSTRAP, '');
    angular.resumeBootstrap = function (extraModules) {
      forEach(extraModules, function (module) {
        modules.push(module);
      });
      return doBootstrap();
    };
    if (isFunction(angular.resumeDeferredBootstrap)) {
      angular.resumeDeferredBootstrap();
    }
  }
  function reloadWithDebugInfo() {
    window.name = 'NG_ENABLE_DEBUG_INFO!' + window.name;
    window.location.reload();
  }
  function getTestability(rootElement) {
    var injector = angular.element(rootElement).injector();
    if (!injector) {
      throw ngMinErr('test', 'no injector found for element argument to getTestability');
    }
    return injector.get('$$testability');
  }
  var SNAKE_CASE_REGEXP = /[A-Z]/g;
  function snake_case(name, separator) {
    separator = separator || '_';
    return name.replace(SNAKE_CASE_REGEXP, function (letter, pos) {
      return (pos ? separator : '') + letter.toLowerCase();
    });
  }
  var bindJQueryFired = false;
  var skipDestroyOnNextJQueryCleanData;
  function bindJQuery() {
    var originalCleanData;
    if (bindJQueryFired) {
      return;
    }
    var jqName = jq();
    jQuery = window.jQuery;
    if (isDefined(jqName)) {
      jQuery = jqName === null ? undefined : window[jqName];
    }
    if (jQuery && jQuery.fn.on) {
      jqLite = jQuery;
      extend(jQuery.fn, {
        scope: JQLitePrototype.scope,
        isolateScope: JQLitePrototype.isolateScope,
        controller: JQLitePrototype.controller,
        injector: JQLitePrototype.injector,
        inheritedData: JQLitePrototype.inheritedData
      });
      originalCleanData = jQuery.cleanData;
      jQuery.cleanData = function (elems) {
        var events;
        if (!skipDestroyOnNextJQueryCleanData) {
          for (var i = 0, elem; (elem = elems[i]) != null; i++) {
            events = jQuery._data(elem, 'events');
            if (events && events.$destroy) {
              jQuery(elem).triggerHandler('$destroy');
            }
          }
        } else {
          skipDestroyOnNextJQueryCleanData = false;
        }
        originalCleanData(elems);
      };
    } else {
      jqLite = JQLite;
    }
    angular.element = jqLite;
    bindJQueryFired = true;
  }
  function assertArg(arg, name, reason) {
    if (!arg) {
      throw ngMinErr('areq', 'Argument \'{0}\' is {1}', name || '?', reason || 'required');
    }
    return arg;
  }
  function assertArgFn(arg, name, acceptArrayAnnotation) {
    if (acceptArrayAnnotation && isArray(arg)) {
      arg = arg[arg.length - 1];
    }
    assertArg(isFunction(arg), name, 'not a function, got ' + (arg && typeof arg === 'object' ? arg.constructor.name || 'Object' : typeof arg));
    return arg;
  }
  function assertNotHasOwnProperty(name, context) {
    if (name === 'hasOwnProperty') {
      throw ngMinErr('badname', 'hasOwnProperty is not a valid {0} name', context);
    }
  }
  function getter(obj, path, bindFnToScope) {
    if (!path)
      return obj;
    var keys = path.split('.');
    var key;
    var lastInstance = obj;
    var len = keys.length;
    for (var i = 0; i < len; i++) {
      key = keys[i];
      if (obj) {
        obj = (lastInstance = obj)[key];
      }
    }
    if (!bindFnToScope && isFunction(obj)) {
      return bind(lastInstance, obj);
    }
    return obj;
  }
  function getBlockNodes(nodes) {
    var node = nodes[0];
    var endNode = nodes[nodes.length - 1];
    var blockNodes = [node];
    do {
      node = node.nextSibling;
      if (!node)
        break;
      blockNodes.push(node);
    } while (node !== endNode);
    return jqLite(blockNodes);
  }
  function createMap() {
    return Object.create(null);
  }
  var NODE_TYPE_ELEMENT = 1;
  var NODE_TYPE_ATTRIBUTE = 2;
  var NODE_TYPE_TEXT = 3;
  var NODE_TYPE_COMMENT = 8;
  var NODE_TYPE_DOCUMENT = 9;
  var NODE_TYPE_DOCUMENT_FRAGMENT = 11;
  function setupModuleLoader(window) {
    var $injectorMinErr = minErr('$injector');
    var ngMinErr = minErr('ng');
    function ensure(obj, name, factory) {
      return obj[name] || (obj[name] = factory());
    }
    var angular = ensure(window, 'angular', Object);
    angular.$$minErr = angular.$$minErr || minErr;
    return ensure(angular, 'module', function () {
      var modules = {};
      return function module(name, requires, configFn) {
        var assertNotHasOwnProperty = function (name, context) {
          if (name === 'hasOwnProperty') {
            throw ngMinErr('badname', 'hasOwnProperty is not a valid {0} name', context);
          }
        };
        assertNotHasOwnProperty(name, 'module');
        if (requires && modules.hasOwnProperty(name)) {
          modules[name] = null;
        }
        return ensure(modules, name, function () {
          if (!requires) {
            throw $injectorMinErr('nomod', 'Module \'{0}\' is not available! You either misspelled ' + 'the module name or forgot to load it. If registering a module ensure that you ' + 'specify the dependencies as the second argument.', name);
          }
          var invokeQueue = [];
          var configBlocks = [];
          var runBlocks = [];
          var config = invokeLater('$injector', 'invoke', 'push', configBlocks);
          var moduleInstance = {
              _invokeQueue: invokeQueue,
              _configBlocks: configBlocks,
              _runBlocks: runBlocks,
              requires: requires,
              name: name,
              provider: invokeLater('$provide', 'provider'),
              factory: invokeLater('$provide', 'factory'),
              service: invokeLater('$provide', 'service'),
              value: invokeLater('$provide', 'value'),
              constant: invokeLater('$provide', 'constant', 'unshift'),
              decorator: invokeLater('$provide', 'decorator'),
              animation: invokeLater('$animateProvider', 'register'),
              filter: invokeLater('$filterProvider', 'register'),
              controller: invokeLater('$controllerProvider', 'register'),
              directive: invokeLater('$compileProvider', 'directive'),
              config: config,
              run: function (block) {
                runBlocks.push(block);
                return this;
              }
            };
          if (configFn) {
            config(configFn);
          }
          return moduleInstance;
          function invokeLater(provider, method, insertMethod, queue) {
            if (!queue)
              queue = invokeQueue;
            return function () {
              queue[insertMethod || 'push']([
                provider,
                method,
                arguments
              ]);
              return moduleInstance;
            };
          }
        });
      };
    });
  }
  function serializeObject(obj) {
    var seen = [];
    return JSON.stringify(obj, function (key, val) {
      val = toJsonReplacer(key, val);
      if (isObject(val)) {
        if (seen.indexOf(val) >= 0)
          return '<<already seen>>';
        seen.push(val);
      }
      return val;
    });
  }
  function toDebugString(obj) {
    if (typeof obj === 'function') {
      return obj.toString().replace(/ \{[\s\S]*$/, '');
    } else if (typeof obj === 'undefined') {
      return 'undefined';
    } else if (typeof obj !== 'string') {
      return serializeObject(obj);
    }
    return obj;
  }
  var version = {
      full: '1.4.0',
      major: 1,
      minor: 4,
      dot: 0,
      codeName: 'jaracimrman-existence'
    };
  function publishExternalAPI(angular) {
    extend(angular, {
      'bootstrap': bootstrap,
      'copy': copy,
      'extend': extend,
      'merge': merge,
      'equals': equals,
      'element': jqLite,
      'forEach': forEach,
      'injector': createInjector,
      'noop': noop,
      'bind': bind,
      'toJson': toJson,
      'fromJson': fromJson,
      'identity': identity,
      'isUndefined': isUndefined,
      'isDefined': isDefined,
      'isString': isString,
      'isFunction': isFunction,
      'isObject': isObject,
      'isNumber': isNumber,
      'isElement': isElement,
      'isArray': isArray,
      'version': version,
      'isDate': isDate,
      'lowercase': lowercase,
      'uppercase': uppercase,
      'callbacks': { counter: 0 },
      'getTestability': getTestability,
      '$$minErr': minErr,
      '$$csp': csp,
      'reloadWithDebugInfo': reloadWithDebugInfo
    });
    angularModule = setupModuleLoader(window);
    try {
      angularModule('ngLocale');
    } catch (e) {
      angularModule('ngLocale', []).provider('$locale', $LocaleProvider);
    }
    angularModule('ng', ['ngLocale'], [
      '$provide',
      function ngModule($provide) {
        $provide.provider({ $$sanitizeUri: $$SanitizeUriProvider });
        $provide.provider('$compile', $CompileProvider).directive({
          a: htmlAnchorDirective,
          input: inputDirective,
          textarea: inputDirective,
          form: formDirective,
          script: scriptDirective,
          select: selectDirective,
          style: styleDirective,
          option: optionDirective,
          ngBind: ngBindDirective,
          ngBindHtml: ngBindHtmlDirective,
          ngBindTemplate: ngBindTemplateDirective,
          ngClass: ngClassDirective,
          ngClassEven: ngClassEvenDirective,
          ngClassOdd: ngClassOddDirective,
          ngCloak: ngCloakDirective,
          ngController: ngControllerDirective,
          ngForm: ngFormDirective,
          ngHide: ngHideDirective,
          ngIf: ngIfDirective,
          ngInclude: ngIncludeDirective,
          ngInit: ngInitDirective,
          ngNonBindable: ngNonBindableDirective,
          ngPluralize: ngPluralizeDirective,
          ngRepeat: ngRepeatDirective,
          ngShow: ngShowDirective,
          ngStyle: ngStyleDirective,
          ngSwitch: ngSwitchDirective,
          ngSwitchWhen: ngSwitchWhenDirective,
          ngSwitchDefault: ngSwitchDefaultDirective,
          ngOptions: ngOptionsDirective,
          ngTransclude: ngTranscludeDirective,
          ngModel: ngModelDirective,
          ngList: ngListDirective,
          ngChange: ngChangeDirective,
          pattern: patternDirective,
          ngPattern: patternDirective,
          required: requiredDirective,
          ngRequired: requiredDirective,
          minlength: minlengthDirective,
          ngMinlength: minlengthDirective,
          maxlength: maxlengthDirective,
          ngMaxlength: maxlengthDirective,
          ngValue: ngValueDirective,
          ngModelOptions: ngModelOptionsDirective
        }).directive({ ngInclude: ngIncludeFillContentDirective }).directive(ngAttributeAliasDirectives).directive(ngEventDirectives);
        $provide.provider({
          $anchorScroll: $AnchorScrollProvider,
          $animate: $AnimateProvider,
          $$animateQueue: $$CoreAnimateQueueProvider,
          $$AnimateRunner: $$CoreAnimateRunnerProvider,
          $browser: $BrowserProvider,
          $cacheFactory: $CacheFactoryProvider,
          $controller: $ControllerProvider,
          $document: $DocumentProvider,
          $exceptionHandler: $ExceptionHandlerProvider,
          $filter: $FilterProvider,
          $interpolate: $InterpolateProvider,
          $interval: $IntervalProvider,
          $http: $HttpProvider,
          $httpParamSerializer: $HttpParamSerializerProvider,
          $httpParamSerializerJQLike: $HttpParamSerializerJQLikeProvider,
          $httpBackend: $HttpBackendProvider,
          $location: $LocationProvider,
          $log: $LogProvider,
          $parse: $ParseProvider,
          $rootScope: $RootScopeProvider,
          $q: $QProvider,
          $$q: $$QProvider,
          $sce: $SceProvider,
          $sceDelegate: $SceDelegateProvider,
          $sniffer: $SnifferProvider,
          $templateCache: $TemplateCacheProvider,
          $templateRequest: $TemplateRequestProvider,
          $$testability: $$TestabilityProvider,
          $timeout: $TimeoutProvider,
          $window: $WindowProvider,
          $$rAF: $$RAFProvider,
          $$asyncCallback: $$AsyncCallbackProvider,
          $$jqLite: $$jqLiteProvider,
          $$HashMap: $$HashMapProvider,
          $$cookieReader: $$CookieReaderProvider
        });
      }
    ]);
  }
  JQLite.expando = 'ng339';
  var jqCache = JQLite.cache = {}, jqId = 1, addEventListenerFn = function (element, type, fn) {
      element.addEventListener(type, fn, false);
    }, removeEventListenerFn = function (element, type, fn) {
      element.removeEventListener(type, fn, false);
    };
  JQLite._data = function (node) {
    return this.cache[node[this.expando]] || {};
  };
  function jqNextId() {
    return ++jqId;
  }
  var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
  var MOZ_HACK_REGEXP = /^moz([A-Z])/;
  var MOUSE_EVENT_MAP = {
      mouseleave: 'mouseout',
      mouseenter: 'mouseover'
    };
  var jqLiteMinErr = minErr('jqLite');
  function camelCase(name) {
    return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    }).replace(MOZ_HACK_REGEXP, 'Moz$1');
  }
  var SINGLE_TAG_REGEXP = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
  var HTML_REGEXP = /<|&#?\w+;/;
  var TAG_NAME_REGEXP = /<([\w:]+)/;
  var XHTML_TAG_REGEXP = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
  var wrapMap = {
      'option': [
        1,
        '<select multiple="multiple">',
        '</select>'
      ],
      'thead': [
        1,
        '<table>',
        '</table>'
      ],
      'col': [
        2,
        '<table><colgroup>',
        '</colgroup></table>'
      ],
      'tr': [
        2,
        '<table><tbody>',
        '</tbody></table>'
      ],
      'td': [
        3,
        '<table><tbody><tr>',
        '</tr></tbody></table>'
      ],
      '_default': [
        0,
        '',
        ''
      ]
    };
  wrapMap.optgroup = wrapMap.option;
  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
  wrapMap.th = wrapMap.td;
  function jqLiteIsTextNode(html) {
    return !HTML_REGEXP.test(html);
  }
  function jqLiteAcceptsData(node) {
    var nodeType = node.nodeType;
    return nodeType === NODE_TYPE_ELEMENT || !nodeType || nodeType === NODE_TYPE_DOCUMENT;
  }
  function jqLiteBuildFragment(html, context) {
    var tmp, tag, wrap, fragment = context.createDocumentFragment(), nodes = [], i;
    if (jqLiteIsTextNode(html)) {
      nodes.push(context.createTextNode(html));
    } else {
      tmp = tmp || fragment.appendChild(context.createElement('div'));
      tag = (TAG_NAME_REGEXP.exec(html) || [
        '',
        ''
      ])[1].toLowerCase();
      wrap = wrapMap[tag] || wrapMap._default;
      tmp.innerHTML = wrap[1] + html.replace(XHTML_TAG_REGEXP, '<$1></$2>') + wrap[2];
      i = wrap[0];
      while (i--) {
        tmp = tmp.lastChild;
      }
      nodes = concat(nodes, tmp.childNodes);
      tmp = fragment.firstChild;
      tmp.textContent = '';
    }
    fragment.textContent = '';
    fragment.innerHTML = '';
    forEach(nodes, function (node) {
      fragment.appendChild(node);
    });
    return fragment;
  }
  function jqLiteParseHTML(html, context) {
    context = context || document;
    var parsed;
    if (parsed = SINGLE_TAG_REGEXP.exec(html)) {
      return [context.createElement(parsed[1])];
    }
    if (parsed = jqLiteBuildFragment(html, context)) {
      return parsed.childNodes;
    }
    return [];
  }
  function JQLite(element) {
    if (element instanceof JQLite) {
      return element;
    }
    var argIsString;
    if (isString(element)) {
      element = trim(element);
      argIsString = true;
    }
    if (!(this instanceof JQLite)) {
      if (argIsString && element.charAt(0) != '<') {
        throw jqLiteMinErr('nosel', 'Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element');
      }
      return new JQLite(element);
    }
    if (argIsString) {
      jqLiteAddNodes(this, jqLiteParseHTML(element));
    } else {
      jqLiteAddNodes(this, element);
    }
  }
  function jqLiteClone(element) {
    return element.cloneNode(true);
  }
  function jqLiteDealoc(element, onlyDescendants) {
    if (!onlyDescendants)
      jqLiteRemoveData(element);
    if (element.querySelectorAll) {
      var descendants = element.querySelectorAll('*');
      for (var i = 0, l = descendants.length; i < l; i++) {
        jqLiteRemoveData(descendants[i]);
      }
    }
  }
  function jqLiteOff(element, type, fn, unsupported) {
    if (isDefined(unsupported))
      throw jqLiteMinErr('offargs', 'jqLite#off() does not support the `selector` argument');
    var expandoStore = jqLiteExpandoStore(element);
    var events = expandoStore && expandoStore.events;
    var handle = expandoStore && expandoStore.handle;
    if (!handle)
      return;
    if (!type) {
      for (type in events) {
        if (type !== '$destroy') {
          removeEventListenerFn(element, type, handle);
        }
        delete events[type];
      }
    } else {
      forEach(type.split(' '), function (type) {
        if (isDefined(fn)) {
          var listenerFns = events[type];
          arrayRemove(listenerFns || [], fn);
          if (listenerFns && listenerFns.length > 0) {
            return;
          }
        }
        removeEventListenerFn(element, type, handle);
        delete events[type];
      });
    }
  }
  function jqLiteRemoveData(element, name) {
    var expandoId = element.ng339;
    var expandoStore = expandoId && jqCache[expandoId];
    if (expandoStore) {
      if (name) {
        delete expandoStore.data[name];
        return;
      }
      if (expandoStore.handle) {
        if (expandoStore.events.$destroy) {
          expandoStore.handle({}, '$destroy');
        }
        jqLiteOff(element);
      }
      delete jqCache[expandoId];
      element.ng339 = undefined;
    }
  }
  function jqLiteExpandoStore(element, createIfNecessary) {
    var expandoId = element.ng339, expandoStore = expandoId && jqCache[expandoId];
    if (createIfNecessary && !expandoStore) {
      element.ng339 = expandoId = jqNextId();
      expandoStore = jqCache[expandoId] = {
        events: {},
        data: {},
        handle: undefined
      };
    }
    return expandoStore;
  }
  function jqLiteData(element, key, value) {
    if (jqLiteAcceptsData(element)) {
      var isSimpleSetter = isDefined(value);
      var isSimpleGetter = !isSimpleSetter && key && !isObject(key);
      var massGetter = !key;
      var expandoStore = jqLiteExpandoStore(element, !isSimpleGetter);
      var data = expandoStore && expandoStore.data;
      if (isSimpleSetter) {
        data[key] = value;
      } else {
        if (massGetter) {
          return data;
        } else {
          if (isSimpleGetter) {
            return data && data[key];
          } else {
            extend(data, key);
          }
        }
      }
    }
  }
  function jqLiteHasClass(element, selector) {
    if (!element.getAttribute)
      return false;
    return (' ' + (element.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ').indexOf(' ' + selector + ' ') > -1;
  }
  function jqLiteRemoveClass(element, cssClasses) {
    if (cssClasses && element.setAttribute) {
      forEach(cssClasses.split(' '), function (cssClass) {
        element.setAttribute('class', trim((' ' + (element.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ').replace(' ' + trim(cssClass) + ' ', ' ')));
      });
    }
  }
  function jqLiteAddClass(element, cssClasses) {
    if (cssClasses && element.setAttribute) {
      var existingClasses = (' ' + (element.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ');
      forEach(cssClasses.split(' '), function (cssClass) {
        cssClass = trim(cssClass);
        if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
          existingClasses += cssClass + ' ';
        }
      });
      element.setAttribute('class', trim(existingClasses));
    }
  }
  function jqLiteAddNodes(root, elements) {
    if (elements) {
      if (elements.nodeType) {
        root[root.length++] = elements;
      } else {
        var length = elements.length;
        if (typeof length === 'number' && elements.window !== elements) {
          if (length) {
            for (var i = 0; i < length; i++) {
              root[root.length++] = elements[i];
            }
          }
        } else {
          root[root.length++] = elements;
        }
      }
    }
  }
  function jqLiteController(element, name) {
    return jqLiteInheritedData(element, '$' + (name || 'ngController') + 'Controller');
  }
  function jqLiteInheritedData(element, name, value) {
    if (element.nodeType == NODE_TYPE_DOCUMENT) {
      element = element.documentElement;
    }
    var names = isArray(name) ? name : [name];
    while (element) {
      for (var i = 0, ii = names.length; i < ii; i++) {
        if ((value = jqLite.data(element, names[i])) !== undefined)
          return value;
      }
      element = element.parentNode || element.nodeType === NODE_TYPE_DOCUMENT_FRAGMENT && element.host;
    }
  }
  function jqLiteEmpty(element) {
    jqLiteDealoc(element, true);
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
  function jqLiteRemove(element, keepData) {
    if (!keepData)
      jqLiteDealoc(element);
    var parent = element.parentNode;
    if (parent)
      parent.removeChild(element);
  }
  function jqLiteDocumentLoaded(action, win) {
    win = win || window;
    if (win.document.readyState === 'complete') {
      win.setTimeout(action);
    } else {
      jqLite(win).on('load', action);
    }
  }
  var JQLitePrototype = JQLite.prototype = {
      ready: function (fn) {
        var fired = false;
        function trigger() {
          if (fired)
            return;
          fired = true;
          fn();
        }
        if (document.readyState === 'complete') {
          setTimeout(trigger);
        } else {
          this.on('DOMContentLoaded', trigger);
          JQLite(window).on('load', trigger);
        }
      },
      toString: function () {
        var value = [];
        forEach(this, function (e) {
          value.push('' + e);
        });
        return '[' + value.join(', ') + ']';
      },
      eq: function (index) {
        return index >= 0 ? jqLite(this[index]) : jqLite(this[this.length + index]);
      },
      length: 0,
      push: push,
      sort: [].sort,
      splice: [].splice
    };
  var BOOLEAN_ATTR = {};
  forEach('multiple,selected,checked,disabled,readOnly,required,open'.split(','), function (value) {
    BOOLEAN_ATTR[lowercase(value)] = value;
  });
  var BOOLEAN_ELEMENTS = {};
  forEach('input,select,option,textarea,button,form,details'.split(','), function (value) {
    BOOLEAN_ELEMENTS[value] = true;
  });
  var ALIASED_ATTR = {
      'ngMinlength': 'minlength',
      'ngMaxlength': 'maxlength',
      'ngMin': 'min',
      'ngMax': 'max',
      'ngPattern': 'pattern'
    };
  function getBooleanAttrName(element, name) {
    var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];
    return booleanAttr && BOOLEAN_ELEMENTS[nodeName_(element)] && booleanAttr;
  }
  function getAliasedAttrName(element, name) {
    var nodeName = element.nodeName;
    return (nodeName === 'INPUT' || nodeName === 'TEXTAREA') && ALIASED_ATTR[name];
  }
  forEach({
    data: jqLiteData,
    removeData: jqLiteRemoveData
  }, function (fn, name) {
    JQLite[name] = fn;
  });
  forEach({
    data: jqLiteData,
    inheritedData: jqLiteInheritedData,
    scope: function (element) {
      return jqLite.data(element, '$scope') || jqLiteInheritedData(element.parentNode || element, [
        '$isolateScope',
        '$scope'
      ]);
    },
    isolateScope: function (element) {
      return jqLite.data(element, '$isolateScope') || jqLite.data(element, '$isolateScopeNoTemplate');
    },
    controller: jqLiteController,
    injector: function (element) {
      return jqLiteInheritedData(element, '$injector');
    },
    removeAttr: function (element, name) {
      element.removeAttribute(name);
    },
    hasClass: jqLiteHasClass,
    css: function (element, name, value) {
      name = camelCase(name);
      if (isDefined(value)) {
        element.style[name] = value;
      } else {
        return element.style[name];
      }
    },
    attr: function (element, name, value) {
      var nodeType = element.nodeType;
      if (nodeType === NODE_TYPE_TEXT || nodeType === NODE_TYPE_ATTRIBUTE || nodeType === NODE_TYPE_COMMENT) {
        return;
      }
      var lowercasedName = lowercase(name);
      if (BOOLEAN_ATTR[lowercasedName]) {
        if (isDefined(value)) {
          if (!!value) {
            element[name] = true;
            element.setAttribute(name, lowercasedName);
          } else {
            element[name] = false;
            element.removeAttribute(lowercasedName);
          }
        } else {
          return element[name] || (element.attributes.getNamedItem(name) || noop).specified ? lowercasedName : undefined;
        }
      } else if (isDefined(value)) {
        element.setAttribute(name, value);
      } else if (element.getAttribute) {
        var ret = element.getAttribute(name, 2);
        return ret === null ? undefined : ret;
      }
    },
    prop: function (element, name, value) {
      if (isDefined(value)) {
        element[name] = value;
      } else {
        return element[name];
      }
    },
    text: function () {
      getText.$dv = '';
      return getText;
      function getText(element, value) {
        if (isUndefined(value)) {
          var nodeType = element.nodeType;
          return nodeType === NODE_TYPE_ELEMENT || nodeType === NODE_TYPE_TEXT ? element.textContent : '';
        }
        element.textContent = value;
      }
    }(),
    val: function (element, value) {
      if (isUndefined(value)) {
        if (element.multiple && nodeName_(element) === 'select') {
          var result = [];
          forEach(element.options, function (option) {
            if (option.selected) {
              result.push(option.value || option.text);
            }
          });
          return result.length === 0 ? null : result;
        }
        return element.value;
      }
      element.value = value;
    },
    html: function (element, value) {
      if (isUndefined(value)) {
        return element.innerHTML;
      }
      jqLiteDealoc(element, true);
      element.innerHTML = value;
    },
    empty: jqLiteEmpty
  }, function (fn, name) {
    JQLite.prototype[name] = function (arg1, arg2) {
      var i, key;
      var nodeCount = this.length;
      if (fn !== jqLiteEmpty && (fn.length == 2 && (fn !== jqLiteHasClass && fn !== jqLiteController) ? arg1 : arg2) === undefined) {
        if (isObject(arg1)) {
          for (i = 0; i < nodeCount; i++) {
            if (fn === jqLiteData) {
              fn(this[i], arg1);
            } else {
              for (key in arg1) {
                fn(this[i], key, arg1[key]);
              }
            }
          }
          return this;
        } else {
          var value = fn.$dv;
          var jj = value === undefined ? Math.min(nodeCount, 1) : nodeCount;
          for (var j = 0; j < jj; j++) {
            var nodeValue = fn(this[j], arg1, arg2);
            value = value ? value + nodeValue : nodeValue;
          }
          return value;
        }
      } else {
        for (i = 0; i < nodeCount; i++) {
          fn(this[i], arg1, arg2);
        }
        return this;
      }
    };
  });
  function createEventHandler(element, events) {
    var eventHandler = function (event, type) {
      event.isDefaultPrevented = function () {
        return event.defaultPrevented;
      };
      var eventFns = events[type || event.type];
      var eventFnsLength = eventFns ? eventFns.length : 0;
      if (!eventFnsLength)
        return;
      if (isUndefined(event.immediatePropagationStopped)) {
        var originalStopImmediatePropagation = event.stopImmediatePropagation;
        event.stopImmediatePropagation = function () {
          event.immediatePropagationStopped = true;
          if (event.stopPropagation) {
            event.stopPropagation();
          }
          if (originalStopImmediatePropagation) {
            originalStopImmediatePropagation.call(event);
          }
        };
      }
      event.isImmediatePropagationStopped = function () {
        return event.immediatePropagationStopped === true;
      };
      if (eventFnsLength > 1) {
        eventFns = shallowCopy(eventFns);
      }
      for (var i = 0; i < eventFnsLength; i++) {
        if (!event.isImmediatePropagationStopped()) {
          eventFns[i].call(element, event);
        }
      }
    };
    eventHandler.elem = element;
    return eventHandler;
  }
  forEach({
    removeData: jqLiteRemoveData,
    on: function jqLiteOn(element, type, fn, unsupported) {
      if (isDefined(unsupported))
        throw jqLiteMinErr('onargs', 'jqLite#on() does not support the `selector` or `eventData` parameters');
      if (!jqLiteAcceptsData(element)) {
        return;
      }
      var expandoStore = jqLiteExpandoStore(element, true);
      var events = expandoStore.events;
      var handle = expandoStore.handle;
      if (!handle) {
        handle = expandoStore.handle = createEventHandler(element, events);
      }
      var types = type.indexOf(' ') >= 0 ? type.split(' ') : [type];
      var i = types.length;
      while (i--) {
        type = types[i];
        var eventFns = events[type];
        if (!eventFns) {
          events[type] = [];
          if (type === 'mouseenter' || type === 'mouseleave') {
            jqLiteOn(element, MOUSE_EVENT_MAP[type], function (event) {
              var target = this, related = event.relatedTarget;
              if (!related || related !== target && !target.contains(related)) {
                handle(event, type);
              }
            });
          } else {
            if (type !== '$destroy') {
              addEventListenerFn(element, type, handle);
            }
          }
          eventFns = events[type];
        }
        eventFns.push(fn);
      }
    },
    off: jqLiteOff,
    one: function (element, type, fn) {
      element = jqLite(element);
      element.on(type, function onFn() {
        element.off(type, fn);
        element.off(type, onFn);
      });
      element.on(type, fn);
    },
    replaceWith: function (element, replaceNode) {
      var index, parent = element.parentNode;
      jqLiteDealoc(element);
      forEach(new JQLite(replaceNode), function (node) {
        if (index) {
          parent.insertBefore(node, index.nextSibling);
        } else {
          parent.replaceChild(node, element);
        }
        index = node;
      });
    },
    children: function (element) {
      var children = [];
      forEach(element.childNodes, function (element) {
        if (element.nodeType === NODE_TYPE_ELEMENT) {
          children.push(element);
        }
      });
      return children;
    },
    contents: function (element) {
      return element.contentDocument || element.childNodes || [];
    },
    append: function (element, node) {
      var nodeType = element.nodeType;
      if (nodeType !== NODE_TYPE_ELEMENT && nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT)
        return;
      node = new JQLite(node);
      for (var i = 0, ii = node.length; i < ii; i++) {
        var child = node[i];
        element.appendChild(child);
      }
    },
    prepend: function (element, node) {
      if (element.nodeType === NODE_TYPE_ELEMENT) {
        var index = element.firstChild;
        forEach(new JQLite(node), function (child) {
          element.insertBefore(child, index);
        });
      }
    },
    wrap: function (element, wrapNode) {
      wrapNode = jqLite(wrapNode).eq(0).clone()[0];
      var parent = element.parentNode;
      if (parent) {
        parent.replaceChild(wrapNode, element);
      }
      wrapNode.appendChild(element);
    },
    remove: jqLiteRemove,
    detach: function (element) {
      jqLiteRemove(element, true);
    },
    after: function (element, newElement) {
      var index = element, parent = element.parentNode;
      newElement = new JQLite(newElement);
      for (var i = 0, ii = newElement.length; i < ii; i++) {
        var node = newElement[i];
        parent.insertBefore(node, index.nextSibling);
        index = node;
      }
    },
    addClass: jqLiteAddClass,
    removeClass: jqLiteRemoveClass,
    toggleClass: function (element, selector, condition) {
      if (selector) {
        forEach(selector.split(' '), function (className) {
          var classCondition = condition;
          if (isUndefined(classCondition)) {
            classCondition = !jqLiteHasClass(element, className);
          }
          (classCondition ? jqLiteAddClass : jqLiteRemoveClass)(element, className);
        });
      }
    },
    parent: function (element) {
      var parent = element.parentNode;
      return parent && parent.nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT ? parent : null;
    },
    next: function (element) {
      return element.nextElementSibling;
    },
    find: function (element, selector) {
      if (element.getElementsByTagName) {
        return element.getElementsByTagName(selector);
      } else {
        return [];
      }
    },
    clone: jqLiteClone,
    triggerHandler: function (element, event, extraParameters) {
      var dummyEvent, eventFnsCopy, handlerArgs;
      var eventName = event.type || event;
      var expandoStore = jqLiteExpandoStore(element);
      var events = expandoStore && expandoStore.events;
      var eventFns = events && events[eventName];
      if (eventFns) {
        dummyEvent = {
          preventDefault: function () {
            this.defaultPrevented = true;
          },
          isDefaultPrevented: function () {
            return this.defaultPrevented === true;
          },
          stopImmediatePropagation: function () {
            this.immediatePropagationStopped = true;
          },
          isImmediatePropagationStopped: function () {
            return this.immediatePropagationStopped === true;
          },
          stopPropagation: noop,
          type: eventName,
          target: element
        };
        if (event.type) {
          dummyEvent = extend(dummyEvent, event);
        }
        eventFnsCopy = shallowCopy(eventFns);
        handlerArgs = extraParameters ? [dummyEvent].concat(extraParameters) : [dummyEvent];
        forEach(eventFnsCopy, function (fn) {
          if (!dummyEvent.isImmediatePropagationStopped()) {
            fn.apply(element, handlerArgs);
          }
        });
      }
    }
  }, function (fn, name) {
    JQLite.prototype[name] = function (arg1, arg2, arg3) {
      var value;
      for (var i = 0, ii = this.length; i < ii; i++) {
        if (isUndefined(value)) {
          value = fn(this[i], arg1, arg2, arg3);
          if (isDefined(value)) {
            value = jqLite(value);
          }
        } else {
          jqLiteAddNodes(value, fn(this[i], arg1, arg2, arg3));
        }
      }
      return isDefined(value) ? value : this;
    };
    JQLite.prototype.bind = JQLite.prototype.on;
    JQLite.prototype.unbind = JQLite.prototype.off;
  });
  function $$jqLiteProvider() {
    this.$get = function $$jqLite() {
      return extend(JQLite, {
        hasClass: function (node, classes) {
          if (node.attr)
            node = node[0];
          return jqLiteHasClass(node, classes);
        },
        addClass: function (node, classes) {
          if (node.attr)
            node = node[0];
          return jqLiteAddClass(node, classes);
        },
        removeClass: function (node, classes) {
          if (node.attr)
            node = node[0];
          return jqLiteRemoveClass(node, classes);
        }
      });
    };
  }
  function hashKey(obj, nextUidFn) {
    var key = obj && obj.$$hashKey;
    if (key) {
      if (typeof key === 'function') {
        key = obj.$$hashKey();
      }
      return key;
    }
    var objType = typeof obj;
    if (objType == 'function' || objType == 'object' && obj !== null) {
      key = obj.$$hashKey = objType + ':' + (nextUidFn || nextUid)();
    } else {
      key = objType + ':' + obj;
    }
    return key;
  }
  function HashMap(array, isolatedUid) {
    if (isolatedUid) {
      var uid = 0;
      this.nextUid = function () {
        return ++uid;
      };
    }
    forEach(array, this.put, this);
  }
  HashMap.prototype = {
    put: function (key, value) {
      this[hashKey(key, this.nextUid)] = value;
    },
    get: function (key) {
      return this[hashKey(key, this.nextUid)];
    },
    remove: function (key) {
      var value = this[key = hashKey(key, this.nextUid)];
      delete this[key];
      return value;
    }
  };
  var $$HashMapProvider = [function () {
        this.$get = [function () {
            return HashMap;
          }];
      }];
  var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
  var FN_ARG_SPLIT = /,/;
  var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
  var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
  var $injectorMinErr = minErr('$injector');
  function anonFn(fn) {
    var fnText = fn.toString().replace(STRIP_COMMENTS, ''), args = fnText.match(FN_ARGS);
    if (args) {
      return 'function(' + (args[1] || '').replace(/[\s\r\n]+/, ' ') + ')';
    }
    return 'fn';
  }
  function annotate(fn, strictDi, name) {
    var $inject, fnText, argDecl, last;
    if (typeof fn === 'function') {
      if (!($inject = fn.$inject)) {
        $inject = [];
        if (fn.length) {
          if (strictDi) {
            if (!isString(name) || !name) {
              name = fn.name || anonFn(fn);
            }
            throw $injectorMinErr('strictdi', '{0} is not using explicit annotation and cannot be invoked in strict mode', name);
          }
          fnText = fn.toString().replace(STRIP_COMMENTS, '');
          argDecl = fnText.match(FN_ARGS);
          forEach(argDecl[1].split(FN_ARG_SPLIT), function (arg) {
            arg.replace(FN_ARG, function (all, underscore, name) {
              $inject.push(name);
            });
          });
        }
        fn.$inject = $inject;
      }
    } else if (isArray(fn)) {
      last = fn.length - 1;
      assertArgFn(fn[last], 'fn');
      $inject = fn.slice(0, last);
    } else {
      assertArgFn(fn, 'fn', true);
    }
    return $inject;
  }
  function createInjector(modulesToLoad, strictDi) {
    strictDi = strictDi === true;
    var INSTANTIATING = {}, providerSuffix = 'Provider', path = [], loadedModules = new HashMap([], true), providerCache = {
        $provide: {
          provider: supportObject(provider),
          factory: supportObject(factory),
          service: supportObject(service),
          value: supportObject(value),
          constant: supportObject(constant),
          decorator: decorator
        }
      }, providerInjector = providerCache.$injector = createInternalInjector(providerCache, function (serviceName, caller) {
        if (angular.isString(caller)) {
          path.push(caller);
        }
        throw $injectorMinErr('unpr', 'Unknown provider: {0}', path.join(' <- '));
      }), instanceCache = {}, instanceInjector = instanceCache.$injector = createInternalInjector(instanceCache, function (serviceName, caller) {
        var provider = providerInjector.get(serviceName + providerSuffix, caller);
        return instanceInjector.invoke(provider.$get, provider, undefined, serviceName);
      });
    forEach(loadModules(modulesToLoad), function (fn) {
      instanceInjector.invoke(fn || noop);
    });
    return instanceInjector;
    function supportObject(delegate) {
      return function (key, value) {
        if (isObject(key)) {
          forEach(key, reverseParams(delegate));
        } else {
          return delegate(key, value);
        }
      };
    }
    function provider(name, provider_) {
      assertNotHasOwnProperty(name, 'service');
      if (isFunction(provider_) || isArray(provider_)) {
        provider_ = providerInjector.instantiate(provider_);
      }
      if (!provider_.$get) {
        throw $injectorMinErr('pget', 'Provider \'{0}\' must define $get factory method.', name);
      }
      return providerCache[name + providerSuffix] = provider_;
    }
    function enforceReturnValue(name, factory) {
      return function enforcedReturnValue() {
        var result = instanceInjector.invoke(factory, this);
        if (isUndefined(result)) {
          throw $injectorMinErr('undef', 'Provider \'{0}\' must return a value from $get factory method.', name);
        }
        return result;
      };
    }
    function factory(name, factoryFn, enforce) {
      return provider(name, { $get: enforce !== false ? enforceReturnValue(name, factoryFn) : factoryFn });
    }
    function service(name, constructor) {
      return factory(name, [
        '$injector',
        function ($injector) {
          return $injector.instantiate(constructor);
        }
      ]);
    }
    function value(name, val) {
      return factory(name, valueFn(val), false);
    }
    function constant(name, value) {
      assertNotHasOwnProperty(name, 'constant');
      providerCache[name] = value;
      instanceCache[name] = value;
    }
    function decorator(serviceName, decorFn) {
      var origProvider = providerInjector.get(serviceName + providerSuffix), orig$get = origProvider.$get;
      origProvider.$get = function () {
        var origInstance = instanceInjector.invoke(orig$get, origProvider);
        return instanceInjector.invoke(decorFn, null, { $delegate: origInstance });
      };
    }
    function loadModules(modulesToLoad) {
      var runBlocks = [], moduleFn;
      forEach(modulesToLoad, function (module) {
        if (loadedModules.get(module))
          return;
        loadedModules.put(module, true);
        function runInvokeQueue(queue) {
          var i, ii;
          for (i = 0, ii = queue.length; i < ii; i++) {
            var invokeArgs = queue[i], provider = providerInjector.get(invokeArgs[0]);
            provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
          }
        }
        try {
          if (isString(module)) {
            moduleFn = angularModule(module);
            runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks);
            runInvokeQueue(moduleFn._invokeQueue);
            runInvokeQueue(moduleFn._configBlocks);
          } else if (isFunction(module)) {
            runBlocks.push(providerInjector.invoke(module));
          } else if (isArray(module)) {
            runBlocks.push(providerInjector.invoke(module));
          } else {
            assertArgFn(module, 'module');
          }
        } catch (e) {
          if (isArray(module)) {
            module = module[module.length - 1];
          }
          if (e.message && e.stack && e.stack.indexOf(e.message) == -1) {
            e = e.message + '\n' + e.stack;
          }
          throw $injectorMinErr('modulerr', 'Failed to instantiate module {0} due to:\n{1}', module, e.stack || e.message || e);
        }
      });
      return runBlocks;
    }
    function createInternalInjector(cache, factory) {
      function getService(serviceName, caller) {
        if (cache.hasOwnProperty(serviceName)) {
          if (cache[serviceName] === INSTANTIATING) {
            throw $injectorMinErr('cdep', 'Circular dependency found: {0}', serviceName + ' <- ' + path.join(' <- '));
          }
          return cache[serviceName];
        } else {
          try {
            path.unshift(serviceName);
            cache[serviceName] = INSTANTIATING;
            return cache[serviceName] = factory(serviceName, caller);
          } catch (err) {
            if (cache[serviceName] === INSTANTIATING) {
              delete cache[serviceName];
            }
            throw err;
          } finally {
            path.shift();
          }
        }
      }
      function invoke(fn, self, locals, serviceName) {
        if (typeof locals === 'string') {
          serviceName = locals;
          locals = null;
        }
        var args = [], $inject = createInjector.$$annotate(fn, strictDi, serviceName), length, i, key;
        for (i = 0, length = $inject.length; i < length; i++) {
          key = $inject[i];
          if (typeof key !== 'string') {
            throw $injectorMinErr('itkn', 'Incorrect injection token! Expected service name as string, got {0}', key);
          }
          args.push(locals && locals.hasOwnProperty(key) ? locals[key] : getService(key, serviceName));
        }
        if (isArray(fn)) {
          fn = fn[length];
        }
        return fn.apply(self, args);
      }
      function instantiate(Type, locals, serviceName) {
        var instance = Object.create((isArray(Type) ? Type[Type.length - 1] : Type).prototype || null);
        var returnedValue = invoke(Type, instance, locals, serviceName);
        return isObject(returnedValue) || isFunction(returnedValue) ? returnedValue : instance;
      }
      return {
        invoke: invoke,
        instantiate: instantiate,
        get: getService,
        annotate: createInjector.$$annotate,
        has: function (name) {
          return providerCache.hasOwnProperty(name + providerSuffix) || cache.hasOwnProperty(name);
        }
      };
    }
  }
  createInjector.$$annotate = annotate;
  function $AnchorScrollProvider() {
    var autoScrollingEnabled = true;
    this.disableAutoScrolling = function () {
      autoScrollingEnabled = false;
    };
    this.$get = [
      '$window',
      '$location',
      '$rootScope',
      function ($window, $location, $rootScope) {
        var document = $window.document;
        function getFirstAnchor(list) {
          var result = null;
          Array.prototype.some.call(list, function (element) {
            if (nodeName_(element) === 'a') {
              result = element;
              return true;
            }
          });
          return result;
        }
        function getYOffset() {
          var offset = scroll.yOffset;
          if (isFunction(offset)) {
            offset = offset();
          } else if (isElement(offset)) {
            var elem = offset[0];
            var style = $window.getComputedStyle(elem);
            if (style.position !== 'fixed') {
              offset = 0;
            } else {
              offset = elem.getBoundingClientRect().bottom;
            }
          } else if (!isNumber(offset)) {
            offset = 0;
          }
          return offset;
        }
        function scrollTo(elem) {
          if (elem) {
            elem.scrollIntoView();
            var offset = getYOffset();
            if (offset) {
              var elemTop = elem.getBoundingClientRect().top;
              $window.scrollBy(0, elemTop - offset);
            }
          } else {
            $window.scrollTo(0, 0);
          }
        }
        function scroll(hash) {
          hash = isString(hash) ? hash : $location.hash();
          var elm;
          if (!hash)
            scrollTo(null);
          else if (elm = document.getElementById(hash))
            scrollTo(elm);
          else if (elm = getFirstAnchor(document.getElementsByName(hash)))
            scrollTo(elm);
          else if (hash === 'top')
            scrollTo(null);
        }
        if (autoScrollingEnabled) {
          $rootScope.$watch(function autoScrollWatch() {
            return $location.hash();
          }, function autoScrollWatchAction(newVal, oldVal) {
            if (newVal === oldVal && newVal === '')
              return;
            jqLiteDocumentLoaded(function () {
              $rootScope.$evalAsync(scroll);
            });
          });
        }
        return scroll;
      }
    ];
  }
  var $animateMinErr = minErr('$animate');
  var ELEMENT_NODE = 1;
  var NG_ANIMATE_CLASSNAME = 'ng-animate';
  function mergeClasses(a, b) {
    if (!a && !b)
      return '';
    if (!a)
      return b;
    if (!b)
      return a;
    if (isArray(a))
      a = a.join(' ');
    if (isArray(b))
      b = b.join(' ');
    return a + ' ' + b;
  }
  function extractElementNode(element) {
    for (var i = 0; i < element.length; i++) {
      var elm = element[i];
      if (elm.nodeType === ELEMENT_NODE) {
        return elm;
      }
    }
  }
  function splitClasses(classes) {
    if (isString(classes)) {
      classes = classes.split(' ');
    }
    var obj = createMap();
    forEach(classes, function (klass) {
      if (klass.length) {
        obj[klass] = true;
      }
    });
    return obj;
  }
  function prepareAnimateOptions(options) {
    return isObject(options) ? options : {};
  }
  var $$CoreAnimateRunnerProvider = function () {
    this.$get = [
      '$q',
      '$$rAF',
      function ($q, $$rAF) {
        function AnimateRunner() {
        }
        AnimateRunner.all = noop;
        AnimateRunner.chain = noop;
        AnimateRunner.prototype = {
          end: noop,
          cancel: noop,
          resume: noop,
          pause: noop,
          complete: noop,
          then: function (pass, fail) {
            return $q(function (resolve) {
              $$rAF(function () {
                resolve();
              });
            }).then(pass, fail);
          }
        };
        return AnimateRunner;
      }
    ];
  };
  var $$CoreAnimateQueueProvider = function () {
    var postDigestQueue = new HashMap();
    var postDigestElements = [];
    this.$get = [
      '$$AnimateRunner',
      '$rootScope',
      function ($$AnimateRunner, $rootScope) {
        return {
          enabled: noop,
          on: noop,
          off: noop,
          pin: noop,
          push: function (element, event, options, domOperation) {
            domOperation && domOperation();
            options = options || {};
            options.from && element.css(options.from);
            options.to && element.css(options.to);
            if (options.addClass || options.removeClass) {
              addRemoveClassesPostDigest(element, options.addClass, options.removeClass);
            }
            return new $$AnimateRunner();
          }
        };
        function addRemoveClassesPostDigest(element, add, remove) {
          var data = postDigestQueue.get(element);
          var classVal;
          if (!data) {
            postDigestQueue.put(element, data = {});
            postDigestElements.push(element);
          }
          if (add) {
            forEach(add.split(' '), function (className) {
              if (className) {
                data[className] = true;
              }
            });
          }
          if (remove) {
            forEach(remove.split(' '), function (className) {
              if (className) {
                data[className] = false;
              }
            });
          }
          if (postDigestElements.length > 1)
            return;
          $rootScope.$$postDigest(function () {
            forEach(postDigestElements, function (element) {
              var data = postDigestQueue.get(element);
              if (data) {
                var existing = splitClasses(element.attr('class'));
                var toAdd = '';
                var toRemove = '';
                forEach(data, function (status, className) {
                  var hasClass = !!existing[className];
                  if (status !== hasClass) {
                    if (status) {
                      toAdd += (toAdd.length ? ' ' : '') + className;
                    } else {
                      toRemove += (toRemove.length ? ' ' : '') + className;
                    }
                  }
                });
                forEach(element, function (elm) {
                  toAdd && jqLiteAddClass(elm, toAdd);
                  toRemove && jqLiteRemoveClass(elm, toRemove);
                });
                postDigestQueue.remove(element);
              }
            });
            postDigestElements.length = 0;
          });
        }
      }
    ];
  };
  var $AnimateProvider = [
      '$provide',
      function ($provide) {
        var provider = this;
        this.$$registeredAnimations = Object.create(null);
        this.register = function (name, factory) {
          if (name && name.charAt(0) !== '.') {
            throw $animateMinErr('notcsel', 'Expecting class selector starting with \'.\' got \'{0}\'.', name);
          }
          var key = name + '-animation';
          provider.$$registeredAnimations[name.substr(1)] = key;
          $provide.factory(key, factory);
        };
        this.classNameFilter = function (expression) {
          if (arguments.length === 1) {
            this.$$classNameFilter = expression instanceof RegExp ? expression : null;
            if (this.$$classNameFilter) {
              var reservedRegex = new RegExp('(\\s+|\\/)' + NG_ANIMATE_CLASSNAME + '(\\s+|\\/)');
              if (reservedRegex.test(this.$$classNameFilter.toString())) {
                throw $animateMinErr('nongcls', '$animateProvider.classNameFilter(regex) prohibits accepting a regex value which matches/contains the "{0}" CSS class.', NG_ANIMATE_CLASSNAME);
              }
            }
          }
          return this.$$classNameFilter;
        };
        this.$get = [
          '$$animateQueue',
          function ($$animateQueue) {
            function domInsert(element, parentElement, afterElement) {
              if (afterElement) {
                var afterNode = extractElementNode(afterElement);
                if (afterNode && !afterNode.parentNode && !afterNode.previousElementSibling) {
                  afterElement = null;
                }
              }
              afterElement ? afterElement.after(element) : parentElement.prepend(element);
            }
            return {
              on: $$animateQueue.on,
              off: $$animateQueue.off,
              pin: $$animateQueue.pin,
              enabled: $$animateQueue.enabled,
              cancel: function (runner) {
                runner.end && runner.end();
              },
              enter: function (element, parent, after, options) {
                parent = parent && jqLite(parent);
                after = after && jqLite(after);
                parent = parent || after.parent();
                domInsert(element, parent, after);
                return $$animateQueue.push(element, 'enter', prepareAnimateOptions(options));
              },
              move: function (element, parent, after, options) {
                parent = parent && jqLite(parent);
                after = after && jqLite(after);
                parent = parent || after.parent();
                domInsert(element, parent, after);
                return $$animateQueue.push(element, 'move', prepareAnimateOptions(options));
              },
              leave: function (element, options) {
                return $$animateQueue.push(element, 'leave', prepareAnimateOptions(options), function () {
                  element.remove();
                });
              },
              addClass: function (element, className, options) {
                options = prepareAnimateOptions(options);
                options.addClass = mergeClasses(options.addclass, className);
                return $$animateQueue.push(element, 'addClass', options);
              },
              removeClass: function (element, className, options) {
                options = prepareAnimateOptions(options);
                options.removeClass = mergeClasses(options.removeClass, className);
                return $$animateQueue.push(element, 'removeClass', options);
              },
              setClass: function (element, add, remove, options) {
                options = prepareAnimateOptions(options);
                options.addClass = mergeClasses(options.addClass, add);
                options.removeClass = mergeClasses(options.removeClass, remove);
                return $$animateQueue.push(element, 'setClass', options);
              },
              animate: function (element, from, to, className, options) {
                options = prepareAnimateOptions(options);
                options.from = options.from ? extend(options.from, from) : from;
                options.to = options.to ? extend(options.to, to) : to;
                className = className || 'ng-inline-animate';
                options.tempClasses = mergeClasses(options.tempClasses, className);
                return $$animateQueue.push(element, 'animate', options);
              }
            };
          }
        ];
      }
    ];
  function $$AsyncCallbackProvider() {
    this.$get = [
      '$$rAF',
      '$timeout',
      function ($$rAF, $timeout) {
        return $$rAF.supported ? function (fn) {
          return $$rAF(fn);
        } : function (fn) {
          return $timeout(fn, 0, false);
        };
      }
    ];
  }
  function Browser(window, document, $log, $sniffer) {
    var self = this, rawDocument = document[0], location = window.location, history = window.history, setTimeout = window.setTimeout, clearTimeout = window.clearTimeout, pendingDeferIds = {};
    self.isMock = false;
    var outstandingRequestCount = 0;
    var outstandingRequestCallbacks = [];
    self.$$completeOutstandingRequest = completeOutstandingRequest;
    self.$$incOutstandingRequestCount = function () {
      outstandingRequestCount++;
    };
    function completeOutstandingRequest(fn) {
      try {
        fn.apply(null, sliceArgs(arguments, 1));
      } finally {
        outstandingRequestCount--;
        if (outstandingRequestCount === 0) {
          while (outstandingRequestCallbacks.length) {
            try {
              outstandingRequestCallbacks.pop()();
            } catch (e) {
              $log.error(e);
            }
          }
        }
      }
    }
    function getHash(url) {
      var index = url.indexOf('#');
      return index === -1 ? '' : url.substr(index + 1);
    }
    self.notifyWhenNoOutstandingRequests = function (callback) {
      if (outstandingRequestCount === 0) {
        callback();
      } else {
        outstandingRequestCallbacks.push(callback);
      }
    };
    var cachedState, lastHistoryState, lastBrowserUrl = location.href, baseElement = document.find('base'), reloadLocation = null;
    cacheState();
    lastHistoryState = cachedState;
    self.url = function (url, replace, state) {
      if (isUndefined(state)) {
        state = null;
      }
      if (location !== window.location)
        location = window.location;
      if (history !== window.history)
        history = window.history;
      if (url) {
        var sameState = lastHistoryState === state;
        if (lastBrowserUrl === url && (!$sniffer.history || sameState)) {
          return self;
        }
        var sameBase = lastBrowserUrl && stripHash(lastBrowserUrl) === stripHash(url);
        lastBrowserUrl = url;
        lastHistoryState = state;
        if ($sniffer.history && (!sameBase || !sameState)) {
          history[replace ? 'replaceState' : 'pushState'](state, '', url);
          cacheState();
          lastHistoryState = cachedState;
        } else {
          if (!sameBase) {
            reloadLocation = url;
          }
          if (replace) {
            location.replace(url);
          } else if (!sameBase) {
            location.href = url;
          } else {
            location.hash = getHash(url);
          }
        }
        return self;
      } else {
        return reloadLocation || location.href.replace(/%27/g, '\'');
      }
    };
    self.state = function () {
      return cachedState;
    };
    var urlChangeListeners = [], urlChangeInit = false;
    function cacheStateAndFireUrlChange() {
      cacheState();
      fireUrlChange();
    }
    function getCurrentState() {
      try {
        return history.state;
      } catch (e) {
      }
    }
    var lastCachedState = null;
    function cacheState() {
      cachedState = getCurrentState();
      cachedState = isUndefined(cachedState) ? null : cachedState;
      if (equals(cachedState, lastCachedState)) {
        cachedState = lastCachedState;
      }
      lastCachedState = cachedState;
    }
    function fireUrlChange() {
      if (lastBrowserUrl === self.url() && lastHistoryState === cachedState) {
        return;
      }
      lastBrowserUrl = self.url();
      lastHistoryState = cachedState;
      forEach(urlChangeListeners, function (listener) {
        listener(self.url(), cachedState);
      });
    }
    self.onUrlChange = function (callback) {
      if (!urlChangeInit) {
        if ($sniffer.history)
          jqLite(window).on('popstate', cacheStateAndFireUrlChange);
        jqLite(window).on('hashchange', cacheStateAndFireUrlChange);
        urlChangeInit = true;
      }
      urlChangeListeners.push(callback);
      return callback;
    };
    self.$$applicationDestroyed = function () {
      jqLite(window).off('hashchange popstate', cacheStateAndFireUrlChange);
    };
    self.$$checkUrlChange = fireUrlChange;
    self.baseHref = function () {
      var href = baseElement.attr('href');
      return href ? href.replace(/^(https?\:)?\/\/[^\/]*/, '') : '';
    };
    self.defer = function (fn, delay) {
      var timeoutId;
      outstandingRequestCount++;
      timeoutId = setTimeout(function () {
        delete pendingDeferIds[timeoutId];
        completeOutstandingRequest(fn);
      }, delay || 0);
      pendingDeferIds[timeoutId] = true;
      return timeoutId;
    };
    self.defer.cancel = function (deferId) {
      if (pendingDeferIds[deferId]) {
        delete pendingDeferIds[deferId];
        clearTimeout(deferId);
        completeOutstandingRequest(noop);
        return true;
      }
      return false;
    };
  }
  function $BrowserProvider() {
    this.$get = [
      '$window',
      '$log',
      '$sniffer',
      '$document',
      function ($window, $log, $sniffer, $document) {
        return new Browser($window, $document, $log, $sniffer);
      }
    ];
  }
  function $CacheFactoryProvider() {
    this.$get = function () {
      var caches = {};
      function cacheFactory(cacheId, options) {
        if (cacheId in caches) {
          throw minErr('$cacheFactory')('iid', 'CacheId \'{0}\' is already taken!', cacheId);
        }
        var size = 0, stats = extend({}, options, { id: cacheId }), data = {}, capacity = options && options.capacity || Number.MAX_VALUE, lruHash = {}, freshEnd = null, staleEnd = null;
        return caches[cacheId] = {
          put: function (key, value) {
            if (isUndefined(value))
              return;
            if (capacity < Number.MAX_VALUE) {
              var lruEntry = lruHash[key] || (lruHash[key] = { key: key });
              refresh(lruEntry);
            }
            if (!(key in data))
              size++;
            data[key] = value;
            if (size > capacity) {
              this.remove(staleEnd.key);
            }
            return value;
          },
          get: function (key) {
            if (capacity < Number.MAX_VALUE) {
              var lruEntry = lruHash[key];
              if (!lruEntry)
                return;
              refresh(lruEntry);
            }
            return data[key];
          },
          remove: function (key) {
            if (capacity < Number.MAX_VALUE) {
              var lruEntry = lruHash[key];
              if (!lruEntry)
                return;
              if (lruEntry == freshEnd)
                freshEnd = lruEntry.p;
              if (lruEntry == staleEnd)
                staleEnd = lruEntry.n;
              link(lruEntry.n, lruEntry.p);
              delete lruHash[key];
            }
            delete data[key];
            size--;
          },
          removeAll: function () {
            data = {};
            size = 0;
            lruHash = {};
            freshEnd = staleEnd = null;
          },
          destroy: function () {
            data = null;
            stats = null;
            lruHash = null;
            delete caches[cacheId];
          },
          info: function () {
            return extend({}, stats, { size: size });
          }
        };
        function refresh(entry) {
          if (entry != freshEnd) {
            if (!staleEnd) {
              staleEnd = entry;
            } else if (staleEnd == entry) {
              staleEnd = entry.n;
            }
            link(entry.n, entry.p);
            link(entry, freshEnd);
            freshEnd = entry;
            freshEnd.n = null;
          }
        }
        function link(nextEntry, prevEntry) {
          if (nextEntry != prevEntry) {
            if (nextEntry)
              nextEntry.p = prevEntry;
            if (prevEntry)
              prevEntry.n = nextEntry;
          }
        }
      }
      cacheFactory.info = function () {
        var info = {};
        forEach(caches, function (cache, cacheId) {
          info[cacheId] = cache.info();
        });
        return info;
      };
      cacheFactory.get = function (cacheId) {
        return caches[cacheId];
      };
      return cacheFactory;
    };
  }
  function $TemplateCacheProvider() {
    this.$get = [
      '$cacheFactory',
      function ($cacheFactory) {
        return $cacheFactory('templates');
      }
    ];
  }
  var $compileMinErr = minErr('$compile');
  $CompileProvider.$inject = [
    '$provide',
    '$$sanitizeUriProvider'
  ];
  function $CompileProvider($provide, $$sanitizeUriProvider) {
    var hasDirectives = {}, Suffix = 'Directive', COMMENT_DIRECTIVE_REGEXP = /^\s*directive\:\s*([\w\-]+)\s+(.*)$/, CLASS_DIRECTIVE_REGEXP = /(([\w\-]+)(?:\:([^;]+))?;?)/, ALL_OR_NOTHING_ATTRS = makeMap('ngSrc,ngSrcset,src,srcset'), REQUIRE_PREFIX_REGEXP = /^(?:(\^\^?)?(\?)?(\^\^?)?)?/;
    var EVENT_HANDLER_ATTR_REGEXP = /^(on[a-z]+|formaction)$/;
    function parseIsolateBindings(scope, directiveName, isController) {
      var LOCAL_REGEXP = /^\s*([@&]|=(\*?))(\??)\s*(\w*)\s*$/;
      var bindings = {};
      forEach(scope, function (definition, scopeName) {
        var match = definition.match(LOCAL_REGEXP);
        if (!match) {
          throw $compileMinErr('iscp', 'Invalid {3} for directive \'{0}\'.' + ' Definition: {... {1}: \'{2}\' ...}', directiveName, scopeName, definition, isController ? 'controller bindings definition' : 'isolate scope definition');
        }
        bindings[scopeName] = {
          mode: match[1][0],
          collection: match[2] === '*',
          optional: match[3] === '?',
          attrName: match[4] || scopeName
        };
      });
      return bindings;
    }
    function parseDirectiveBindings(directive, directiveName) {
      var bindings = {
          isolateScope: null,
          bindToController: null
        };
      if (isObject(directive.scope)) {
        if (directive.bindToController === true) {
          bindings.bindToController = parseIsolateBindings(directive.scope, directiveName, true);
          bindings.isolateScope = {};
        } else {
          bindings.isolateScope = parseIsolateBindings(directive.scope, directiveName, false);
        }
      }
      if (isObject(directive.bindToController)) {
        bindings.bindToController = parseIsolateBindings(directive.bindToController, directiveName, true);
      }
      if (isObject(bindings.bindToController)) {
        var controller = directive.controller;
        var controllerAs = directive.controllerAs;
        if (!controller) {
          throw $compileMinErr('noctrl', 'Cannot bind to controller without directive \'{0}\'s controller.', directiveName);
        } else if (!identifierForController(controller, controllerAs)) {
          throw $compileMinErr('noident', 'Cannot bind to controller without identifier for directive \'{0}\'.', directiveName);
        }
      }
      return bindings;
    }
    function assertValidDirectiveName(name) {
      var letter = name.charAt(0);
      if (!letter || letter !== lowercase(letter)) {
        throw $compileMinErr('baddir', 'Directive name \'{0}\' is invalid. The first character must be a lowercase letter', name);
      }
      if (name !== name.trim()) {
        throw $compileMinErr('baddir', 'Directive name \'{0}\' is invalid. The name should not contain leading or trailing whitespaces', name);
      }
    }
    this.directive = function registerDirective(name, directiveFactory) {
      assertNotHasOwnProperty(name, 'directive');
      if (isString(name)) {
        assertValidDirectiveName(name);
        assertArg(directiveFactory, 'directiveFactory');
        if (!hasDirectives.hasOwnProperty(name)) {
          hasDirectives[name] = [];
          $provide.factory(name + Suffix, [
            '$injector',
            '$exceptionHandler',
            function ($injector, $exceptionHandler) {
              var directives = [];
              forEach(hasDirectives[name], function (directiveFactory, index) {
                try {
                  var directive = $injector.invoke(directiveFactory);
                  if (isFunction(directive)) {
                    directive = { compile: valueFn(directive) };
                  } else if (!directive.compile && directive.link) {
                    directive.compile = valueFn(directive.link);
                  }
                  directive.priority = directive.priority || 0;
                  directive.index = index;
                  directive.name = directive.name || name;
                  directive.require = directive.require || directive.controller && directive.name;
                  directive.restrict = directive.restrict || 'EA';
                  var bindings = directive.$$bindings = parseDirectiveBindings(directive, directive.name);
                  if (isObject(bindings.isolateScope)) {
                    directive.$$isolateBindings = bindings.isolateScope;
                  }
                  directives.push(directive);
                } catch (e) {
                  $exceptionHandler(e);
                }
              });
              return directives;
            }
          ]);
        }
        hasDirectives[name].push(directiveFactory);
      } else {
        forEach(name, reverseParams(registerDirective));
      }
      return this;
    };
    this.aHrefSanitizationWhitelist = function (regexp) {
      if (isDefined(regexp)) {
        $$sanitizeUriProvider.aHrefSanitizationWhitelist(regexp);
        return this;
      } else {
        return $$sanitizeUriProvider.aHrefSanitizationWhitelist();
      }
    };
    this.imgSrcSanitizationWhitelist = function (regexp) {
      if (isDefined(regexp)) {
        $$sanitizeUriProvider.imgSrcSanitizationWhitelist(regexp);
        return this;
      } else {
        return $$sanitizeUriProvider.imgSrcSanitizationWhitelist();
      }
    };
    var debugInfoEnabled = true;
    this.debugInfoEnabled = function (enabled) {
      if (isDefined(enabled)) {
        debugInfoEnabled = enabled;
        return this;
      }
      return debugInfoEnabled;
    };
    this.$get = [
      '$injector',
      '$interpolate',
      '$exceptionHandler',
      '$templateRequest',
      '$parse',
      '$controller',
      '$rootScope',
      '$document',
      '$sce',
      '$animate',
      '$$sanitizeUri',
      function ($injector, $interpolate, $exceptionHandler, $templateRequest, $parse, $controller, $rootScope, $document, $sce, $animate, $$sanitizeUri) {
        var Attributes = function (element, attributesToCopy) {
          if (attributesToCopy) {
            var keys = Object.keys(attributesToCopy);
            var i, l, key;
            for (i = 0, l = keys.length; i < l; i++) {
              key = keys[i];
              this[key] = attributesToCopy[key];
            }
          } else {
            this.$attr = {};
          }
          this.$$element = element;
        };
        Attributes.prototype = {
          $normalize: directiveNormalize,
          $addClass: function (classVal) {
            if (classVal && classVal.length > 0) {
              $animate.addClass(this.$$element, classVal);
            }
          },
          $removeClass: function (classVal) {
            if (classVal && classVal.length > 0) {
              $animate.removeClass(this.$$element, classVal);
            }
          },
          $updateClass: function (newClasses, oldClasses) {
            var toAdd = tokenDifference(newClasses, oldClasses);
            if (toAdd && toAdd.length) {
              $animate.addClass(this.$$element, toAdd);
            }
            var toRemove = tokenDifference(oldClasses, newClasses);
            if (toRemove && toRemove.length) {
              $animate.removeClass(this.$$element, toRemove);
            }
          },
          $set: function (key, value, writeAttr, attrName) {
            var node = this.$$element[0], booleanKey = getBooleanAttrName(node, key), aliasedKey = getAliasedAttrName(node, key), observer = key, nodeName;
            if (booleanKey) {
              this.$$element.prop(key, value);
              attrName = booleanKey;
            } else if (aliasedKey) {
              this[aliasedKey] = value;
              observer = aliasedKey;
            }
            this[key] = value;
            if (attrName) {
              this.$attr[key] = attrName;
            } else {
              attrName = this.$attr[key];
              if (!attrName) {
                this.$attr[key] = attrName = snake_case(key, '-');
              }
            }
            nodeName = nodeName_(this.$$element);
            if (nodeName === 'a' && key === 'href' || nodeName === 'img' && key === 'src') {
              this[key] = value = $$sanitizeUri(value, key === 'src');
            } else if (nodeName === 'img' && key === 'srcset') {
              var result = '';
              var trimmedSrcset = trim(value);
              var srcPattern = /(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/;
              var pattern = /\s/.test(trimmedSrcset) ? srcPattern : /(,)/;
              var rawUris = trimmedSrcset.split(pattern);
              var nbrUrisWith2parts = Math.floor(rawUris.length / 2);
              for (var i = 0; i < nbrUrisWith2parts; i++) {
                var innerIdx = i * 2;
                result += $$sanitizeUri(trim(rawUris[innerIdx]), true);
                result += ' ' + trim(rawUris[innerIdx + 1]);
              }
              var lastTuple = trim(rawUris[i * 2]).split(/\s/);
              result += $$sanitizeUri(trim(lastTuple[0]), true);
              if (lastTuple.length === 2) {
                result += ' ' + trim(lastTuple[1]);
              }
              this[key] = value = result;
            }
            if (writeAttr !== false) {
              if (value === null || value === undefined) {
                this.$$element.removeAttr(attrName);
              } else {
                this.$$element.attr(attrName, value);
              }
            }
            var $$observers = this.$$observers;
            $$observers && forEach($$observers[observer], function (fn) {
              try {
                fn(value);
              } catch (e) {
                $exceptionHandler(e);
              }
            });
          },
          $observe: function (key, fn) {
            var attrs = this, $$observers = attrs.$$observers || (attrs.$$observers = createMap()), listeners = $$observers[key] || ($$observers[key] = []);
            listeners.push(fn);
            $rootScope.$evalAsync(function () {
              if (!listeners.$$inter && attrs.hasOwnProperty(key)) {
                fn(attrs[key]);
              }
            });
            return function () {
              arrayRemove(listeners, fn);
            };
          }
        };
        function safeAddClass($element, className) {
          try {
            $element.addClass(className);
          } catch (e) {
          }
        }
        var startSymbol = $interpolate.startSymbol(), endSymbol = $interpolate.endSymbol(), denormalizeTemplate = startSymbol == '{{' || endSymbol == '}}' ? identity : function denormalizeTemplate(template) {
            return template.replace(/\{\{/g, startSymbol).replace(/}}/g, endSymbol);
          }, NG_ATTR_BINDING = /^ngAttr[A-Z]/;
        compile.$$addBindingInfo = debugInfoEnabled ? function $$addBindingInfo($element, binding) {
          var bindings = $element.data('$binding') || [];
          if (isArray(binding)) {
            bindings = bindings.concat(binding);
          } else {
            bindings.push(binding);
          }
          $element.data('$binding', bindings);
        } : noop;
        compile.$$addBindingClass = debugInfoEnabled ? function $$addBindingClass($element) {
          safeAddClass($element, 'ng-binding');
        } : noop;
        compile.$$addScopeInfo = debugInfoEnabled ? function $$addScopeInfo($element, scope, isolated, noTemplate) {
          var dataName = isolated ? noTemplate ? '$isolateScopeNoTemplate' : '$isolateScope' : '$scope';
          $element.data(dataName, scope);
        } : noop;
        compile.$$addScopeClass = debugInfoEnabled ? function $$addScopeClass($element, isolated) {
          safeAddClass($element, isolated ? 'ng-isolate-scope' : 'ng-scope');
        } : noop;
        return compile;
        function compile($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext) {
          if (!($compileNodes instanceof jqLite)) {
            $compileNodes = jqLite($compileNodes);
          }
          forEach($compileNodes, function (node, index) {
            if (node.nodeType == NODE_TYPE_TEXT && node.nodeValue.match(/\S+/)) {
              $compileNodes[index] = jqLite(node).wrap('<span></span>').parent()[0];
            }
          });
          var compositeLinkFn = compileNodes($compileNodes, transcludeFn, $compileNodes, maxPriority, ignoreDirective, previousCompileContext);
          compile.$$addScopeClass($compileNodes);
          var namespace = null;
          return function publicLinkFn(scope, cloneConnectFn, options) {
            assertArg(scope, 'scope');
            options = options || {};
            var parentBoundTranscludeFn = options.parentBoundTranscludeFn, transcludeControllers = options.transcludeControllers, futureParentElement = options.futureParentElement;
            if (parentBoundTranscludeFn && parentBoundTranscludeFn.$$boundTransclude) {
              parentBoundTranscludeFn = parentBoundTranscludeFn.$$boundTransclude;
            }
            if (!namespace) {
              namespace = detectNamespaceForChildElements(futureParentElement);
            }
            var $linkNode;
            if (namespace !== 'html') {
              $linkNode = jqLite(wrapTemplate(namespace, jqLite('<div>').append($compileNodes).html()));
            } else if (cloneConnectFn) {
              $linkNode = JQLitePrototype.clone.call($compileNodes);
            } else {
              $linkNode = $compileNodes;
            }
            if (transcludeControllers) {
              for (var controllerName in transcludeControllers) {
                $linkNode.data('$' + controllerName + 'Controller', transcludeControllers[controllerName].instance);
              }
            }
            compile.$$addScopeInfo($linkNode, scope);
            if (cloneConnectFn)
              cloneConnectFn($linkNode, scope);
            if (compositeLinkFn)
              compositeLinkFn(scope, $linkNode, $linkNode, parentBoundTranscludeFn);
            return $linkNode;
          };
        }
        function detectNamespaceForChildElements(parentElement) {
          var node = parentElement && parentElement[0];
          if (!node) {
            return 'html';
          } else {
            return nodeName_(node) !== 'foreignobject' && node.toString().match(/SVG/) ? 'svg' : 'html';
          }
        }
        function compileNodes(nodeList, transcludeFn, $rootElement, maxPriority, ignoreDirective, previousCompileContext) {
          var linkFns = [], attrs, directives, nodeLinkFn, childNodes, childLinkFn, linkFnFound, nodeLinkFnFound;
          for (var i = 0; i < nodeList.length; i++) {
            attrs = new Attributes();
            directives = collectDirectives(nodeList[i], [], attrs, i === 0 ? maxPriority : undefined, ignoreDirective);
            nodeLinkFn = directives.length ? applyDirectivesToNode(directives, nodeList[i], attrs, transcludeFn, $rootElement, null, [], [], previousCompileContext) : null;
            if (nodeLinkFn && nodeLinkFn.scope) {
              compile.$$addScopeClass(attrs.$$element);
            }
            childLinkFn = nodeLinkFn && nodeLinkFn.terminal || !(childNodes = nodeList[i].childNodes) || !childNodes.length ? null : compileNodes(childNodes, nodeLinkFn ? (nodeLinkFn.transcludeOnThisElement || !nodeLinkFn.templateOnThisElement) && nodeLinkFn.transclude : transcludeFn);
            if (nodeLinkFn || childLinkFn) {
              linkFns.push(i, nodeLinkFn, childLinkFn);
              linkFnFound = true;
              nodeLinkFnFound = nodeLinkFnFound || nodeLinkFn;
            }
            previousCompileContext = null;
          }
          return linkFnFound ? compositeLinkFn : null;
          function compositeLinkFn(scope, nodeList, $rootElement, parentBoundTranscludeFn) {
            var nodeLinkFn, childLinkFn, node, childScope, i, ii, idx, childBoundTranscludeFn;
            var stableNodeList;
            if (nodeLinkFnFound) {
              var nodeListLength = nodeList.length;
              stableNodeList = new Array(nodeListLength);
              for (i = 0; i < linkFns.length; i += 3) {
                idx = linkFns[i];
                stableNodeList[idx] = nodeList[idx];
              }
            } else {
              stableNodeList = nodeList;
            }
            for (i = 0, ii = linkFns.length; i < ii;) {
              node = stableNodeList[linkFns[i++]];
              nodeLinkFn = linkFns[i++];
              childLinkFn = linkFns[i++];
              if (nodeLinkFn) {
                if (nodeLinkFn.scope) {
                  childScope = scope.$new();
                  compile.$$addScopeInfo(jqLite(node), childScope);
                  var destroyBindings = nodeLinkFn.$$destroyBindings;
                  if (destroyBindings) {
                    nodeLinkFn.$$destroyBindings = null;
                    childScope.$on('$destroyed', destroyBindings);
                  }
                } else {
                  childScope = scope;
                }
                if (nodeLinkFn.transcludeOnThisElement) {
                  childBoundTranscludeFn = createBoundTranscludeFn(scope, nodeLinkFn.transclude, parentBoundTranscludeFn, nodeLinkFn.elementTranscludeOnThisElement);
                } else if (!nodeLinkFn.templateOnThisElement && parentBoundTranscludeFn) {
                  childBoundTranscludeFn = parentBoundTranscludeFn;
                } else if (!parentBoundTranscludeFn && transcludeFn) {
                  childBoundTranscludeFn = createBoundTranscludeFn(scope, transcludeFn);
                } else {
                  childBoundTranscludeFn = null;
                }
                nodeLinkFn(childLinkFn, childScope, node, $rootElement, childBoundTranscludeFn, nodeLinkFn);
              } else if (childLinkFn) {
                childLinkFn(scope, node.childNodes, undefined, parentBoundTranscludeFn);
              }
            }
          }
        }
        function createBoundTranscludeFn(scope, transcludeFn, previousBoundTranscludeFn, elementTransclusion) {
          var boundTranscludeFn = function (transcludedScope, cloneFn, controllers, futureParentElement, containingScope) {
            if (!transcludedScope) {
              transcludedScope = scope.$new(false, containingScope);
              transcludedScope.$$transcluded = true;
            }
            return transcludeFn(transcludedScope, cloneFn, {
              parentBoundTranscludeFn: previousBoundTranscludeFn,
              transcludeControllers: controllers,
              futureParentElement: futureParentElement
            });
          };
          return boundTranscludeFn;
        }
        function collectDirectives(node, directives, attrs, maxPriority, ignoreDirective) {
          var nodeType = node.nodeType, attrsMap = attrs.$attr, match, className;
          switch (nodeType) {
          case NODE_TYPE_ELEMENT:
            addDirective(directives, directiveNormalize(nodeName_(node)), 'E', maxPriority, ignoreDirective);
            for (var attr, name, nName, ngAttrName, value, isNgAttr, nAttrs = node.attributes, j = 0, jj = nAttrs && nAttrs.length; j < jj; j++) {
              var attrStartName = false;
              var attrEndName = false;
              attr = nAttrs[j];
              name = attr.name;
              value = trim(attr.value);
              ngAttrName = directiveNormalize(name);
              if (isNgAttr = NG_ATTR_BINDING.test(ngAttrName)) {
                name = name.replace(PREFIX_REGEXP, '').substr(8).replace(/_(.)/g, function (match, letter) {
                  return letter.toUpperCase();
                });
              }
              var directiveNName = ngAttrName.replace(/(Start|End)$/, '');
              if (directiveIsMultiElement(directiveNName)) {
                if (ngAttrName === directiveNName + 'Start') {
                  attrStartName = name;
                  attrEndName = name.substr(0, name.length - 5) + 'end';
                  name = name.substr(0, name.length - 6);
                }
              }
              nName = directiveNormalize(name.toLowerCase());
              attrsMap[nName] = name;
              if (isNgAttr || !attrs.hasOwnProperty(nName)) {
                attrs[nName] = value;
                if (getBooleanAttrName(node, nName)) {
                  attrs[nName] = true;
                }
              }
              addAttrInterpolateDirective(node, directives, value, nName, isNgAttr);
              addDirective(directives, nName, 'A', maxPriority, ignoreDirective, attrStartName, attrEndName);
            }
            className = node.className;
            if (isObject(className)) {
              className = className.animVal;
            }
            if (isString(className) && className !== '') {
              while (match = CLASS_DIRECTIVE_REGEXP.exec(className)) {
                nName = directiveNormalize(match[2]);
                if (addDirective(directives, nName, 'C', maxPriority, ignoreDirective)) {
                  attrs[nName] = trim(match[3]);
                }
                className = className.substr(match.index + match[0].length);
              }
            }
            break;
          case NODE_TYPE_TEXT:
            addTextInterpolateDirective(directives, node.nodeValue);
            break;
          case NODE_TYPE_COMMENT:
            try {
              match = COMMENT_DIRECTIVE_REGEXP.exec(node.nodeValue);
              if (match) {
                nName = directiveNormalize(match[1]);
                if (addDirective(directives, nName, 'M', maxPriority, ignoreDirective)) {
                  attrs[nName] = trim(match[2]);
                }
              }
            } catch (e) {
            }
            break;
          }
          directives.sort(byPriority);
          return directives;
        }
        function groupScan(node, attrStart, attrEnd) {
          var nodes = [];
          var depth = 0;
          if (attrStart && node.hasAttribute && node.hasAttribute(attrStart)) {
            do {
              if (!node) {
                throw $compileMinErr('uterdir', 'Unterminated attribute, found \'{0}\' but no matching \'{1}\' found.', attrStart, attrEnd);
              }
              if (node.nodeType == NODE_TYPE_ELEMENT) {
                if (node.hasAttribute(attrStart))
                  depth++;
                if (node.hasAttribute(attrEnd))
                  depth--;
              }
              nodes.push(node);
              node = node.nextSibling;
            } while (depth > 0);
          } else {
            nodes.push(node);
          }
          return jqLite(nodes);
        }
        function groupElementsLinkFnWrapper(linkFn, attrStart, attrEnd) {
          return function (scope, element, attrs, controllers, transcludeFn) {
            element = groupScan(element[0], attrStart, attrEnd);
            return linkFn(scope, element, attrs, controllers, transcludeFn);
          };
        }
        function applyDirectivesToNode(directives, compileNode, templateAttrs, transcludeFn, jqCollection, originalReplaceDirective, preLinkFns, postLinkFns, previousCompileContext) {
          previousCompileContext = previousCompileContext || {};
          var terminalPriority = -Number.MAX_VALUE, newScopeDirective, controllerDirectives = previousCompileContext.controllerDirectives, newIsolateScopeDirective = previousCompileContext.newIsolateScopeDirective, templateDirective = previousCompileContext.templateDirective, nonTlbTranscludeDirective = previousCompileContext.nonTlbTranscludeDirective, hasTranscludeDirective = false, hasTemplate = false, hasElementTranscludeDirective = previousCompileContext.hasElementTranscludeDirective, $compileNode = templateAttrs.$$element = jqLite(compileNode), directive, directiveName, $template, replaceDirective = originalReplaceDirective, childTranscludeFn = transcludeFn, linkFn, directiveValue;
          for (var i = 0, ii = directives.length; i < ii; i++) {
            directive = directives[i];
            var attrStart = directive.$$start;
            var attrEnd = directive.$$end;
            if (attrStart) {
              $compileNode = groupScan(compileNode, attrStart, attrEnd);
            }
            $template = undefined;
            if (terminalPriority > directive.priority) {
              break;
            }
            if (directiveValue = directive.scope) {
              if (!directive.templateUrl) {
                if (isObject(directiveValue)) {
                  assertNoDuplicate('new/isolated scope', newIsolateScopeDirective || newScopeDirective, directive, $compileNode);
                  newIsolateScopeDirective = directive;
                } else {
                  assertNoDuplicate('new/isolated scope', newIsolateScopeDirective, directive, $compileNode);
                }
              }
              newScopeDirective = newScopeDirective || directive;
            }
            directiveName = directive.name;
            if (!directive.templateUrl && directive.controller) {
              directiveValue = directive.controller;
              controllerDirectives = controllerDirectives || createMap();
              assertNoDuplicate('\'' + directiveName + '\' controller', controllerDirectives[directiveName], directive, $compileNode);
              controllerDirectives[directiveName] = directive;
            }
            if (directiveValue = directive.transclude) {
              hasTranscludeDirective = true;
              if (!directive.$$tlb) {
                assertNoDuplicate('transclusion', nonTlbTranscludeDirective, directive, $compileNode);
                nonTlbTranscludeDirective = directive;
              }
              if (directiveValue == 'element') {
                hasElementTranscludeDirective = true;
                terminalPriority = directive.priority;
                $template = $compileNode;
                $compileNode = templateAttrs.$$element = jqLite(document.createComment(' ' + directiveName + ': ' + templateAttrs[directiveName] + ' '));
                compileNode = $compileNode[0];
                replaceWith(jqCollection, sliceArgs($template), compileNode);
                childTranscludeFn = compile($template, transcludeFn, terminalPriority, replaceDirective && replaceDirective.name, { nonTlbTranscludeDirective: nonTlbTranscludeDirective });
              } else {
                $template = jqLite(jqLiteClone(compileNode)).contents();
                $compileNode.empty();
                childTranscludeFn = compile($template, transcludeFn);
              }
            }
            if (directive.template) {
              hasTemplate = true;
              assertNoDuplicate('template', templateDirective, directive, $compileNode);
              templateDirective = directive;
              directiveValue = isFunction(directive.template) ? directive.template($compileNode, templateAttrs) : directive.template;
              directiveValue = denormalizeTemplate(directiveValue);
              if (directive.replace) {
                replaceDirective = directive;
                if (jqLiteIsTextNode(directiveValue)) {
                  $template = [];
                } else {
                  $template = removeComments(wrapTemplate(directive.templateNamespace, trim(directiveValue)));
                }
                compileNode = $template[0];
                if ($template.length != 1 || compileNode.nodeType !== NODE_TYPE_ELEMENT) {
                  throw $compileMinErr('tplrt', 'Template for directive \'{0}\' must have exactly one root element. {1}', directiveName, '');
                }
                replaceWith(jqCollection, $compileNode, compileNode);
                var newTemplateAttrs = { $attr: {} };
                var templateDirectives = collectDirectives(compileNode, [], newTemplateAttrs);
                var unprocessedDirectives = directives.splice(i + 1, directives.length - (i + 1));
                if (newIsolateScopeDirective) {
                  markDirectivesAsIsolate(templateDirectives);
                }
                directives = directives.concat(templateDirectives).concat(unprocessedDirectives);
                mergeTemplateAttributes(templateAttrs, newTemplateAttrs);
                ii = directives.length;
              } else {
                $compileNode.html(directiveValue);
              }
            }
            if (directive.templateUrl) {
              hasTemplate = true;
              assertNoDuplicate('template', templateDirective, directive, $compileNode);
              templateDirective = directive;
              if (directive.replace) {
                replaceDirective = directive;
              }
              nodeLinkFn = compileTemplateUrl(directives.splice(i, directives.length - i), $compileNode, templateAttrs, jqCollection, hasTranscludeDirective && childTranscludeFn, preLinkFns, postLinkFns, {
                controllerDirectives: controllerDirectives,
                newIsolateScopeDirective: newIsolateScopeDirective,
                templateDirective: templateDirective,
                nonTlbTranscludeDirective: nonTlbTranscludeDirective
              });
              ii = directives.length;
            } else if (directive.compile) {
              try {
                linkFn = directive.compile($compileNode, templateAttrs, childTranscludeFn);
                if (isFunction(linkFn)) {
                  addLinkFns(null, linkFn, attrStart, attrEnd);
                } else if (linkFn) {
                  addLinkFns(linkFn.pre, linkFn.post, attrStart, attrEnd);
                }
              } catch (e) {
                $exceptionHandler(e, startingTag($compileNode));
              }
            }
            if (directive.terminal) {
              nodeLinkFn.terminal = true;
              terminalPriority = Math.max(terminalPriority, directive.priority);
            }
          }
          nodeLinkFn.scope = newScopeDirective && newScopeDirective.scope === true;
          nodeLinkFn.transcludeOnThisElement = hasTranscludeDirective;
          nodeLinkFn.elementTranscludeOnThisElement = hasElementTranscludeDirective;
          nodeLinkFn.templateOnThisElement = hasTemplate;
          nodeLinkFn.transclude = childTranscludeFn;
          previousCompileContext.hasElementTranscludeDirective = hasElementTranscludeDirective;
          return nodeLinkFn;
          function addLinkFns(pre, post, attrStart, attrEnd) {
            if (pre) {
              if (attrStart)
                pre = groupElementsLinkFnWrapper(pre, attrStart, attrEnd);
              pre.require = directive.require;
              pre.directiveName = directiveName;
              if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
                pre = cloneAndAnnotateFn(pre, { isolateScope: true });
              }
              preLinkFns.push(pre);
            }
            if (post) {
              if (attrStart)
                post = groupElementsLinkFnWrapper(post, attrStart, attrEnd);
              post.require = directive.require;
              post.directiveName = directiveName;
              if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
                post = cloneAndAnnotateFn(post, { isolateScope: true });
              }
              postLinkFns.push(post);
            }
          }
          function getControllers(directiveName, require, $element, elementControllers) {
            var value;
            if (isString(require)) {
              var match = require.match(REQUIRE_PREFIX_REGEXP);
              var name = require.substring(match[0].length);
              var inheritType = match[1] || match[3];
              var optional = match[2] === '?';
              if (inheritType === '^^') {
                $element = $element.parent();
              } else {
                value = elementControllers && elementControllers[name];
                value = value && value.instance;
              }
              if (!value) {
                var dataName = '$' + name + 'Controller';
                value = inheritType ? $element.inheritedData(dataName) : $element.data(dataName);
              }
              if (!value && !optional) {
                throw $compileMinErr('ctreq', 'Controller \'{0}\', required by directive \'{1}\', can\'t be found!', name, directiveName);
              }
            } else if (isArray(require)) {
              value = [];
              for (var i = 0, ii = require.length; i < ii; i++) {
                value[i] = getControllers(directiveName, require[i], $element, elementControllers);
              }
            }
            return value || null;
          }
          function setupControllers($element, attrs, transcludeFn, controllerDirectives, isolateScope, scope) {
            var elementControllers = createMap();
            for (var controllerKey in controllerDirectives) {
              var directive = controllerDirectives[controllerKey];
              var locals = {
                  $scope: directive === newIsolateScopeDirective || directive.$$isolateScope ? isolateScope : scope,
                  $element: $element,
                  $attrs: attrs,
                  $transclude: transcludeFn
                };
              var controller = directive.controller;
              if (controller == '@') {
                controller = attrs[directive.name];
              }
              var controllerInstance = $controller(controller, locals, true, directive.controllerAs);
              elementControllers[directive.name] = controllerInstance;
              if (!hasElementTranscludeDirective) {
                $element.data('$' + directive.name + 'Controller', controllerInstance.instance);
              }
            }
            return elementControllers;
          }
          function nodeLinkFn(childLinkFn, scope, linkNode, $rootElement, boundTranscludeFn, thisLinkFn) {
            var i, ii, linkFn, controller, isolateScope, elementControllers, transcludeFn, $element, attrs;
            if (compileNode === linkNode) {
              attrs = templateAttrs;
              $element = templateAttrs.$$element;
            } else {
              $element = jqLite(linkNode);
              attrs = new Attributes($element, templateAttrs);
            }
            if (newIsolateScopeDirective) {
              isolateScope = scope.$new(true);
            }
            if (boundTranscludeFn) {
              transcludeFn = controllersBoundTransclude;
              transcludeFn.$$boundTransclude = boundTranscludeFn;
            }
            if (controllerDirectives) {
              elementControllers = setupControllers($element, attrs, transcludeFn, controllerDirectives, isolateScope, scope);
            }
            if (newIsolateScopeDirective) {
              compile.$$addScopeInfo($element, isolateScope, true, !(templateDirective && (templateDirective === newIsolateScopeDirective || templateDirective === newIsolateScopeDirective.$$originalDirective)));
              compile.$$addScopeClass($element, true);
              isolateScope.$$isolateBindings = newIsolateScopeDirective.$$isolateBindings;
              initializeDirectiveBindings(scope, attrs, isolateScope, isolateScope.$$isolateBindings, newIsolateScopeDirective, isolateScope);
            }
            if (elementControllers) {
              var scopeDirective = newIsolateScopeDirective || newScopeDirective;
              var bindings;
              var controllerForBindings;
              if (scopeDirective && elementControllers[scopeDirective.name]) {
                bindings = scopeDirective.$$bindings.bindToController;
                controller = elementControllers[scopeDirective.name];
                if (controller && controller.identifier && bindings) {
                  controllerForBindings = controller;
                  thisLinkFn.$$destroyBindings = initializeDirectiveBindings(scope, attrs, controller.instance, bindings, scopeDirective);
                }
              }
              for (i in elementControllers) {
                controller = elementControllers[i];
                var controllerResult = controller();
                if (controllerResult !== controller.instance) {
                  controller.instance = controllerResult;
                  $element.data('$' + directive.name + 'Controller', controllerResult);
                  if (controller === controllerForBindings) {
                    thisLinkFn.$$destroyBindings();
                    thisLinkFn.$$destroyBindings = initializeDirectiveBindings(scope, attrs, controllerResult, bindings, scopeDirective);
                  }
                }
              }
            }
            for (i = 0, ii = preLinkFns.length; i < ii; i++) {
              linkFn = preLinkFns[i];
              invokeLinkFn(linkFn, linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.directiveName, linkFn.require, $element, elementControllers), transcludeFn);
            }
            var scopeToChild = scope;
            if (newIsolateScopeDirective && (newIsolateScopeDirective.template || newIsolateScopeDirective.templateUrl === null)) {
              scopeToChild = isolateScope;
            }
            childLinkFn && childLinkFn(scopeToChild, linkNode.childNodes, undefined, boundTranscludeFn);
            for (i = postLinkFns.length - 1; i >= 0; i--) {
              linkFn = postLinkFns[i];
              invokeLinkFn(linkFn, linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.directiveName, linkFn.require, $element, elementControllers), transcludeFn);
            }
            function controllersBoundTransclude(scope, cloneAttachFn, futureParentElement) {
              var transcludeControllers;
              if (!isScope(scope)) {
                futureParentElement = cloneAttachFn;
                cloneAttachFn = scope;
                scope = undefined;
              }
              if (hasElementTranscludeDirective) {
                transcludeControllers = elementControllers;
              }
              if (!futureParentElement) {
                futureParentElement = hasElementTranscludeDirective ? $element.parent() : $element;
              }
              return boundTranscludeFn(scope, cloneAttachFn, transcludeControllers, futureParentElement, scopeToChild);
            }
          }
        }
        function markDirectivesAsIsolate(directives) {
          for (var j = 0, jj = directives.length; j < jj; j++) {
            directives[j] = inherit(directives[j], { $$isolateScope: true });
          }
        }
        function addDirective(tDirectives, name, location, maxPriority, ignoreDirective, startAttrName, endAttrName) {
          if (name === ignoreDirective)
            return null;
          var match = null;
          if (hasDirectives.hasOwnProperty(name)) {
            for (var directive, directives = $injector.get(name + Suffix), i = 0, ii = directives.length; i < ii; i++) {
              try {
                directive = directives[i];
                if ((maxPriority === undefined || maxPriority > directive.priority) && directive.restrict.indexOf(location) != -1) {
                  if (startAttrName) {
                    directive = inherit(directive, {
                      $$start: startAttrName,
                      $$end: endAttrName
                    });
                  }
                  tDirectives.push(directive);
                  match = directive;
                }
              } catch (e) {
                $exceptionHandler(e);
              }
            }
          }
          return match;
        }
        function directiveIsMultiElement(name) {
          if (hasDirectives.hasOwnProperty(name)) {
            for (var directive, directives = $injector.get(name + Suffix), i = 0, ii = directives.length; i < ii; i++) {
              directive = directives[i];
              if (directive.multiElement) {
                return true;
              }
            }
          }
          return false;
        }
        function mergeTemplateAttributes(dst, src) {
          var srcAttr = src.$attr, dstAttr = dst.$attr, $element = dst.$$element;
          forEach(dst, function (value, key) {
            if (key.charAt(0) != '$') {
              if (src[key] && src[key] !== value) {
                value += (key === 'style' ? ';' : ' ') + src[key];
              }
              dst.$set(key, value, true, srcAttr[key]);
            }
          });
          forEach(src, function (value, key) {
            if (key == 'class') {
              safeAddClass($element, value);
              dst['class'] = (dst['class'] ? dst['class'] + ' ' : '') + value;
            } else if (key == 'style') {
              $element.attr('style', $element.attr('style') + ';' + value);
              dst['style'] = (dst['style'] ? dst['style'] + ';' : '') + value;
            } else if (key.charAt(0) != '$' && !dst.hasOwnProperty(key)) {
              dst[key] = value;
              dstAttr[key] = srcAttr[key];
            }
          });
        }
        function compileTemplateUrl(directives, $compileNode, tAttrs, $rootElement, childTranscludeFn, preLinkFns, postLinkFns, previousCompileContext) {
          var linkQueue = [], afterTemplateNodeLinkFn, afterTemplateChildLinkFn, beforeTemplateCompileNode = $compileNode[0], origAsyncDirective = directives.shift(), derivedSyncDirective = inherit(origAsyncDirective, {
              templateUrl: null,
              transclude: null,
              replace: null,
              $$originalDirective: origAsyncDirective
            }), templateUrl = isFunction(origAsyncDirective.templateUrl) ? origAsyncDirective.templateUrl($compileNode, tAttrs) : origAsyncDirective.templateUrl, templateNamespace = origAsyncDirective.templateNamespace;
          $compileNode.empty();
          $templateRequest($sce.getTrustedResourceUrl(templateUrl)).then(function (content) {
            var compileNode, tempTemplateAttrs, $template, childBoundTranscludeFn;
            content = denormalizeTemplate(content);
            if (origAsyncDirective.replace) {
              if (jqLiteIsTextNode(content)) {
                $template = [];
              } else {
                $template = removeComments(wrapTemplate(templateNamespace, trim(content)));
              }
              compileNode = $template[0];
              if ($template.length != 1 || compileNode.nodeType !== NODE_TYPE_ELEMENT) {
                throw $compileMinErr('tplrt', 'Template for directive \'{0}\' must have exactly one root element. {1}', origAsyncDirective.name, templateUrl);
              }
              tempTemplateAttrs = { $attr: {} };
              replaceWith($rootElement, $compileNode, compileNode);
              var templateDirectives = collectDirectives(compileNode, [], tempTemplateAttrs);
              if (isObject(origAsyncDirective.scope)) {
                markDirectivesAsIsolate(templateDirectives);
              }
              directives = templateDirectives.concat(directives);
              mergeTemplateAttributes(tAttrs, tempTemplateAttrs);
            } else {
              compileNode = beforeTemplateCompileNode;
              $compileNode.html(content);
            }
            directives.unshift(derivedSyncDirective);
            afterTemplateNodeLinkFn = applyDirectivesToNode(directives, compileNode, tAttrs, childTranscludeFn, $compileNode, origAsyncDirective, preLinkFns, postLinkFns, previousCompileContext);
            forEach($rootElement, function (node, i) {
              if (node == compileNode) {
                $rootElement[i] = $compileNode[0];
              }
            });
            afterTemplateChildLinkFn = compileNodes($compileNode[0].childNodes, childTranscludeFn);
            while (linkQueue.length) {
              var scope = linkQueue.shift(), beforeTemplateLinkNode = linkQueue.shift(), linkRootElement = linkQueue.shift(), boundTranscludeFn = linkQueue.shift(), linkNode = $compileNode[0];
              if (scope.$$destroyed)
                continue;
              if (beforeTemplateLinkNode !== beforeTemplateCompileNode) {
                var oldClasses = beforeTemplateLinkNode.className;
                if (!(previousCompileContext.hasElementTranscludeDirective && origAsyncDirective.replace)) {
                  linkNode = jqLiteClone(compileNode);
                }
                replaceWith(linkRootElement, jqLite(beforeTemplateLinkNode), linkNode);
                safeAddClass(jqLite(linkNode), oldClasses);
              }
              if (afterTemplateNodeLinkFn.transcludeOnThisElement) {
                childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude, boundTranscludeFn);
              } else {
                childBoundTranscludeFn = boundTranscludeFn;
              }
              afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, linkNode, $rootElement, childBoundTranscludeFn, afterTemplateNodeLinkFn);
            }
            linkQueue = null;
          });
          return function delayedNodeLinkFn(ignoreChildLinkFn, scope, node, rootElement, boundTranscludeFn) {
            var childBoundTranscludeFn = boundTranscludeFn;
            if (scope.$$destroyed)
              return;
            if (linkQueue) {
              linkQueue.push(scope, node, rootElement, childBoundTranscludeFn);
            } else {
              if (afterTemplateNodeLinkFn.transcludeOnThisElement) {
                childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude, boundTranscludeFn);
              }
              afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, node, rootElement, childBoundTranscludeFn, afterTemplateNodeLinkFn);
            }
          };
        }
        function byPriority(a, b) {
          var diff = b.priority - a.priority;
          if (diff !== 0)
            return diff;
          if (a.name !== b.name)
            return a.name < b.name ? -1 : 1;
          return a.index - b.index;
        }
        function assertNoDuplicate(what, previousDirective, directive, element) {
          if (previousDirective) {
            throw $compileMinErr('multidir', 'Multiple directives [{0}, {1}] asking for {2} on: {3}', previousDirective.name, directive.name, what, startingTag(element));
          }
        }
        function addTextInterpolateDirective(directives, text) {
          var interpolateFn = $interpolate(text, true);
          if (interpolateFn) {
            directives.push({
              priority: 0,
              compile: function textInterpolateCompileFn(templateNode) {
                var templateNodeParent = templateNode.parent(), hasCompileParent = !!templateNodeParent.length;
                if (hasCompileParent)
                  compile.$$addBindingClass(templateNodeParent);
                return function textInterpolateLinkFn(scope, node) {
                  var parent = node.parent();
                  if (!hasCompileParent)
                    compile.$$addBindingClass(parent);
                  compile.$$addBindingInfo(parent, interpolateFn.expressions);
                  scope.$watch(interpolateFn, function interpolateFnWatchAction(value) {
                    node[0].nodeValue = value;
                  });
                };
              }
            });
          }
        }
        function wrapTemplate(type, template) {
          type = lowercase(type || 'html');
          switch (type) {
          case 'svg':
          case 'math':
            var wrapper = document.createElement('div');
            wrapper.innerHTML = '<' + type + '>' + template + '</' + type + '>';
            return wrapper.childNodes[0].childNodes;
          default:
            return template;
          }
        }
        function getTrustedContext(node, attrNormalizedName) {
          if (attrNormalizedName == 'srcdoc') {
            return $sce.HTML;
          }
          var tag = nodeName_(node);
          if (attrNormalizedName == 'xlinkHref' || tag == 'form' && attrNormalizedName == 'action' || tag != 'img' && (attrNormalizedName == 'src' || attrNormalizedName == 'ngSrc')) {
            return $sce.RESOURCE_URL;
          }
        }
        function addAttrInterpolateDirective(node, directives, value, name, allOrNothing) {
          var trustedContext = getTrustedContext(node, name);
          allOrNothing = ALL_OR_NOTHING_ATTRS[name] || allOrNothing;
          var interpolateFn = $interpolate(value, true, trustedContext, allOrNothing);
          if (!interpolateFn)
            return;
          if (name === 'multiple' && nodeName_(node) === 'select') {
            throw $compileMinErr('selmulti', 'Binding to the \'multiple\' attribute is not supported. Element: {0}', startingTag(node));
          }
          directives.push({
            priority: 100,
            compile: function () {
              return {
                pre: function attrInterpolatePreLinkFn(scope, element, attr) {
                  var $$observers = attr.$$observers || (attr.$$observers = {});
                  if (EVENT_HANDLER_ATTR_REGEXP.test(name)) {
                    throw $compileMinErr('nodomevents', 'Interpolations for HTML DOM event attributes are disallowed.  Please use the ' + 'ng- versions (such as ng-click instead of onclick) instead.');
                  }
                  var newValue = attr[name];
                  if (newValue !== value) {
                    interpolateFn = newValue && $interpolate(newValue, true, trustedContext, allOrNothing);
                    value = newValue;
                  }
                  if (!interpolateFn)
                    return;
                  attr[name] = interpolateFn(scope);
                  ($$observers[name] || ($$observers[name] = [])).$$inter = true;
                  (attr.$$observers && attr.$$observers[name].$$scope || scope).$watch(interpolateFn, function interpolateFnWatchAction(newValue, oldValue) {
                    if (name === 'class' && newValue != oldValue) {
                      attr.$updateClass(newValue, oldValue);
                    } else {
                      attr.$set(name, newValue);
                    }
                  });
                }
              };
            }
          });
        }
        function replaceWith($rootElement, elementsToRemove, newNode) {
          var firstElementToRemove = elementsToRemove[0], removeCount = elementsToRemove.length, parent = firstElementToRemove.parentNode, i, ii;
          if ($rootElement) {
            for (i = 0, ii = $rootElement.length; i < ii; i++) {
              if ($rootElement[i] == firstElementToRemove) {
                $rootElement[i++] = newNode;
                for (var j = i, j2 = j + removeCount - 1, jj = $rootElement.length; j < jj; j++, j2++) {
                  if (j2 < jj) {
                    $rootElement[j] = $rootElement[j2];
                  } else {
                    delete $rootElement[j];
                  }
                }
                $rootElement.length -= removeCount - 1;
                if ($rootElement.context === firstElementToRemove) {
                  $rootElement.context = newNode;
                }
                break;
              }
            }
          }
          if (parent) {
            parent.replaceChild(newNode, firstElementToRemove);
          }
          var fragment = document.createDocumentFragment();
          fragment.appendChild(firstElementToRemove);
          jqLite(newNode).data(jqLite(firstElementToRemove).data());
          if (!jQuery) {
            delete jqLite.cache[firstElementToRemove[jqLite.expando]];
          } else {
            skipDestroyOnNextJQueryCleanData = true;
            jQuery.cleanData([firstElementToRemove]);
          }
          for (var k = 1, kk = elementsToRemove.length; k < kk; k++) {
            var element = elementsToRemove[k];
            jqLite(element).remove();
            fragment.appendChild(element);
            delete elementsToRemove[k];
          }
          elementsToRemove[0] = newNode;
          elementsToRemove.length = 1;
        }
        function cloneAndAnnotateFn(fn, annotation) {
          return extend(function () {
            return fn.apply(null, arguments);
          }, fn, annotation);
        }
        function invokeLinkFn(linkFn, scope, $element, attrs, controllers, transcludeFn) {
          try {
            linkFn(scope, $element, attrs, controllers, transcludeFn);
          } catch (e) {
            $exceptionHandler(e, startingTag($element));
          }
        }
        function initializeDirectiveBindings(scope, attrs, destination, bindings, directive, newScope) {
          var onNewScopeDestroyed;
          forEach(bindings, function (definition, scopeName) {
            var attrName = definition.attrName, optional = definition.optional, mode = definition.mode, lastValue, parentGet, parentSet, compare;
            switch (mode) {
            case '@':
              attrs.$observe(attrName, function (value) {
                destination[scopeName] = value;
              });
              attrs.$$observers[attrName].$$scope = scope;
              if (attrs[attrName]) {
                destination[scopeName] = $interpolate(attrs[attrName])(scope);
              }
              break;
            case '=':
              if (optional && !attrs[attrName]) {
                return;
              }
              parentGet = $parse(attrs[attrName]);
              if (parentGet.literal) {
                compare = equals;
              } else {
                compare = function (a, b) {
                  return a === b || a !== a && b !== b;
                };
              }
              parentSet = parentGet.assign || function () {
                lastValue = destination[scopeName] = parentGet(scope);
                throw $compileMinErr('nonassign', 'Expression \'{0}\' used with directive \'{1}\' is non-assignable!', attrs[attrName], directive.name);
              };
              lastValue = destination[scopeName] = parentGet(scope);
              var parentValueWatch = function parentValueWatch(parentValue) {
                if (!compare(parentValue, destination[scopeName])) {
                  if (!compare(parentValue, lastValue)) {
                    destination[scopeName] = parentValue;
                  } else {
                    parentSet(scope, parentValue = destination[scopeName]);
                  }
                }
                return lastValue = parentValue;
              };
              parentValueWatch.$stateful = true;
              var unwatch;
              if (definition.collection) {
                unwatch = scope.$watchCollection(attrs[attrName], parentValueWatch);
              } else {
                unwatch = scope.$watch($parse(attrs[attrName], parentValueWatch), null, parentGet.literal);
              }
              onNewScopeDestroyed = onNewScopeDestroyed || [];
              onNewScopeDestroyed.push(unwatch);
              break;
            case '&':
              if (!attrs.hasOwnProperty(attrName) && optional)
                break;
              parentGet = $parse(attrs[attrName]);
              if (parentGet === noop && optional)
                break;
              destination[scopeName] = function (locals) {
                return parentGet(scope, locals);
              };
              break;
            }
          });
          var destroyBindings = onNewScopeDestroyed ? function destroyBindings() {
              for (var i = 0, ii = onNewScopeDestroyed.length; i < ii; ++i) {
                onNewScopeDestroyed[i]();
              }
            } : noop;
          if (newScope && destroyBindings !== noop) {
            newScope.$on('$destroy', destroyBindings);
            return noop;
          }
          return destroyBindings;
        }
      }
    ];
  }
  var PREFIX_REGEXP = /^((?:x|data)[\:\-_])/i;
  function directiveNormalize(name) {
    return camelCase(name.replace(PREFIX_REGEXP, ''));
  }
  function nodesetLinkingFn(scope, nodeList, rootElement, boundTranscludeFn) {
  }
  function directiveLinkingFn(nodesetLinkingFn, scope, node, rootElement, boundTranscludeFn) {
  }
  function tokenDifference(str1, str2) {
    var values = '', tokens1 = str1.split(/\s+/), tokens2 = str2.split(/\s+/);
    outer:
      for (var i = 0; i < tokens1.length; i++) {
        var token = tokens1[i];
        for (var j = 0; j < tokens2.length; j++) {
          if (token == tokens2[j])
            continue outer;
        }
        values += (values.length > 0 ? ' ' : '') + token;
      }
    return values;
  }
  function removeComments(jqNodes) {
    jqNodes = jqLite(jqNodes);
    var i = jqNodes.length;
    if (i <= 1) {
      return jqNodes;
    }
    while (i--) {
      var node = jqNodes[i];
      if (node.nodeType === NODE_TYPE_COMMENT) {
        splice.call(jqNodes, i, 1);
      }
    }
    return jqNodes;
  }
  var $controllerMinErr = minErr('$controller');
  var CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/;
  function identifierForController(controller, ident) {
    if (ident && isString(ident))
      return ident;
    if (isString(controller)) {
      var match = CNTRL_REG.exec(controller);
      if (match)
        return match[3];
    }
  }
  function $ControllerProvider() {
    var controllers = {}, globals = false;
    this.register = function (name, constructor) {
      assertNotHasOwnProperty(name, 'controller');
      if (isObject(name)) {
        extend(controllers, name);
      } else {
        controllers[name] = constructor;
      }
    };
    this.allowGlobals = function () {
      globals = true;
    };
    this.$get = [
      '$injector',
      '$window',
      function ($injector, $window) {
        return function (expression, locals, later, ident) {
          var instance, match, constructor, identifier;
          later = later === true;
          if (ident && isString(ident)) {
            identifier = ident;
          }
          if (isString(expression)) {
            match = expression.match(CNTRL_REG);
            if (!match) {
              throw $controllerMinErr('ctrlfmt', 'Badly formed controller string \'{0}\'. ' + 'Must match `__name__ as __id__` or `__name__`.', expression);
            }
            constructor = match[1], identifier = identifier || match[3];
            expression = controllers.hasOwnProperty(constructor) ? controllers[constructor] : getter(locals.$scope, constructor, true) || (globals ? getter($window, constructor, true) : undefined);
            assertArgFn(expression, constructor, true);
          }
          if (later) {
            var controllerPrototype = (isArray(expression) ? expression[expression.length - 1] : expression).prototype;
            instance = Object.create(controllerPrototype || null);
            if (identifier) {
              addIdentifier(locals, identifier, instance, constructor || expression.name);
            }
            var instantiate;
            return instantiate = extend(function () {
              var result = $injector.invoke(expression, instance, locals, constructor);
              if (result !== instance && (isObject(result) || isFunction(result))) {
                instance = result;
                if (identifier) {
                  addIdentifier(locals, identifier, instance, constructor || expression.name);
                }
              }
              return instance;
            }, {
              instance: instance,
              identifier: identifier
            });
          }
          instance = $injector.instantiate(expression, locals, constructor);
          if (identifier) {
            addIdentifier(locals, identifier, instance, constructor || expression.name);
          }
          return instance;
        };
        function addIdentifier(locals, identifier, instance, name) {
          if (!(locals && isObject(locals.$scope))) {
            throw minErr('$controller')('noscp', 'Cannot export controller \'{0}\' as \'{1}\'! No $scope object provided via `locals`.', name, identifier);
          }
          locals.$scope[identifier] = instance;
        }
      }
    ];
  }
  function $DocumentProvider() {
    this.$get = [
      '$window',
      function (window) {
        return jqLite(window.document);
      }
    ];
  }
  function $ExceptionHandlerProvider() {
    this.$get = [
      '$log',
      function ($log) {
        return function (exception, cause) {
          $log.error.apply($log, arguments);
        };
      }
    ];
  }
  var APPLICATION_JSON = 'application/json';
  var CONTENT_TYPE_APPLICATION_JSON = { 'Content-Type': APPLICATION_JSON + ';charset=utf-8' };
  var JSON_START = /^\[|^\{(?!\{)/;
  var JSON_ENDS = {
      '[': /]$/,
      '{': /}$/
    };
  var JSON_PROTECTION_PREFIX = /^\)\]\}',?\n/;
  function serializeValue(v) {
    if (isObject(v)) {
      return isDate(v) ? v.toISOString() : toJson(v);
    }
    return v;
  }
  function $HttpParamSerializerProvider() {
    this.$get = function () {
      return function ngParamSerializer(params) {
        if (!params)
          return '';
        var parts = [];
        forEachSorted(params, function (value, key) {
          if (value === null || isUndefined(value))
            return;
          if (isArray(value)) {
            forEach(value, function (v, k) {
              parts.push(encodeUriQuery(key) + '=' + encodeUriQuery(serializeValue(v)));
            });
          } else {
            parts.push(encodeUriQuery(key) + '=' + encodeUriQuery(serializeValue(value)));
          }
        });
        return parts.join('&');
      };
    };
  }
  function $HttpParamSerializerJQLikeProvider() {
    this.$get = function () {
      return function jQueryLikeParamSerializer(params) {
        if (!params)
          return '';
        var parts = [];
        serialize(params, '', true);
        return parts.join('&');
        function serialize(toSerialize, prefix, topLevel) {
          if (toSerialize === null || isUndefined(toSerialize))
            return;
          if (isArray(toSerialize)) {
            forEach(toSerialize, function (value) {
              serialize(value, prefix + '[]');
            });
          } else if (isObject(toSerialize) && !isDate(toSerialize)) {
            forEachSorted(toSerialize, function (value, key) {
              serialize(value, prefix + (topLevel ? '' : '[') + key + (topLevel ? '' : ']'));
            });
          } else {
            parts.push(encodeUriQuery(prefix) + '=' + encodeUriQuery(serializeValue(toSerialize)));
          }
        }
      };
    };
  }
  function defaultHttpResponseTransform(data, headers) {
    if (isString(data)) {
      var tempData = data.replace(JSON_PROTECTION_PREFIX, '').trim();
      if (tempData) {
        var contentType = headers('Content-Type');
        if (contentType && contentType.indexOf(APPLICATION_JSON) === 0 || isJsonLike(tempData)) {
          data = fromJson(tempData);
        }
      }
    }
    return data;
  }
  function isJsonLike(str) {
    var jsonStart = str.match(JSON_START);
    return jsonStart && JSON_ENDS[jsonStart[0]].test(str);
  }
  function parseHeaders(headers) {
    var parsed = createMap(), i;
    function fillInParsed(key, val) {
      if (key) {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
    if (isString(headers)) {
      forEach(headers.split('\n'), function (line) {
        i = line.indexOf(':');
        fillInParsed(lowercase(trim(line.substr(0, i))), trim(line.substr(i + 1)));
      });
    } else if (isObject(headers)) {
      forEach(headers, function (headerVal, headerKey) {
        fillInParsed(lowercase(headerKey), trim(headerVal));
      });
    }
    return parsed;
  }
  function headersGetter(headers) {
    var headersObj;
    return function (name) {
      if (!headersObj)
        headersObj = parseHeaders(headers);
      if (name) {
        var value = headersObj[lowercase(name)];
        if (value === void 0) {
          value = null;
        }
        return value;
      }
      return headersObj;
    };
  }
  function transformData(data, headers, status, fns) {
    if (isFunction(fns)) {
      return fns(data, headers, status);
    }
    forEach(fns, function (fn) {
      data = fn(data, headers, status);
    });
    return data;
  }
  function isSuccess(status) {
    return 200 <= status && status < 300;
  }
  function $HttpProvider() {
    var defaults = this.defaults = {
        transformResponse: [defaultHttpResponseTransform],
        transformRequest: [function (d) {
            return isObject(d) && !isFile(d) && !isBlob(d) && !isFormData(d) ? toJson(d) : d;
          }],
        headers: {
          common: { 'Accept': 'application/json, text/plain, */*' },
          post: shallowCopy(CONTENT_TYPE_APPLICATION_JSON),
          put: shallowCopy(CONTENT_TYPE_APPLICATION_JSON),
          patch: shallowCopy(CONTENT_TYPE_APPLICATION_JSON)
        },
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
        paramSerializer: '$httpParamSerializer'
      };
    var useApplyAsync = false;
    this.useApplyAsync = function (value) {
      if (isDefined(value)) {
        useApplyAsync = !!value;
        return this;
      }
      return useApplyAsync;
    };
    var interceptorFactories = this.interceptors = [];
    this.$get = [
      '$httpBackend',
      '$$cookieReader',
      '$cacheFactory',
      '$rootScope',
      '$q',
      '$injector',
      function ($httpBackend, $$cookieReader, $cacheFactory, $rootScope, $q, $injector) {
        var defaultCache = $cacheFactory('$http');
        defaults.paramSerializer = isString(defaults.paramSerializer) ? $injector.get(defaults.paramSerializer) : defaults.paramSerializer;
        var reversedInterceptors = [];
        forEach(interceptorFactories, function (interceptorFactory) {
          reversedInterceptors.unshift(isString(interceptorFactory) ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory));
        });
        function $http(requestConfig) {
          if (!angular.isObject(requestConfig)) {
            throw minErr('$http')('badreq', 'Http request configuration must be an object.  Received: {0}', requestConfig);
          }
          var config = extend({
              method: 'get',
              transformRequest: defaults.transformRequest,
              transformResponse: defaults.transformResponse,
              paramSerializer: defaults.paramSerializer
            }, requestConfig);
          config.headers = mergeHeaders(requestConfig);
          config.method = uppercase(config.method);
          config.paramSerializer = isString(config.paramSerializer) ? $injector.get(config.paramSerializer) : config.paramSerializer;
          var serverRequest = function (config) {
            var headers = config.headers;
            var reqData = transformData(config.data, headersGetter(headers), undefined, config.transformRequest);
            if (isUndefined(reqData)) {
              forEach(headers, function (value, header) {
                if (lowercase(header) === 'content-type') {
                  delete headers[header];
                }
              });
            }
            if (isUndefined(config.withCredentials) && !isUndefined(defaults.withCredentials)) {
              config.withCredentials = defaults.withCredentials;
            }
            return sendReq(config, reqData).then(transformResponse, transformResponse);
          };
          var chain = [
              serverRequest,
              undefined
            ];
          var promise = $q.when(config);
          forEach(reversedInterceptors, function (interceptor) {
            if (interceptor.request || interceptor.requestError) {
              chain.unshift(interceptor.request, interceptor.requestError);
            }
            if (interceptor.response || interceptor.responseError) {
              chain.push(interceptor.response, interceptor.responseError);
            }
          });
          while (chain.length) {
            var thenFn = chain.shift();
            var rejectFn = chain.shift();
            promise = promise.then(thenFn, rejectFn);
          }
          promise.success = function (fn) {
            assertArgFn(fn, 'fn');
            promise.then(function (response) {
              fn(response.data, response.status, response.headers, config);
            });
            return promise;
          };
          promise.error = function (fn) {
            assertArgFn(fn, 'fn');
            promise.then(null, function (response) {
              fn(response.data, response.status, response.headers, config);
            });
            return promise;
          };
          return promise;
          function transformResponse(response) {
            var resp = extend({}, response);
            if (!response.data) {
              resp.data = response.data;
            } else {
              resp.data = transformData(response.data, response.headers, response.status, config.transformResponse);
            }
            return isSuccess(response.status) ? resp : $q.reject(resp);
          }
          function executeHeaderFns(headers, config) {
            var headerContent, processedHeaders = {};
            forEach(headers, function (headerFn, header) {
              if (isFunction(headerFn)) {
                headerContent = headerFn(config);
                if (headerContent != null) {
                  processedHeaders[header] = headerContent;
                }
              } else {
                processedHeaders[header] = headerFn;
              }
            });
            return processedHeaders;
          }
          function mergeHeaders(config) {
            var defHeaders = defaults.headers, reqHeaders = extend({}, config.headers), defHeaderName, lowercaseDefHeaderName, reqHeaderName;
            defHeaders = extend({}, defHeaders.common, defHeaders[lowercase(config.method)]);
            defaultHeadersIteration:
              for (defHeaderName in defHeaders) {
                lowercaseDefHeaderName = lowercase(defHeaderName);
                for (reqHeaderName in reqHeaders) {
                  if (lowercase(reqHeaderName) === lowercaseDefHeaderName) {
                    continue defaultHeadersIteration;
                  }
                }
                reqHeaders[defHeaderName] = defHeaders[defHeaderName];
              }
            return executeHeaderFns(reqHeaders, shallowCopy(config));
          }
        }
        $http.pendingRequests = [];
        createShortMethods('get', 'delete', 'head', 'jsonp');
        createShortMethodsWithData('post', 'put', 'patch');
        $http.defaults = defaults;
        return $http;
        function createShortMethods(names) {
          forEach(arguments, function (name) {
            $http[name] = function (url, config) {
              return $http(extend({}, config || {}, {
                method: name,
                url: url
              }));
            };
          });
        }
        function createShortMethodsWithData(name) {
          forEach(arguments, function (name) {
            $http[name] = function (url, data, config) {
              return $http(extend({}, config || {}, {
                method: name,
                url: url,
                data: data
              }));
            };
          });
        }
        function sendReq(config, reqData) {
          var deferred = $q.defer(), promise = deferred.promise, cache, cachedResp, reqHeaders = config.headers, url = buildUrl(config.url, config.paramSerializer(config.params));
          $http.pendingRequests.push(config);
          promise.then(removePendingReq, removePendingReq);
          if ((config.cache || defaults.cache) && config.cache !== false && (config.method === 'GET' || config.method === 'JSONP')) {
            cache = isObject(config.cache) ? config.cache : isObject(defaults.cache) ? defaults.cache : defaultCache;
          }
          if (cache) {
            cachedResp = cache.get(url);
            if (isDefined(cachedResp)) {
              if (isPromiseLike(cachedResp)) {
                cachedResp.then(resolvePromiseWithResult, resolvePromiseWithResult);
              } else {
                if (isArray(cachedResp)) {
                  resolvePromise(cachedResp[1], cachedResp[0], shallowCopy(cachedResp[2]), cachedResp[3]);
                } else {
                  resolvePromise(cachedResp, 200, {}, 'OK');
                }
              }
            } else {
              cache.put(url, promise);
            }
          }
          if (isUndefined(cachedResp)) {
            var xsrfValue = urlIsSameOrigin(config.url) ? $$cookieReader()[config.xsrfCookieName || defaults.xsrfCookieName] : undefined;
            if (xsrfValue) {
              reqHeaders[config.xsrfHeaderName || defaults.xsrfHeaderName] = xsrfValue;
            }
            $httpBackend(config.method, url, reqData, done, reqHeaders, config.timeout, config.withCredentials, config.responseType);
          }
          return promise;
          function done(status, response, headersString, statusText) {
            if (cache) {
              if (isSuccess(status)) {
                cache.put(url, [
                  status,
                  response,
                  parseHeaders(headersString),
                  statusText
                ]);
              } else {
                cache.remove(url);
              }
            }
            function resolveHttpPromise() {
              resolvePromise(response, status, headersString, statusText);
            }
            if (useApplyAsync) {
              $rootScope.$applyAsync(resolveHttpPromise);
            } else {
              resolveHttpPromise();
              if (!$rootScope.$$phase)
                $rootScope.$apply();
            }
          }
          function resolvePromise(response, status, headers, statusText) {
            status = Math.max(status, 0);
            (isSuccess(status) ? deferred.resolve : deferred.reject)({
              data: response,
              status: status,
              headers: headersGetter(headers),
              config: config,
              statusText: statusText
            });
          }
          function resolvePromiseWithResult(result) {
            resolvePromise(result.data, result.status, shallowCopy(result.headers()), result.statusText);
          }
          function removePendingReq() {
            var idx = $http.pendingRequests.indexOf(config);
            if (idx !== -1)
              $http.pendingRequests.splice(idx, 1);
          }
        }
        function buildUrl(url, serializedParams) {
          if (serializedParams.length > 0) {
            url += (url.indexOf('?') == -1 ? '?' : '&') + serializedParams;
          }
          return url;
        }
      }
    ];
  }
  function createXhr() {
    return new window.XMLHttpRequest();
  }
  function $HttpBackendProvider() {
    this.$get = [
      '$browser',
      '$window',
      '$document',
      function ($browser, $window, $document) {
        return createHttpBackend($browser, createXhr, $browser.defer, $window.angular.callbacks, $document[0]);
      }
    ];
  }
  function createHttpBackend($browser, createXhr, $browserDefer, callbacks, rawDocument) {
    return function (method, url, post, callback, headers, timeout, withCredentials, responseType) {
      $browser.$$incOutstandingRequestCount();
      url = url || $browser.url();
      if (lowercase(method) == 'jsonp') {
        var callbackId = '_' + (callbacks.counter++).toString(36);
        callbacks[callbackId] = function (data) {
          callbacks[callbackId].data = data;
          callbacks[callbackId].called = true;
        };
        var jsonpDone = jsonpReq(url.replace('JSON_CALLBACK', 'angular.callbacks.' + callbackId), callbackId, function (status, text) {
            completeRequest(callback, status, callbacks[callbackId].data, '', text);
            callbacks[callbackId] = noop;
          });
      } else {
        var xhr = createXhr();
        xhr.open(method, url, true);
        forEach(headers, function (value, key) {
          if (isDefined(value)) {
            xhr.setRequestHeader(key, value);
          }
        });
        xhr.onload = function requestLoaded() {
          var statusText = xhr.statusText || '';
          var response = 'response' in xhr ? xhr.response : xhr.responseText;
          var status = xhr.status === 1223 ? 204 : xhr.status;
          if (status === 0) {
            status = response ? 200 : urlResolve(url).protocol == 'file' ? 404 : 0;
          }
          completeRequest(callback, status, response, xhr.getAllResponseHeaders(), statusText);
        };
        var requestError = function () {
          completeRequest(callback, -1, null, null, '');
        };
        xhr.onerror = requestError;
        xhr.onabort = requestError;
        if (withCredentials) {
          xhr.withCredentials = true;
        }
        if (responseType) {
          try {
            xhr.responseType = responseType;
          } catch (e) {
            if (responseType !== 'json') {
              throw e;
            }
          }
        }
        xhr.send(post);
      }
      if (timeout > 0) {
        var timeoutId = $browserDefer(timeoutRequest, timeout);
      } else if (isPromiseLike(timeout)) {
        timeout.then(timeoutRequest);
      }
      function timeoutRequest() {
        jsonpDone && jsonpDone();
        xhr && xhr.abort();
      }
      function completeRequest(callback, status, response, headersString, statusText) {
        if (timeoutId !== undefined) {
          $browserDefer.cancel(timeoutId);
        }
        jsonpDone = xhr = null;
        callback(status, response, headersString, statusText);
        $browser.$$completeOutstandingRequest(noop);
      }
    };
    function jsonpReq(url, callbackId, done) {
      var script = rawDocument.createElement('script'), callback = null;
      script.type = 'text/javascript';
      script.src = url;
      script.async = true;
      callback = function (event) {
        removeEventListenerFn(script, 'load', callback);
        removeEventListenerFn(script, 'error', callback);
        rawDocument.body.removeChild(script);
        script = null;
        var status = -1;
        var text = 'unknown';
        if (event) {
          if (event.type === 'load' && !callbacks[callbackId].called) {
            event = { type: 'error' };
          }
          text = event.type;
          status = event.type === 'error' ? 404 : 200;
        }
        if (done) {
          done(status, text);
        }
      };
      addEventListenerFn(script, 'load', callback);
      addEventListenerFn(script, 'error', callback);
      rawDocument.body.appendChild(script);
      return callback;
    }
  }
  var $interpolateMinErr = angular.$interpolateMinErr = minErr('$interpolate');
  $interpolateMinErr.throwNoconcat = function (text) {
    throw $interpolateMinErr('noconcat', 'Error while interpolating: {0}\nStrict Contextual Escaping disallows ' + 'interpolations that concatenate multiple expressions when a trusted value is ' + 'required.  See http://docs.angularjs.org/api/ng.$sce', text);
  };
  $interpolateMinErr.interr = function (text, err) {
    return $interpolateMinErr('interr', 'Can\'t interpolate: {0}\n{1}', text, err.toString());
  };
  function $InterpolateProvider() {
    var startSymbol = '{{';
    var endSymbol = '}}';
    this.startSymbol = function (value) {
      if (value) {
        startSymbol = value;
        return this;
      } else {
        return startSymbol;
      }
    };
    this.endSymbol = function (value) {
      if (value) {
        endSymbol = value;
        return this;
      } else {
        return endSymbol;
      }
    };
    this.$get = [
      '$parse',
      '$exceptionHandler',
      '$sce',
      function ($parse, $exceptionHandler, $sce) {
        var startSymbolLength = startSymbol.length, endSymbolLength = endSymbol.length, escapedStartRegexp = new RegExp(startSymbol.replace(/./g, escape), 'g'), escapedEndRegexp = new RegExp(endSymbol.replace(/./g, escape), 'g');
        function escape(ch) {
          return '\\\\\\' + ch;
        }
        function unescapeText(text) {
          return text.replace(escapedStartRegexp, startSymbol).replace(escapedEndRegexp, endSymbol);
        }
        function stringify(value) {
          if (value == null) {
            return '';
          }
          switch (typeof value) {
          case 'string':
            break;
          case 'number':
            value = '' + value;
            break;
          default:
            value = toJson(value);
          }
          return value;
        }
        function $interpolate(text, mustHaveExpression, trustedContext, allOrNothing) {
          allOrNothing = !!allOrNothing;
          var startIndex, endIndex, index = 0, expressions = [], parseFns = [], textLength = text.length, exp, concat = [], expressionPositions = [];
          while (index < textLength) {
            if ((startIndex = text.indexOf(startSymbol, index)) != -1 && (endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) != -1) {
              if (index !== startIndex) {
                concat.push(unescapeText(text.substring(index, startIndex)));
              }
              exp = text.substring(startIndex + startSymbolLength, endIndex);
              expressions.push(exp);
              parseFns.push($parse(exp, parseStringifyInterceptor));
              index = endIndex + endSymbolLength;
              expressionPositions.push(concat.length);
              concat.push('');
            } else {
              if (index !== textLength) {
                concat.push(unescapeText(text.substring(index)));
              }
              break;
            }
          }
          if (trustedContext && concat.length > 1) {
            $interpolateMinErr.throwNoconcat(text);
          }
          if (!mustHaveExpression || expressions.length) {
            var compute = function (values) {
              for (var i = 0, ii = expressions.length; i < ii; i++) {
                if (allOrNothing && isUndefined(values[i]))
                  return;
                concat[expressionPositions[i]] = values[i];
              }
              return concat.join('');
            };
            var getValue = function (value) {
              return trustedContext ? $sce.getTrusted(trustedContext, value) : $sce.valueOf(value);
            };
            return extend(function interpolationFn(context) {
              var i = 0;
              var ii = expressions.length;
              var values = new Array(ii);
              try {
                for (; i < ii; i++) {
                  values[i] = parseFns[i](context);
                }
                return compute(values);
              } catch (err) {
                $exceptionHandler($interpolateMinErr.interr(text, err));
              }
            }, {
              exp: text,
              expressions: expressions,
              $$watchDelegate: function (scope, listener) {
                var lastValue;
                return scope.$watchGroup(parseFns, function interpolateFnWatcher(values, oldValues) {
                  var currValue = compute(values);
                  if (isFunction(listener)) {
                    listener.call(this, currValue, values !== oldValues ? lastValue : currValue, scope);
                  }
                  lastValue = currValue;
                });
              }
            });
          }
          function parseStringifyInterceptor(value) {
            try {
              value = getValue(value);
              return allOrNothing && !isDefined(value) ? value : stringify(value);
            } catch (err) {
              $exceptionHandler($interpolateMinErr.interr(text, err));
            }
          }
        }
        $interpolate.startSymbol = function () {
          return startSymbol;
        };
        $interpolate.endSymbol = function () {
          return endSymbol;
        };
        return $interpolate;
      }
    ];
  }
  function $IntervalProvider() {
    this.$get = [
      '$rootScope',
      '$window',
      '$q',
      '$$q',
      function ($rootScope, $window, $q, $$q) {
        var intervals = {};
        function interval(fn, delay, count, invokeApply) {
          var hasParams = arguments.length > 4, args = hasParams ? sliceArgs(arguments, 4) : [], setInterval = $window.setInterval, clearInterval = $window.clearInterval, iteration = 0, skipApply = isDefined(invokeApply) && !invokeApply, deferred = (skipApply ? $$q : $q).defer(), promise = deferred.promise;
          count = isDefined(count) ? count : 0;
          promise.then(null, null, !hasParams ? fn : function () {
            fn.apply(null, args);
          });
          promise.$$intervalId = setInterval(function tick() {
            deferred.notify(iteration++);
            if (count > 0 && iteration >= count) {
              deferred.resolve(iteration);
              clearInterval(promise.$$intervalId);
              delete intervals[promise.$$intervalId];
            }
            if (!skipApply)
              $rootScope.$apply();
          }, delay);
          intervals[promise.$$intervalId] = deferred;
          return promise;
        }
        interval.cancel = function (promise) {
          if (promise && promise.$$intervalId in intervals) {
            intervals[promise.$$intervalId].reject('canceled');
            $window.clearInterval(promise.$$intervalId);
            delete intervals[promise.$$intervalId];
            return true;
          }
          return false;
        };
        return interval;
      }
    ];
  }
  function $LocaleProvider() {
    this.$get = function () {
      return {
        id: 'en-us',
        NUMBER_FORMATS: {
          DECIMAL_SEP: '.',
          GROUP_SEP: ',',
          PATTERNS: [
            {
              minInt: 1,
              minFrac: 0,
              maxFrac: 3,
              posPre: '',
              posSuf: '',
              negPre: '-',
              negSuf: '',
              gSize: 3,
              lgSize: 3
            },
            {
              minInt: 1,
              minFrac: 2,
              maxFrac: 2,
              posPre: '\xa4',
              posSuf: '',
              negPre: '(\xa4',
              negSuf: ')',
              gSize: 3,
              lgSize: 3
            }
          ],
          CURRENCY_SYM: '$'
        },
        DATETIME_FORMATS: {
          MONTH: 'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),
          SHORTMONTH: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),
          DAY: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
          SHORTDAY: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(','),
          AMPMS: [
            'AM',
            'PM'
          ],
          medium: 'MMM d, y h:mm:ss a',
          'short': 'M/d/yy h:mm a',
          fullDate: 'EEEE, MMMM d, y',
          longDate: 'MMMM d, y',
          mediumDate: 'MMM d, y',
          shortDate: 'M/d/yy',
          mediumTime: 'h:mm:ss a',
          shortTime: 'h:mm a',
          ERANAMES: [
            'Before Christ',
            'Anno Domini'
          ],
          ERAS: [
            'BC',
            'AD'
          ]
        },
        pluralCat: function (num) {
          if (num === 1) {
            return 'one';
          }
          return 'other';
        }
      };
    };
  }
  var PATH_MATCH = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/, DEFAULT_PORTS = {
      'http': 80,
      'https': 443,
      'ftp': 21
    };
  var $locationMinErr = minErr('$location');
  function encodePath(path) {
    var segments = path.split('/'), i = segments.length;
    while (i--) {
      segments[i] = encodeUriSegment(segments[i]);
    }
    return segments.join('/');
  }
  function parseAbsoluteUrl(absoluteUrl, locationObj) {
    var parsedUrl = urlResolve(absoluteUrl);
    locationObj.$$protocol = parsedUrl.protocol;
    locationObj.$$host = parsedUrl.hostname;
    locationObj.$$port = toInt(parsedUrl.port) || DEFAULT_PORTS[parsedUrl.protocol] || null;
  }
  function parseAppUrl(relativeUrl, locationObj) {
    var prefixed = relativeUrl.charAt(0) !== '/';
    if (prefixed) {
      relativeUrl = '/' + relativeUrl;
    }
    var match = urlResolve(relativeUrl);
    locationObj.$$path = decodeURIComponent(prefixed && match.pathname.charAt(0) === '/' ? match.pathname.substring(1) : match.pathname);
    locationObj.$$search = parseKeyValue(match.search);
    locationObj.$$hash = decodeURIComponent(match.hash);
    if (locationObj.$$path && locationObj.$$path.charAt(0) != '/') {
      locationObj.$$path = '/' + locationObj.$$path;
    }
  }
  function beginsWith(begin, whole) {
    if (whole.indexOf(begin) === 0) {
      return whole.substr(begin.length);
    }
  }
  function stripHash(url) {
    var index = url.indexOf('#');
    return index == -1 ? url : url.substr(0, index);
  }
  function trimEmptyHash(url) {
    return url.replace(/(#.+)|#$/, '$1');
  }
  function stripFile(url) {
    return url.substr(0, stripHash(url).lastIndexOf('/') + 1);
  }
  function serverBase(url) {
    return url.substring(0, url.indexOf('/', url.indexOf('//') + 2));
  }
  function LocationHtml5Url(appBase, basePrefix) {
    this.$$html5 = true;
    basePrefix = basePrefix || '';
    var appBaseNoFile = stripFile(appBase);
    parseAbsoluteUrl(appBase, this);
    this.$$parse = function (url) {
      var pathUrl = beginsWith(appBaseNoFile, url);
      if (!isString(pathUrl)) {
        throw $locationMinErr('ipthprfx', 'Invalid url "{0}", missing path prefix "{1}".', url, appBaseNoFile);
      }
      parseAppUrl(pathUrl, this);
      if (!this.$$path) {
        this.$$path = '/';
      }
      this.$$compose();
    };
    this.$$compose = function () {
      var search = toKeyValue(this.$$search), hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';
      this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
      this.$$absUrl = appBaseNoFile + this.$$url.substr(1);
    };
    this.$$parseLinkUrl = function (url, relHref) {
      if (relHref && relHref[0] === '#') {
        this.hash(relHref.slice(1));
        return true;
      }
      var appUrl, prevAppUrl;
      var rewrittenUrl;
      if ((appUrl = beginsWith(appBase, url)) !== undefined) {
        prevAppUrl = appUrl;
        if ((appUrl = beginsWith(basePrefix, appUrl)) !== undefined) {
          rewrittenUrl = appBaseNoFile + (beginsWith('/', appUrl) || appUrl);
        } else {
          rewrittenUrl = appBase + prevAppUrl;
        }
      } else if ((appUrl = beginsWith(appBaseNoFile, url)) !== undefined) {
        rewrittenUrl = appBaseNoFile + appUrl;
      } else if (appBaseNoFile == url + '/') {
        rewrittenUrl = appBaseNoFile;
      }
      if (rewrittenUrl) {
        this.$$parse(rewrittenUrl);
      }
      return !!rewrittenUrl;
    };
  }
  function LocationHashbangUrl(appBase, hashPrefix) {
    var appBaseNoFile = stripFile(appBase);
    parseAbsoluteUrl(appBase, this);
    this.$$parse = function (url) {
      var withoutBaseUrl = beginsWith(appBase, url) || beginsWith(appBaseNoFile, url);
      var withoutHashUrl;
      if (withoutBaseUrl.charAt(0) === '#') {
        withoutHashUrl = beginsWith(hashPrefix, withoutBaseUrl);
        if (isUndefined(withoutHashUrl)) {
          withoutHashUrl = withoutBaseUrl;
        }
      } else {
        withoutHashUrl = this.$$html5 ? withoutBaseUrl : '';
      }
      parseAppUrl(withoutHashUrl, this);
      this.$$path = removeWindowsDriveName(this.$$path, withoutHashUrl, appBase);
      this.$$compose();
      function removeWindowsDriveName(path, url, base) {
        var windowsFilePathExp = /^\/[A-Z]:(\/.*)/;
        var firstPathSegmentMatch;
        if (url.indexOf(base) === 0) {
          url = url.replace(base, '');
        }
        if (windowsFilePathExp.exec(url)) {
          return path;
        }
        firstPathSegmentMatch = windowsFilePathExp.exec(path);
        return firstPathSegmentMatch ? firstPathSegmentMatch[1] : path;
      }
    };
    this.$$compose = function () {
      var search = toKeyValue(this.$$search), hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';
      this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
      this.$$absUrl = appBase + (this.$$url ? hashPrefix + this.$$url : '');
    };
    this.$$parseLinkUrl = function (url, relHref) {
      if (stripHash(appBase) == stripHash(url)) {
        this.$$parse(url);
        return true;
      }
      return false;
    };
  }
  function LocationHashbangInHtml5Url(appBase, hashPrefix) {
    this.$$html5 = true;
    LocationHashbangUrl.apply(this, arguments);
    var appBaseNoFile = stripFile(appBase);
    this.$$parseLinkUrl = function (url, relHref) {
      if (relHref && relHref[0] === '#') {
        this.hash(relHref.slice(1));
        return true;
      }
      var rewrittenUrl;
      var appUrl;
      if (appBase == stripHash(url)) {
        rewrittenUrl = url;
      } else if (appUrl = beginsWith(appBaseNoFile, url)) {
        rewrittenUrl = appBase + hashPrefix + appUrl;
      } else if (appBaseNoFile === url + '/') {
        rewrittenUrl = appBaseNoFile;
      }
      if (rewrittenUrl) {
        this.$$parse(rewrittenUrl);
      }
      return !!rewrittenUrl;
    };
    this.$$compose = function () {
      var search = toKeyValue(this.$$search), hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';
      this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
      this.$$absUrl = appBase + hashPrefix + this.$$url;
    };
  }
  var locationPrototype = {
      $$html5: false,
      $$replace: false,
      absUrl: locationGetter('$$absUrl'),
      url: function (url) {
        if (isUndefined(url)) {
          return this.$$url;
        }
        var match = PATH_MATCH.exec(url);
        if (match[1] || url === '')
          this.path(decodeURIComponent(match[1]));
        if (match[2] || match[1] || url === '')
          this.search(match[3] || '');
        this.hash(match[5] || '');
        return this;
      },
      protocol: locationGetter('$$protocol'),
      host: locationGetter('$$host'),
      port: locationGetter('$$port'),
      path: locationGetterSetter('$$path', function (path) {
        path = path !== null ? path.toString() : '';
        return path.charAt(0) == '/' ? path : '/' + path;
      }),
      search: function (search, paramValue) {
        switch (arguments.length) {
        case 0:
          return this.$$search;
        case 1:
          if (isString(search) || isNumber(search)) {
            search = search.toString();
            this.$$search = parseKeyValue(search);
          } else if (isObject(search)) {
            search = copy(search, {});
            forEach(search, function (value, key) {
              if (value == null)
                delete search[key];
            });
            this.$$search = search;
          } else {
            throw $locationMinErr('isrcharg', 'The first argument of the `$location#search()` call must be a string or an object.');
          }
          break;
        default:
          if (isUndefined(paramValue) || paramValue === null) {
            delete this.$$search[search];
          } else {
            this.$$search[search] = paramValue;
          }
        }
        this.$$compose();
        return this;
      },
      hash: locationGetterSetter('$$hash', function (hash) {
        return hash !== null ? hash.toString() : '';
      }),
      replace: function () {
        this.$$replace = true;
        return this;
      }
    };
  forEach([
    LocationHashbangInHtml5Url,
    LocationHashbangUrl,
    LocationHtml5Url
  ], function (Location) {
    Location.prototype = Object.create(locationPrototype);
    Location.prototype.state = function (state) {
      if (!arguments.length) {
        return this.$$state;
      }
      if (Location !== LocationHtml5Url || !this.$$html5) {
        throw $locationMinErr('nostate', 'History API state support is available only ' + 'in HTML5 mode and only in browsers supporting HTML5 History API');
      }
      this.$$state = isUndefined(state) ? null : state;
      return this;
    };
  });
  function locationGetter(property) {
    return function () {
      return this[property];
    };
  }
  function locationGetterSetter(property, preprocess) {
    return function (value) {
      if (isUndefined(value)) {
        return this[property];
      }
      this[property] = preprocess(value);
      this.$$compose();
      return this;
    };
  }
  function $LocationProvider() {
    var hashPrefix = '', html5Mode = {
        enabled: false,
        requireBase: true,
        rewriteLinks: true
      };
    this.hashPrefix = function (prefix) {
      if (isDefined(prefix)) {
        hashPrefix = prefix;
        return this;
      } else {
        return hashPrefix;
      }
    };
    this.html5Mode = function (mode) {
      if (isBoolean(mode)) {
        html5Mode.enabled = mode;
        return this;
      } else if (isObject(mode)) {
        if (isBoolean(mode.enabled)) {
          html5Mode.enabled = mode.enabled;
        }
        if (isBoolean(mode.requireBase)) {
          html5Mode.requireBase = mode.requireBase;
        }
        if (isBoolean(mode.rewriteLinks)) {
          html5Mode.rewriteLinks = mode.rewriteLinks;
        }
        return this;
      } else {
        return html5Mode;
      }
    };
    this.$get = [
      '$rootScope',
      '$browser',
      '$sniffer',
      '$rootElement',
      '$window',
      function ($rootScope, $browser, $sniffer, $rootElement, $window) {
        var $location, LocationMode, baseHref = $browser.baseHref(), initialUrl = $browser.url(), appBase;
        if (html5Mode.enabled) {
          if (!baseHref && html5Mode.requireBase) {
            throw $locationMinErr('nobase', '$location in HTML5 mode requires a <base> tag to be present!');
          }
          appBase = serverBase(initialUrl) + (baseHref || '/');
          LocationMode = $sniffer.history ? LocationHtml5Url : LocationHashbangInHtml5Url;
        } else {
          appBase = stripHash(initialUrl);
          LocationMode = LocationHashbangUrl;
        }
        $location = new LocationMode(appBase, '#' + hashPrefix);
        $location.$$parseLinkUrl(initialUrl, initialUrl);
        $location.$$state = $browser.state();
        var IGNORE_URI_REGEXP = /^\s*(javascript|mailto):/i;
        function setBrowserUrlWithFallback(url, replace, state) {
          var oldUrl = $location.url();
          var oldState = $location.$$state;
          try {
            $browser.url(url, replace, state);
            $location.$$state = $browser.state();
          } catch (e) {
            $location.url(oldUrl);
            $location.$$state = oldState;
            throw e;
          }
        }
        $rootElement.on('click', function (event) {
          if (!html5Mode.rewriteLinks || event.ctrlKey || event.metaKey || event.shiftKey || event.which == 2 || event.button == 2)
            return;
          var elm = jqLite(event.target);
          while (nodeName_(elm[0]) !== 'a') {
            if (elm[0] === $rootElement[0] || !(elm = elm.parent())[0])
              return;
          }
          var absHref = elm.prop('href');
          var relHref = elm.attr('href') || elm.attr('xlink:href');
          if (isObject(absHref) && absHref.toString() === '[object SVGAnimatedString]') {
            absHref = urlResolve(absHref.animVal).href;
          }
          if (IGNORE_URI_REGEXP.test(absHref))
            return;
          if (absHref && !elm.attr('target') && !event.isDefaultPrevented()) {
            if ($location.$$parseLinkUrl(absHref, relHref)) {
              event.preventDefault();
              if ($location.absUrl() != $browser.url()) {
                $rootScope.$apply();
                $window.angular['ff-684208-preventDefault'] = true;
              }
            }
          }
        });
        if (trimEmptyHash($location.absUrl()) != trimEmptyHash(initialUrl)) {
          $browser.url($location.absUrl(), true);
        }
        var initializing = true;
        $browser.onUrlChange(function (newUrl, newState) {
          $rootScope.$evalAsync(function () {
            var oldUrl = $location.absUrl();
            var oldState = $location.$$state;
            var defaultPrevented;
            $location.$$parse(newUrl);
            $location.$$state = newState;
            defaultPrevented = $rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl, newState, oldState).defaultPrevented;
            if ($location.absUrl() !== newUrl)
              return;
            if (defaultPrevented) {
              $location.$$parse(oldUrl);
              $location.$$state = oldState;
              setBrowserUrlWithFallback(oldUrl, false, oldState);
            } else {
              initializing = false;
              afterLocationChange(oldUrl, oldState);
            }
          });
          if (!$rootScope.$$phase)
            $rootScope.$digest();
        });
        $rootScope.$watch(function $locationWatch() {
          var oldUrl = trimEmptyHash($browser.url());
          var newUrl = trimEmptyHash($location.absUrl());
          var oldState = $browser.state();
          var currentReplace = $location.$$replace;
          var urlOrStateChanged = oldUrl !== newUrl || $location.$$html5 && $sniffer.history && oldState !== $location.$$state;
          if (initializing || urlOrStateChanged) {
            initializing = false;
            $rootScope.$evalAsync(function () {
              var newUrl = $location.absUrl();
              var defaultPrevented = $rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl, $location.$$state, oldState).defaultPrevented;
              if ($location.absUrl() !== newUrl)
                return;
              if (defaultPrevented) {
                $location.$$parse(oldUrl);
                $location.$$state = oldState;
              } else {
                if (urlOrStateChanged) {
                  setBrowserUrlWithFallback(newUrl, currentReplace, oldState === $location.$$state ? null : $location.$$state);
                }
                afterLocationChange(oldUrl, oldState);
              }
            });
          }
          $location.$$replace = false;
        });
        return $location;
        function afterLocationChange(oldUrl, oldState) {
          $rootScope.$broadcast('$locationChangeSuccess', $location.absUrl(), oldUrl, $location.$$state, oldState);
        }
      }
    ];
  }
  function $LogProvider() {
    var debug = true, self = this;
    this.debugEnabled = function (flag) {
      if (isDefined(flag)) {
        debug = flag;
        return this;
      } else {
        return debug;
      }
    };
    this.$get = [
      '$window',
      function ($window) {
        return {
          log: consoleLog('log'),
          info: consoleLog('info'),
          warn: consoleLog('warn'),
          error: consoleLog('error'),
          debug: function () {
            var fn = consoleLog('debug');
            return function () {
              if (debug) {
                fn.apply(self, arguments);
              }
            };
          }()
        };
        function formatError(arg) {
          if (arg instanceof Error) {
            if (arg.stack) {
              arg = arg.message && arg.stack.indexOf(arg.message) === -1 ? 'Error: ' + arg.message + '\n' + arg.stack : arg.stack;
            } else if (arg.sourceURL) {
              arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
            }
          }
          return arg;
        }
        function consoleLog(type) {
          var console = $window.console || {}, logFn = console[type] || console.log || noop, hasApply = false;
          try {
            hasApply = !!logFn.apply;
          } catch (e) {
          }
          if (hasApply) {
            return function () {
              var args = [];
              forEach(arguments, function (arg) {
                args.push(formatError(arg));
              });
              return logFn.apply(console, args);
            };
          }
          return function (arg1, arg2) {
            logFn(arg1, arg2 == null ? '' : arg2);
          };
        }
      }
    ];
  }
  var $parseMinErr = minErr('$parse');
  function ensureSafeMemberName(name, fullExpression) {
    if (name === '__defineGetter__' || name === '__defineSetter__' || name === '__lookupGetter__' || name === '__lookupSetter__' || name === '__proto__') {
      throw $parseMinErr('isecfld', 'Attempting to access a disallowed field in Angular expressions! ' + 'Expression: {0}', fullExpression);
    }
    return name;
  }
  function ensureSafeObject(obj, fullExpression) {
    if (obj) {
      if (obj.constructor === obj) {
        throw $parseMinErr('isecfn', 'Referencing Function in Angular expressions is disallowed! Expression: {0}', fullExpression);
      } else if (obj.window === obj) {
        throw $parseMinErr('isecwindow', 'Referencing the Window in Angular expressions is disallowed! Expression: {0}', fullExpression);
      } else if (obj.children && (obj.nodeName || obj.prop && obj.attr && obj.find)) {
        throw $parseMinErr('isecdom', 'Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}', fullExpression);
      } else if (obj === Object) {
        throw $parseMinErr('isecobj', 'Referencing Object in Angular expressions is disallowed! Expression: {0}', fullExpression);
      }
    }
    return obj;
  }
  var CALL = Function.prototype.call;
  var APPLY = Function.prototype.apply;
  var BIND = Function.prototype.bind;
  function ensureSafeFunction(obj, fullExpression) {
    if (obj) {
      if (obj.constructor === obj) {
        throw $parseMinErr('isecfn', 'Referencing Function in Angular expressions is disallowed! Expression: {0}', fullExpression);
      } else if (obj === CALL || obj === APPLY || obj === BIND) {
        throw $parseMinErr('isecff', 'Referencing call, apply or bind in Angular expressions is disallowed! Expression: {0}', fullExpression);
      }
    }
  }
  var OPERATORS = createMap();
  forEach('+ - * / % === !== == != < > <= >= && || ! = |'.split(' '), function (operator) {
    OPERATORS[operator] = true;
  });
  var ESCAPE = {
      'n': '\n',
      'f': '\f',
      'r': '\r',
      't': '\t',
      'v': '\x0B',
      '\'': '\'',
      '"': '"'
    };
  var Lexer = function (options) {
    this.options = options;
  };
  Lexer.prototype = {
    constructor: Lexer,
    lex: function (text) {
      this.text = text;
      this.index = 0;
      this.tokens = [];
      while (this.index < this.text.length) {
        var ch = this.text.charAt(this.index);
        if (ch === '"' || ch === '\'') {
          this.readString(ch);
        } else if (this.isNumber(ch) || ch === '.' && this.isNumber(this.peek())) {
          this.readNumber();
        } else if (this.isIdent(ch)) {
          this.readIdent();
        } else if (this.is(ch, '(){}[].,;:?')) {
          this.tokens.push({
            index: this.index,
            text: ch
          });
          this.index++;
        } else if (this.isWhitespace(ch)) {
          this.index++;
        } else {
          var ch2 = ch + this.peek();
          var ch3 = ch2 + this.peek(2);
          var op1 = OPERATORS[ch];
          var op2 = OPERATORS[ch2];
          var op3 = OPERATORS[ch3];
          if (op1 || op2 || op3) {
            var token = op3 ? ch3 : op2 ? ch2 : ch;
            this.tokens.push({
              index: this.index,
              text: token,
              operator: true
            });
            this.index += token.length;
          } else {
            this.throwError('Unexpected next character ', this.index, this.index + 1);
          }
        }
      }
      return this.tokens;
    },
    is: function (ch, chars) {
      return chars.indexOf(ch) !== -1;
    },
    peek: function (i) {
      var num = i || 1;
      return this.index + num < this.text.length ? this.text.charAt(this.index + num) : false;
    },
    isNumber: function (ch) {
      return '0' <= ch && ch <= '9' && typeof ch === 'string';
    },
    isWhitespace: function (ch) {
      return ch === ' ' || ch === '\r' || ch === '\t' || ch === '\n' || ch === '\x0B' || ch === '\xa0';
    },
    isIdent: function (ch) {
      return 'a' <= ch && ch <= 'z' || 'A' <= ch && ch <= 'Z' || '_' === ch || ch === '$';
    },
    isExpOperator: function (ch) {
      return ch === '-' || ch === '+' || this.isNumber(ch);
    },
    throwError: function (error, start, end) {
      end = end || this.index;
      var colStr = isDefined(start) ? 's ' + start + '-' + this.index + ' [' + this.text.substring(start, end) + ']' : ' ' + end;
      throw $parseMinErr('lexerr', 'Lexer Error: {0} at column{1} in expression [{2}].', error, colStr, this.text);
    },
    readNumber: function () {
      var number = '';
      var start = this.index;
      while (this.index < this.text.length) {
        var ch = lowercase(this.text.charAt(this.index));
        if (ch == '.' || this.isNumber(ch)) {
          number += ch;
        } else {
          var peekCh = this.peek();
          if (ch == 'e' && this.isExpOperator(peekCh)) {
            number += ch;
          } else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && number.charAt(number.length - 1) == 'e') {
            number += ch;
          } else if (this.isExpOperator(ch) && (!peekCh || !this.isNumber(peekCh)) && number.charAt(number.length - 1) == 'e') {
            this.throwError('Invalid exponent');
          } else {
            break;
          }
        }
        this.index++;
      }
      this.tokens.push({
        index: start,
        text: number,
        constant: true,
        value: Number(number)
      });
    },
    readIdent: function () {
      var start = this.index;
      while (this.index < this.text.length) {
        var ch = this.text.charAt(this.index);
        if (!(this.isIdent(ch) || this.isNumber(ch))) {
          break;
        }
        this.index++;
      }
      this.tokens.push({
        index: start,
        text: this.text.slice(start, this.index),
        identifier: true
      });
    },
    readString: function (quote) {
      var start = this.index;
      this.index++;
      var string = '';
      var rawString = quote;
      var escape = false;
      while (this.index < this.text.length) {
        var ch = this.text.charAt(this.index);
        rawString += ch;
        if (escape) {
          if (ch === 'u') {
            var hex = this.text.substring(this.index + 1, this.index + 5);
            if (!hex.match(/[\da-f]{4}/i)) {
              this.throwError('Invalid unicode escape [\\u' + hex + ']');
            }
            this.index += 4;
            string += String.fromCharCode(parseInt(hex, 16));
          } else {
            var rep = ESCAPE[ch];
            string = string + (rep || ch);
          }
          escape = false;
        } else if (ch === '\\') {
          escape = true;
        } else if (ch === quote) {
          this.index++;
          this.tokens.push({
            index: start,
            text: rawString,
            constant: true,
            value: string
          });
          return;
        } else {
          string += ch;
        }
        this.index++;
      }
      this.throwError('Unterminated quote', start);
    }
  };
  var AST = function (lexer, options) {
    this.lexer = lexer;
    this.options = options;
  };
  AST.Program = 'Program';
  AST.ExpressionStatement = 'ExpressionStatement';
  AST.AssignmentExpression = 'AssignmentExpression';
  AST.ConditionalExpression = 'ConditionalExpression';
  AST.LogicalExpression = 'LogicalExpression';
  AST.BinaryExpression = 'BinaryExpression';
  AST.UnaryExpression = 'UnaryExpression';
  AST.CallExpression = 'CallExpression';
  AST.MemberExpression = 'MemberExpression';
  AST.Identifier = 'Identifier';
  AST.Literal = 'Literal';
  AST.ArrayExpression = 'ArrayExpression';
  AST.Property = 'Property';
  AST.ObjectExpression = 'ObjectExpression';
  AST.ThisExpression = 'ThisExpression';
  AST.NGValueParameter = 'NGValueParameter';
  AST.prototype = {
    ast: function (text) {
      this.text = text;
      this.tokens = this.lexer.lex(text);
      var value = this.program();
      if (this.tokens.length !== 0) {
        this.throwError('is an unexpected token', this.tokens[0]);
      }
      return value;
    },
    program: function () {
      var body = [];
      while (true) {
        if (this.tokens.length > 0 && !this.peek('}', ')', ';', ']'))
          body.push(this.expressionStatement());
        if (!this.expect(';')) {
          return {
            type: AST.Program,
            body: body
          };
        }
      }
    },
    expressionStatement: function () {
      return {
        type: AST.ExpressionStatement,
        expression: this.filterChain()
      };
    },
    filterChain: function () {
      var left = this.expression();
      var token;
      while (token = this.expect('|')) {
        left = this.filter(left);
      }
      return left;
    },
    expression: function () {
      return this.assignment();
    },
    assignment: function () {
      var result = this.ternary();
      if (this.expect('=')) {
        result = {
          type: AST.AssignmentExpression,
          left: result,
          right: this.assignment(),
          operator: '='
        };
      }
      return result;
    },
    ternary: function () {
      var test = this.logicalOR();
      var alternate;
      var consequent;
      if (this.expect('?')) {
        alternate = this.expression();
        if (this.consume(':')) {
          consequent = this.expression();
          return {
            type: AST.ConditionalExpression,
            test: test,
            alternate: alternate,
            consequent: consequent
          };
        }
      }
      return test;
    },
    logicalOR: function () {
      var left = this.logicalAND();
      while (this.expect('||')) {
        left = {
          type: AST.LogicalExpression,
          operator: '||',
          left: left,
          right: this.logicalAND()
        };
      }
      return left;
    },
    logicalAND: function () {
      var left = this.equality();
      while (this.expect('&&')) {
        left = {
          type: AST.LogicalExpression,
          operator: '&&',
          left: left,
          right: this.equality()
        };
      }
      return left;
    },
    equality: function () {
      var left = this.relational();
      var token;
      while (token = this.expect('==', '!=', '===', '!==')) {
        left = {
          type: AST.BinaryExpression,
          operator: token.text,
          left: left,
          right: this.relational()
        };
      }
      return left;
    },
    relational: function () {
      var left = this.additive();
      var token;
      while (token = this.expect('<', '>', '<=', '>=')) {
        left = {
          type: AST.BinaryExpression,
          operator: token.text,
          left: left,
          right: this.additive()
        };
      }
      return left;
    },
    additive: function () {
      var left = this.multiplicative();
      var token;
      while (token = this.expect('+', '-')) {
        left = {
          type: AST.BinaryExpression,
          operator: token.text,
          left: left,
          right: this.multiplicative()
        };
      }
      return left;
    },
    multiplicative: function () {
      var left = this.unary();
      var token;
      while (token = this.expect('*', '/', '%')) {
        left = {
          type: AST.BinaryExpression,
          operator: token.text,
          left: left,
          right: this.unary()
        };
      }
      return left;
    },
    unary: function () {
      var token;
      if (token = this.expect('+', '-', '!')) {
        return {
          type: AST.UnaryExpression,
          operator: token.text,
          prefix: true,
          argument: this.unary()
        };
      } else {
        return this.primary();
      }
    },
    primary: function () {
      var primary;
      if (this.expect('(')) {
        primary = this.filterChain();
        this.consume(')');
      } else if (this.expect('[')) {
        primary = this.arrayDeclaration();
      } else if (this.expect('{')) {
        primary = this.object();
      } else if (this.constants.hasOwnProperty(this.peek().text)) {
        primary = copy(this.constants[this.consume().text]);
      } else if (this.peek().identifier) {
        primary = this.identifier();
      } else if (this.peek().constant) {
        primary = this.constant();
      } else {
        this.throwError('not a primary expression', this.peek());
      }
      var next;
      while (next = this.expect('(', '[', '.')) {
        if (next.text === '(') {
          primary = {
            type: AST.CallExpression,
            callee: primary,
            arguments: this.parseArguments()
          };
          this.consume(')');
        } else if (next.text === '[') {
          primary = {
            type: AST.MemberExpression,
            object: primary,
            property: this.expression(),
            computed: true
          };
          this.consume(']');
        } else if (next.text === '.') {
          primary = {
            type: AST.MemberExpression,
            object: primary,
            property: this.identifier(),
            computed: false
          };
        } else {
          this.throwError('IMPOSSIBLE');
        }
      }
      return primary;
    },
    filter: function (baseExpression) {
      var args = [baseExpression];
      var result = {
          type: AST.CallExpression,
          callee: this.identifier(),
          arguments: args,
          filter: true
        };
      while (this.expect(':')) {
        args.push(this.expression());
      }
      return result;
    },
    parseArguments: function () {
      var args = [];
      if (this.peekToken().text !== ')') {
        do {
          args.push(this.expression());
        } while (this.expect(','));
      }
      return args;
    },
    identifier: function () {
      var token = this.consume();
      if (!token.identifier) {
        this.throwError('is not a valid identifier', token);
      }
      return {
        type: AST.Identifier,
        name: token.text
      };
    },
    constant: function () {
      return {
        type: AST.Literal,
        value: this.consume().value
      };
    },
    arrayDeclaration: function () {
      var elements = [];
      if (this.peekToken().text !== ']') {
        do {
          if (this.peek(']')) {
            break;
          }
          elements.push(this.expression());
        } while (this.expect(','));
      }
      this.consume(']');
      return {
        type: AST.ArrayExpression,
        elements: elements
      };
    },
    object: function () {
      var properties = [], property;
      if (this.peekToken().text !== '}') {
        do {
          if (this.peek('}')) {
            break;
          }
          property = {
            type: AST.Property,
            kind: 'init'
          };
          if (this.peek().constant) {
            property.key = this.constant();
          } else if (this.peek().identifier) {
            property.key = this.identifier();
          } else {
            this.throwError('invalid key', this.peek());
          }
          this.consume(':');
          property.value = this.expression();
          properties.push(property);
        } while (this.expect(','));
      }
      this.consume('}');
      return {
        type: AST.ObjectExpression,
        properties: properties
      };
    },
    throwError: function (msg, token) {
      throw $parseMinErr('syntax', 'Syntax Error: Token \'{0}\' {1} at column {2} of the expression [{3}] starting at [{4}].', token.text, msg, token.index + 1, this.text, this.text.substring(token.index));
    },
    consume: function (e1) {
      if (this.tokens.length === 0) {
        throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
      }
      var token = this.expect(e1);
      if (!token) {
        this.throwError('is unexpected, expecting [' + e1 + ']', this.peek());
      }
      return token;
    },
    peekToken: function () {
      if (this.tokens.length === 0) {
        throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
      }
      return this.tokens[0];
    },
    peek: function (e1, e2, e3, e4) {
      return this.peekAhead(0, e1, e2, e3, e4);
    },
    peekAhead: function (i, e1, e2, e3, e4) {
      if (this.tokens.length > i) {
        var token = this.tokens[i];
        var t = token.text;
        if (t === e1 || t === e2 || t === e3 || t === e4 || !e1 && !e2 && !e3 && !e4) {
          return token;
        }
      }
      return false;
    },
    expect: function (e1, e2, e3, e4) {
      var token = this.peek(e1, e2, e3, e4);
      if (token) {
        this.tokens.shift();
        return token;
      }
      return false;
    },
    constants: {
      'true': {
        type: AST.Literal,
        value: true
      },
      'false': {
        type: AST.Literal,
        value: false
      },
      'null': {
        type: AST.Literal,
        value: null
      },
      'undefined': {
        type: AST.Literal,
        value: undefined
      },
      'this': { type: AST.ThisExpression }
    }
  };
  function ifDefined(v, d) {
    return typeof v !== 'undefined' ? v : d;
  }
  function plusFn(l, r) {
    if (typeof l === 'undefined')
      return r;
    if (typeof r === 'undefined')
      return l;
    return l + r;
  }
  function isStateless($filter, filterName) {
    var fn = $filter(filterName);
    return !fn.$stateful;
  }
  function findConstantAndWatchExpressions(ast, $filter) {
    var allConstants;
    var argsToWatch;
    switch (ast.type) {
    case AST.Program:
      allConstants = true;
      forEach(ast.body, function (expr) {
        findConstantAndWatchExpressions(expr.expression, $filter);
        allConstants = allConstants && expr.expression.constant;
      });
      ast.constant = allConstants;
      break;
    case AST.Literal:
      ast.constant = true;
      ast.toWatch = [];
      break;
    case AST.UnaryExpression:
      findConstantAndWatchExpressions(ast.argument, $filter);
      ast.constant = ast.argument.constant;
      ast.toWatch = ast.argument.toWatch;
      break;
    case AST.BinaryExpression:
      findConstantAndWatchExpressions(ast.left, $filter);
      findConstantAndWatchExpressions(ast.right, $filter);
      ast.constant = ast.left.constant && ast.right.constant;
      ast.toWatch = ast.left.toWatch.concat(ast.right.toWatch);
      break;
    case AST.LogicalExpression:
      findConstantAndWatchExpressions(ast.left, $filter);
      findConstantAndWatchExpressions(ast.right, $filter);
      ast.constant = ast.left.constant && ast.right.constant;
      ast.toWatch = ast.constant ? [] : [ast];
      break;
    case AST.ConditionalExpression:
      findConstantAndWatchExpressions(ast.test, $filter);
      findConstantAndWatchExpressions(ast.alternate, $filter);
      findConstantAndWatchExpressions(ast.consequent, $filter);
      ast.constant = ast.test.constant && ast.alternate.constant && ast.consequent.constant;
      ast.toWatch = ast.constant ? [] : [ast];
      break;
    case AST.Identifier:
      ast.constant = false;
      ast.toWatch = [ast];
      break;
    case AST.MemberExpression:
      findConstantAndWatchExpressions(ast.object, $filter);
      if (ast.computed) {
        findConstantAndWatchExpressions(ast.property, $filter);
      }
      ast.constant = ast.object.constant && (!ast.computed || ast.property.constant);
      ast.toWatch = [ast];
      break;
    case AST.CallExpression:
      allConstants = ast.filter ? isStateless($filter, ast.callee.name) : false;
      argsToWatch = [];
      forEach(ast.arguments, function (expr) {
        findConstantAndWatchExpressions(expr, $filter);
        allConstants = allConstants && expr.constant;
        if (!expr.constant) {
          argsToWatch.push.apply(argsToWatch, expr.toWatch);
        }
      });
      ast.constant = allConstants;
      ast.toWatch = ast.filter && isStateless($filter, ast.callee.name) ? argsToWatch : [ast];
      break;
    case AST.AssignmentExpression:
      findConstantAndWatchExpressions(ast.left, $filter);
      findConstantAndWatchExpressions(ast.right, $filter);
      ast.constant = ast.left.constant && ast.right.constant;
      ast.toWatch = [ast];
      break;
    case AST.ArrayExpression:
      allConstants = true;
      argsToWatch = [];
      forEach(ast.elements, function (expr) {
        findConstantAndWatchExpressions(expr, $filter);
        allConstants = allConstants && expr.constant;
        if (!expr.constant) {
          argsToWatch.push.apply(argsToWatch, expr.toWatch);
        }
      });
      ast.constant = allConstants;
      ast.toWatch = argsToWatch;
      break;
    case AST.ObjectExpression:
      allConstants = true;
      argsToWatch = [];
      forEach(ast.properties, function (property) {
        findConstantAndWatchExpressions(property.value, $filter);
        allConstants = allConstants && property.value.constant;
        if (!property.value.constant) {
          argsToWatch.push.apply(argsToWatch, property.value.toWatch);
        }
      });
      ast.constant = allConstants;
      ast.toWatch = argsToWatch;
      break;
    case AST.ThisExpression:
      ast.constant = false;
      ast.toWatch = [];
      break;
    }
  }
  function getInputs(body) {
    if (body.length != 1)
      return;
    var lastExpression = body[0].expression;
    var candidate = lastExpression.toWatch;
    if (candidate.length !== 1)
      return candidate;
    return candidate[0] !== lastExpression ? candidate : undefined;
  }
  function isAssignable(ast) {
    return ast.type === AST.Identifier || ast.type === AST.MemberExpression;
  }
  function assignableAST(ast) {
    if (ast.body.length === 1 && isAssignable(ast.body[0].expression)) {
      return {
        type: AST.AssignmentExpression,
        left: ast.body[0].expression,
        right: { type: AST.NGValueParameter },
        operator: '='
      };
    }
  }
  function isLiteral(ast) {
    return ast.body.length === 0 || ast.body.length === 1 && (ast.body[0].expression.type === AST.Literal || ast.body[0].expression.type === AST.ArrayExpression || ast.body[0].expression.type === AST.ObjectExpression);
  }
  function isConstant(ast) {
    return ast.constant;
  }
  function ASTCompiler(astBuilder, $filter) {
    this.astBuilder = astBuilder;
    this.$filter = $filter;
  }
  ASTCompiler.prototype = {
    compile: function (expression, expensiveChecks) {
      var self = this;
      var ast = this.astBuilder.ast(expression);
      this.state = {
        nextId: 0,
        filters: {},
        expensiveChecks: expensiveChecks,
        fn: {
          vars: [],
          body: [],
          own: {}
        },
        assign: {
          vars: [],
          body: [],
          own: {}
        },
        inputs: []
      };
      findConstantAndWatchExpressions(ast, self.$filter);
      var extra = '';
      var assignable;
      this.stage = 'assign';
      if (assignable = assignableAST(ast)) {
        this.state.computing = 'assign';
        var result = this.nextId();
        this.recurse(assignable, result);
        extra = 'fn.assign=' + this.generateFunction('assign', 's,v,l');
      }
      var toWatch = getInputs(ast.body);
      self.stage = 'inputs';
      forEach(toWatch, function (watch, key) {
        var fnKey = 'fn' + key;
        self.state[fnKey] = {
          vars: [],
          body: [],
          own: {}
        };
        self.state.computing = fnKey;
        var intoId = self.nextId();
        self.recurse(watch, intoId);
        self.return_(intoId);
        self.state.inputs.push(fnKey);
        watch.watchId = key;
      });
      this.state.computing = 'fn';
      this.stage = 'main';
      this.recurse(ast);
      var fnString = '"' + this.USE + ' ' + this.STRICT + '";\n' + this.filterPrefix() + 'var fn=' + this.generateFunction('fn', 's,l,a,i') + extra + this.watchFns() + 'return fn;';
      var fn = new Function('$filter', 'ensureSafeMemberName', 'ensureSafeObject', 'ensureSafeFunction', 'ifDefined', 'plus', 'text', fnString)(this.$filter, ensureSafeMemberName, ensureSafeObject, ensureSafeFunction, ifDefined, plusFn, expression);
      this.state = this.stage = undefined;
      fn.literal = isLiteral(ast);
      fn.constant = isConstant(ast);
      return fn;
    },
    USE: 'use',
    STRICT: 'strict',
    watchFns: function () {
      var result = [];
      var fns = this.state.inputs;
      var self = this;
      forEach(fns, function (name) {
        result.push('var ' + name + '=' + self.generateFunction(name, 's'));
      });
      if (fns.length) {
        result.push('fn.inputs=[' + fns.join(',') + '];');
      }
      return result.join('');
    },
    generateFunction: function (name, params) {
      return 'function(' + params + '){' + this.varsPrefix(name) + this.body(name) + '};';
    },
    filterPrefix: function () {
      var parts = [];
      var self = this;
      forEach(this.state.filters, function (id, filter) {
        parts.push(id + '=$filter(' + self.escape(filter) + ')');
      });
      if (parts.length)
        return 'var ' + parts.join(',') + ';';
      return '';
    },
    varsPrefix: function (section) {
      return this.state[section].vars.length ? 'var ' + this.state[section].vars.join(',') + ';' : '';
    },
    body: function (section) {
      return this.state[section].body.join('');
    },
    recurse: function (ast, intoId, nameId, recursionFn, create, skipWatchIdCheck) {
      var left, right, self = this, args, expression;
      recursionFn = recursionFn || noop;
      if (!skipWatchIdCheck && isDefined(ast.watchId)) {
        intoId = intoId || this.nextId();
        this.if_('i', this.lazyAssign(intoId, this.computedMember('i', ast.watchId)), this.lazyRecurse(ast, intoId, nameId, recursionFn, create, true));
        return;
      }
      switch (ast.type) {
      case AST.Program:
        forEach(ast.body, function (expression, pos) {
          self.recurse(expression.expression, undefined, undefined, function (expr) {
            right = expr;
          });
          if (pos !== ast.body.length - 1) {
            self.current().body.push(right, ';');
          } else {
            self.return_(right);
          }
        });
        break;
      case AST.Literal:
        expression = this.escape(ast.value);
        this.assign(intoId, expression);
        recursionFn(expression);
        break;
      case AST.UnaryExpression:
        this.recurse(ast.argument, undefined, undefined, function (expr) {
          right = expr;
        });
        expression = ast.operator + '(' + this.ifDefined(right, 0) + ')';
        this.assign(intoId, expression);
        recursionFn(expression);
        break;
      case AST.BinaryExpression:
        this.recurse(ast.left, undefined, undefined, function (expr) {
          left = expr;
        });
        this.recurse(ast.right, undefined, undefined, function (expr) {
          right = expr;
        });
        if (ast.operator === '+') {
          expression = this.plus(left, right);
        } else if (ast.operator === '-') {
          expression = this.ifDefined(left, 0) + ast.operator + this.ifDefined(right, 0);
        } else {
          expression = '(' + left + ')' + ast.operator + '(' + right + ')';
        }
        this.assign(intoId, expression);
        recursionFn(expression);
        break;
      case AST.LogicalExpression:
        intoId = intoId || this.nextId();
        self.recurse(ast.left, intoId);
        self.if_(ast.operator === '&&' ? intoId : self.not(intoId), self.lazyRecurse(ast.right, intoId));
        recursionFn(intoId);
        break;
      case AST.ConditionalExpression:
        intoId = intoId || this.nextId();
        self.recurse(ast.test, intoId);
        self.if_(intoId, self.lazyRecurse(ast.alternate, intoId), self.lazyRecurse(ast.consequent, intoId));
        recursionFn(intoId);
        break;
      case AST.Identifier:
        intoId = intoId || this.nextId();
        if (nameId) {
          nameId.context = self.stage === 'inputs' ? 's' : this.assign(this.nextId(), this.getHasOwnProperty('l', ast.name) + '?l:s');
          nameId.computed = false;
          nameId.name = ast.name;
        }
        ensureSafeMemberName(ast.name);
        self.if_(self.stage === 'inputs' || self.not(self.getHasOwnProperty('l', ast.name)), function () {
          self.if_(self.stage === 'inputs' || 's', function () {
            if (create && create !== 1) {
              self.if_(self.not(self.nonComputedMember('s', ast.name)), self.lazyAssign(self.nonComputedMember('s', ast.name), '{}'));
            }
            self.assign(intoId, self.nonComputedMember('s', ast.name));
          });
        }, intoId && self.lazyAssign(intoId, self.nonComputedMember('l', ast.name)));
        if (self.state.expensiveChecks || isPossiblyDangerousMemberName(ast.name)) {
          self.addEnsureSafeObject(intoId);
        }
        recursionFn(intoId);
        break;
      case AST.MemberExpression:
        left = nameId && (nameId.context = this.nextId()) || this.nextId();
        intoId = intoId || this.nextId();
        self.recurse(ast.object, left, undefined, function () {
          self.if_(self.notNull(left), function () {
            if (ast.computed) {
              right = self.nextId();
              self.recurse(ast.property, right);
              self.addEnsureSafeMemberName(right);
              if (create && create !== 1) {
                self.if_(self.not(self.computedMember(left, right)), self.lazyAssign(self.computedMember(left, right), '{}'));
              }
              expression = self.ensureSafeObject(self.computedMember(left, right));
              self.assign(intoId, expression);
              if (nameId) {
                nameId.computed = true;
                nameId.name = right;
              }
            } else {
              ensureSafeMemberName(ast.property.name);
              if (create && create !== 1) {
                self.if_(self.not(self.nonComputedMember(left, ast.property.name)), self.lazyAssign(self.nonComputedMember(left, ast.property.name), '{}'));
              }
              expression = self.nonComputedMember(left, ast.property.name);
              if (self.state.expensiveChecks || isPossiblyDangerousMemberName(ast.property.name)) {
                expression = self.ensureSafeObject(expression);
              }
              self.assign(intoId, expression);
              if (nameId) {
                nameId.computed = false;
                nameId.name = ast.property.name;
              }
            }
            recursionFn(intoId);
          });
        }, !!create);
        break;
      case AST.CallExpression:
        intoId = intoId || this.nextId();
        if (ast.filter) {
          right = self.filter(ast.callee.name);
          args = [];
          forEach(ast.arguments, function (expr) {
            var argument = self.nextId();
            self.recurse(expr, argument);
            args.push(argument);
          });
          expression = right + '(' + args.join(',') + ')';
          self.assign(intoId, expression);
          recursionFn(intoId);
        } else {
          right = self.nextId();
          left = {};
          args = [];
          self.recurse(ast.callee, right, left, function () {
            self.if_(self.notNull(right), function () {
              self.addEnsureSafeFunction(right);
              forEach(ast.arguments, function (expr) {
                self.recurse(expr, self.nextId(), undefined, function (argument) {
                  args.push(self.ensureSafeObject(argument));
                });
              });
              if (left.name) {
                if (!self.state.expensiveChecks) {
                  self.addEnsureSafeObject(left.context);
                }
                expression = self.member(left.context, left.name, left.computed) + '(' + args.join(',') + ')';
              } else {
                expression = right + '(' + args.join(',') + ')';
              }
              expression = self.ensureSafeObject(expression);
              self.assign(intoId, expression);
              recursionFn(intoId);
            });
          });
        }
        break;
      case AST.AssignmentExpression:
        right = this.nextId();
        left = {};
        if (!isAssignable(ast.left)) {
          throw $parseMinErr('lval', 'Trying to assing a value to a non l-value');
        }
        this.recurse(ast.left, undefined, left, function () {
          self.if_(self.notNull(left.context), function () {
            self.recurse(ast.right, right);
            self.addEnsureSafeObject(self.member(left.context, left.name, left.computed));
            expression = self.member(left.context, left.name, left.computed) + ast.operator + right;
            self.assign(intoId, expression);
            recursionFn(intoId || expression);
          });
        }, 1);
        break;
      case AST.ArrayExpression:
        args = [];
        forEach(ast.elements, function (expr) {
          self.recurse(expr, self.nextId(), undefined, function (argument) {
            args.push(argument);
          });
        });
        expression = '[' + args.join(',') + ']';
        this.assign(intoId, expression);
        recursionFn(expression);
        break;
      case AST.ObjectExpression:
        args = [];
        forEach(ast.properties, function (property) {
          self.recurse(property.value, self.nextId(), undefined, function (expr) {
            args.push(self.escape(property.key.type === AST.Identifier ? property.key.name : '' + property.key.value) + ':' + expr);
          });
        });
        expression = '{' + args.join(',') + '}';
        this.assign(intoId, expression);
        recursionFn(expression);
        break;
      case AST.ThisExpression:
        this.assign(intoId, 's');
        recursionFn('s');
        break;
      case AST.NGValueParameter:
        this.assign(intoId, 'v');
        recursionFn('v');
        break;
      }
    },
    getHasOwnProperty: function (element, property) {
      var key = element + '.' + property;
      var own = this.current().own;
      if (!own.hasOwnProperty(key)) {
        own[key] = this.nextId(false, element + '&&(' + this.escape(property) + ' in ' + element + ')');
      }
      return own[key];
    },
    assign: function (id, value) {
      if (!id)
        return;
      this.current().body.push(id, '=', value, ';');
      return id;
    },
    filter: function (filterName) {
      if (!this.state.filters.hasOwnProperty(filterName)) {
        this.state.filters[filterName] = this.nextId(true);
      }
      return this.state.filters[filterName];
    },
    ifDefined: function (id, defaultValue) {
      return 'ifDefined(' + id + ',' + this.escape(defaultValue) + ')';
    },
    plus: function (left, right) {
      return 'plus(' + left + ',' + right + ')';
    },
    return_: function (id) {
      this.current().body.push('return ', id, ';');
    },
    if_: function (test, alternate, consequent) {
      if (test === true) {
        alternate();
      } else {
        var body = this.current().body;
        body.push('if(', test, '){');
        alternate();
        body.push('}');
        if (consequent) {
          body.push('else{');
          consequent();
          body.push('}');
        }
      }
    },
    not: function (expression) {
      return '!(' + expression + ')';
    },
    notNull: function (expression) {
      return expression + '!=null';
    },
    nonComputedMember: function (left, right) {
      return left + '.' + right;
    },
    computedMember: function (left, right) {
      return left + '[' + right + ']';
    },
    member: function (left, right, computed) {
      if (computed)
        return this.computedMember(left, right);
      return this.nonComputedMember(left, right);
    },
    addEnsureSafeObject: function (item) {
      this.current().body.push(this.ensureSafeObject(item), ';');
    },
    addEnsureSafeMemberName: function (item) {
      this.current().body.push(this.ensureSafeMemberName(item), ';');
    },
    addEnsureSafeFunction: function (item) {
      this.current().body.push(this.ensureSafeFunction(item), ';');
    },
    ensureSafeObject: function (item) {
      return 'ensureSafeObject(' + item + ',text)';
    },
    ensureSafeMemberName: function (item) {
      return 'ensureSafeMemberName(' + item + ',text)';
    },
    ensureSafeFunction: function (item) {
      return 'ensureSafeFunction(' + item + ',text)';
    },
    lazyRecurse: function (ast, intoId, nameId, recursionFn, create, skipWatchIdCheck) {
      var self = this;
      return function () {
        self.recurse(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck);
      };
    },
    lazyAssign: function (id, value) {
      var self = this;
      return function () {
        self.assign(id, value);
      };
    },
    stringEscapeRegex: /[^ a-zA-Z0-9]/g,
    stringEscapeFn: function (c) {
      return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
    },
    escape: function (value) {
      if (isString(value))
        return '\'' + value.replace(this.stringEscapeRegex, this.stringEscapeFn) + '\'';
      if (isNumber(value))
        return value.toString();
      if (value === true)
        return 'true';
      if (value === false)
        return 'false';
      if (value === null)
        return 'null';
      if (typeof value === 'undefined')
        return 'undefined';
      throw $parseMinErr('esc', 'IMPOSSIBLE');
    },
    nextId: function (skip, init) {
      var id = 'v' + this.state.nextId++;
      if (!skip) {
        this.current().vars.push(id + (init ? '=' + init : ''));
      }
      return id;
    },
    current: function () {
      return this.state[this.state.computing];
    }
  };
  function ASTInterpreter(astBuilder, $filter) {
    this.astBuilder = astBuilder;
    this.$filter = $filter;
  }
  ASTInterpreter.prototype = {
    compile: function (expression, expensiveChecks) {
      var self = this;
      var ast = this.astBuilder.ast(expression);
      this.expression = expression;
      this.expensiveChecks = expensiveChecks;
      findConstantAndWatchExpressions(ast, self.$filter);
      var assignable;
      var assign;
      if (assignable = assignableAST(ast)) {
        assign = this.recurse(assignable);
      }
      var toWatch = getInputs(ast.body);
      var inputs;
      if (toWatch) {
        inputs = [];
        forEach(toWatch, function (watch, key) {
          var input = self.recurse(watch);
          watch.input = input;
          inputs.push(input);
          watch.watchId = key;
        });
      }
      var expressions = [];
      forEach(ast.body, function (expression) {
        expressions.push(self.recurse(expression.expression));
      });
      var fn = ast.body.length === 0 ? function () {
        } : ast.body.length === 1 ? expressions[0] : function (scope, locals) {
          var lastValue;
          forEach(expressions, function (exp) {
            lastValue = exp(scope, locals);
          });
          return lastValue;
        };
      if (assign) {
        fn.assign = function (scope, value, locals) {
          return assign(scope, locals, value);
        };
      }
      if (inputs) {
        fn.inputs = inputs;
      }
      fn.literal = isLiteral(ast);
      fn.constant = isConstant(ast);
      return fn;
    },
    recurse: function (ast, context, create) {
      var left, right, self = this, args, expression;
      if (ast.input) {
        return this.inputs(ast.input, ast.watchId);
      }
      switch (ast.type) {
      case AST.Literal:
        return this.value(ast.value, context);
      case AST.UnaryExpression:
        right = this.recurse(ast.argument);
        return this['unary' + ast.operator](right, context);
      case AST.BinaryExpression:
        left = this.recurse(ast.left);
        right = this.recurse(ast.right);
        return this['binary' + ast.operator](left, right, context);
      case AST.LogicalExpression:
        left = this.recurse(ast.left);
        right = this.recurse(ast.right);
        return this['binary' + ast.operator](left, right, context);
      case AST.ConditionalExpression:
        return this['ternary?:'](this.recurse(ast.test), this.recurse(ast.alternate), this.recurse(ast.consequent), context);
      case AST.Identifier:
        ensureSafeMemberName(ast.name, self.expression);
        return self.identifier(ast.name, self.expensiveChecks || isPossiblyDangerousMemberName(ast.name), context, create, self.expression);
      case AST.MemberExpression:
        left = this.recurse(ast.object, false, !!create);
        if (!ast.computed) {
          ensureSafeMemberName(ast.property.name, self.expression);
          right = ast.property.name;
        }
        if (ast.computed)
          right = this.recurse(ast.property);
        return ast.computed ? this.computedMember(left, right, context, create, self.expression) : this.nonComputedMember(left, right, self.expensiveChecks, context, create, self.expression);
      case AST.CallExpression:
        args = [];
        forEach(ast.arguments, function (expr) {
          args.push(self.recurse(expr));
        });
        if (ast.filter)
          right = this.$filter(ast.callee.name);
        if (!ast.filter)
          right = this.recurse(ast.callee, true);
        return ast.filter ? function (scope, locals, assign, inputs) {
          var values = [];
          for (var i = 0; i < args.length; ++i) {
            values.push(args[i](scope, locals, assign, inputs));
          }
          var value = right.apply(undefined, values, inputs);
          return context ? {
            context: undefined,
            name: undefined,
            value: value
          } : value;
        } : function (scope, locals, assign, inputs) {
          var rhs = right(scope, locals, assign, inputs);
          var value;
          if (rhs.value != null) {
            ensureSafeObject(rhs.context, self.expression);
            ensureSafeFunction(rhs.value, self.expression);
            var values = [];
            for (var i = 0; i < args.length; ++i) {
              values.push(ensureSafeObject(args[i](scope, locals, assign, inputs), self.expression));
            }
            value = ensureSafeObject(rhs.value.apply(rhs.context, values), self.expression);
          }
          return context ? { value: value } : value;
        };
      case AST.AssignmentExpression:
        left = this.recurse(ast.left, true, 1);
        right = this.recurse(ast.right);
        return function (scope, locals, assign, inputs) {
          var lhs = left(scope, locals, assign, inputs);
          var rhs = right(scope, locals, assign, inputs);
          ensureSafeObject(lhs.value, self.expression);
          lhs.context[lhs.name] = rhs;
          return context ? { value: rhs } : rhs;
        };
      case AST.ArrayExpression:
        args = [];
        forEach(ast.elements, function (expr) {
          args.push(self.recurse(expr));
        });
        return function (scope, locals, assign, inputs) {
          var value = [];
          for (var i = 0; i < args.length; ++i) {
            value.push(args[i](scope, locals, assign, inputs));
          }
          return context ? { value: value } : value;
        };
      case AST.ObjectExpression:
        args = [];
        forEach(ast.properties, function (property) {
          args.push({
            key: property.key.type === AST.Identifier ? property.key.name : '' + property.key.value,
            value: self.recurse(property.value)
          });
        });
        return function (scope, locals, assign, inputs) {
          var value = {};
          for (var i = 0; i < args.length; ++i) {
            value[args[i].key] = args[i].value(scope, locals, assign, inputs);
          }
          return context ? { value: value } : value;
        };
      case AST.ThisExpression:
        return function (scope) {
          return context ? { value: scope } : scope;
        };
      case AST.NGValueParameter:
        return function (scope, locals, assign, inputs) {
          return context ? { value: assign } : assign;
        };
      }
    },
    'unary+': function (argument, context) {
      return function (scope, locals, assign, inputs) {
        var arg = argument(scope, locals, assign, inputs);
        if (isDefined(arg)) {
          arg = +arg;
        } else {
          arg = 0;
        }
        return context ? { value: arg } : arg;
      };
    },
    'unary-': function (argument, context) {
      return function (scope, locals, assign, inputs) {
        var arg = argument(scope, locals, assign, inputs);
        if (isDefined(arg)) {
          arg = -arg;
        } else {
          arg = 0;
        }
        return context ? { value: arg } : arg;
      };
    },
    'unary!': function (argument, context) {
      return function (scope, locals, assign, inputs) {
        var arg = !argument(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    'binary+': function (left, right, context) {
      return function (scope, locals, assign, inputs) {
        var lhs = left(scope, locals, assign, inputs);
        var rhs = right(scope, locals, assign, inputs);
        var arg = plusFn(lhs, rhs);
        return context ? { value: arg } : arg;
      };
    },
    'binary-': function (left, right, context) {
      return function (scope, locals, assign, inputs) {
        var lhs = left(scope, locals, assign, inputs);
        var rhs = right(scope, locals, assign, inputs);
        var arg = (isDefined(lhs) ? lhs : 0) - (isDefined(rhs) ? rhs : 0);
        return context ? { value: arg } : arg;
      };
    },
    'binary*': function (left, right, context) {
      return function (scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) * right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    'binary/': function (left, right, context) {
      return function (scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) / right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    'binary%': function (left, right, context) {
      return function (scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) % right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    'binary===': function (left, right, context) {
      return function (scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) === right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    'binary!==': function (left, right, context) {
      return function (scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) !== right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    'binary==': function (left, right, context) {
      return function (scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) == right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    'binary!=': function (left, right, context) {
      return function (scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) != right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    'binary<': function (left, right, context) {
      return function (scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) < right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    'binary>': function (left, right, context) {
      return function (scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) > right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    'binary<=': function (left, right, context) {
      return function (scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) <= right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    'binary>=': function (left, right, context) {
      return function (scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) >= right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    'binary&&': function (left, right, context) {
      return function (scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) && right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    'binary||': function (left, right, context) {
      return function (scope, locals, assign, inputs) {
        var arg = left(scope, locals, assign, inputs) || right(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    'ternary?:': function (test, alternate, consequent, context) {
      return function (scope, locals, assign, inputs) {
        var arg = test(scope, locals, assign, inputs) ? alternate(scope, locals, assign, inputs) : consequent(scope, locals, assign, inputs);
        return context ? { value: arg } : arg;
      };
    },
    value: function (value, context) {
      return function () {
        return context ? {
          context: undefined,
          name: undefined,
          value: value
        } : value;
      };
    },
    identifier: function (name, expensiveChecks, context, create, expression) {
      return function (scope, locals, assign, inputs) {
        var base = locals && name in locals ? locals : scope;
        if (create && create !== 1 && base && !base[name]) {
          base[name] = {};
        }
        var value = base ? base[name] : undefined;
        if (expensiveChecks) {
          ensureSafeObject(value, expression);
        }
        if (context) {
          return {
            context: base,
            name: name,
            value: value
          };
        } else {
          return value;
        }
      };
    },
    computedMember: function (left, right, context, create, expression) {
      return function (scope, locals, assign, inputs) {
        var lhs = left(scope, locals, assign, inputs);
        var rhs;
        var value;
        if (lhs != null) {
          rhs = right(scope, locals, assign, inputs);
          ensureSafeMemberName(rhs, expression);
          if (create && create !== 1 && lhs && !lhs[rhs]) {
            lhs[rhs] = {};
          }
          value = lhs[rhs];
          ensureSafeObject(value, expression);
        }
        if (context) {
          return {
            context: lhs,
            name: rhs,
            value: value
          };
        } else {
          return value;
        }
      };
    },
    nonComputedMember: function (left, right, expensiveChecks, context, create, expression) {
      return function (scope, locals, assign, inputs) {
        var lhs = left(scope, locals, assign, inputs);
        if (create && create !== 1 && lhs && !lhs[right]) {
          lhs[right] = {};
        }
        var value = lhs != null ? lhs[right] : undefined;
        if (expensiveChecks || isPossiblyDangerousMemberName(right)) {
          ensureSafeObject(value, expression);
        }
        if (context) {
          return {
            context: lhs,
            name: right,
            value: value
          };
        } else {
          return value;
        }
      };
    },
    inputs: function (input, watchId) {
      return function (scope, value, locals, inputs) {
        if (inputs)
          return inputs[watchId];
        return input(scope, value, locals);
      };
    }
  };
  var Parser = function (lexer, $filter, options) {
    this.lexer = lexer;
    this.$filter = $filter;
    this.options = options;
    this.ast = new AST(this.lexer);
    this.astCompiler = options.csp ? new ASTInterpreter(this.ast, $filter) : new ASTCompiler(this.ast, $filter);
  };
  Parser.prototype = {
    constructor: Parser,
    parse: function (text) {
      return this.astCompiler.compile(text, this.options.expensiveChecks);
    }
  };
  function setter(obj, path, setValue, fullExp) {
    ensureSafeObject(obj, fullExp);
    var element = path.split('.'), key;
    for (var i = 0; element.length > 1; i++) {
      key = ensureSafeMemberName(element.shift(), fullExp);
      var propertyObj = ensureSafeObject(obj[key], fullExp);
      if (!propertyObj) {
        propertyObj = {};
        obj[key] = propertyObj;
      }
      obj = propertyObj;
    }
    key = ensureSafeMemberName(element.shift(), fullExp);
    ensureSafeObject(obj[key], fullExp);
    obj[key] = setValue;
    return setValue;
  }
  var getterFnCacheDefault = createMap();
  var getterFnCacheExpensive = createMap();
  function isPossiblyDangerousMemberName(name) {
    return name == 'constructor';
  }
  var objectValueOf = Object.prototype.valueOf;
  function getValueOf(value) {
    return isFunction(value.valueOf) ? value.valueOf() : objectValueOf.call(value);
  }
  function $ParseProvider() {
    var cacheDefault = createMap();
    var cacheExpensive = createMap();
    this.$get = [
      '$filter',
      '$sniffer',
      function ($filter, $sniffer) {
        var $parseOptions = {
            csp: $sniffer.csp,
            expensiveChecks: false
          }, $parseOptionsExpensive = {
            csp: $sniffer.csp,
            expensiveChecks: true
          };
        return function $parse(exp, interceptorFn, expensiveChecks) {
          var parsedExpression, oneTime, cacheKey;
          switch (typeof exp) {
          case 'string':
            exp = exp.trim();
            cacheKey = exp;
            var cache = expensiveChecks ? cacheExpensive : cacheDefault;
            parsedExpression = cache[cacheKey];
            if (!parsedExpression) {
              if (exp.charAt(0) === ':' && exp.charAt(1) === ':') {
                oneTime = true;
                exp = exp.substring(2);
              }
              var parseOptions = expensiveChecks ? $parseOptionsExpensive : $parseOptions;
              var lexer = new Lexer(parseOptions);
              var parser = new Parser(lexer, $filter, parseOptions);
              parsedExpression = parser.parse(exp);
              if (parsedExpression.constant) {
                parsedExpression.$$watchDelegate = constantWatchDelegate;
              } else if (oneTime) {
                parsedExpression.$$watchDelegate = parsedExpression.literal ? oneTimeLiteralWatchDelegate : oneTimeWatchDelegate;
              } else if (parsedExpression.inputs) {
                parsedExpression.$$watchDelegate = inputsWatchDelegate;
              }
              cache[cacheKey] = parsedExpression;
            }
            return addInterceptor(parsedExpression, interceptorFn);
          case 'function':
            return addInterceptor(exp, interceptorFn);
          default:
            return noop;
          }
        };
        function expressionInputDirtyCheck(newValue, oldValueOfValue) {
          if (newValue == null || oldValueOfValue == null) {
            return newValue === oldValueOfValue;
          }
          if (typeof newValue === 'object') {
            newValue = getValueOf(newValue);
            if (typeof newValue === 'object') {
              return false;
            }
          }
          return newValue === oldValueOfValue || newValue !== newValue && oldValueOfValue !== oldValueOfValue;
        }
        function inputsWatchDelegate(scope, listener, objectEquality, parsedExpression, prettyPrintExpression) {
          var inputExpressions = parsedExpression.inputs;
          var lastResult;
          if (inputExpressions.length === 1) {
            var oldInputValueOf = expressionInputDirtyCheck;
            inputExpressions = inputExpressions[0];
            return scope.$watch(function expressionInputWatch(scope) {
              var newInputValue = inputExpressions(scope);
              if (!expressionInputDirtyCheck(newInputValue, oldInputValueOf)) {
                lastResult = parsedExpression(scope, undefined, undefined, [newInputValue]);
                oldInputValueOf = newInputValue && getValueOf(newInputValue);
              }
              return lastResult;
            }, listener, objectEquality, prettyPrintExpression);
          }
          var oldInputValueOfValues = [];
          var oldInputValues = [];
          for (var i = 0, ii = inputExpressions.length; i < ii; i++) {
            oldInputValueOfValues[i] = expressionInputDirtyCheck;
            oldInputValues[i] = null;
          }
          return scope.$watch(function expressionInputsWatch(scope) {
            var changed = false;
            for (var i = 0, ii = inputExpressions.length; i < ii; i++) {
              var newInputValue = inputExpressions[i](scope);
              if (changed || (changed = !expressionInputDirtyCheck(newInputValue, oldInputValueOfValues[i]))) {
                oldInputValues[i] = newInputValue;
                oldInputValueOfValues[i] = newInputValue && getValueOf(newInputValue);
              }
            }
            if (changed) {
              lastResult = parsedExpression(scope, undefined, undefined, oldInputValues);
            }
            return lastResult;
          }, listener, objectEquality, prettyPrintExpression);
        }
        function oneTimeWatchDelegate(scope, listener, objectEquality, parsedExpression) {
          var unwatch, lastValue;
          return unwatch = scope.$watch(function oneTimeWatch(scope) {
            return parsedExpression(scope);
          }, function oneTimeListener(value, old, scope) {
            lastValue = value;
            if (isFunction(listener)) {
              listener.apply(this, arguments);
            }
            if (isDefined(value)) {
              scope.$$postDigest(function () {
                if (isDefined(lastValue)) {
                  unwatch();
                }
              });
            }
          }, objectEquality);
        }
        function oneTimeLiteralWatchDelegate(scope, listener, objectEquality, parsedExpression) {
          var unwatch, lastValue;
          return unwatch = scope.$watch(function oneTimeWatch(scope) {
            return parsedExpression(scope);
          }, function oneTimeListener(value, old, scope) {
            lastValue = value;
            if (isFunction(listener)) {
              listener.call(this, value, old, scope);
            }
            if (isAllDefined(value)) {
              scope.$$postDigest(function () {
                if (isAllDefined(lastValue))
                  unwatch();
              });
            }
          }, objectEquality);
          function isAllDefined(value) {
            var allDefined = true;
            forEach(value, function (val) {
              if (!isDefined(val))
                allDefined = false;
            });
            return allDefined;
          }
        }
        function constantWatchDelegate(scope, listener, objectEquality, parsedExpression) {
          var unwatch;
          return unwatch = scope.$watch(function constantWatch(scope) {
            return parsedExpression(scope);
          }, function constantListener(value, old, scope) {
            if (isFunction(listener)) {
              listener.apply(this, arguments);
            }
            unwatch();
          }, objectEquality);
        }
        function addInterceptor(parsedExpression, interceptorFn) {
          if (!interceptorFn)
            return parsedExpression;
          var watchDelegate = parsedExpression.$$watchDelegate;
          var regularWatch = watchDelegate !== oneTimeLiteralWatchDelegate && watchDelegate !== oneTimeWatchDelegate;
          var fn = regularWatch ? function regularInterceptedExpression(scope, locals, assign, inputs) {
              var value = parsedExpression(scope, locals, assign, inputs);
              return interceptorFn(value, scope, locals);
            } : function oneTimeInterceptedExpression(scope, locals, assign, inputs) {
              var value = parsedExpression(scope, locals, assign, inputs);
              var result = interceptorFn(value, scope, locals);
              return isDefined(value) ? result : value;
            };
          if (parsedExpression.$$watchDelegate && parsedExpression.$$watchDelegate !== inputsWatchDelegate) {
            fn.$$watchDelegate = parsedExpression.$$watchDelegate;
          } else if (!interceptorFn.$stateful) {
            fn.$$watchDelegate = inputsWatchDelegate;
            fn.inputs = parsedExpression.inputs ? parsedExpression.inputs : [parsedExpression];
          }
          return fn;
        }
      }
    ];
  }
  function $QProvider() {
    this.$get = [
      '$rootScope',
      '$exceptionHandler',
      function ($rootScope, $exceptionHandler) {
        return qFactory(function (callback) {
          $rootScope.$evalAsync(callback);
        }, $exceptionHandler);
      }
    ];
  }
  function $$QProvider() {
    this.$get = [
      '$browser',
      '$exceptionHandler',
      function ($browser, $exceptionHandler) {
        return qFactory(function (callback) {
          $browser.defer(callback);
        }, $exceptionHandler);
      }
    ];
  }
  function qFactory(nextTick, exceptionHandler) {
    var $qMinErr = minErr('$q', TypeError);
    function callOnce(self, resolveFn, rejectFn) {
      var called = false;
      function wrap(fn) {
        return function (value) {
          if (called)
            return;
          called = true;
          fn.call(self, value);
        };
      }
      return [
        wrap(resolveFn),
        wrap(rejectFn)
      ];
    }
    var defer = function () {
      return new Deferred();
    };
    function Promise() {
      this.$$state = { status: 0 };
    }
    Promise.prototype = {
      then: function (onFulfilled, onRejected, progressBack) {
        var result = new Deferred();
        this.$$state.pending = this.$$state.pending || [];
        this.$$state.pending.push([
          result,
          onFulfilled,
          onRejected,
          progressBack
        ]);
        if (this.$$state.status > 0)
          scheduleProcessQueue(this.$$state);
        return result.promise;
      },
      'catch': function (callback) {
        return this.then(null, callback);
      },
      'finally': function (callback, progressBack) {
        return this.then(function (value) {
          return handleCallback(value, true, callback);
        }, function (error) {
          return handleCallback(error, false, callback);
        }, progressBack);
      }
    };
    function simpleBind(context, fn) {
      return function (value) {
        fn.call(context, value);
      };
    }
    function processQueue(state) {
      var fn, deferred, pending;
      pending = state.pending;
      state.processScheduled = false;
      state.pending = undefined;
      for (var i = 0, ii = pending.length; i < ii; ++i) {
        deferred = pending[i][0];
        fn = pending[i][state.status];
        try {
          if (isFunction(fn)) {
            deferred.resolve(fn(state.value));
          } else if (state.status === 1) {
            deferred.resolve(state.value);
          } else {
            deferred.reject(state.value);
          }
        } catch (e) {
          deferred.reject(e);
          exceptionHandler(e);
        }
      }
    }
    function scheduleProcessQueue(state) {
      if (state.processScheduled || !state.pending)
        return;
      state.processScheduled = true;
      nextTick(function () {
        processQueue(state);
      });
    }
    function Deferred() {
      this.promise = new Promise();
      this.resolve = simpleBind(this, this.resolve);
      this.reject = simpleBind(this, this.reject);
      this.notify = simpleBind(this, this.notify);
    }
    Deferred.prototype = {
      resolve: function (val) {
        if (this.promise.$$state.status)
          return;
        if (val === this.promise) {
          this.$$reject($qMinErr('qcycle', 'Expected promise to be resolved with value other than itself \'{0}\'', val));
        } else {
          this.$$resolve(val);
        }
      },
      $$resolve: function (val) {
        var then, fns;
        fns = callOnce(this, this.$$resolve, this.$$reject);
        try {
          if (isObject(val) || isFunction(val))
            then = val && val.then;
          if (isFunction(then)) {
            this.promise.$$state.status = -1;
            then.call(val, fns[0], fns[1], this.notify);
          } else {
            this.promise.$$state.value = val;
            this.promise.$$state.status = 1;
            scheduleProcessQueue(this.promise.$$state);
          }
        } catch (e) {
          fns[1](e);
          exceptionHandler(e);
        }
      },
      reject: function (reason) {
        if (this.promise.$$state.status)
          return;
        this.$$reject(reason);
      },
      $$reject: function (reason) {
        this.promise.$$state.value = reason;
        this.promise.$$state.status = 2;
        scheduleProcessQueue(this.promise.$$state);
      },
      notify: function (progress) {
        var callbacks = this.promise.$$state.pending;
        if (this.promise.$$state.status <= 0 && callbacks && callbacks.length) {
          nextTick(function () {
            var callback, result;
            for (var i = 0, ii = callbacks.length; i < ii; i++) {
              result = callbacks[i][0];
              callback = callbacks[i][3];
              try {
                result.notify(isFunction(callback) ? callback(progress) : progress);
              } catch (e) {
                exceptionHandler(e);
              }
            }
          });
        }
      }
    };
    var reject = function (reason) {
      var result = new Deferred();
      result.reject(reason);
      return result.promise;
    };
    var makePromise = function makePromise(value, resolved) {
      var result = new Deferred();
      if (resolved) {
        result.resolve(value);
      } else {
        result.reject(value);
      }
      return result.promise;
    };
    var handleCallback = function handleCallback(value, isResolved, callback) {
      var callbackOutput = null;
      try {
        if (isFunction(callback))
          callbackOutput = callback();
      } catch (e) {
        return makePromise(e, false);
      }
      if (isPromiseLike(callbackOutput)) {
        return callbackOutput.then(function () {
          return makePromise(value, isResolved);
        }, function (error) {
          return makePromise(error, false);
        });
      } else {
        return makePromise(value, isResolved);
      }
    };
    var when = function (value, callback, errback, progressBack) {
      var result = new Deferred();
      result.resolve(value);
      return result.promise.then(callback, errback, progressBack);
    };
    function all(promises) {
      var deferred = new Deferred(), counter = 0, results = isArray(promises) ? [] : {};
      forEach(promises, function (promise, key) {
        counter++;
        when(promise).then(function (value) {
          if (results.hasOwnProperty(key))
            return;
          results[key] = value;
          if (!--counter)
            deferred.resolve(results);
        }, function (reason) {
          if (results.hasOwnProperty(key))
            return;
          deferred.reject(reason);
        });
      });
      if (counter === 0) {
        deferred.resolve(results);
      }
      return deferred.promise;
    }
    var $Q = function Q(resolver) {
      if (!isFunction(resolver)) {
        throw $qMinErr('norslvr', 'Expected resolverFn, got \'{0}\'', resolver);
      }
      if (!(this instanceof Q)) {
        return new Q(resolver);
      }
      var deferred = new Deferred();
      function resolveFn(value) {
        deferred.resolve(value);
      }
      function rejectFn(reason) {
        deferred.reject(reason);
      }
      resolver(resolveFn, rejectFn);
      return deferred.promise;
    };
    $Q.defer = defer;
    $Q.reject = reject;
    $Q.when = when;
    $Q.all = all;
    return $Q;
  }
  function $$RAFProvider() {
    this.$get = [
      '$window',
      '$timeout',
      function ($window, $timeout) {
        var requestAnimationFrame = $window.requestAnimationFrame || $window.webkitRequestAnimationFrame;
        var cancelAnimationFrame = $window.cancelAnimationFrame || $window.webkitCancelAnimationFrame || $window.webkitCancelRequestAnimationFrame;
        var rafSupported = !!requestAnimationFrame;
        var rafFn = rafSupported ? function (fn) {
            var id = requestAnimationFrame(fn);
            return function () {
              cancelAnimationFrame(id);
            };
          } : function (fn) {
            var timer = $timeout(fn, 16.66, false);
            return function () {
              $timeout.cancel(timer);
            };
          };
        queueFn.supported = rafSupported;
        var cancelLastRAF;
        var taskCount = 0;
        var taskQueue = [];
        return queueFn;
        function flush() {
          for (var i = 0; i < taskQueue.length; i++) {
            var task = taskQueue[i];
            if (task) {
              taskQueue[i] = null;
              task();
            }
          }
          taskCount = taskQueue.length = 0;
        }
        function queueFn(asyncFn) {
          var index = taskQueue.length;
          taskCount++;
          taskQueue.push(asyncFn);
          if (index === 0) {
            cancelLastRAF = rafFn(flush);
          }
          return function cancelQueueFn() {
            if (index >= 0) {
              taskQueue[index] = null;
              index = null;
              if (--taskCount === 0 && cancelLastRAF) {
                cancelLastRAF();
                cancelLastRAF = null;
                taskQueue.length = 0;
              }
            }
          };
        }
      }
    ];
  }
  function $RootScopeProvider() {
    var TTL = 10;
    var $rootScopeMinErr = minErr('$rootScope');
    var lastDirtyWatch = null;
    var applyAsyncId = null;
    this.digestTtl = function (value) {
      if (arguments.length) {
        TTL = value;
      }
      return TTL;
    };
    function createChildScopeClass(parent) {
      function ChildScope() {
        this.$$watchers = this.$$nextSibling = this.$$childHead = this.$$childTail = null;
        this.$$listeners = {};
        this.$$listenerCount = {};
        this.$$watchersCount = 0;
        this.$id = nextUid();
        this.$$ChildScope = null;
      }
      ChildScope.prototype = parent;
      return ChildScope;
    }
    this.$get = [
      '$injector',
      '$exceptionHandler',
      '$parse',
      '$browser',
      function ($injector, $exceptionHandler, $parse, $browser) {
        function destroyChildScope($event) {
          $event.currentScope.$$destroyed = true;
        }
        function Scope() {
          this.$id = nextUid();
          this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null;
          this.$root = this;
          this.$$destroyed = false;
          this.$$listeners = {};
          this.$$listenerCount = {};
          this.$$watchersCount = 0;
          this.$$isolateBindings = null;
        }
        Scope.prototype = {
          constructor: Scope,
          $new: function (isolate, parent) {
            var child;
            parent = parent || this;
            if (isolate) {
              child = new Scope();
              child.$root = this.$root;
            } else {
              if (!this.$$ChildScope) {
                this.$$ChildScope = createChildScopeClass(this);
              }
              child = new this.$$ChildScope();
            }
            child.$parent = parent;
            child.$$prevSibling = parent.$$childTail;
            if (parent.$$childHead) {
              parent.$$childTail.$$nextSibling = child;
              parent.$$childTail = child;
            } else {
              parent.$$childHead = parent.$$childTail = child;
            }
            if (isolate || parent != this)
              child.$on('$destroy', destroyChildScope);
            return child;
          },
          $watch: function (watchExp, listener, objectEquality, prettyPrintExpression) {
            var get = $parse(watchExp);
            if (get.$$watchDelegate) {
              return get.$$watchDelegate(this, listener, objectEquality, get, watchExp);
            }
            var scope = this, array = scope.$$watchers, watcher = {
                fn: listener,
                last: initWatchVal,
                get: get,
                exp: prettyPrintExpression || watchExp,
                eq: !!objectEquality
              };
            lastDirtyWatch = null;
            if (!isFunction(listener)) {
              watcher.fn = noop;
            }
            if (!array) {
              array = scope.$$watchers = [];
            }
            array.unshift(watcher);
            incrementWatchersCount(this, 1);
            return function deregisterWatch() {
              if (arrayRemove(array, watcher) >= 0) {
                incrementWatchersCount(scope, -1);
              }
              lastDirtyWatch = null;
            };
          },
          $watchGroup: function (watchExpressions, listener) {
            var oldValues = new Array(watchExpressions.length);
            var newValues = new Array(watchExpressions.length);
            var deregisterFns = [];
            var self = this;
            var changeReactionScheduled = false;
            var firstRun = true;
            if (!watchExpressions.length) {
              var shouldCall = true;
              self.$evalAsync(function () {
                if (shouldCall)
                  listener(newValues, newValues, self);
              });
              return function deregisterWatchGroup() {
                shouldCall = false;
              };
            }
            if (watchExpressions.length === 1) {
              return this.$watch(watchExpressions[0], function watchGroupAction(value, oldValue, scope) {
                newValues[0] = value;
                oldValues[0] = oldValue;
                listener(newValues, value === oldValue ? newValues : oldValues, scope);
              });
            }
            forEach(watchExpressions, function (expr, i) {
              var unwatchFn = self.$watch(expr, function watchGroupSubAction(value, oldValue) {
                  newValues[i] = value;
                  oldValues[i] = oldValue;
                  if (!changeReactionScheduled) {
                    changeReactionScheduled = true;
                    self.$evalAsync(watchGroupAction);
                  }
                });
              deregisterFns.push(unwatchFn);
            });
            function watchGroupAction() {
              changeReactionScheduled = false;
              if (firstRun) {
                firstRun = false;
                listener(newValues, newValues, self);
              } else {
                listener(newValues, oldValues, self);
              }
            }
            return function deregisterWatchGroup() {
              while (deregisterFns.length) {
                deregisterFns.shift()();
              }
            };
          },
          $watchCollection: function (obj, listener) {
            $watchCollectionInterceptor.$stateful = true;
            var self = this;
            var newValue;
            var oldValue;
            var veryOldValue;
            var trackVeryOldValue = listener.length > 1;
            var changeDetected = 0;
            var changeDetector = $parse(obj, $watchCollectionInterceptor);
            var internalArray = [];
            var internalObject = {};
            var initRun = true;
            var oldLength = 0;
            function $watchCollectionInterceptor(_value) {
              newValue = _value;
              var newLength, key, bothNaN, newItem, oldItem;
              if (isUndefined(newValue))
                return;
              if (!isObject(newValue)) {
                if (oldValue !== newValue) {
                  oldValue = newValue;
                  changeDetected++;
                }
              } else if (isArrayLike(newValue)) {
                if (oldValue !== internalArray) {
                  oldValue = internalArray;
                  oldLength = oldValue.length = 0;
                  changeDetected++;
                }
                newLength = newValue.length;
                if (oldLength !== newLength) {
                  changeDetected++;
                  oldValue.length = oldLength = newLength;
                }
                for (var i = 0; i < newLength; i++) {
                  oldItem = oldValue[i];
                  newItem = newValue[i];
                  bothNaN = oldItem !== oldItem && newItem !== newItem;
                  if (!bothNaN && oldItem !== newItem) {
                    changeDetected++;
                    oldValue[i] = newItem;
                  }
                }
              } else {
                if (oldValue !== internalObject) {
                  oldValue = internalObject = {};
                  oldLength = 0;
                  changeDetected++;
                }
                newLength = 0;
                for (key in newValue) {
                  if (newValue.hasOwnProperty(key)) {
                    newLength++;
                    newItem = newValue[key];
                    oldItem = oldValue[key];
                    if (key in oldValue) {
                      bothNaN = oldItem !== oldItem && newItem !== newItem;
                      if (!bothNaN && oldItem !== newItem) {
                        changeDetected++;
                        oldValue[key] = newItem;
                      }
                    } else {
                      oldLength++;
                      oldValue[key] = newItem;
                      changeDetected++;
                    }
                  }
                }
                if (oldLength > newLength) {
                  changeDetected++;
                  for (key in oldValue) {
                    if (!newValue.hasOwnProperty(key)) {
                      oldLength--;
                      delete oldValue[key];
                    }
                  }
                }
              }
              return changeDetected;
            }
            function $watchCollectionAction() {
              if (initRun) {
                initRun = false;
                listener(newValue, newValue, self);
              } else {
                listener(newValue, veryOldValue, self);
              }
              if (trackVeryOldValue) {
                if (!isObject(newValue)) {
                  veryOldValue = newValue;
                } else if (isArrayLike(newValue)) {
                  veryOldValue = new Array(newValue.length);
                  for (var i = 0; i < newValue.length; i++) {
                    veryOldValue[i] = newValue[i];
                  }
                } else {
                  veryOldValue = {};
                  for (var key in newValue) {
                    if (hasOwnProperty.call(newValue, key)) {
                      veryOldValue[key] = newValue[key];
                    }
                  }
                }
              }
            }
            return this.$watch(changeDetector, $watchCollectionAction);
          },
          $digest: function () {
            var watch, value, last, watchers, length, dirty, ttl = TTL, next, current, target = this, watchLog = [], logIdx, logMsg, asyncTask;
            beginPhase('$digest');
            $browser.$$checkUrlChange();
            if (this === $rootScope && applyAsyncId !== null) {
              $browser.defer.cancel(applyAsyncId);
              flushApplyAsync();
            }
            lastDirtyWatch = null;
            do {
              dirty = false;
              current = target;
              while (asyncQueue.length) {
                try {
                  asyncTask = asyncQueue.shift();
                  asyncTask.scope.$eval(asyncTask.expression, asyncTask.locals);
                } catch (e) {
                  $exceptionHandler(e);
                }
                lastDirtyWatch = null;
              }
              traverseScopesLoop:
                do {
                  if (watchers = current.$$watchers) {
                    length = watchers.length;
                    while (length--) {
                      try {
                        watch = watchers[length];
                        if (watch) {
                          if ((value = watch.get(current)) !== (last = watch.last) && !(watch.eq ? equals(value, last) : typeof value === 'number' && typeof last === 'number' && isNaN(value) && isNaN(last))) {
                            dirty = true;
                            lastDirtyWatch = watch;
                            watch.last = watch.eq ? copy(value, null) : value;
                            watch.fn(value, last === initWatchVal ? value : last, current);
                            if (ttl < 5) {
                              logIdx = 4 - ttl;
                              if (!watchLog[logIdx])
                                watchLog[logIdx] = [];
                              watchLog[logIdx].push({
                                msg: isFunction(watch.exp) ? 'fn: ' + (watch.exp.name || watch.exp.toString()) : watch.exp,
                                newVal: value,
                                oldVal: last
                              });
                            }
                          } else if (watch === lastDirtyWatch) {
                            dirty = false;
                            break traverseScopesLoop;
                          }
                        }
                      } catch (e) {
                        $exceptionHandler(e);
                      }
                    }
                  }
                  if (!(next = current.$$watchersCount && current.$$childHead || current !== target && current.$$nextSibling)) {
                    while (current !== target && !(next = current.$$nextSibling)) {
                      current = current.$parent;
                    }
                  }
                } while (current = next);
              if ((dirty || asyncQueue.length) && !ttl--) {
                clearPhase();
                throw $rootScopeMinErr('infdig', '{0} $digest() iterations reached. Aborting!\n' + 'Watchers fired in the last 5 iterations: {1}', TTL, watchLog);
              }
            } while (dirty || asyncQueue.length);
            clearPhase();
            while (postDigestQueue.length) {
              try {
                postDigestQueue.shift()();
              } catch (e) {
                $exceptionHandler(e);
              }
            }
          },
          $destroy: function () {
            if (this.$$destroyed)
              return;
            var parent = this.$parent;
            this.$broadcast('$destroy');
            this.$$destroyed = true;
            if (this === $rootScope) {
              $browser.$$applicationDestroyed();
            }
            incrementWatchersCount(this, -this.$$watchersCount);
            for (var eventName in this.$$listenerCount) {
              decrementListenerCount(this, this.$$listenerCount[eventName], eventName);
            }
            if (parent && parent.$$childHead == this)
              parent.$$childHead = this.$$nextSibling;
            if (parent && parent.$$childTail == this)
              parent.$$childTail = this.$$prevSibling;
            if (this.$$prevSibling)
              this.$$prevSibling.$$nextSibling = this.$$nextSibling;
            if (this.$$nextSibling)
              this.$$nextSibling.$$prevSibling = this.$$prevSibling;
            this.$destroy = this.$digest = this.$apply = this.$evalAsync = this.$applyAsync = noop;
            this.$on = this.$watch = this.$watchGroup = function () {
              return noop;
            };
            this.$$listeners = {};
            this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = this.$root = this.$$watchers = null;
          },
          $eval: function (expr, locals) {
            return $parse(expr)(this, locals);
          },
          $evalAsync: function (expr, locals) {
            if (!$rootScope.$$phase && !asyncQueue.length) {
              $browser.defer(function () {
                if (asyncQueue.length) {
                  $rootScope.$digest();
                }
              });
            }
            asyncQueue.push({
              scope: this,
              expression: expr,
              locals: locals
            });
          },
          $$postDigest: function (fn) {
            postDigestQueue.push(fn);
          },
          $apply: function (expr) {
            try {
              beginPhase('$apply');
              return this.$eval(expr);
            } catch (e) {
              $exceptionHandler(e);
            } finally {
              clearPhase();
              try {
                $rootScope.$digest();
              } catch (e) {
                $exceptionHandler(e);
                throw e;
              }
            }
          },
          $applyAsync: function (expr) {
            var scope = this;
            expr && applyAsyncQueue.push($applyAsyncExpression);
            scheduleApplyAsync();
            function $applyAsyncExpression() {
              scope.$eval(expr);
            }
          },
          $on: function (name, listener) {
            var namedListeners = this.$$listeners[name];
            if (!namedListeners) {
              this.$$listeners[name] = namedListeners = [];
            }
            namedListeners.push(listener);
            var current = this;
            do {
              if (!current.$$listenerCount[name]) {
                current.$$listenerCount[name] = 0;
              }
              current.$$listenerCount[name]++;
            } while (current = current.$parent);
            var self = this;
            return function () {
              var indexOfListener = namedListeners.indexOf(listener);
              if (indexOfListener !== -1) {
                namedListeners[indexOfListener] = null;
                decrementListenerCount(self, 1, name);
              }
            };
          },
          $emit: function (name, args) {
            var empty = [], namedListeners, scope = this, stopPropagation = false, event = {
                name: name,
                targetScope: scope,
                stopPropagation: function () {
                  stopPropagation = true;
                },
                preventDefault: function () {
                  event.defaultPrevented = true;
                },
                defaultPrevented: false
              }, listenerArgs = concat([event], arguments, 1), i, length;
            do {
              namedListeners = scope.$$listeners[name] || empty;
              event.currentScope = scope;
              for (i = 0, length = namedListeners.length; i < length; i++) {
                if (!namedListeners[i]) {
                  namedListeners.splice(i, 1);
                  i--;
                  length--;
                  continue;
                }
                try {
                  namedListeners[i].apply(null, listenerArgs);
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
              if (stopPropagation) {
                event.currentScope = null;
                return event;
              }
              scope = scope.$parent;
            } while (scope);
            event.currentScope = null;
            return event;
          },
          $broadcast: function (name, args) {
            var target = this, current = target, next = target, event = {
                name: name,
                targetScope: target,
                preventDefault: function () {
                  event.defaultPrevented = true;
                },
                defaultPrevented: false
              };
            if (!target.$$listenerCount[name])
              return event;
            var listenerArgs = concat([event], arguments, 1), listeners, i, length;
            while (current = next) {
              event.currentScope = current;
              listeners = current.$$listeners[name] || [];
              for (i = 0, length = listeners.length; i < length; i++) {
                if (!listeners[i]) {
                  listeners.splice(i, 1);
                  i--;
                  length--;
                  continue;
                }
                try {
                  listeners[i].apply(null, listenerArgs);
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
              if (!(next = current.$$listenerCount[name] && current.$$childHead || current !== target && current.$$nextSibling)) {
                while (current !== target && !(next = current.$$nextSibling)) {
                  current = current.$parent;
                }
              }
            }
            event.currentScope = null;
            return event;
          }
        };
        var $rootScope = new Scope();
        var asyncQueue = $rootScope.$$asyncQueue = [];
        var postDigestQueue = $rootScope.$$postDigestQueue = [];
        var applyAsyncQueue = $rootScope.$$applyAsyncQueue = [];
        return $rootScope;
        function beginPhase(phase) {
          if ($rootScope.$$phase) {
            throw $rootScopeMinErr('inprog', '{0} already in progress', $rootScope.$$phase);
          }
          $rootScope.$$phase = phase;
        }
        function clearPhase() {
          $rootScope.$$phase = null;
        }
        function incrementWatchersCount(current, count) {
          do {
            current.$$watchersCount += count;
          } while (current = current.$parent);
        }
        function decrementListenerCount(current, count, name) {
          do {
            current.$$listenerCount[name] -= count;
            if (current.$$listenerCount[name] === 0) {
              delete current.$$listenerCount[name];
            }
          } while (current = current.$parent);
        }
        function initWatchVal() {
        }
        function flushApplyAsync() {
          while (applyAsyncQueue.length) {
            try {
              applyAsyncQueue.shift()();
            } catch (e) {
              $exceptionHandler(e);
            }
          }
          applyAsyncId = null;
        }
        function scheduleApplyAsync() {
          if (applyAsyncId === null) {
            applyAsyncId = $browser.defer(function () {
              $rootScope.$apply(flushApplyAsync);
            });
          }
        }
      }
    ];
  }
  function $$SanitizeUriProvider() {
    var aHrefSanitizationWhitelist = /^\s*(https?|ftp|mailto|tel|file):/, imgSrcSanitizationWhitelist = /^\s*((https?|ftp|file|blob):|data:image\/)/;
    this.aHrefSanitizationWhitelist = function (regexp) {
      if (isDefined(regexp)) {
        aHrefSanitizationWhitelist = regexp;
        return this;
      }
      return aHrefSanitizationWhitelist;
    };
    this.imgSrcSanitizationWhitelist = function (regexp) {
      if (isDefined(regexp)) {
        imgSrcSanitizationWhitelist = regexp;
        return this;
      }
      return imgSrcSanitizationWhitelist;
    };
    this.$get = function () {
      return function sanitizeUri(uri, isImage) {
        var regex = isImage ? imgSrcSanitizationWhitelist : aHrefSanitizationWhitelist;
        var normalizedVal;
        normalizedVal = urlResolve(uri).href;
        if (normalizedVal !== '' && !normalizedVal.match(regex)) {
          return 'unsafe:' + normalizedVal;
        }
        return uri;
      };
    };
  }
  var $sceMinErr = minErr('$sce');
  var SCE_CONTEXTS = {
      HTML: 'html',
      CSS: 'css',
      URL: 'url',
      RESOURCE_URL: 'resourceUrl',
      JS: 'js'
    };
  function adjustMatcher(matcher) {
    if (matcher === 'self') {
      return matcher;
    } else if (isString(matcher)) {
      if (matcher.indexOf('***') > -1) {
        throw $sceMinErr('iwcard', 'Illegal sequence *** in string matcher.  String: {0}', matcher);
      }
      matcher = escapeForRegexp(matcher).replace('\\*\\*', '.*').replace('\\*', '[^:/.?&;]*');
      return new RegExp('^' + matcher + '$');
    } else if (isRegExp(matcher)) {
      return new RegExp('^' + matcher.source + '$');
    } else {
      throw $sceMinErr('imatcher', 'Matchers may only be "self", string patterns or RegExp objects');
    }
  }
  function adjustMatchers(matchers) {
    var adjustedMatchers = [];
    if (isDefined(matchers)) {
      forEach(matchers, function (matcher) {
        adjustedMatchers.push(adjustMatcher(matcher));
      });
    }
    return adjustedMatchers;
  }
  function $SceDelegateProvider() {
    this.SCE_CONTEXTS = SCE_CONTEXTS;
    var resourceUrlWhitelist = ['self'], resourceUrlBlacklist = [];
    this.resourceUrlWhitelist = function (value) {
      if (arguments.length) {
        resourceUrlWhitelist = adjustMatchers(value);
      }
      return resourceUrlWhitelist;
    };
    this.resourceUrlBlacklist = function (value) {
      if (arguments.length) {
        resourceUrlBlacklist = adjustMatchers(value);
      }
      return resourceUrlBlacklist;
    };
    this.$get = [
      '$injector',
      function ($injector) {
        var htmlSanitizer = function htmlSanitizer(html) {
          throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
        };
        if ($injector.has('$sanitize')) {
          htmlSanitizer = $injector.get('$sanitize');
        }
        function matchUrl(matcher, parsedUrl) {
          if (matcher === 'self') {
            return urlIsSameOrigin(parsedUrl);
          } else {
            return !!matcher.exec(parsedUrl.href);
          }
        }
        function isResourceUrlAllowedByPolicy(url) {
          var parsedUrl = urlResolve(url.toString());
          var i, n, allowed = false;
          for (i = 0, n = resourceUrlWhitelist.length; i < n; i++) {
            if (matchUrl(resourceUrlWhitelist[i], parsedUrl)) {
              allowed = true;
              break;
            }
          }
          if (allowed) {
            for (i = 0, n = resourceUrlBlacklist.length; i < n; i++) {
              if (matchUrl(resourceUrlBlacklist[i], parsedUrl)) {
                allowed = false;
                break;
              }
            }
          }
          return allowed;
        }
        function generateHolderType(Base) {
          var holderType = function TrustedValueHolderType(trustedValue) {
            this.$$unwrapTrustedValue = function () {
              return trustedValue;
            };
          };
          if (Base) {
            holderType.prototype = new Base();
          }
          holderType.prototype.valueOf = function sceValueOf() {
            return this.$$unwrapTrustedValue();
          };
          holderType.prototype.toString = function sceToString() {
            return this.$$unwrapTrustedValue().toString();
          };
          return holderType;
        }
        var trustedValueHolderBase = generateHolderType(), byType = {};
        byType[SCE_CONTEXTS.HTML] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.CSS] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.URL] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.JS] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.RESOURCE_URL] = generateHolderType(byType[SCE_CONTEXTS.URL]);
        function trustAs(type, trustedValue) {
          var Constructor = byType.hasOwnProperty(type) ? byType[type] : null;
          if (!Constructor) {
            throw $sceMinErr('icontext', 'Attempted to trust a value in invalid context. Context: {0}; Value: {1}', type, trustedValue);
          }
          if (trustedValue === null || trustedValue === undefined || trustedValue === '') {
            return trustedValue;
          }
          if (typeof trustedValue !== 'string') {
            throw $sceMinErr('itype', 'Attempted to trust a non-string value in a content requiring a string: Context: {0}', type);
          }
          return new Constructor(trustedValue);
        }
        function valueOf(maybeTrusted) {
          if (maybeTrusted instanceof trustedValueHolderBase) {
            return maybeTrusted.$$unwrapTrustedValue();
          } else {
            return maybeTrusted;
          }
        }
        function getTrusted(type, maybeTrusted) {
          if (maybeTrusted === null || maybeTrusted === undefined || maybeTrusted === '') {
            return maybeTrusted;
          }
          var constructor = byType.hasOwnProperty(type) ? byType[type] : null;
          if (constructor && maybeTrusted instanceof constructor) {
            return maybeTrusted.$$unwrapTrustedValue();
          }
          if (type === SCE_CONTEXTS.RESOURCE_URL) {
            if (isResourceUrlAllowedByPolicy(maybeTrusted)) {
              return maybeTrusted;
            } else {
              throw $sceMinErr('insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}', maybeTrusted.toString());
            }
          } else if (type === SCE_CONTEXTS.HTML) {
            return htmlSanitizer(maybeTrusted);
          }
          throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
        }
        return {
          trustAs: trustAs,
          getTrusted: getTrusted,
          valueOf: valueOf
        };
      }
    ];
  }
  function $SceProvider() {
    var enabled = true;
    this.enabled = function (value) {
      if (arguments.length) {
        enabled = !!value;
      }
      return enabled;
    };
    this.$get = [
      '$parse',
      '$sceDelegate',
      function ($parse, $sceDelegate) {
        if (enabled && msie < 8) {
          throw $sceMinErr('iequirks', 'Strict Contextual Escaping does not support Internet Explorer version < 11 in quirks ' + 'mode.  You can fix this by adding the text <!doctype html> to the top of your HTML ' + 'document.  See http://docs.angularjs.org/api/ng.$sce for more information.');
        }
        var sce = shallowCopy(SCE_CONTEXTS);
        sce.isEnabled = function () {
          return enabled;
        };
        sce.trustAs = $sceDelegate.trustAs;
        sce.getTrusted = $sceDelegate.getTrusted;
        sce.valueOf = $sceDelegate.valueOf;
        if (!enabled) {
          sce.trustAs = sce.getTrusted = function (type, value) {
            return value;
          };
          sce.valueOf = identity;
        }
        sce.parseAs = function sceParseAs(type, expr) {
          var parsed = $parse(expr);
          if (parsed.literal && parsed.constant) {
            return parsed;
          } else {
            return $parse(expr, function (value) {
              return sce.getTrusted(type, value);
            });
          }
        };
        var parse = sce.parseAs, getTrusted = sce.getTrusted, trustAs = sce.trustAs;
        forEach(SCE_CONTEXTS, function (enumValue, name) {
          var lName = lowercase(name);
          sce[camelCase('parse_as_' + lName)] = function (expr) {
            return parse(enumValue, expr);
          };
          sce[camelCase('get_trusted_' + lName)] = function (value) {
            return getTrusted(enumValue, value);
          };
          sce[camelCase('trust_as_' + lName)] = function (value) {
            return trustAs(enumValue, value);
          };
        });
        return sce;
      }
    ];
  }
  function $SnifferProvider() {
    this.$get = [
      '$window',
      '$document',
      function ($window, $document) {
        var eventSupport = {}, android = toInt((/android (\d+)/.exec(lowercase(($window.navigator || {}).userAgent)) || [])[1]), boxee = /Boxee/i.test(($window.navigator || {}).userAgent), document = $document[0] || {}, vendorPrefix, vendorRegex = /^(Moz|webkit|ms)(?=[A-Z])/, bodyStyle = document.body && document.body.style, transitions = false, animations = false, match;
        if (bodyStyle) {
          for (var prop in bodyStyle) {
            if (match = vendorRegex.exec(prop)) {
              vendorPrefix = match[0];
              vendorPrefix = vendorPrefix.substr(0, 1).toUpperCase() + vendorPrefix.substr(1);
              break;
            }
          }
          if (!vendorPrefix) {
            vendorPrefix = 'WebkitOpacity' in bodyStyle && 'webkit';
          }
          transitions = !!('transition' in bodyStyle || vendorPrefix + 'Transition' in bodyStyle);
          animations = !!('animation' in bodyStyle || vendorPrefix + 'Animation' in bodyStyle);
          if (android && (!transitions || !animations)) {
            transitions = isString(bodyStyle.webkitTransition);
            animations = isString(bodyStyle.webkitAnimation);
          }
        }
        return {
          history: !!($window.history && $window.history.pushState && !(android < 4) && !boxee),
          hasEvent: function (event) {
            if (event === 'input' && msie <= 11)
              return false;
            if (isUndefined(eventSupport[event])) {
              var divElm = document.createElement('div');
              eventSupport[event] = 'on' + event in divElm;
            }
            return eventSupport[event];
          },
          csp: csp(),
          vendorPrefix: vendorPrefix,
          transitions: transitions,
          animations: animations,
          android: android
        };
      }
    ];
  }
  var $compileMinErr = minErr('$compile');
  function $TemplateRequestProvider() {
    this.$get = [
      '$templateCache',
      '$http',
      '$q',
      function ($templateCache, $http, $q) {
        function handleRequestFn(tpl, ignoreRequestError) {
          handleRequestFn.totalPendingRequests++;
          var transformResponse = $http.defaults && $http.defaults.transformResponse;
          if (isArray(transformResponse)) {
            transformResponse = transformResponse.filter(function (transformer) {
              return transformer !== defaultHttpResponseTransform;
            });
          } else if (transformResponse === defaultHttpResponseTransform) {
            transformResponse = null;
          }
          var httpOptions = {
              cache: $templateCache,
              transformResponse: transformResponse
            };
          return $http.get(tpl, httpOptions)['finally'](function () {
            handleRequestFn.totalPendingRequests--;
          }).then(function (response) {
            $templateCache.put(tpl, response.data);
            return response.data;
          }, handleError);
          function handleError(resp) {
            if (!ignoreRequestError) {
              throw $compileMinErr('tpload', 'Failed to load template: {0} (HTTP status: {1} {2})', tpl, resp.status, resp.statusText);
            }
            return $q.reject(resp);
          }
        }
        handleRequestFn.totalPendingRequests = 0;
        return handleRequestFn;
      }
    ];
  }
  function $$TestabilityProvider() {
    this.$get = [
      '$rootScope',
      '$browser',
      '$location',
      function ($rootScope, $browser, $location) {
        var testability = {};
        testability.findBindings = function (element, expression, opt_exactMatch) {
          var bindings = element.getElementsByClassName('ng-binding');
          var matches = [];
          forEach(bindings, function (binding) {
            var dataBinding = angular.element(binding).data('$binding');
            if (dataBinding) {
              forEach(dataBinding, function (bindingName) {
                if (opt_exactMatch) {
                  var matcher = new RegExp('(^|\\s)' + escapeForRegexp(expression) + '(\\s|\\||$)');
                  if (matcher.test(bindingName)) {
                    matches.push(binding);
                  }
                } else {
                  if (bindingName.indexOf(expression) != -1) {
                    matches.push(binding);
                  }
                }
              });
            }
          });
          return matches;
        };
        testability.findModels = function (element, expression, opt_exactMatch) {
          var prefixes = [
              'ng-',
              'data-ng-',
              'ng\\:'
            ];
          for (var p = 0; p < prefixes.length; ++p) {
            var attributeEquals = opt_exactMatch ? '=' : '*=';
            var selector = '[' + prefixes[p] + 'model' + attributeEquals + '"' + expression + '"]';
            var elements = element.querySelectorAll(selector);
            if (elements.length) {
              return elements;
            }
          }
        };
        testability.getLocation = function () {
          return $location.url();
        };
        testability.setLocation = function (url) {
          if (url !== $location.url()) {
            $location.url(url);
            $rootScope.$digest();
          }
        };
        testability.whenStable = function (callback) {
          $browser.notifyWhenNoOutstandingRequests(callback);
        };
        return testability;
      }
    ];
  }
  function $TimeoutProvider() {
    this.$get = [
      '$rootScope',
      '$browser',
      '$q',
      '$$q',
      '$exceptionHandler',
      function ($rootScope, $browser, $q, $$q, $exceptionHandler) {
        var deferreds = {};
        function timeout(fn, delay, invokeApply) {
          if (!isFunction(fn)) {
            invokeApply = delay;
            delay = fn;
            fn = noop;
          }
          var args = sliceArgs(arguments, 3), skipApply = isDefined(invokeApply) && !invokeApply, deferred = (skipApply ? $$q : $q).defer(), promise = deferred.promise, timeoutId;
          timeoutId = $browser.defer(function () {
            try {
              deferred.resolve(fn.apply(null, args));
            } catch (e) {
              deferred.reject(e);
              $exceptionHandler(e);
            } finally {
              delete deferreds[promise.$$timeoutId];
            }
            if (!skipApply)
              $rootScope.$apply();
          }, delay);
          promise.$$timeoutId = timeoutId;
          deferreds[timeoutId] = deferred;
          return promise;
        }
        timeout.cancel = function (promise) {
          if (promise && promise.$$timeoutId in deferreds) {
            deferreds[promise.$$timeoutId].reject('canceled');
            delete deferreds[promise.$$timeoutId];
            return $browser.defer.cancel(promise.$$timeoutId);
          }
          return false;
        };
        return timeout;
      }
    ];
  }
  var urlParsingNode = document.createElement('a');
  var originUrl = urlResolve(window.location.href);
  function urlResolve(url) {
    var href = url;
    if (msie) {
      urlParsingNode.setAttribute('href', href);
      href = urlParsingNode.href;
    }
    urlParsingNode.setAttribute('href', href);
    return {
      href: urlParsingNode.href,
      protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
      host: urlParsingNode.host,
      search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
      hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
      hostname: urlParsingNode.hostname,
      port: urlParsingNode.port,
      pathname: urlParsingNode.pathname.charAt(0) === '/' ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
    };
  }
  function urlIsSameOrigin(requestUrl) {
    var parsed = isString(requestUrl) ? urlResolve(requestUrl) : requestUrl;
    return parsed.protocol === originUrl.protocol && parsed.host === originUrl.host;
  }
  function $WindowProvider() {
    this.$get = valueFn(window);
  }
  function $$CookieReader($document) {
    var rawDocument = $document[0] || {};
    var lastCookies = {};
    var lastCookieString = '';
    function safeDecodeURIComponent(str) {
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    return function () {
      var cookieArray, cookie, i, index, name;
      var currentCookieString = rawDocument.cookie || '';
      if (currentCookieString !== lastCookieString) {
        lastCookieString = currentCookieString;
        cookieArray = lastCookieString.split('; ');
        lastCookies = {};
        for (i = 0; i < cookieArray.length; i++) {
          cookie = cookieArray[i];
          index = cookie.indexOf('=');
          if (index > 0) {
            name = safeDecodeURIComponent(cookie.substring(0, index));
            if (lastCookies[name] === undefined) {
              lastCookies[name] = safeDecodeURIComponent(cookie.substring(index + 1));
            }
          }
        }
      }
      return lastCookies;
    };
  }
  $$CookieReader.$inject = ['$document'];
  function $$CookieReaderProvider() {
    this.$get = $$CookieReader;
  }
  $FilterProvider.$inject = ['$provide'];
  function $FilterProvider($provide) {
    var suffix = 'Filter';
    function register(name, factory) {
      if (isObject(name)) {
        var filters = {};
        forEach(name, function (filter, key) {
          filters[key] = register(key, filter);
        });
        return filters;
      } else {
        return $provide.factory(name + suffix, factory);
      }
    }
    this.register = register;
    this.$get = [
      '$injector',
      function ($injector) {
        return function (name) {
          return $injector.get(name + suffix);
        };
      }
    ];
    register('currency', currencyFilter);
    register('date', dateFilter);
    register('filter', filterFilter);
    register('json', jsonFilter);
    register('limitTo', limitToFilter);
    register('lowercase', lowercaseFilter);
    register('number', numberFilter);
    register('orderBy', orderByFilter);
    register('uppercase', uppercaseFilter);
  }
  function filterFilter() {
    return function (array, expression, comparator) {
      if (!isArrayLike(array)) {
        if (array == null) {
          return array;
        } else {
          throw minErr('filter')('notarray', 'Expected array but received: {0}', array);
        }
      }
      var expressionType = getTypeForFilter(expression);
      var predicateFn;
      var matchAgainstAnyProp;
      switch (expressionType) {
      case 'function':
        predicateFn = expression;
        break;
      case 'boolean':
      case 'null':
      case 'number':
      case 'string':
        matchAgainstAnyProp = true;
      case 'object':
        predicateFn = createPredicateFn(expression, comparator, matchAgainstAnyProp);
        break;
      default:
        return array;
      }
      return Array.prototype.filter.call(array, predicateFn);
    };
  }
  function hasCustomToString(obj) {
    return isFunction(obj.toString) && obj.toString !== Object.prototype.toString;
  }
  function createPredicateFn(expression, comparator, matchAgainstAnyProp) {
    var shouldMatchPrimitives = isObject(expression) && '$' in expression;
    var predicateFn;
    if (comparator === true) {
      comparator = equals;
    } else if (!isFunction(comparator)) {
      comparator = function (actual, expected) {
        if (isUndefined(actual)) {
          return false;
        }
        if (actual === null || expected === null) {
          return actual === expected;
        }
        if (isObject(expected) || isObject(actual) && !hasCustomToString(actual)) {
          return false;
        }
        actual = lowercase('' + actual);
        expected = lowercase('' + expected);
        return actual.indexOf(expected) !== -1;
      };
    }
    predicateFn = function (item) {
      if (shouldMatchPrimitives && !isObject(item)) {
        return deepCompare(item, expression.$, comparator, false);
      }
      return deepCompare(item, expression, comparator, matchAgainstAnyProp);
    };
    return predicateFn;
  }
  function deepCompare(actual, expected, comparator, matchAgainstAnyProp, dontMatchWholeObject) {
    var actualType = getTypeForFilter(actual);
    var expectedType = getTypeForFilter(expected);
    if (expectedType === 'string' && expected.charAt(0) === '!') {
      return !deepCompare(actual, expected.substring(1), comparator, matchAgainstAnyProp);
    } else if (isArray(actual)) {
      return actual.some(function (item) {
        return deepCompare(item, expected, comparator, matchAgainstAnyProp);
      });
    }
    switch (actualType) {
    case 'object':
      var key;
      if (matchAgainstAnyProp) {
        for (key in actual) {
          if (key.charAt(0) !== '$' && deepCompare(actual[key], expected, comparator, true)) {
            return true;
          }
        }
        return dontMatchWholeObject ? false : deepCompare(actual, expected, comparator, false);
      } else if (expectedType === 'object') {
        for (key in expected) {
          var expectedVal = expected[key];
          if (isFunction(expectedVal) || isUndefined(expectedVal)) {
            continue;
          }
          var matchAnyProperty = key === '$';
          var actualVal = matchAnyProperty ? actual : actual[key];
          if (!deepCompare(actualVal, expectedVal, comparator, matchAnyProperty, matchAnyProperty)) {
            return false;
          }
        }
        return true;
      } else {
        return comparator(actual, expected);
      }
      break;
    case 'function':
      return false;
    default:
      return comparator(actual, expected);
    }
  }
  function getTypeForFilter(val) {
    return val === null ? 'null' : typeof val;
  }
  currencyFilter.$inject = ['$locale'];
  function currencyFilter($locale) {
    var formats = $locale.NUMBER_FORMATS;
    return function (amount, currencySymbol, fractionSize) {
      if (isUndefined(currencySymbol)) {
        currencySymbol = formats.CURRENCY_SYM;
      }
      if (isUndefined(fractionSize)) {
        fractionSize = formats.PATTERNS[1].maxFrac;
      }
      return amount == null ? amount : formatNumber(amount, formats.PATTERNS[1], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize).replace(/\u00A4/g, currencySymbol);
    };
  }
  numberFilter.$inject = ['$locale'];
  function numberFilter($locale) {
    var formats = $locale.NUMBER_FORMATS;
    return function (number, fractionSize) {
      return number == null ? number : formatNumber(number, formats.PATTERNS[0], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize);
    };
  }
  var DECIMAL_SEP = '.';
  function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {
    if (isObject(number))
      return '';
    var isNegative = number < 0;
    number = Math.abs(number);
    var isInfinity = number === Infinity;
    if (!isInfinity && !isFinite(number))
      return '';
    var numStr = number + '', formatedText = '', hasExponent = false, parts = [];
    if (isInfinity)
      formatedText = '\u221e';
    if (!isInfinity && numStr.indexOf('e') !== -1) {
      var match = numStr.match(/([\d\.]+)e(-?)(\d+)/);
      if (match && match[2] == '-' && match[3] > fractionSize + 1) {
        number = 0;
      } else {
        formatedText = numStr;
        hasExponent = true;
      }
    }
    if (!isInfinity && !hasExponent) {
      var fractionLen = (numStr.split(DECIMAL_SEP)[1] || '').length;
      if (isUndefined(fractionSize)) {
        fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac);
      }
      number = +(Math.round(+(number.toString() + 'e' + fractionSize)).toString() + 'e' + -fractionSize);
      var fraction = ('' + number).split(DECIMAL_SEP);
      var whole = fraction[0];
      fraction = fraction[1] || '';
      var i, pos = 0, lgroup = pattern.lgSize, group = pattern.gSize;
      if (whole.length >= lgroup + group) {
        pos = whole.length - lgroup;
        for (i = 0; i < pos; i++) {
          if ((pos - i) % group === 0 && i !== 0) {
            formatedText += groupSep;
          }
          formatedText += whole.charAt(i);
        }
      }
      for (i = pos; i < whole.length; i++) {
        if ((whole.length - i) % lgroup === 0 && i !== 0) {
          formatedText += groupSep;
        }
        formatedText += whole.charAt(i);
      }
      while (fraction.length < fractionSize) {
        fraction += '0';
      }
      if (fractionSize && fractionSize !== '0')
        formatedText += decimalSep + fraction.substr(0, fractionSize);
    } else {
      if (fractionSize > 0 && number < 1) {
        formatedText = number.toFixed(fractionSize);
        number = parseFloat(formatedText);
      }
    }
    if (number === 0) {
      isNegative = false;
    }
    parts.push(isNegative ? pattern.negPre : pattern.posPre, formatedText, isNegative ? pattern.negSuf : pattern.posSuf);
    return parts.join('');
  }
  function padNumber(num, digits, trim) {
    var neg = '';
    if (num < 0) {
      neg = '-';
      num = -num;
    }
    num = '' + num;
    while (num.length < digits)
      num = '0' + num;
    if (trim) {
      num = num.substr(num.length - digits);
    }
    return neg + num;
  }
  function dateGetter(name, size, offset, trim) {
    offset = offset || 0;
    return function (date) {
      var value = date['get' + name]();
      if (offset > 0 || value > -offset) {
        value += offset;
      }
      if (value === 0 && offset == -12)
        value = 12;
      return padNumber(value, size, trim);
    };
  }
  function dateStrGetter(name, shortForm) {
    return function (date, formats) {
      var value = date['get' + name]();
      var get = uppercase(shortForm ? 'SHORT' + name : name);
      return formats[get][value];
    };
  }
  function timeZoneGetter(date, formats, offset) {
    var zone = -1 * offset;
    var paddedZone = zone >= 0 ? '+' : '';
    paddedZone += padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2);
    return paddedZone;
  }
  function getFirstThursdayOfYear(year) {
    var dayOfWeekOnFirst = new Date(year, 0, 1).getDay();
    return new Date(year, 0, (dayOfWeekOnFirst <= 4 ? 5 : 12) - dayOfWeekOnFirst);
  }
  function getThursdayThisWeek(datetime) {
    return new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate() + (4 - datetime.getDay()));
  }
  function weekGetter(size) {
    return function (date) {
      var firstThurs = getFirstThursdayOfYear(date.getFullYear()), thisThurs = getThursdayThisWeek(date);
      var diff = +thisThurs - +firstThurs, result = 1 + Math.round(diff / 604800000);
      return padNumber(result, size);
    };
  }
  function ampmGetter(date, formats) {
    return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
  }
  function eraGetter(date, formats) {
    return date.getFullYear() <= 0 ? formats.ERAS[0] : formats.ERAS[1];
  }
  function longEraGetter(date, formats) {
    return date.getFullYear() <= 0 ? formats.ERANAMES[0] : formats.ERANAMES[1];
  }
  var DATE_FORMATS = {
      yyyy: dateGetter('FullYear', 4),
      yy: dateGetter('FullYear', 2, 0, true),
      y: dateGetter('FullYear', 1),
      MMMM: dateStrGetter('Month'),
      MMM: dateStrGetter('Month', true),
      MM: dateGetter('Month', 2, 1),
      M: dateGetter('Month', 1, 1),
      dd: dateGetter('Date', 2),
      d: dateGetter('Date', 1),
      HH: dateGetter('Hours', 2),
      H: dateGetter('Hours', 1),
      hh: dateGetter('Hours', 2, -12),
      h: dateGetter('Hours', 1, -12),
      mm: dateGetter('Minutes', 2),
      m: dateGetter('Minutes', 1),
      ss: dateGetter('Seconds', 2),
      s: dateGetter('Seconds', 1),
      sss: dateGetter('Milliseconds', 3),
      EEEE: dateStrGetter('Day'),
      EEE: dateStrGetter('Day', true),
      a: ampmGetter,
      Z: timeZoneGetter,
      ww: weekGetter(2),
      w: weekGetter(1),
      G: eraGetter,
      GG: eraGetter,
      GGG: eraGetter,
      GGGG: longEraGetter
    };
  var DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z|G+|w+))(.*)/, NUMBER_STRING = /^\-?\d+$/;
  dateFilter.$inject = ['$locale'];
  function dateFilter($locale) {
    var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
    function jsonStringToDate(string) {
      var match;
      if (match = string.match(R_ISO8601_STR)) {
        var date = new Date(0), tzHour = 0, tzMin = 0, dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear, timeSetter = match[8] ? date.setUTCHours : date.setHours;
        if (match[9]) {
          tzHour = toInt(match[9] + match[10]);
          tzMin = toInt(match[9] + match[11]);
        }
        dateSetter.call(date, toInt(match[1]), toInt(match[2]) - 1, toInt(match[3]));
        var h = toInt(match[4] || 0) - tzHour;
        var m = toInt(match[5] || 0) - tzMin;
        var s = toInt(match[6] || 0);
        var ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
        timeSetter.call(date, h, m, s, ms);
        return date;
      }
      return string;
    }
    return function (date, format, timezone) {
      var text = '', parts = [], fn, match;
      format = format || 'mediumDate';
      format = $locale.DATETIME_FORMATS[format] || format;
      if (isString(date)) {
        date = NUMBER_STRING.test(date) ? toInt(date) : jsonStringToDate(date);
      }
      if (isNumber(date)) {
        date = new Date(date);
      }
      if (!isDate(date) || !isFinite(date.getTime())) {
        return date;
      }
      while (format) {
        match = DATE_FORMATS_SPLIT.exec(format);
        if (match) {
          parts = concat(parts, match, 1);
          format = parts.pop();
        } else {
          parts.push(format);
          format = null;
        }
      }
      var dateTimezoneOffset = date.getTimezoneOffset();
      if (timezone) {
        dateTimezoneOffset = timezoneToOffset(timezone, date.getTimezoneOffset());
        date = convertTimezoneToLocal(date, timezone, true);
      }
      forEach(parts, function (value) {
        fn = DATE_FORMATS[value];
        text += fn ? fn(date, $locale.DATETIME_FORMATS, dateTimezoneOffset) : value.replace(/(^'|'$)/g, '').replace(/''/g, '\'');
      });
      return text;
    };
  }
  function jsonFilter() {
    return function (object, spacing) {
      if (isUndefined(spacing)) {
        spacing = 2;
      }
      return toJson(object, spacing);
    };
  }
  var lowercaseFilter = valueFn(lowercase);
  var uppercaseFilter = valueFn(uppercase);
  function limitToFilter() {
    return function (input, limit, begin) {
      if (Math.abs(Number(limit)) === Infinity) {
        limit = Number(limit);
      } else {
        limit = toInt(limit);
      }
      if (isNaN(limit))
        return input;
      if (isNumber(input))
        input = input.toString();
      if (!isArray(input) && !isString(input))
        return input;
      begin = !begin || isNaN(begin) ? 0 : toInt(begin);
      begin = begin < 0 && begin >= -input.length ? input.length + begin : begin;
      if (limit >= 0) {
        return input.slice(begin, begin + limit);
      } else {
        if (begin === 0) {
          return input.slice(limit, input.length);
        } else {
          return input.slice(Math.max(0, begin + limit), begin);
        }
      }
    };
  }
  orderByFilter.$inject = ['$parse'];
  function orderByFilter($parse) {
    return function (array, sortPredicate, reverseOrder) {
      if (!isArrayLike(array))
        return array;
      sortPredicate = isArray(sortPredicate) ? sortPredicate : [sortPredicate];
      if (sortPredicate.length === 0) {
        sortPredicate = ['+'];
      }
      sortPredicate = sortPredicate.map(function (predicate) {
        var descending = false, get = predicate || identity;
        if (isString(predicate)) {
          if (predicate.charAt(0) == '+' || predicate.charAt(0) == '-') {
            descending = predicate.charAt(0) == '-';
            predicate = predicate.substring(1);
          }
          if (predicate === '') {
            return reverseComparator(compare, descending);
          }
          get = $parse(predicate);
          if (get.constant) {
            var key = get();
            return reverseComparator(function (a, b) {
              return compare(a[key], b[key]);
            }, descending);
          }
        }
        return reverseComparator(function (a, b) {
          return compare(get(a), get(b));
        }, descending);
      });
      return slice.call(array).sort(reverseComparator(comparator, reverseOrder));
      function comparator(o1, o2) {
        for (var i = 0; i < sortPredicate.length; i++) {
          var comp = sortPredicate[i](o1, o2);
          if (comp !== 0)
            return comp;
        }
        return 0;
      }
      function reverseComparator(comp, descending) {
        return descending ? function (a, b) {
          return comp(b, a);
        } : comp;
      }
      function isPrimitive(value) {
        switch (typeof value) {
        case 'number':
        case 'boolean':
        case 'string':
          return true;
        default:
          return false;
        }
      }
      function objectToString(value) {
        if (value === null)
          return 'null';
        if (typeof value.valueOf === 'function') {
          value = value.valueOf();
          if (isPrimitive(value))
            return value;
        }
        if (typeof value.toString === 'function') {
          value = value.toString();
          if (isPrimitive(value))
            return value;
        }
        return '';
      }
      function compare(v1, v2) {
        var t1 = typeof v1;
        var t2 = typeof v2;
        if (t1 === t2 && t1 === 'object') {
          v1 = objectToString(v1);
          v2 = objectToString(v2);
        }
        if (t1 === t2) {
          if (t1 === 'string') {
            v1 = v1.toLowerCase();
            v2 = v2.toLowerCase();
          }
          if (v1 === v2)
            return 0;
          return v1 < v2 ? -1 : 1;
        } else {
          return t1 < t2 ? -1 : 1;
        }
      }
    };
  }
  function ngDirective(directive) {
    if (isFunction(directive)) {
      directive = { link: directive };
    }
    directive.restrict = directive.restrict || 'AC';
    return valueFn(directive);
  }
  var htmlAnchorDirective = valueFn({
      restrict: 'E',
      compile: function (element, attr) {
        if (!attr.href && !attr.xlinkHref) {
          return function (scope, element) {
            if (element[0].nodeName.toLowerCase() !== 'a')
              return;
            var href = toString.call(element.prop('href')) === '[object SVGAnimatedString]' ? 'xlink:href' : 'href';
            element.on('click', function (event) {
              if (!element.attr(href)) {
                event.preventDefault();
              }
            });
          };
        }
      }
    });
  var ngAttributeAliasDirectives = {};
  forEach(BOOLEAN_ATTR, function (propName, attrName) {
    if (propName == 'multiple')
      return;
    function defaultLinkFn(scope, element, attr) {
      scope.$watch(attr[normalized], function ngBooleanAttrWatchAction(value) {
        attr.$set(attrName, !!value);
      });
    }
    var normalized = directiveNormalize('ng-' + attrName);
    var linkFn = defaultLinkFn;
    if (propName === 'checked') {
      linkFn = function (scope, element, attr) {
        if (attr.ngModel !== attr[normalized]) {
          defaultLinkFn(scope, element, attr);
        }
      };
    }
    ngAttributeAliasDirectives[normalized] = function () {
      return {
        restrict: 'A',
        priority: 100,
        link: linkFn
      };
    };
  });
  forEach(ALIASED_ATTR, function (htmlAttr, ngAttr) {
    ngAttributeAliasDirectives[ngAttr] = function () {
      return {
        priority: 100,
        link: function (scope, element, attr) {
          if (ngAttr === 'ngPattern' && attr.ngPattern.charAt(0) == '/') {
            var match = attr.ngPattern.match(REGEX_STRING_REGEXP);
            if (match) {
              attr.$set('ngPattern', new RegExp(match[1], match[2]));
              return;
            }
          }
          scope.$watch(attr[ngAttr], function ngAttrAliasWatchAction(value) {
            attr.$set(ngAttr, value);
          });
        }
      };
    };
  });
  forEach([
    'src',
    'srcset',
    'href'
  ], function (attrName) {
    var normalized = directiveNormalize('ng-' + attrName);
    ngAttributeAliasDirectives[normalized] = function () {
      return {
        priority: 99,
        link: function (scope, element, attr) {
          var propName = attrName, name = attrName;
          if (attrName === 'href' && toString.call(element.prop('href')) === '[object SVGAnimatedString]') {
            name = 'xlinkHref';
            attr.$attr[name] = 'xlink:href';
            propName = null;
          }
          attr.$observe(normalized, function (value) {
            if (!value) {
              if (attrName === 'href') {
                attr.$set(name, null);
              }
              return;
            }
            attr.$set(name, value);
            if (msie && propName)
              element.prop(propName, attr[name]);
          });
        }
      };
    };
  });
  var nullFormCtrl = {
      $addControl: noop,
      $$renameControl: nullFormRenameControl,
      $removeControl: noop,
      $setValidity: noop,
      $setDirty: noop,
      $setPristine: noop,
      $setSubmitted: noop
    }, SUBMITTED_CLASS = 'ng-submitted';
  function nullFormRenameControl(control, name) {
    control.$name = name;
  }
  FormController.$inject = [
    '$element',
    '$attrs',
    '$scope',
    '$animate',
    '$interpolate'
  ];
  function FormController(element, attrs, $scope, $animate, $interpolate) {
    var form = this, controls = [];
    var parentForm = form.$$parentForm = element.parent().controller('form') || nullFormCtrl;
    form.$error = {};
    form.$$success = {};
    form.$pending = undefined;
    form.$name = $interpolate(attrs.name || attrs.ngForm || '')($scope);
    form.$dirty = false;
    form.$pristine = true;
    form.$valid = true;
    form.$invalid = false;
    form.$submitted = false;
    parentForm.$addControl(form);
    form.$rollbackViewValue = function () {
      forEach(controls, function (control) {
        control.$rollbackViewValue();
      });
    };
    form.$commitViewValue = function () {
      forEach(controls, function (control) {
        control.$commitViewValue();
      });
    };
    form.$addControl = function (control) {
      assertNotHasOwnProperty(control.$name, 'input');
      controls.push(control);
      if (control.$name) {
        form[control.$name] = control;
      }
    };
    form.$$renameControl = function (control, newName) {
      var oldName = control.$name;
      if (form[oldName] === control) {
        delete form[oldName];
      }
      form[newName] = control;
      control.$name = newName;
    };
    form.$removeControl = function (control) {
      if (control.$name && form[control.$name] === control) {
        delete form[control.$name];
      }
      forEach(form.$pending, function (value, name) {
        form.$setValidity(name, null, control);
      });
      forEach(form.$error, function (value, name) {
        form.$setValidity(name, null, control);
      });
      forEach(form.$$success, function (value, name) {
        form.$setValidity(name, null, control);
      });
      arrayRemove(controls, control);
    };
    addSetValidityMethod({
      ctrl: this,
      $element: element,
      set: function (object, property, controller) {
        var list = object[property];
        if (!list) {
          object[property] = [controller];
        } else {
          var index = list.indexOf(controller);
          if (index === -1) {
            list.push(controller);
          }
        }
      },
      unset: function (object, property, controller) {
        var list = object[property];
        if (!list) {
          return;
        }
        arrayRemove(list, controller);
        if (list.length === 0) {
          delete object[property];
        }
      },
      parentForm: parentForm,
      $animate: $animate
    });
    form.$setDirty = function () {
      $animate.removeClass(element, PRISTINE_CLASS);
      $animate.addClass(element, DIRTY_CLASS);
      form.$dirty = true;
      form.$pristine = false;
      parentForm.$setDirty();
    };
    form.$setPristine = function () {
      $animate.setClass(element, PRISTINE_CLASS, DIRTY_CLASS + ' ' + SUBMITTED_CLASS);
      form.$dirty = false;
      form.$pristine = true;
      form.$submitted = false;
      forEach(controls, function (control) {
        control.$setPristine();
      });
    };
    form.$setUntouched = function () {
      forEach(controls, function (control) {
        control.$setUntouched();
      });
    };
    form.$setSubmitted = function () {
      $animate.addClass(element, SUBMITTED_CLASS);
      form.$submitted = true;
      parentForm.$setSubmitted();
    };
  }
  var formDirectiveFactory = function (isNgForm) {
    return [
      '$timeout',
      function ($timeout) {
        var formDirective = {
            name: 'form',
            restrict: isNgForm ? 'EAC' : 'E',
            controller: FormController,
            compile: function ngFormCompile(formElement, attr) {
              formElement.addClass(PRISTINE_CLASS).addClass(VALID_CLASS);
              var nameAttr = attr.name ? 'name' : isNgForm && attr.ngForm ? 'ngForm' : false;
              return {
                pre: function ngFormPreLink(scope, formElement, attr, controller) {
                  if (!('action' in attr)) {
                    var handleFormSubmission = function (event) {
                      scope.$apply(function () {
                        controller.$commitViewValue();
                        controller.$setSubmitted();
                      });
                      event.preventDefault();
                    };
                    addEventListenerFn(formElement[0], 'submit', handleFormSubmission);
                    formElement.on('$destroy', function () {
                      $timeout(function () {
                        removeEventListenerFn(formElement[0], 'submit', handleFormSubmission);
                      }, 0, false);
                    });
                  }
                  var parentFormCtrl = controller.$$parentForm;
                  if (nameAttr) {
                    setter(scope, controller.$name, controller, controller.$name);
                    attr.$observe(nameAttr, function (newValue) {
                      if (controller.$name === newValue)
                        return;
                      setter(scope, controller.$name, undefined, controller.$name);
                      parentFormCtrl.$$renameControl(controller, newValue);
                      setter(scope, controller.$name, controller, controller.$name);
                    });
                  }
                  formElement.on('$destroy', function () {
                    parentFormCtrl.$removeControl(controller);
                    if (nameAttr) {
                      setter(scope, attr[nameAttr], undefined, controller.$name);
                    }
                    extend(controller, nullFormCtrl);
                  });
                }
              };
            }
          };
        return formDirective;
      }
    ];
  };
  var formDirective = formDirectiveFactory();
  var ngFormDirective = formDirectiveFactory(true);
  var ISO_DATE_REGEXP = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
  var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
  var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
  var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;
  var DATE_REGEXP = /^(\d{4})-(\d{2})-(\d{2})$/;
  var DATETIMELOCAL_REGEXP = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/;
  var WEEK_REGEXP = /^(\d{4})-W(\d\d)$/;
  var MONTH_REGEXP = /^(\d{4})-(\d\d)$/;
  var TIME_REGEXP = /^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/;
  var inputType = {
      'text': textInputType,
      'date': createDateInputType('date', DATE_REGEXP, createDateParser(DATE_REGEXP, [
        'yyyy',
        'MM',
        'dd'
      ]), 'yyyy-MM-dd'),
      'datetime-local': createDateInputType('datetimelocal', DATETIMELOCAL_REGEXP, createDateParser(DATETIMELOCAL_REGEXP, [
        'yyyy',
        'MM',
        'dd',
        'HH',
        'mm',
        'ss',
        'sss'
      ]), 'yyyy-MM-ddTHH:mm:ss.sss'),
      'time': createDateInputType('time', TIME_REGEXP, createDateParser(TIME_REGEXP, [
        'HH',
        'mm',
        'ss',
        'sss'
      ]), 'HH:mm:ss.sss'),
      'week': createDateInputType('week', WEEK_REGEXP, weekParser, 'yyyy-Www'),
      'month': createDateInputType('month', MONTH_REGEXP, createDateParser(MONTH_REGEXP, [
        'yyyy',
        'MM'
      ]), 'yyyy-MM'),
      'number': numberInputType,
      'url': urlInputType,
      'email': emailInputType,
      'radio': radioInputType,
      'checkbox': checkboxInputType,
      'hidden': noop,
      'button': noop,
      'submit': noop,
      'reset': noop,
      'file': noop
    };
  function stringBasedInputType(ctrl) {
    ctrl.$formatters.push(function (value) {
      return ctrl.$isEmpty(value) ? value : value.toString();
    });
  }
  function textInputType(scope, element, attr, ctrl, $sniffer, $browser) {
    baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
    stringBasedInputType(ctrl);
  }
  function baseInputType(scope, element, attr, ctrl, $sniffer, $browser) {
    var type = lowercase(element[0].type);
    if (!$sniffer.android) {
      var composing = false;
      element.on('compositionstart', function (data) {
        composing = true;
      });
      element.on('compositionend', function () {
        composing = false;
        listener();
      });
    }
    var listener = function (ev) {
      if (timeout) {
        $browser.defer.cancel(timeout);
        timeout = null;
      }
      if (composing)
        return;
      var value = element.val(), event = ev && ev.type;
      if (type !== 'password' && (!attr.ngTrim || attr.ngTrim !== 'false')) {
        value = trim(value);
      }
      if (ctrl.$viewValue !== value || value === '' && ctrl.$$hasNativeValidators) {
        ctrl.$setViewValue(value, event);
      }
    };
    if ($sniffer.hasEvent('input')) {
      element.on('input', listener);
    } else {
      var timeout;
      var deferListener = function (ev, input, origValue) {
        if (!timeout) {
          timeout = $browser.defer(function () {
            timeout = null;
            if (!input || input.value !== origValue) {
              listener(ev);
            }
          });
        }
      };
      element.on('keydown', function (event) {
        var key = event.keyCode;
        if (key === 91 || 15 < key && key < 19 || 37 <= key && key <= 40)
          return;
        deferListener(event, this, this.value);
      });
      if ($sniffer.hasEvent('paste')) {
        element.on('paste cut', deferListener);
      }
    }
    element.on('change', listener);
    ctrl.$render = function () {
      element.val(ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue);
    };
  }
  function weekParser(isoWeek, existingDate) {
    if (isDate(isoWeek)) {
      return isoWeek;
    }
    if (isString(isoWeek)) {
      WEEK_REGEXP.lastIndex = 0;
      var parts = WEEK_REGEXP.exec(isoWeek);
      if (parts) {
        var year = +parts[1], week = +parts[2], hours = 0, minutes = 0, seconds = 0, milliseconds = 0, firstThurs = getFirstThursdayOfYear(year), addDays = (week - 1) * 7;
        if (existingDate) {
          hours = existingDate.getHours();
          minutes = existingDate.getMinutes();
          seconds = existingDate.getSeconds();
          milliseconds = existingDate.getMilliseconds();
        }
        return new Date(year, 0, firstThurs.getDate() + addDays, hours, minutes, seconds, milliseconds);
      }
    }
    return NaN;
  }
  function createDateParser(regexp, mapping) {
    return function (iso, date) {
      var parts, map;
      if (isDate(iso)) {
        return iso;
      }
      if (isString(iso)) {
        if (iso.charAt(0) == '"' && iso.charAt(iso.length - 1) == '"') {
          iso = iso.substring(1, iso.length - 1);
        }
        if (ISO_DATE_REGEXP.test(iso)) {
          return new Date(iso);
        }
        regexp.lastIndex = 0;
        parts = regexp.exec(iso);
        if (parts) {
          parts.shift();
          if (date) {
            map = {
              yyyy: date.getFullYear(),
              MM: date.getMonth() + 1,
              dd: date.getDate(),
              HH: date.getHours(),
              mm: date.getMinutes(),
              ss: date.getSeconds(),
              sss: date.getMilliseconds() / 1000
            };
          } else {
            map = {
              yyyy: 1970,
              MM: 1,
              dd: 1,
              HH: 0,
              mm: 0,
              ss: 0,
              sss: 0
            };
          }
          forEach(parts, function (part, index) {
            if (index < mapping.length) {
              map[mapping[index]] = +part;
            }
          });
          return new Date(map.yyyy, map.MM - 1, map.dd, map.HH, map.mm, map.ss || 0, map.sss * 1000 || 0);
        }
      }
      return NaN;
    };
  }
  function createDateInputType(type, regexp, parseDate, format) {
    return function dynamicDateInputType(scope, element, attr, ctrl, $sniffer, $browser, $filter) {
      badInputChecker(scope, element, attr, ctrl);
      baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
      var timezone = ctrl && ctrl.$options && ctrl.$options.timezone;
      var previousDate;
      ctrl.$$parserName = type;
      ctrl.$parsers.push(function (value) {
        if (ctrl.$isEmpty(value))
          return null;
        if (regexp.test(value)) {
          var parsedDate = parseDate(value, previousDate);
          if (timezone) {
            parsedDate = convertTimezoneToLocal(parsedDate, timezone);
          }
          return parsedDate;
        }
        return undefined;
      });
      ctrl.$formatters.push(function (value) {
        if (value && !isDate(value)) {
          throw $ngModelMinErr('datefmt', 'Expected `{0}` to be a date', value);
        }
        if (isValidDate(value)) {
          previousDate = value;
          if (previousDate && timezone) {
            previousDate = convertTimezoneToLocal(previousDate, timezone, true);
          }
          return $filter('date')(value, format, timezone);
        } else {
          previousDate = null;
          return '';
        }
      });
      if (isDefined(attr.min) || attr.ngMin) {
        var minVal;
        ctrl.$validators.min = function (value) {
          return !isValidDate(value) || isUndefined(minVal) || parseDate(value) >= minVal;
        };
        attr.$observe('min', function (val) {
          minVal = parseObservedDateValue(val);
          ctrl.$validate();
        });
      }
      if (isDefined(attr.max) || attr.ngMax) {
        var maxVal;
        ctrl.$validators.max = function (value) {
          return !isValidDate(value) || isUndefined(maxVal) || parseDate(value) <= maxVal;
        };
        attr.$observe('max', function (val) {
          maxVal = parseObservedDateValue(val);
          ctrl.$validate();
        });
      }
      function isValidDate(value) {
        return value && !(value.getTime && value.getTime() !== value.getTime());
      }
      function parseObservedDateValue(val) {
        return isDefined(val) ? isDate(val) ? val : parseDate(val) : undefined;
      }
    };
  }
  function badInputChecker(scope, element, attr, ctrl) {
    var node = element[0];
    var nativeValidation = ctrl.$$hasNativeValidators = isObject(node.validity);
    if (nativeValidation) {
      ctrl.$parsers.push(function (value) {
        var validity = element.prop(VALIDITY_STATE_PROPERTY) || {};
        return validity.badInput && !validity.typeMismatch ? undefined : value;
      });
    }
  }
  function numberInputType(scope, element, attr, ctrl, $sniffer, $browser) {
    badInputChecker(scope, element, attr, ctrl);
    baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
    ctrl.$$parserName = 'number';
    ctrl.$parsers.push(function (value) {
      if (ctrl.$isEmpty(value))
        return null;
      if (NUMBER_REGEXP.test(value))
        return parseFloat(value);
      return undefined;
    });
    ctrl.$formatters.push(function (value) {
      if (!ctrl.$isEmpty(value)) {
        if (!isNumber(value)) {
          throw $ngModelMinErr('numfmt', 'Expected `{0}` to be a number', value);
        }
        value = value.toString();
      }
      return value;
    });
    if (isDefined(attr.min) || attr.ngMin) {
      var minVal;
      ctrl.$validators.min = function (value) {
        return ctrl.$isEmpty(value) || isUndefined(minVal) || value >= minVal;
      };
      attr.$observe('min', function (val) {
        if (isDefined(val) && !isNumber(val)) {
          val = parseFloat(val, 10);
        }
        minVal = isNumber(val) && !isNaN(val) ? val : undefined;
        ctrl.$validate();
      });
    }
    if (isDefined(attr.max) || attr.ngMax) {
      var maxVal;
      ctrl.$validators.max = function (value) {
        return ctrl.$isEmpty(value) || isUndefined(maxVal) || value <= maxVal;
      };
      attr.$observe('max', function (val) {
        if (isDefined(val) && !isNumber(val)) {
          val = parseFloat(val, 10);
        }
        maxVal = isNumber(val) && !isNaN(val) ? val : undefined;
        ctrl.$validate();
      });
    }
  }
  function urlInputType(scope, element, attr, ctrl, $sniffer, $browser) {
    baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
    stringBasedInputType(ctrl);
    ctrl.$$parserName = 'url';
    ctrl.$validators.url = function (modelValue, viewValue) {
      var value = modelValue || viewValue;
      return ctrl.$isEmpty(value) || URL_REGEXP.test(value);
    };
  }
  function emailInputType(scope, element, attr, ctrl, $sniffer, $browser) {
    baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
    stringBasedInputType(ctrl);
    ctrl.$$parserName = 'email';
    ctrl.$validators.email = function (modelValue, viewValue) {
      var value = modelValue || viewValue;
      return ctrl.$isEmpty(value) || EMAIL_REGEXP.test(value);
    };
  }
  function radioInputType(scope, element, attr, ctrl) {
    if (isUndefined(attr.name)) {
      element.attr('name', nextUid());
    }
    var listener = function (ev) {
      if (element[0].checked) {
        ctrl.$setViewValue(attr.value, ev && ev.type);
      }
    };
    element.on('click', listener);
    ctrl.$render = function () {
      var value = attr.value;
      element[0].checked = value == ctrl.$viewValue;
    };
    attr.$observe('value', ctrl.$render);
  }
  function parseConstantExpr($parse, context, name, expression, fallback) {
    var parseFn;
    if (isDefined(expression)) {
      parseFn = $parse(expression);
      if (!parseFn.constant) {
        throw minErr('ngModel')('constexpr', 'Expected constant expression for `{0}`, but saw ' + '`{1}`.', name, expression);
      }
      return parseFn(context);
    }
    return fallback;
  }
  function checkboxInputType(scope, element, attr, ctrl, $sniffer, $browser, $filter, $parse) {
    var trueValue = parseConstantExpr($parse, scope, 'ngTrueValue', attr.ngTrueValue, true);
    var falseValue = parseConstantExpr($parse, scope, 'ngFalseValue', attr.ngFalseValue, false);
    var listener = function (ev) {
      ctrl.$setViewValue(element[0].checked, ev && ev.type);
    };
    element.on('click', listener);
    ctrl.$render = function () {
      element[0].checked = ctrl.$viewValue;
    };
    ctrl.$isEmpty = function (value) {
      return value === false;
    };
    ctrl.$formatters.push(function (value) {
      return equals(value, trueValue);
    });
    ctrl.$parsers.push(function (value) {
      return value ? trueValue : falseValue;
    });
  }
  var inputDirective = [
      '$browser',
      '$sniffer',
      '$filter',
      '$parse',
      function ($browser, $sniffer, $filter, $parse) {
        return {
          restrict: 'E',
          require: ['?ngModel'],
          link: {
            pre: function (scope, element, attr, ctrls) {
              if (ctrls[0]) {
                (inputType[lowercase(attr.type)] || inputType.text)(scope, element, attr, ctrls[0], $sniffer, $browser, $filter, $parse);
              }
            }
          }
        };
      }
    ];
  var CONSTANT_VALUE_REGEXP = /^(true|false|\d+)$/;
  var ngValueDirective = function () {
    return {
      restrict: 'A',
      priority: 100,
      compile: function (tpl, tplAttr) {
        if (CONSTANT_VALUE_REGEXP.test(tplAttr.ngValue)) {
          return function ngValueConstantLink(scope, elm, attr) {
            attr.$set('value', scope.$eval(attr.ngValue));
          };
        } else {
          return function ngValueLink(scope, elm, attr) {
            scope.$watch(attr.ngValue, function valueWatchAction(value) {
              attr.$set('value', value);
            });
          };
        }
      }
    };
  };
  var ngBindDirective = [
      '$compile',
      function ($compile) {
        return {
          restrict: 'AC',
          compile: function ngBindCompile(templateElement) {
            $compile.$$addBindingClass(templateElement);
            return function ngBindLink(scope, element, attr) {
              $compile.$$addBindingInfo(element, attr.ngBind);
              element = element[0];
              scope.$watch(attr.ngBind, function ngBindWatchAction(value) {
                element.textContent = value === undefined ? '' : value;
              });
            };
          }
        };
      }
    ];
  var ngBindTemplateDirective = [
      '$interpolate',
      '$compile',
      function ($interpolate, $compile) {
        return {
          compile: function ngBindTemplateCompile(templateElement) {
            $compile.$$addBindingClass(templateElement);
            return function ngBindTemplateLink(scope, element, attr) {
              var interpolateFn = $interpolate(element.attr(attr.$attr.ngBindTemplate));
              $compile.$$addBindingInfo(element, interpolateFn.expressions);
              element = element[0];
              attr.$observe('ngBindTemplate', function (value) {
                element.textContent = value === undefined ? '' : value;
              });
            };
          }
        };
      }
    ];
  var ngBindHtmlDirective = [
      '$sce',
      '$parse',
      '$compile',
      function ($sce, $parse, $compile) {
        return {
          restrict: 'A',
          compile: function ngBindHtmlCompile(tElement, tAttrs) {
            var ngBindHtmlGetter = $parse(tAttrs.ngBindHtml);
            var ngBindHtmlWatch = $parse(tAttrs.ngBindHtml, function getStringValue(value) {
                return (value || '').toString();
              });
            $compile.$$addBindingClass(tElement);
            return function ngBindHtmlLink(scope, element, attr) {
              $compile.$$addBindingInfo(element, attr.ngBindHtml);
              scope.$watch(ngBindHtmlWatch, function ngBindHtmlWatchAction() {
                element.html($sce.getTrustedHtml(ngBindHtmlGetter(scope)) || '');
              });
            };
          }
        };
      }
    ];
  var ngChangeDirective = valueFn({
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attr, ctrl) {
        ctrl.$viewChangeListeners.push(function () {
          scope.$eval(attr.ngChange);
        });
      }
    });
  function classDirective(name, selector) {
    name = 'ngClass' + name;
    return [
      '$animate',
      function ($animate) {
        return {
          restrict: 'AC',
          link: function (scope, element, attr) {
            var oldVal;
            scope.$watch(attr[name], ngClassWatchAction, true);
            attr.$observe('class', function (value) {
              ngClassWatchAction(scope.$eval(attr[name]));
            });
            if (name !== 'ngClass') {
              scope.$watch('$index', function ($index, old$index) {
                var mod = $index & 1;
                if (mod !== (old$index & 1)) {
                  var classes = arrayClasses(scope.$eval(attr[name]));
                  mod === selector ? addClasses(classes) : removeClasses(classes);
                }
              });
            }
            function addClasses(classes) {
              var newClasses = digestClassCounts(classes, 1);
              attr.$addClass(newClasses);
            }
            function removeClasses(classes) {
              var newClasses = digestClassCounts(classes, -1);
              attr.$removeClass(newClasses);
            }
            function digestClassCounts(classes, count) {
              var classCounts = element.data('$classCounts') || createMap();
              var classesToUpdate = [];
              forEach(classes, function (className) {
                if (count > 0 || classCounts[className]) {
                  classCounts[className] = (classCounts[className] || 0) + count;
                  if (classCounts[className] === +(count > 0)) {
                    classesToUpdate.push(className);
                  }
                }
              });
              element.data('$classCounts', classCounts);
              return classesToUpdate.join(' ');
            }
            function updateClasses(oldClasses, newClasses) {
              var toAdd = arrayDifference(newClasses, oldClasses);
              var toRemove = arrayDifference(oldClasses, newClasses);
              toAdd = digestClassCounts(toAdd, 1);
              toRemove = digestClassCounts(toRemove, -1);
              if (toAdd && toAdd.length) {
                $animate.addClass(element, toAdd);
              }
              if (toRemove && toRemove.length) {
                $animate.removeClass(element, toRemove);
              }
            }
            function ngClassWatchAction(newVal) {
              if (selector === true || scope.$index % 2 === selector) {
                var newClasses = arrayClasses(newVal || []);
                if (!oldVal) {
                  addClasses(newClasses);
                } else if (!equals(newVal, oldVal)) {
                  var oldClasses = arrayClasses(oldVal);
                  updateClasses(oldClasses, newClasses);
                }
              }
              oldVal = shallowCopy(newVal);
            }
          }
        };
        function arrayDifference(tokens1, tokens2) {
          var values = [];
          outer:
            for (var i = 0; i < tokens1.length; i++) {
              var token = tokens1[i];
              for (var j = 0; j < tokens2.length; j++) {
                if (token == tokens2[j])
                  continue outer;
              }
              values.push(token);
            }
          return values;
        }
        function arrayClasses(classVal) {
          var classes = [];
          if (isArray(classVal)) {
            forEach(classVal, function (v) {
              classes = classes.concat(arrayClasses(v));
            });
            return classes;
          } else if (isString(classVal)) {
            return classVal.split(' ');
          } else if (isObject(classVal)) {
            forEach(classVal, function (v, k) {
              if (v) {
                classes = classes.concat(k.split(' '));
              }
            });
            return classes;
          }
          return classVal;
        }
      }
    ];
  }
  var ngClassDirective = classDirective('', true);
  var ngClassOddDirective = classDirective('Odd', 0);
  var ngClassEvenDirective = classDirective('Even', 1);
  var ngCloakDirective = ngDirective({
      compile: function (element, attr) {
        attr.$set('ngCloak', undefined);
        element.removeClass('ng-cloak');
      }
    });
  var ngControllerDirective = [function () {
        return {
          restrict: 'A',
          scope: true,
          controller: '@',
          priority: 500
        };
      }];
  var ngEventDirectives = {};
  var forceAsyncEvents = {
      'blur': true,
      'focus': true
    };
  forEach('click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' '), function (eventName) {
    var directiveName = directiveNormalize('ng-' + eventName);
    ngEventDirectives[directiveName] = [
      '$parse',
      '$rootScope',
      function ($parse, $rootScope) {
        return {
          restrict: 'A',
          compile: function ($element, attr) {
            var fn = $parse(attr[directiveName], null, true);
            return function ngEventHandler(scope, element) {
              element.on(eventName, function (event) {
                var callback = function () {
                  fn(scope, { $event: event });
                };
                if (forceAsyncEvents[eventName] && $rootScope.$$phase) {
                  scope.$evalAsync(callback);
                } else {
                  scope.$apply(callback);
                }
              });
            };
          }
        };
      }
    ];
  });
  var ngIfDirective = [
      '$animate',
      function ($animate) {
        return {
          multiElement: true,
          transclude: 'element',
          priority: 600,
          terminal: true,
          restrict: 'A',
          $$tlb: true,
          link: function ($scope, $element, $attr, ctrl, $transclude) {
            var block, childScope, previousElements;
            $scope.$watch($attr.ngIf, function ngIfWatchAction(value) {
              if (value) {
                if (!childScope) {
                  $transclude(function (clone, newScope) {
                    childScope = newScope;
                    clone[clone.length++] = document.createComment(' end ngIf: ' + $attr.ngIf + ' ');
                    block = { clone: clone };
                    $animate.enter(clone, $element.parent(), $element);
                  });
                }
              } else {
                if (previousElements) {
                  previousElements.remove();
                  previousElements = null;
                }
                if (childScope) {
                  childScope.$destroy();
                  childScope = null;
                }
                if (block) {
                  previousElements = getBlockNodes(block.clone);
                  $animate.leave(previousElements).then(function () {
                    previousElements = null;
                  });
                  block = null;
                }
              }
            });
          }
        };
      }
    ];
  var ngIncludeDirective = [
      '$templateRequest',
      '$anchorScroll',
      '$animate',
      '$sce',
      function ($templateRequest, $anchorScroll, $animate, $sce) {
        return {
          restrict: 'ECA',
          priority: 400,
          terminal: true,
          transclude: 'element',
          controller: angular.noop,
          compile: function (element, attr) {
            var srcExp = attr.ngInclude || attr.src, onloadExp = attr.onload || '', autoScrollExp = attr.autoscroll;
            return function (scope, $element, $attr, ctrl, $transclude) {
              var changeCounter = 0, currentScope, previousElement, currentElement;
              var cleanupLastIncludeContent = function () {
                if (previousElement) {
                  previousElement.remove();
                  previousElement = null;
                }
                if (currentScope) {
                  currentScope.$destroy();
                  currentScope = null;
                }
                if (currentElement) {
                  $animate.leave(currentElement).then(function () {
                    previousElement = null;
                  });
                  previousElement = currentElement;
                  currentElement = null;
                }
              };
              scope.$watch($sce.parseAsResourceUrl(srcExp), function ngIncludeWatchAction(src) {
                var afterAnimation = function () {
                  if (isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                    $anchorScroll();
                  }
                };
                var thisChangeId = ++changeCounter;
                if (src) {
                  $templateRequest(src, true).then(function (response) {
                    if (thisChangeId !== changeCounter)
                      return;
                    var newScope = scope.$new();
                    ctrl.template = response;
                    var clone = $transclude(newScope, function (clone) {
                        cleanupLastIncludeContent();
                        $animate.enter(clone, null, $element).then(afterAnimation);
                      });
                    currentScope = newScope;
                    currentElement = clone;
                    currentScope.$emit('$includeContentLoaded', src);
                    scope.$eval(onloadExp);
                  }, function () {
                    if (thisChangeId === changeCounter) {
                      cleanupLastIncludeContent();
                      scope.$emit('$includeContentError', src);
                    }
                  });
                  scope.$emit('$includeContentRequested', src);
                } else {
                  cleanupLastIncludeContent();
                  ctrl.template = null;
                }
              });
            };
          }
        };
      }
    ];
  var ngIncludeFillContentDirective = [
      '$compile',
      function ($compile) {
        return {
          restrict: 'ECA',
          priority: -400,
          require: 'ngInclude',
          link: function (scope, $element, $attr, ctrl) {
            if (/SVG/.test($element[0].toString())) {
              $element.empty();
              $compile(jqLiteBuildFragment(ctrl.template, document).childNodes)(scope, function namespaceAdaptedClone(clone) {
                $element.append(clone);
              }, { futureParentElement: $element });
              return;
            }
            $element.html(ctrl.template);
            $compile($element.contents())(scope);
          }
        };
      }
    ];
  var ngInitDirective = ngDirective({
      priority: 450,
      compile: function () {
        return {
          pre: function (scope, element, attrs) {
            scope.$eval(attrs.ngInit);
          }
        };
      }
    });
  var ngListDirective = function () {
    return {
      restrict: 'A',
      priority: 100,
      require: 'ngModel',
      link: function (scope, element, attr, ctrl) {
        var ngList = element.attr(attr.$attr.ngList) || ', ';
        var trimValues = attr.ngTrim !== 'false';
        var separator = trimValues ? trim(ngList) : ngList;
        var parse = function (viewValue) {
          if (isUndefined(viewValue))
            return;
          var list = [];
          if (viewValue) {
            forEach(viewValue.split(separator), function (value) {
              if (value)
                list.push(trimValues ? trim(value) : value);
            });
          }
          return list;
        };
        ctrl.$parsers.push(parse);
        ctrl.$formatters.push(function (value) {
          if (isArray(value)) {
            return value.join(ngList);
          }
          return undefined;
        });
        ctrl.$isEmpty = function (value) {
          return !value || !value.length;
        };
      }
    };
  };
  var VALID_CLASS = 'ng-valid', INVALID_CLASS = 'ng-invalid', PRISTINE_CLASS = 'ng-pristine', DIRTY_CLASS = 'ng-dirty', UNTOUCHED_CLASS = 'ng-untouched', TOUCHED_CLASS = 'ng-touched', PENDING_CLASS = 'ng-pending';
  var $ngModelMinErr = new minErr('ngModel');
  var NgModelController = [
      '$scope',
      '$exceptionHandler',
      '$attrs',
      '$element',
      '$parse',
      '$animate',
      '$timeout',
      '$rootScope',
      '$q',
      '$interpolate',
      function ($scope, $exceptionHandler, $attr, $element, $parse, $animate, $timeout, $rootScope, $q, $interpolate) {
        this.$viewValue = Number.NaN;
        this.$modelValue = Number.NaN;
        this.$$rawModelValue = undefined;
        this.$validators = {};
        this.$asyncValidators = {};
        this.$parsers = [];
        this.$formatters = [];
        this.$viewChangeListeners = [];
        this.$untouched = true;
        this.$touched = false;
        this.$pristine = true;
        this.$dirty = false;
        this.$valid = true;
        this.$invalid = false;
        this.$error = {};
        this.$$success = {};
        this.$pending = undefined;
        this.$name = $interpolate($attr.name || '', false)($scope);
        var parsedNgModel = $parse($attr.ngModel), parsedNgModelAssign = parsedNgModel.assign, ngModelGet = parsedNgModel, ngModelSet = parsedNgModelAssign, pendingDebounce = null, parserValid, ctrl = this;
        this.$$setOptions = function (options) {
          ctrl.$options = options;
          if (options && options.getterSetter) {
            var invokeModelGetter = $parse($attr.ngModel + '()'), invokeModelSetter = $parse($attr.ngModel + '($$$p)');
            ngModelGet = function ($scope) {
              var modelValue = parsedNgModel($scope);
              if (isFunction(modelValue)) {
                modelValue = invokeModelGetter($scope);
              }
              return modelValue;
            };
            ngModelSet = function ($scope, newValue) {
              if (isFunction(parsedNgModel($scope))) {
                invokeModelSetter($scope, { $$$p: ctrl.$modelValue });
              } else {
                parsedNgModelAssign($scope, ctrl.$modelValue);
              }
            };
          } else if (!parsedNgModel.assign) {
            throw $ngModelMinErr('nonassign', 'Expression \'{0}\' is non-assignable. Element: {1}', $attr.ngModel, startingTag($element));
          }
        };
        this.$render = noop;
        this.$isEmpty = function (value) {
          return isUndefined(value) || value === '' || value === null || value !== value;
        };
        var parentForm = $element.inheritedData('$formController') || nullFormCtrl, currentValidationRunId = 0;
        addSetValidityMethod({
          ctrl: this,
          $element: $element,
          set: function (object, property) {
            object[property] = true;
          },
          unset: function (object, property) {
            delete object[property];
          },
          parentForm: parentForm,
          $animate: $animate
        });
        this.$setPristine = function () {
          ctrl.$dirty = false;
          ctrl.$pristine = true;
          $animate.removeClass($element, DIRTY_CLASS);
          $animate.addClass($element, PRISTINE_CLASS);
        };
        this.$setDirty = function () {
          ctrl.$dirty = true;
          ctrl.$pristine = false;
          $animate.removeClass($element, PRISTINE_CLASS);
          $animate.addClass($element, DIRTY_CLASS);
          parentForm.$setDirty();
        };
        this.$setUntouched = function () {
          ctrl.$touched = false;
          ctrl.$untouched = true;
          $animate.setClass($element, UNTOUCHED_CLASS, TOUCHED_CLASS);
        };
        this.$setTouched = function () {
          ctrl.$touched = true;
          ctrl.$untouched = false;
          $animate.setClass($element, TOUCHED_CLASS, UNTOUCHED_CLASS);
        };
        this.$rollbackViewValue = function () {
          $timeout.cancel(pendingDebounce);
          ctrl.$viewValue = ctrl.$$lastCommittedViewValue;
          ctrl.$render();
        };
        this.$validate = function () {
          if (isNumber(ctrl.$modelValue) && isNaN(ctrl.$modelValue)) {
            return;
          }
          var viewValue = ctrl.$$lastCommittedViewValue;
          var modelValue = ctrl.$$rawModelValue;
          var prevValid = ctrl.$valid;
          var prevModelValue = ctrl.$modelValue;
          var allowInvalid = ctrl.$options && ctrl.$options.allowInvalid;
          ctrl.$$runValidators(modelValue, viewValue, function (allValid) {
            if (!allowInvalid && prevValid !== allValid) {
              ctrl.$modelValue = allValid ? modelValue : undefined;
              if (ctrl.$modelValue !== prevModelValue) {
                ctrl.$$writeModelToScope();
              }
            }
          });
        };
        this.$$runValidators = function (modelValue, viewValue, doneCallback) {
          currentValidationRunId++;
          var localValidationRunId = currentValidationRunId;
          if (!processParseErrors()) {
            validationDone(false);
            return;
          }
          if (!processSyncValidators()) {
            validationDone(false);
            return;
          }
          processAsyncValidators();
          function processParseErrors() {
            var errorKey = ctrl.$$parserName || 'parse';
            if (parserValid === undefined) {
              setValidity(errorKey, null);
            } else {
              if (!parserValid) {
                forEach(ctrl.$validators, function (v, name) {
                  setValidity(name, null);
                });
                forEach(ctrl.$asyncValidators, function (v, name) {
                  setValidity(name, null);
                });
              }
              setValidity(errorKey, parserValid);
              return parserValid;
            }
            return true;
          }
          function processSyncValidators() {
            var syncValidatorsValid = true;
            forEach(ctrl.$validators, function (validator, name) {
              var result = validator(modelValue, viewValue);
              syncValidatorsValid = syncValidatorsValid && result;
              setValidity(name, result);
            });
            if (!syncValidatorsValid) {
              forEach(ctrl.$asyncValidators, function (v, name) {
                setValidity(name, null);
              });
              return false;
            }
            return true;
          }
          function processAsyncValidators() {
            var validatorPromises = [];
            var allValid = true;
            forEach(ctrl.$asyncValidators, function (validator, name) {
              var promise = validator(modelValue, viewValue);
              if (!isPromiseLike(promise)) {
                throw $ngModelMinErr('$asyncValidators', 'Expected asynchronous validator to return a promise but got \'{0}\' instead.', promise);
              }
              setValidity(name, undefined);
              validatorPromises.push(promise.then(function () {
                setValidity(name, true);
              }, function (error) {
                allValid = false;
                setValidity(name, false);
              }));
            });
            if (!validatorPromises.length) {
              validationDone(true);
            } else {
              $q.all(validatorPromises).then(function () {
                validationDone(allValid);
              }, noop);
            }
          }
          function setValidity(name, isValid) {
            if (localValidationRunId === currentValidationRunId) {
              ctrl.$setValidity(name, isValid);
            }
          }
          function validationDone(allValid) {
            if (localValidationRunId === currentValidationRunId) {
              doneCallback(allValid);
            }
          }
        };
        this.$commitViewValue = function () {
          var viewValue = ctrl.$viewValue;
          $timeout.cancel(pendingDebounce);
          if (ctrl.$$lastCommittedViewValue === viewValue && (viewValue !== '' || !ctrl.$$hasNativeValidators)) {
            return;
          }
          ctrl.$$lastCommittedViewValue = viewValue;
          if (ctrl.$pristine) {
            this.$setDirty();
          }
          this.$$parseAndValidate();
        };
        this.$$parseAndValidate = function () {
          var viewValue = ctrl.$$lastCommittedViewValue;
          var modelValue = viewValue;
          parserValid = isUndefined(modelValue) ? undefined : true;
          if (parserValid) {
            for (var i = 0; i < ctrl.$parsers.length; i++) {
              modelValue = ctrl.$parsers[i](modelValue);
              if (isUndefined(modelValue)) {
                parserValid = false;
                break;
              }
            }
          }
          if (isNumber(ctrl.$modelValue) && isNaN(ctrl.$modelValue)) {
            ctrl.$modelValue = ngModelGet($scope);
          }
          var prevModelValue = ctrl.$modelValue;
          var allowInvalid = ctrl.$options && ctrl.$options.allowInvalid;
          ctrl.$$rawModelValue = modelValue;
          if (allowInvalid) {
            ctrl.$modelValue = modelValue;
            writeToModelIfNeeded();
          }
          ctrl.$$runValidators(modelValue, ctrl.$$lastCommittedViewValue, function (allValid) {
            if (!allowInvalid) {
              ctrl.$modelValue = allValid ? modelValue : undefined;
              writeToModelIfNeeded();
            }
          });
          function writeToModelIfNeeded() {
            if (ctrl.$modelValue !== prevModelValue) {
              ctrl.$$writeModelToScope();
            }
          }
        };
        this.$$writeModelToScope = function () {
          ngModelSet($scope, ctrl.$modelValue);
          forEach(ctrl.$viewChangeListeners, function (listener) {
            try {
              listener();
            } catch (e) {
              $exceptionHandler(e);
            }
          });
        };
        this.$setViewValue = function (value, trigger) {
          ctrl.$viewValue = value;
          if (!ctrl.$options || ctrl.$options.updateOnDefault) {
            ctrl.$$debounceViewValueCommit(trigger);
          }
        };
        this.$$debounceViewValueCommit = function (trigger) {
          var debounceDelay = 0, options = ctrl.$options, debounce;
          if (options && isDefined(options.debounce)) {
            debounce = options.debounce;
            if (isNumber(debounce)) {
              debounceDelay = debounce;
            } else if (isNumber(debounce[trigger])) {
              debounceDelay = debounce[trigger];
            } else if (isNumber(debounce['default'])) {
              debounceDelay = debounce['default'];
            }
          }
          $timeout.cancel(pendingDebounce);
          if (debounceDelay) {
            pendingDebounce = $timeout(function () {
              ctrl.$commitViewValue();
            }, debounceDelay);
          } else if ($rootScope.$$phase) {
            ctrl.$commitViewValue();
          } else {
            $scope.$apply(function () {
              ctrl.$commitViewValue();
            });
          }
        };
        $scope.$watch(function ngModelWatch() {
          var modelValue = ngModelGet($scope);
          if (modelValue !== ctrl.$modelValue && (ctrl.$modelValue === ctrl.$modelValue || modelValue === modelValue)) {
            ctrl.$modelValue = ctrl.$$rawModelValue = modelValue;
            parserValid = undefined;
            var formatters = ctrl.$formatters, idx = formatters.length;
            var viewValue = modelValue;
            while (idx--) {
              viewValue = formatters[idx](viewValue);
            }
            if (ctrl.$viewValue !== viewValue) {
              ctrl.$viewValue = ctrl.$$lastCommittedViewValue = viewValue;
              ctrl.$render();
              ctrl.$$runValidators(modelValue, viewValue, noop);
            }
          }
          return modelValue;
        });
      }
    ];
  var ngModelDirective = [
      '$rootScope',
      function ($rootScope) {
        return {
          restrict: 'A',
          require: [
            'ngModel',
            '^?form',
            '^?ngModelOptions'
          ],
          controller: NgModelController,
          priority: 1,
          compile: function ngModelCompile(element) {
            element.addClass(PRISTINE_CLASS).addClass(UNTOUCHED_CLASS).addClass(VALID_CLASS);
            return {
              pre: function ngModelPreLink(scope, element, attr, ctrls) {
                var modelCtrl = ctrls[0], formCtrl = ctrls[1] || nullFormCtrl;
                modelCtrl.$$setOptions(ctrls[2] && ctrls[2].$options);
                formCtrl.$addControl(modelCtrl);
                attr.$observe('name', function (newValue) {
                  if (modelCtrl.$name !== newValue) {
                    formCtrl.$$renameControl(modelCtrl, newValue);
                  }
                });
                scope.$on('$destroy', function () {
                  formCtrl.$removeControl(modelCtrl);
                });
              },
              post: function ngModelPostLink(scope, element, attr, ctrls) {
                var modelCtrl = ctrls[0];
                if (modelCtrl.$options && modelCtrl.$options.updateOn) {
                  element.on(modelCtrl.$options.updateOn, function (ev) {
                    modelCtrl.$$debounceViewValueCommit(ev && ev.type);
                  });
                }
                element.on('blur', function (ev) {
                  if (modelCtrl.$touched)
                    return;
                  if ($rootScope.$$phase) {
                    scope.$evalAsync(modelCtrl.$setTouched);
                  } else {
                    scope.$apply(modelCtrl.$setTouched);
                  }
                });
              }
            };
          }
        };
      }
    ];
  var DEFAULT_REGEXP = /(\s+|^)default(\s+|$)/;
  var ngModelOptionsDirective = function () {
    return {
      restrict: 'A',
      controller: [
        '$scope',
        '$attrs',
        function ($scope, $attrs) {
          var that = this;
          this.$options = copy($scope.$eval($attrs.ngModelOptions));
          if (this.$options.updateOn !== undefined) {
            this.$options.updateOnDefault = false;
            this.$options.updateOn = trim(this.$options.updateOn.replace(DEFAULT_REGEXP, function () {
              that.$options.updateOnDefault = true;
              return ' ';
            }));
          } else {
            this.$options.updateOnDefault = true;
          }
        }
      ]
    };
  };
  function addSetValidityMethod(context) {
    var ctrl = context.ctrl, $element = context.$element, classCache = {}, set = context.set, unset = context.unset, parentForm = context.parentForm, $animate = context.$animate;
    classCache[INVALID_CLASS] = !(classCache[VALID_CLASS] = $element.hasClass(VALID_CLASS));
    ctrl.$setValidity = setValidity;
    function setValidity(validationErrorKey, state, controller) {
      if (state === undefined) {
        createAndSet('$pending', validationErrorKey, controller);
      } else {
        unsetAndCleanup('$pending', validationErrorKey, controller);
      }
      if (!isBoolean(state)) {
        unset(ctrl.$error, validationErrorKey, controller);
        unset(ctrl.$$success, validationErrorKey, controller);
      } else {
        if (state) {
          unset(ctrl.$error, validationErrorKey, controller);
          set(ctrl.$$success, validationErrorKey, controller);
        } else {
          set(ctrl.$error, validationErrorKey, controller);
          unset(ctrl.$$success, validationErrorKey, controller);
        }
      }
      if (ctrl.$pending) {
        cachedToggleClass(PENDING_CLASS, true);
        ctrl.$valid = ctrl.$invalid = undefined;
        toggleValidationCss('', null);
      } else {
        cachedToggleClass(PENDING_CLASS, false);
        ctrl.$valid = isObjectEmpty(ctrl.$error);
        ctrl.$invalid = !ctrl.$valid;
        toggleValidationCss('', ctrl.$valid);
      }
      var combinedState;
      if (ctrl.$pending && ctrl.$pending[validationErrorKey]) {
        combinedState = undefined;
      } else if (ctrl.$error[validationErrorKey]) {
        combinedState = false;
      } else if (ctrl.$$success[validationErrorKey]) {
        combinedState = true;
      } else {
        combinedState = null;
      }
      toggleValidationCss(validationErrorKey, combinedState);
      parentForm.$setValidity(validationErrorKey, combinedState, ctrl);
    }
    function createAndSet(name, value, controller) {
      if (!ctrl[name]) {
        ctrl[name] = {};
      }
      set(ctrl[name], value, controller);
    }
    function unsetAndCleanup(name, value, controller) {
      if (ctrl[name]) {
        unset(ctrl[name], value, controller);
      }
      if (isObjectEmpty(ctrl[name])) {
        ctrl[name] = undefined;
      }
    }
    function cachedToggleClass(className, switchValue) {
      if (switchValue && !classCache[className]) {
        $animate.addClass($element, className);
        classCache[className] = true;
      } else if (!switchValue && classCache[className]) {
        $animate.removeClass($element, className);
        classCache[className] = false;
      }
    }
    function toggleValidationCss(validationErrorKey, isValid) {
      validationErrorKey = validationErrorKey ? '-' + snake_case(validationErrorKey, '-') : '';
      cachedToggleClass(VALID_CLASS + validationErrorKey, isValid === true);
      cachedToggleClass(INVALID_CLASS + validationErrorKey, isValid === false);
    }
  }
  function isObjectEmpty(obj) {
    if (obj) {
      for (var prop in obj) {
        return false;
      }
    }
    return true;
  }
  var ngNonBindableDirective = ngDirective({
      terminal: true,
      priority: 1000
    });
  var ngOptionsMinErr = minErr('ngOptions');
  var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;
  var ngOptionsDirective = [
      '$compile',
      '$parse',
      function ($compile, $parse) {
        function parseOptionsExpression(optionsExp, selectElement, scope) {
          var match = optionsExp.match(NG_OPTIONS_REGEXP);
          if (!match) {
            throw ngOptionsMinErr('iexp', 'Expected expression in form of ' + '\'_select_ (as _label_)? for (_key_,)?_value_ in _collection_\'' + ' but got \'{0}\'. Element: {1}', optionsExp, startingTag(selectElement));
          }
          var valueName = match[5] || match[7];
          var keyName = match[6];
          var selectAs = / as /.test(match[0]) && match[1];
          var trackBy = match[9];
          var valueFn = $parse(match[2] ? match[1] : valueName);
          var selectAsFn = selectAs && $parse(selectAs);
          var viewValueFn = selectAsFn || valueFn;
          var trackByFn = trackBy && $parse(trackBy);
          var getTrackByValueFn = trackBy ? function (value, locals) {
              return trackByFn(scope, locals);
            } : function getHashOfValue(value) {
              return hashKey(value);
            };
          var getTrackByValue = function (value, key) {
            return getTrackByValueFn(value, getLocals(value, key));
          };
          var displayFn = $parse(match[2] || match[1]);
          var groupByFn = $parse(match[3] || '');
          var disableWhenFn = $parse(match[4] || '');
          var valuesFn = $parse(match[8]);
          var locals = {};
          var getLocals = keyName ? function (value, key) {
              locals[keyName] = key;
              locals[valueName] = value;
              return locals;
            } : function (value) {
              locals[valueName] = value;
              return locals;
            };
          function Option(selectValue, viewValue, label, group, disabled) {
            this.selectValue = selectValue;
            this.viewValue = viewValue;
            this.label = label;
            this.group = group;
            this.disabled = disabled;
          }
          return {
            trackBy: trackBy,
            getTrackByValue: getTrackByValue,
            getWatchables: $parse(valuesFn, function (values) {
              var watchedArray = [];
              values = values || [];
              Object.keys(values).forEach(function getWatchable(key) {
                var locals = getLocals(values[key], key);
                var selectValue = getTrackByValueFn(values[key], locals);
                watchedArray.push(selectValue);
                if (match[2] || match[1]) {
                  var label = displayFn(scope, locals);
                  watchedArray.push(label);
                }
                if (match[4]) {
                  var disableWhen = disableWhenFn(scope, locals);
                  watchedArray.push(disableWhen);
                }
              });
              return watchedArray;
            }),
            getOptions: function () {
              var optionItems = [];
              var selectValueMap = {};
              var optionValues = valuesFn(scope) || [];
              var optionValuesKeys;
              if (!keyName && isArrayLike(optionValues)) {
                optionValuesKeys = optionValues;
              } else {
                optionValuesKeys = [];
                for (var itemKey in optionValues) {
                  if (optionValues.hasOwnProperty(itemKey) && itemKey.charAt(0) !== '$') {
                    optionValuesKeys.push(itemKey);
                  }
                }
              }
              var optionValuesLength = optionValuesKeys.length;
              for (var index = 0; index < optionValuesLength; index++) {
                var key = optionValues === optionValuesKeys ? index : optionValuesKeys[index];
                var value = optionValues[key];
                var locals = getLocals(value, key);
                var viewValue = viewValueFn(scope, locals);
                var selectValue = getTrackByValueFn(viewValue, locals);
                var label = displayFn(scope, locals);
                var group = groupByFn(scope, locals);
                var disabled = disableWhenFn(scope, locals);
                var optionItem = new Option(selectValue, viewValue, label, group, disabled);
                optionItems.push(optionItem);
                selectValueMap[selectValue] = optionItem;
              }
              return {
                items: optionItems,
                selectValueMap: selectValueMap,
                getOptionFromViewValue: function (value) {
                  return selectValueMap[getTrackByValue(value)];
                },
                getViewValueFromOption: function (option) {
                  return trackBy ? angular.copy(option.viewValue) : option.viewValue;
                }
              };
            }
          };
        }
        var optionTemplate = document.createElement('option'), optGroupTemplate = document.createElement('optgroup');
        return {
          restrict: 'A',
          terminal: true,
          require: [
            'select',
            '?ngModel'
          ],
          link: function (scope, selectElement, attr, ctrls) {
            var ngModelCtrl = ctrls[1];
            if (!ngModelCtrl)
              return;
            var selectCtrl = ctrls[0];
            var multiple = attr.multiple;
            var emptyOption;
            for (var i = 0, children = selectElement.children(), ii = children.length; i < ii; i++) {
              if (children[i].value === '') {
                emptyOption = children.eq(i);
                break;
              }
            }
            var providedEmptyOption = !!emptyOption;
            var unknownOption = jqLite(optionTemplate.cloneNode(false));
            unknownOption.val('?');
            var options;
            var ngOptions = parseOptionsExpression(attr.ngOptions, selectElement, scope);
            var renderEmptyOption = function () {
              if (!providedEmptyOption) {
                selectElement.prepend(emptyOption);
              }
              selectElement.val('');
              emptyOption.prop('selected', true);
              emptyOption.attr('selected', true);
            };
            var removeEmptyOption = function () {
              if (!providedEmptyOption) {
                emptyOption.remove();
              }
            };
            var renderUnknownOption = function () {
              selectElement.prepend(unknownOption);
              selectElement.val('?');
              unknownOption.prop('selected', true);
              unknownOption.attr('selected', true);
            };
            var removeUnknownOption = function () {
              unknownOption.remove();
            };
            if (!multiple) {
              selectCtrl.writeValue = function writeNgOptionsValue(value) {
                var option = options.getOptionFromViewValue(value);
                if (option && !option.disabled) {
                  if (selectElement[0].value !== option.selectValue) {
                    removeUnknownOption();
                    removeEmptyOption();
                    selectElement[0].value = option.selectValue;
                    option.element.selected = true;
                    option.element.setAttribute('selected', 'selected');
                  }
                } else {
                  if (value === null || providedEmptyOption) {
                    removeUnknownOption();
                    renderEmptyOption();
                  } else {
                    removeEmptyOption();
                    renderUnknownOption();
                  }
                }
              };
              selectCtrl.readValue = function readNgOptionsValue() {
                var selectedOption = options.selectValueMap[selectElement.val()];
                if (selectedOption && !selectedOption.disabled) {
                  removeEmptyOption();
                  removeUnknownOption();
                  return options.getViewValueFromOption(selectedOption);
                }
                return null;
              };
              if (ngOptions.trackBy) {
                scope.$watch(function () {
                  return ngOptions.getTrackByValue(ngModelCtrl.$viewValue);
                }, function () {
                  ngModelCtrl.$render();
                });
              }
            } else {
              ngModelCtrl.$isEmpty = function (value) {
                return !value || value.length === 0;
              };
              selectCtrl.writeValue = function writeNgOptionsMultiple(value) {
                options.items.forEach(function (option) {
                  option.element.selected = false;
                });
                if (value) {
                  value.forEach(function (item) {
                    var option = options.getOptionFromViewValue(item);
                    if (option && !option.disabled)
                      option.element.selected = true;
                  });
                }
              };
              selectCtrl.readValue = function readNgOptionsMultiple() {
                var selectedValues = selectElement.val() || [], selections = [];
                forEach(selectedValues, function (value) {
                  var option = options.selectValueMap[value];
                  if (!option.disabled)
                    selections.push(options.getViewValueFromOption(option));
                });
                return selections;
              };
              if (ngOptions.trackBy) {
                scope.$watchCollection(function () {
                  if (isArray(ngModelCtrl.$viewValue)) {
                    return ngModelCtrl.$viewValue.map(function (value) {
                      return ngOptions.getTrackByValue(value);
                    });
                  }
                }, function () {
                  ngModelCtrl.$render();
                });
              }
            }
            if (providedEmptyOption) {
              emptyOption.remove();
              $compile(emptyOption)(scope);
              emptyOption.removeClass('ng-scope');
            } else {
              emptyOption = jqLite(optionTemplate.cloneNode(false));
            }
            updateOptions();
            scope.$watchCollection(ngOptions.getWatchables, updateOptions);
            function updateOptionElement(option, element) {
              option.element = element;
              element.disabled = option.disabled;
              if (option.value !== element.value)
                element.value = option.selectValue;
              if (option.label !== element.label) {
                element.label = option.label;
                element.textContent = option.label;
              }
            }
            function addOrReuseElement(parent, current, type, templateElement) {
              var element;
              if (current && lowercase(current.nodeName) === type) {
                element = current;
              } else {
                element = templateElement.cloneNode(false);
                if (!current) {
                  parent.appendChild(element);
                } else {
                  parent.insertBefore(element, current);
                }
              }
              return element;
            }
            function removeExcessElements(current) {
              var next;
              while (current) {
                next = current.nextSibling;
                jqLiteRemove(current);
                current = next;
              }
            }
            function skipEmptyAndUnknownOptions(current) {
              var emptyOption_ = emptyOption && emptyOption[0];
              var unknownOption_ = unknownOption && unknownOption[0];
              if (emptyOption_ || unknownOption_) {
                while (current && (current === emptyOption_ || current === unknownOption_)) {
                  current = current.nextSibling;
                }
              }
              return current;
            }
            function updateOptions() {
              var previousValue = options && selectCtrl.readValue();
              options = ngOptions.getOptions();
              var groupMap = {};
              var currentElement = selectElement[0].firstChild;
              if (providedEmptyOption) {
                selectElement.prepend(emptyOption);
              }
              currentElement = skipEmptyAndUnknownOptions(currentElement);
              options.items.forEach(function updateOption(option) {
                var group;
                var groupElement;
                var optionElement;
                if (option.group) {
                  group = groupMap[option.group];
                  if (!group) {
                    groupElement = addOrReuseElement(selectElement[0], currentElement, 'optgroup', optGroupTemplate);
                    currentElement = groupElement.nextSibling;
                    groupElement.label = option.group;
                    group = groupMap[option.group] = {
                      groupElement: groupElement,
                      currentOptionElement: groupElement.firstChild
                    };
                  }
                  optionElement = addOrReuseElement(group.groupElement, group.currentOptionElement, 'option', optionTemplate);
                  updateOptionElement(option, optionElement);
                  group.currentOptionElement = optionElement.nextSibling;
                } else {
                  optionElement = addOrReuseElement(selectElement[0], currentElement, 'option', optionTemplate);
                  updateOptionElement(option, optionElement);
                  currentElement = optionElement.nextSibling;
                }
              });
              Object.keys(groupMap).forEach(function (key) {
                removeExcessElements(groupMap[key].currentOptionElement);
              });
              removeExcessElements(currentElement);
              ngModelCtrl.$render();
              if (!ngModelCtrl.$isEmpty(previousValue)) {
                var nextValue = selectCtrl.readValue();
                if (ngOptions.trackBy && !equals(previousValue, nextValue) || previousValue !== nextValue) {
                  ngModelCtrl.$setViewValue(nextValue);
                  ngModelCtrl.$render();
                }
              }
            }
          }
        };
      }
    ];
  var ngPluralizeDirective = [
      '$locale',
      '$interpolate',
      '$log',
      function ($locale, $interpolate, $log) {
        var BRACE = /{}/g, IS_WHEN = /^when(Minus)?(.+)$/;
        return {
          link: function (scope, element, attr) {
            var numberExp = attr.count, whenExp = attr.$attr.when && element.attr(attr.$attr.when), offset = attr.offset || 0, whens = scope.$eval(whenExp) || {}, whensExpFns = {}, startSymbol = $interpolate.startSymbol(), endSymbol = $interpolate.endSymbol(), braceReplacement = startSymbol + numberExp + '-' + offset + endSymbol, watchRemover = angular.noop, lastCount;
            forEach(attr, function (expression, attributeName) {
              var tmpMatch = IS_WHEN.exec(attributeName);
              if (tmpMatch) {
                var whenKey = (tmpMatch[1] ? '-' : '') + lowercase(tmpMatch[2]);
                whens[whenKey] = element.attr(attr.$attr[attributeName]);
              }
            });
            forEach(whens, function (expression, key) {
              whensExpFns[key] = $interpolate(expression.replace(BRACE, braceReplacement));
            });
            scope.$watch(numberExp, function ngPluralizeWatchAction(newVal) {
              var count = parseFloat(newVal);
              var countIsNaN = isNaN(count);
              if (!countIsNaN && !(count in whens)) {
                count = $locale.pluralCat(count - offset);
              }
              if (count !== lastCount && !(countIsNaN && isNumber(lastCount) && isNaN(lastCount))) {
                watchRemover();
                var whenExpFn = whensExpFns[count];
                if (isUndefined(whenExpFn)) {
                  if (newVal != null) {
                    $log.debug('ngPluralize: no rule defined for \'' + count + '\' in ' + whenExp);
                  }
                  watchRemover = noop;
                  updateElementText();
                } else {
                  watchRemover = scope.$watch(whenExpFn, updateElementText);
                }
                lastCount = count;
              }
            });
            function updateElementText(newText) {
              element.text(newText || '');
            }
          }
        };
      }
    ];
  var ngRepeatDirective = [
      '$parse',
      '$animate',
      function ($parse, $animate) {
        var NG_REMOVED = '$$NG_REMOVED';
        var ngRepeatMinErr = minErr('ngRepeat');
        var updateScope = function (scope, index, valueIdentifier, value, keyIdentifier, key, arrayLength) {
          scope[valueIdentifier] = value;
          if (keyIdentifier)
            scope[keyIdentifier] = key;
          scope.$index = index;
          scope.$first = index === 0;
          scope.$last = index === arrayLength - 1;
          scope.$middle = !(scope.$first || scope.$last);
          scope.$odd = !(scope.$even = (index & 1) === 0);
        };
        var getBlockStart = function (block) {
          return block.clone[0];
        };
        var getBlockEnd = function (block) {
          return block.clone[block.clone.length - 1];
        };
        return {
          restrict: 'A',
          multiElement: true,
          transclude: 'element',
          priority: 1000,
          terminal: true,
          $$tlb: true,
          compile: function ngRepeatCompile($element, $attr) {
            var expression = $attr.ngRepeat;
            var ngRepeatEndComment = document.createComment(' end ngRepeat: ' + expression + ' ');
            var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
            if (!match) {
              throw ngRepeatMinErr('iexp', 'Expected expression in form of \'_item_ in _collection_[ track by _id_]\' but got \'{0}\'.', expression);
            }
            var lhs = match[1];
            var rhs = match[2];
            var aliasAs = match[3];
            var trackByExp = match[4];
            match = lhs.match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/);
            if (!match) {
              throw ngRepeatMinErr('iidexp', '\'_item_\' in \'_item_ in _collection_\' should be an identifier or \'(_key_, _value_)\' expression, but got \'{0}\'.', lhs);
            }
            var valueIdentifier = match[3] || match[1];
            var keyIdentifier = match[2];
            if (aliasAs && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(aliasAs) || /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent|\$root|\$id)$/.test(aliasAs))) {
              throw ngRepeatMinErr('badident', 'alias \'{0}\' is invalid --- must be a valid JS identifier which is not a reserved name.', aliasAs);
            }
            var trackByExpGetter, trackByIdExpFn, trackByIdArrayFn, trackByIdObjFn;
            var hashFnLocals = { $id: hashKey };
            if (trackByExp) {
              trackByExpGetter = $parse(trackByExp);
            } else {
              trackByIdArrayFn = function (key, value) {
                return hashKey(value);
              };
              trackByIdObjFn = function (key) {
                return key;
              };
            }
            return function ngRepeatLink($scope, $element, $attr, ctrl, $transclude) {
              if (trackByExpGetter) {
                trackByIdExpFn = function (key, value, index) {
                  if (keyIdentifier)
                    hashFnLocals[keyIdentifier] = key;
                  hashFnLocals[valueIdentifier] = value;
                  hashFnLocals.$index = index;
                  return trackByExpGetter($scope, hashFnLocals);
                };
              }
              var lastBlockMap = createMap();
              $scope.$watchCollection(rhs, function ngRepeatAction(collection) {
                var index, length, previousNode = $element[0], nextNode, nextBlockMap = createMap(), collectionLength, key, value, trackById, trackByIdFn, collectionKeys, block, nextBlockOrder, elementsToRemove;
                if (aliasAs) {
                  $scope[aliasAs] = collection;
                }
                if (isArrayLike(collection)) {
                  collectionKeys = collection;
                  trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
                } else {
                  trackByIdFn = trackByIdExpFn || trackByIdObjFn;
                  collectionKeys = [];
                  for (var itemKey in collection) {
                    if (collection.hasOwnProperty(itemKey) && itemKey.charAt(0) !== '$') {
                      collectionKeys.push(itemKey);
                    }
                  }
                }
                collectionLength = collectionKeys.length;
                nextBlockOrder = new Array(collectionLength);
                for (index = 0; index < collectionLength; index++) {
                  key = collection === collectionKeys ? index : collectionKeys[index];
                  value = collection[key];
                  trackById = trackByIdFn(key, value, index);
                  if (lastBlockMap[trackById]) {
                    block = lastBlockMap[trackById];
                    delete lastBlockMap[trackById];
                    nextBlockMap[trackById] = block;
                    nextBlockOrder[index] = block;
                  } else if (nextBlockMap[trackById]) {
                    forEach(nextBlockOrder, function (block) {
                      if (block && block.scope)
                        lastBlockMap[block.id] = block;
                    });
                    throw ngRepeatMinErr('dupes', 'Duplicates in a repeater are not allowed. Use \'track by\' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}, Duplicate value: {2}', expression, trackById, value);
                  } else {
                    nextBlockOrder[index] = {
                      id: trackById,
                      scope: undefined,
                      clone: undefined
                    };
                    nextBlockMap[trackById] = true;
                  }
                }
                for (var blockKey in lastBlockMap) {
                  block = lastBlockMap[blockKey];
                  elementsToRemove = getBlockNodes(block.clone);
                  $animate.leave(elementsToRemove);
                  if (elementsToRemove[0].parentNode) {
                    for (index = 0, length = elementsToRemove.length; index < length; index++) {
                      elementsToRemove[index][NG_REMOVED] = true;
                    }
                  }
                  block.scope.$destroy();
                }
                for (index = 0; index < collectionLength; index++) {
                  key = collection === collectionKeys ? index : collectionKeys[index];
                  value = collection[key];
                  block = nextBlockOrder[index];
                  if (block.scope) {
                    nextNode = previousNode;
                    do {
                      nextNode = nextNode.nextSibling;
                    } while (nextNode && nextNode[NG_REMOVED]);
                    if (getBlockStart(block) != nextNode) {
                      $animate.move(getBlockNodes(block.clone), null, jqLite(previousNode));
                    }
                    previousNode = getBlockEnd(block);
                    updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
                  } else {
                    $transclude(function ngRepeatTransclude(clone, scope) {
                      block.scope = scope;
                      var endNode = ngRepeatEndComment.cloneNode(false);
                      clone[clone.length++] = endNode;
                      $animate.enter(clone, null, jqLite(previousNode));
                      previousNode = endNode;
                      block.clone = clone;
                      nextBlockMap[block.id] = block;
                      updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
                    });
                  }
                }
                lastBlockMap = nextBlockMap;
              });
            };
          }
        };
      }
    ];
  var NG_HIDE_CLASS = 'ng-hide';
  var NG_HIDE_IN_PROGRESS_CLASS = 'ng-hide-animate';
  var ngShowDirective = [
      '$animate',
      function ($animate) {
        return {
          restrict: 'A',
          multiElement: true,
          link: function (scope, element, attr) {
            scope.$watch(attr.ngShow, function ngShowWatchAction(value) {
              $animate[value ? 'removeClass' : 'addClass'](element, NG_HIDE_CLASS, { tempClasses: NG_HIDE_IN_PROGRESS_CLASS });
            });
          }
        };
      }
    ];
  var ngHideDirective = [
      '$animate',
      function ($animate) {
        return {
          restrict: 'A',
          multiElement: true,
          link: function (scope, element, attr) {
            scope.$watch(attr.ngHide, function ngHideWatchAction(value) {
              $animate[value ? 'addClass' : 'removeClass'](element, NG_HIDE_CLASS, { tempClasses: NG_HIDE_IN_PROGRESS_CLASS });
            });
          }
        };
      }
    ];
  var ngStyleDirective = ngDirective(function (scope, element, attr) {
      scope.$watch(attr.ngStyle, function ngStyleWatchAction(newStyles, oldStyles) {
        if (oldStyles && newStyles !== oldStyles) {
          forEach(oldStyles, function (val, style) {
            element.css(style, '');
          });
        }
        if (newStyles)
          element.css(newStyles);
      }, true);
    });
  var ngSwitchDirective = [
      '$animate',
      function ($animate) {
        return {
          require: 'ngSwitch',
          controller: [
            '$scope',
            function ngSwitchController() {
              this.cases = {};
            }
          ],
          link: function (scope, element, attr, ngSwitchController) {
            var watchExpr = attr.ngSwitch || attr.on, selectedTranscludes = [], selectedElements = [], previousLeaveAnimations = [], selectedScopes = [];
            var spliceFactory = function (array, index) {
              return function () {
                array.splice(index, 1);
              };
            };
            scope.$watch(watchExpr, function ngSwitchWatchAction(value) {
              var i, ii;
              for (i = 0, ii = previousLeaveAnimations.length; i < ii; ++i) {
                $animate.cancel(previousLeaveAnimations[i]);
              }
              previousLeaveAnimations.length = 0;
              for (i = 0, ii = selectedScopes.length; i < ii; ++i) {
                var selected = getBlockNodes(selectedElements[i].clone);
                selectedScopes[i].$destroy();
                var promise = previousLeaveAnimations[i] = $animate.leave(selected);
                promise.then(spliceFactory(previousLeaveAnimations, i));
              }
              selectedElements.length = 0;
              selectedScopes.length = 0;
              if (selectedTranscludes = ngSwitchController.cases['!' + value] || ngSwitchController.cases['?']) {
                forEach(selectedTranscludes, function (selectedTransclude) {
                  selectedTransclude.transclude(function (caseElement, selectedScope) {
                    selectedScopes.push(selectedScope);
                    var anchor = selectedTransclude.element;
                    caseElement[caseElement.length++] = document.createComment(' end ngSwitchWhen: ');
                    var block = { clone: caseElement };
                    selectedElements.push(block);
                    $animate.enter(caseElement, anchor.parent(), anchor);
                  });
                });
              }
            });
          }
        };
      }
    ];
  var ngSwitchWhenDirective = ngDirective({
      transclude: 'element',
      priority: 1200,
      require: '^ngSwitch',
      multiElement: true,
      link: function (scope, element, attrs, ctrl, $transclude) {
        ctrl.cases['!' + attrs.ngSwitchWhen] = ctrl.cases['!' + attrs.ngSwitchWhen] || [];
        ctrl.cases['!' + attrs.ngSwitchWhen].push({
          transclude: $transclude,
          element: element
        });
      }
    });
  var ngSwitchDefaultDirective = ngDirective({
      transclude: 'element',
      priority: 1200,
      require: '^ngSwitch',
      multiElement: true,
      link: function (scope, element, attr, ctrl, $transclude) {
        ctrl.cases['?'] = ctrl.cases['?'] || [];
        ctrl.cases['?'].push({
          transclude: $transclude,
          element: element
        });
      }
    });
  var ngTranscludeDirective = ngDirective({
      restrict: 'EAC',
      link: function ($scope, $element, $attrs, controller, $transclude) {
        if (!$transclude) {
          throw minErr('ngTransclude')('orphan', 'Illegal use of ngTransclude directive in the template! ' + 'No parent directive that requires a transclusion found. ' + 'Element: {0}', startingTag($element));
        }
        $transclude(function (clone) {
          $element.empty();
          $element.append(clone);
        });
      }
    });
  var scriptDirective = [
      '$templateCache',
      function ($templateCache) {
        return {
          restrict: 'E',
          terminal: true,
          compile: function (element, attr) {
            if (attr.type == 'text/ng-template') {
              var templateUrl = attr.id, text = element[0].text;
              $templateCache.put(templateUrl, text);
            }
          }
        };
      }
    ];
  var noopNgModelController = {
      $setViewValue: noop,
      $render: noop
    };
  var SelectController = [
      '$element',
      '$scope',
      '$attrs',
      function ($element, $scope, $attrs) {
        var self = this, optionsMap = new HashMap();
        self.ngModelCtrl = noopNgModelController;
        self.unknownOption = jqLite(document.createElement('option'));
        self.renderUnknownOption = function (val) {
          var unknownVal = '? ' + hashKey(val) + ' ?';
          self.unknownOption.val(unknownVal);
          $element.prepend(self.unknownOption);
          $element.val(unknownVal);
        };
        $scope.$on('$destroy', function () {
          self.renderUnknownOption = noop;
        });
        self.removeUnknownOption = function () {
          if (self.unknownOption.parent())
            self.unknownOption.remove();
        };
        self.readValue = function readSingleValue() {
          self.removeUnknownOption();
          return $element.val();
        };
        self.writeValue = function writeSingleValue(value) {
          if (self.hasOption(value)) {
            self.removeUnknownOption();
            $element.val(value);
            if (value === '')
              self.emptyOption.prop('selected', true);
          } else {
            if (value == null && self.emptyOption) {
              self.removeUnknownOption();
              $element.val('');
            } else {
              self.renderUnknownOption(value);
            }
          }
        };
        self.addOption = function (value, element) {
          assertNotHasOwnProperty(value, '"option value"');
          if (value === '') {
            self.emptyOption = element;
          }
          var count = optionsMap.get(value) || 0;
          optionsMap.put(value, count + 1);
        };
        self.removeOption = function (value) {
          var count = optionsMap.get(value);
          if (count) {
            if (count === 1) {
              optionsMap.remove(value);
              if (value === '') {
                self.emptyOption = undefined;
              }
            } else {
              optionsMap.put(value, count - 1);
            }
          }
        };
        self.hasOption = function (value) {
          return !!optionsMap.get(value);
        };
      }
    ];
  var selectDirective = function () {
    return {
      restrict: 'E',
      require: [
        'select',
        '?ngModel'
      ],
      controller: SelectController,
      link: function (scope, element, attr, ctrls) {
        var ngModelCtrl = ctrls[1];
        if (!ngModelCtrl)
          return;
        var selectCtrl = ctrls[0];
        selectCtrl.ngModelCtrl = ngModelCtrl;
        ngModelCtrl.$render = function () {
          selectCtrl.writeValue(ngModelCtrl.$viewValue);
        };
        element.on('change', function () {
          scope.$apply(function () {
            ngModelCtrl.$setViewValue(selectCtrl.readValue());
          });
        });
        if (attr.multiple) {
          selectCtrl.readValue = function readMultipleValue() {
            var array = [];
            forEach(element.find('option'), function (option) {
              if (option.selected) {
                array.push(option.value);
              }
            });
            return array;
          };
          selectCtrl.writeValue = function writeMultipleValue(value) {
            var items = new HashMap(value);
            forEach(element.find('option'), function (option) {
              option.selected = isDefined(items.get(option.value));
            });
          };
          var lastView, lastViewRef = NaN;
          scope.$watch(function selectMultipleWatch() {
            if (lastViewRef === ngModelCtrl.$viewValue && !equals(lastView, ngModelCtrl.$viewValue)) {
              lastView = shallowCopy(ngModelCtrl.$viewValue);
              ngModelCtrl.$render();
            }
            lastViewRef = ngModelCtrl.$viewValue;
          });
          ngModelCtrl.$isEmpty = function (value) {
            return !value || value.length === 0;
          };
        }
      }
    };
  };
  var optionDirective = [
      '$interpolate',
      function ($interpolate) {
        function chromeHack(optionElement) {
          if (optionElement[0].hasAttribute('selected')) {
            optionElement[0].selected = true;
          }
        }
        return {
          restrict: 'E',
          priority: 100,
          compile: function (element, attr) {
            if (isUndefined(attr.value)) {
              var interpolateFn = $interpolate(element.text(), true);
              if (!interpolateFn) {
                attr.$set('value', element.text());
              }
            }
            return function (scope, element, attr) {
              var selectCtrlName = '$selectController', parent = element.parent(), selectCtrl = parent.data(selectCtrlName) || parent.parent().data(selectCtrlName);
              if (selectCtrl && selectCtrl.ngModelCtrl) {
                if (interpolateFn) {
                  scope.$watch(interpolateFn, function interpolateWatchAction(newVal, oldVal) {
                    attr.$set('value', newVal);
                    if (oldVal !== newVal) {
                      selectCtrl.removeOption(oldVal);
                    }
                    selectCtrl.addOption(newVal, element);
                    selectCtrl.ngModelCtrl.$render();
                    chromeHack(element);
                  });
                } else {
                  selectCtrl.addOption(attr.value, element);
                  selectCtrl.ngModelCtrl.$render();
                  chromeHack(element);
                }
                element.on('$destroy', function () {
                  selectCtrl.removeOption(attr.value);
                  selectCtrl.ngModelCtrl.$render();
                });
              }
            };
          }
        };
      }
    ];
  var styleDirective = valueFn({
      restrict: 'E',
      terminal: false
    });
  var requiredDirective = function () {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, elm, attr, ctrl) {
        if (!ctrl)
          return;
        attr.required = true;
        ctrl.$validators.required = function (modelValue, viewValue) {
          return !attr.required || !ctrl.$isEmpty(viewValue);
        };
        attr.$observe('required', function () {
          ctrl.$validate();
        });
      }
    };
  };
  var patternDirective = function () {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, elm, attr, ctrl) {
        if (!ctrl)
          return;
        var regexp, patternExp = attr.ngPattern || attr.pattern;
        attr.$observe('pattern', function (regex) {
          if (isString(regex) && regex.length > 0) {
            regex = new RegExp('^' + regex + '$');
          }
          if (regex && !regex.test) {
            throw minErr('ngPattern')('noregexp', 'Expected {0} to be a RegExp but was {1}. Element: {2}', patternExp, regex, startingTag(elm));
          }
          regexp = regex || undefined;
          ctrl.$validate();
        });
        ctrl.$validators.pattern = function (value) {
          return ctrl.$isEmpty(value) || isUndefined(regexp) || regexp.test(value);
        };
      }
    };
  };
  var maxlengthDirective = function () {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, elm, attr, ctrl) {
        if (!ctrl)
          return;
        var maxlength = -1;
        attr.$observe('maxlength', function (value) {
          var intVal = toInt(value);
          maxlength = isNaN(intVal) ? -1 : intVal;
          ctrl.$validate();
        });
        ctrl.$validators.maxlength = function (modelValue, viewValue) {
          return maxlength < 0 || ctrl.$isEmpty(viewValue) || viewValue.length <= maxlength;
        };
      }
    };
  };
  var minlengthDirective = function () {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, elm, attr, ctrl) {
        if (!ctrl)
          return;
        var minlength = 0;
        attr.$observe('minlength', function (value) {
          minlength = toInt(value) || 0;
          ctrl.$validate();
        });
        ctrl.$validators.minlength = function (modelValue, viewValue) {
          return ctrl.$isEmpty(viewValue) || viewValue.length >= minlength;
        };
      }
    };
  };
  if (window.angular.bootstrap) {
    console.log('WARNING: Tried to load angular more than once.');
    return;
  }
  bindJQuery();
  publishExternalAPI(angular);
  jqLite(document).ready(function () {
    angularInit(document, bootstrap);
  });
}(window, document));
!window.angular.$$csp() && window.angular.element(document).find('head').prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\\:form{display:block;}.ng-animate-shim{visibility:hidden;}.ng-anchor{position:absolute;}</style>');(function (global, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = global.document ? factory(global, true) : function (w) {
      if (!w.document) {
        throw new Error('jQuery requires a window with a document');
      }
      return factory(w);
    };
  } else {
    factory(global);
  }
}(typeof window !== 'undefined' ? window : this, function (window, noGlobal) {
  var deletedIds = [];
  var slice = deletedIds.slice;
  var concat = deletedIds.concat;
  var push = deletedIds.push;
  var indexOf = deletedIds.indexOf;
  var class2type = {};
  var toString = class2type.toString;
  var hasOwn = class2type.hasOwnProperty;
  var support = {};
  var version = '1.11.1', jQuery = function (selector, context) {
      return new jQuery.fn.init(selector, context);
    }, rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, rmsPrefix = /^-ms-/, rdashAlpha = /-([\da-z])/gi, fcamelCase = function (all, letter) {
      return letter.toUpperCase();
    };
  jQuery.fn = jQuery.prototype = {
    jquery: version,
    constructor: jQuery,
    selector: '',
    length: 0,
    toArray: function () {
      return slice.call(this);
    },
    get: function (num) {
      return num != null ? num < 0 ? this[num + this.length] : this[num] : slice.call(this);
    },
    pushStack: function (elems) {
      var ret = jQuery.merge(this.constructor(), elems);
      ret.prevObject = this;
      ret.context = this.context;
      return ret;
    },
    each: function (callback, args) {
      return jQuery.each(this, callback, args);
    },
    map: function (callback) {
      return this.pushStack(jQuery.map(this, function (elem, i) {
        return callback.call(elem, i, elem);
      }));
    },
    slice: function () {
      return this.pushStack(slice.apply(this, arguments));
    },
    first: function () {
      return this.eq(0);
    },
    last: function () {
      return this.eq(-1);
    },
    eq: function (i) {
      var len = this.length, j = +i + (i < 0 ? len : 0);
      return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
    },
    end: function () {
      return this.prevObject || this.constructor(null);
    },
    push: push,
    sort: deletedIds.sort,
    splice: deletedIds.splice
  };
  jQuery.extend = jQuery.fn.extend = function () {
    var src, copyIsArray, copy, name, options, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
    if (typeof target === 'boolean') {
      deep = target;
      target = arguments[i] || {};
      i++;
    }
    if (typeof target !== 'object' && !jQuery.isFunction(target)) {
      target = {};
    }
    if (i === length) {
      target = this;
      i--;
    }
    for (; i < length; i++) {
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target === copy) {
            continue;
          }
          if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && jQuery.isArray(src) ? src : [];
            } else {
              clone = src && jQuery.isPlainObject(src) ? src : {};
            }
            target[name] = jQuery.extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  };
  jQuery.extend({
    expando: 'jQuery' + (version + Math.random()).replace(/\D/g, ''),
    isReady: true,
    error: function (msg) {
      throw new Error(msg);
    },
    noop: function () {
    },
    isFunction: function (obj) {
      return jQuery.type(obj) === 'function';
    },
    isArray: Array.isArray || function (obj) {
      return jQuery.type(obj) === 'array';
    },
    isWindow: function (obj) {
      return obj != null && obj == obj.window;
    },
    isNumeric: function (obj) {
      return !jQuery.isArray(obj) && obj - parseFloat(obj) >= 0;
    },
    isEmptyObject: function (obj) {
      var name;
      for (name in obj) {
        return false;
      }
      return true;
    },
    isPlainObject: function (obj) {
      var key;
      if (!obj || jQuery.type(obj) !== 'object' || obj.nodeType || jQuery.isWindow(obj)) {
        return false;
      }
      try {
        if (obj.constructor && !hasOwn.call(obj, 'constructor') && !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
          return false;
        }
      } catch (e) {
        return false;
      }
      if (support.ownLast) {
        for (key in obj) {
          return hasOwn.call(obj, key);
        }
      }
      for (key in obj) {
      }
      return key === undefined || hasOwn.call(obj, key);
    },
    type: function (obj) {
      if (obj == null) {
        return obj + '';
      }
      return typeof obj === 'object' || typeof obj === 'function' ? class2type[toString.call(obj)] || 'object' : typeof obj;
    },
    globalEval: function (data) {
      if (data && jQuery.trim(data)) {
        (window.execScript || function (data) {
          window['eval'].call(window, data);
        })(data);
      }
    },
    camelCase: function (string) {
      return string.replace(rmsPrefix, 'ms-').replace(rdashAlpha, fcamelCase);
    },
    nodeName: function (elem, name) {
      return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    },
    each: function (obj, callback, args) {
      var value, i = 0, length = obj.length, isArray = isArraylike(obj);
      if (args) {
        if (isArray) {
          for (; i < length; i++) {
            value = callback.apply(obj[i], args);
            if (value === false) {
              break;
            }
          }
        } else {
          for (i in obj) {
            value = callback.apply(obj[i], args);
            if (value === false) {
              break;
            }
          }
        }
      } else {
        if (isArray) {
          for (; i < length; i++) {
            value = callback.call(obj[i], i, obj[i]);
            if (value === false) {
              break;
            }
          }
        } else {
          for (i in obj) {
            value = callback.call(obj[i], i, obj[i]);
            if (value === false) {
              break;
            }
          }
        }
      }
      return obj;
    },
    trim: function (text) {
      return text == null ? '' : (text + '').replace(rtrim, '');
    },
    makeArray: function (arr, results) {
      var ret = results || [];
      if (arr != null) {
        if (isArraylike(Object(arr))) {
          jQuery.merge(ret, typeof arr === 'string' ? [arr] : arr);
        } else {
          push.call(ret, arr);
        }
      }
      return ret;
    },
    inArray: function (elem, arr, i) {
      var len;
      if (arr) {
        if (indexOf) {
          return indexOf.call(arr, elem, i);
        }
        len = arr.length;
        i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
        for (; i < len; i++) {
          if (i in arr && arr[i] === elem) {
            return i;
          }
        }
      }
      return -1;
    },
    merge: function (first, second) {
      var len = +second.length, j = 0, i = first.length;
      while (j < len) {
        first[i++] = second[j++];
      }
      if (len !== len) {
        while (second[j] !== undefined) {
          first[i++] = second[j++];
        }
      }
      first.length = i;
      return first;
    },
    grep: function (elems, callback, invert) {
      var callbackInverse, matches = [], i = 0, length = elems.length, callbackExpect = !invert;
      for (; i < length; i++) {
        callbackInverse = !callback(elems[i], i);
        if (callbackInverse !== callbackExpect) {
          matches.push(elems[i]);
        }
      }
      return matches;
    },
    map: function (elems, callback, arg) {
      var value, i = 0, length = elems.length, isArray = isArraylike(elems), ret = [];
      if (isArray) {
        for (; i < length; i++) {
          value = callback(elems[i], i, arg);
          if (value != null) {
            ret.push(value);
          }
        }
      } else {
        for (i in elems) {
          value = callback(elems[i], i, arg);
          if (value != null) {
            ret.push(value);
          }
        }
      }
      return concat.apply([], ret);
    },
    guid: 1,
    proxy: function (fn, context) {
      var args, proxy, tmp;
      if (typeof context === 'string') {
        tmp = fn[context];
        context = fn;
        fn = tmp;
      }
      if (!jQuery.isFunction(fn)) {
        return undefined;
      }
      args = slice.call(arguments, 2);
      proxy = function () {
        return fn.apply(context || this, args.concat(slice.call(arguments)));
      };
      proxy.guid = fn.guid = fn.guid || jQuery.guid++;
      return proxy;
    },
    now: function () {
      return +new Date();
    },
    support: support
  });
  jQuery.each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function (i, name) {
    class2type['[object ' + name + ']'] = name.toLowerCase();
  });
  function isArraylike(obj) {
    var length = obj.length, type = jQuery.type(obj);
    if (type === 'function' || jQuery.isWindow(obj)) {
      return false;
    }
    if (obj.nodeType === 1 && length) {
      return true;
    }
    return type === 'array' || length === 0 || typeof length === 'number' && length > 0 && length - 1 in obj;
  }
  var Sizzle = function (window) {
      var i, support, Expr, getText, isXML, tokenize, compile, select, outermostContext, sortInput, hasDuplicate, setDocument, document, docElem, documentIsHTML, rbuggyQSA, rbuggyMatches, matches, contains, expando = 'sizzle' + -new Date(), preferredDoc = window.document, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), sortOrder = function (a, b) {
          if (a === b) {
            hasDuplicate = true;
          }
          return 0;
        }, strundefined = typeof undefined, MAX_NEGATIVE = 1 << 31, hasOwn = {}.hasOwnProperty, arr = [], pop = arr.pop, push_native = arr.push, push = arr.push, slice = arr.slice, indexOf = arr.indexOf || function (elem) {
          var i = 0, len = this.length;
          for (; i < len; i++) {
            if (this[i] === elem) {
              return i;
            }
          }
          return -1;
        }, booleans = 'checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped', whitespace = '[\\x20\\t\\r\\n\\f]', characterEncoding = '(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+', identifier = characterEncoding.replace('w', 'w#'), attributes = '\\[' + whitespace + '*(' + characterEncoding + ')(?:' + whitespace + '*([*^$|!~]?=)' + whitespace + '*(?:\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)"|(' + identifier + '))|)' + whitespace + '*\\]', pseudos = ':(' + characterEncoding + ')(?:\\((' + '(\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)")|' + '((?:\\\\.|[^\\\\()[\\]]|' + attributes + ')*)|' + '.*' + ')\\)|)', rtrim = new RegExp('^' + whitespace + '+|((?:^|[^\\\\])(?:\\\\.)*)' + whitespace + '+$', 'g'), rcomma = new RegExp('^' + whitespace + '*,' + whitespace + '*'), rcombinators = new RegExp('^' + whitespace + '*([>+~]|' + whitespace + ')' + whitespace + '*'), rattributeQuotes = new RegExp('=' + whitespace + '*([^\\]\'"]*?)' + whitespace + '*\\]', 'g'), rpseudo = new RegExp(pseudos), ridentifier = new RegExp('^' + identifier + '$'), matchExpr = {
          'ID': new RegExp('^#(' + characterEncoding + ')'),
          'CLASS': new RegExp('^\\.(' + characterEncoding + ')'),
          'TAG': new RegExp('^(' + characterEncoding.replace('w', 'w*') + ')'),
          'ATTR': new RegExp('^' + attributes),
          'PSEUDO': new RegExp('^' + pseudos),
          'CHILD': new RegExp('^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(' + whitespace + '*(even|odd|(([+-]|)(\\d*)n|)' + whitespace + '*(?:([+-]|)' + whitespace + '*(\\d+)|))' + whitespace + '*\\)|)', 'i'),
          'bool': new RegExp('^(?:' + booleans + ')$', 'i'),
          'needsContext': new RegExp('^' + whitespace + '*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(' + whitespace + '*((?:-\\d)?\\d*)' + whitespace + '*\\)|)(?=[^-]|$)', 'i')
        }, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rnative = /^[^{]+\{\s*\[native \w/, rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, rescape = /'|\\/g, runescape = new RegExp('\\\\([\\da-f]{1,6}' + whitespace + '?|(' + whitespace + ')|.)', 'ig'), funescape = function (_, escaped, escapedWhitespace) {
          var high = '0x' + escaped - 65536;
          return high !== high || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
        };
      try {
        push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes);
        arr[preferredDoc.childNodes.length].nodeType;
      } catch (e) {
        push = {
          apply: arr.length ? function (target, els) {
            push_native.apply(target, slice.call(els));
          } : function (target, els) {
            var j = target.length, i = 0;
            while (target[j++] = els[i++]) {
            }
            target.length = j - 1;
          }
        };
      }
      function Sizzle(selector, context, results, seed) {
        var match, elem, m, nodeType, i, groups, old, nid, newContext, newSelector;
        if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
          setDocument(context);
        }
        context = context || document;
        results = results || [];
        if (!selector || typeof selector !== 'string') {
          return results;
        }
        if ((nodeType = context.nodeType) !== 1 && nodeType !== 9) {
          return [];
        }
        if (documentIsHTML && !seed) {
          if (match = rquickExpr.exec(selector)) {
            if (m = match[1]) {
              if (nodeType === 9) {
                elem = context.getElementById(m);
                if (elem && elem.parentNode) {
                  if (elem.id === m) {
                    results.push(elem);
                    return results;
                  }
                } else {
                  return results;
                }
              } else {
                if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains(context, elem) && elem.id === m) {
                  results.push(elem);
                  return results;
                }
              }
            } else if (match[2]) {
              push.apply(results, context.getElementsByTagName(selector));
              return results;
            } else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {
              push.apply(results, context.getElementsByClassName(m));
              return results;
            }
          }
          if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
            nid = old = expando;
            newContext = context;
            newSelector = nodeType === 9 && selector;
            if (nodeType === 1 && context.nodeName.toLowerCase() !== 'object') {
              groups = tokenize(selector);
              if (old = context.getAttribute('id')) {
                nid = old.replace(rescape, '\\$&');
              } else {
                context.setAttribute('id', nid);
              }
              nid = '[id=\'' + nid + '\'] ';
              i = groups.length;
              while (i--) {
                groups[i] = nid + toSelector(groups[i]);
              }
              newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
              newSelector = groups.join(',');
            }
            if (newSelector) {
              try {
                push.apply(results, newContext.querySelectorAll(newSelector));
                return results;
              } catch (qsaError) {
              } finally {
                if (!old) {
                  context.removeAttribute('id');
                }
              }
            }
          }
        }
        return select(selector.replace(rtrim, '$1'), context, results, seed);
      }
      function createCache() {
        var keys = [];
        function cache(key, value) {
          if (keys.push(key + ' ') > Expr.cacheLength) {
            delete cache[keys.shift()];
          }
          return cache[key + ' '] = value;
        }
        return cache;
      }
      function markFunction(fn) {
        fn[expando] = true;
        return fn;
      }
      function assert(fn) {
        var div = document.createElement('div');
        try {
          return !!fn(div);
        } catch (e) {
          return false;
        } finally {
          if (div.parentNode) {
            div.parentNode.removeChild(div);
          }
          div = null;
        }
      }
      function addHandle(attrs, handler) {
        var arr = attrs.split('|'), i = attrs.length;
        while (i--) {
          Expr.attrHandle[arr[i]] = handler;
        }
      }
      function siblingCheck(a, b) {
        var cur = b && a, diff = cur && a.nodeType === 1 && b.nodeType === 1 && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE);
        if (diff) {
          return diff;
        }
        if (cur) {
          while (cur = cur.nextSibling) {
            if (cur === b) {
              return -1;
            }
          }
        }
        return a ? 1 : -1;
      }
      function createInputPseudo(type) {
        return function (elem) {
          var name = elem.nodeName.toLowerCase();
          return name === 'input' && elem.type === type;
        };
      }
      function createButtonPseudo(type) {
        return function (elem) {
          var name = elem.nodeName.toLowerCase();
          return (name === 'input' || name === 'button') && elem.type === type;
        };
      }
      function createPositionalPseudo(fn) {
        return markFunction(function (argument) {
          argument = +argument;
          return markFunction(function (seed, matches) {
            var j, matchIndexes = fn([], seed.length, argument), i = matchIndexes.length;
            while (i--) {
              if (seed[j = matchIndexes[i]]) {
                seed[j] = !(matches[j] = seed[j]);
              }
            }
          });
        });
      }
      function testContext(context) {
        return context && typeof context.getElementsByTagName !== strundefined && context;
      }
      support = Sizzle.support = {};
      isXML = Sizzle.isXML = function (elem) {
        var documentElement = elem && (elem.ownerDocument || elem).documentElement;
        return documentElement ? documentElement.nodeName !== 'HTML' : false;
      };
      setDocument = Sizzle.setDocument = function (node) {
        var hasCompare, doc = node ? node.ownerDocument || node : preferredDoc, parent = doc.defaultView;
        if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
          return document;
        }
        document = doc;
        docElem = doc.documentElement;
        documentIsHTML = !isXML(doc);
        if (parent && parent !== parent.top) {
          if (parent.addEventListener) {
            parent.addEventListener('unload', function () {
              setDocument();
            }, false);
          } else if (parent.attachEvent) {
            parent.attachEvent('onunload', function () {
              setDocument();
            });
          }
        }
        support.attributes = assert(function (div) {
          div.className = 'i';
          return !div.getAttribute('className');
        });
        support.getElementsByTagName = assert(function (div) {
          div.appendChild(doc.createComment(''));
          return !div.getElementsByTagName('*').length;
        });
        support.getElementsByClassName = rnative.test(doc.getElementsByClassName) && assert(function (div) {
          div.innerHTML = '<div class=\'a\'></div><div class=\'a i\'></div>';
          div.firstChild.className = 'i';
          return div.getElementsByClassName('i').length === 2;
        });
        support.getById = assert(function (div) {
          docElem.appendChild(div).id = expando;
          return !doc.getElementsByName || !doc.getElementsByName(expando).length;
        });
        if (support.getById) {
          Expr.find['ID'] = function (id, context) {
            if (typeof context.getElementById !== strundefined && documentIsHTML) {
              var m = context.getElementById(id);
              return m && m.parentNode ? [m] : [];
            }
          };
          Expr.filter['ID'] = function (id) {
            var attrId = id.replace(runescape, funescape);
            return function (elem) {
              return elem.getAttribute('id') === attrId;
            };
          };
        } else {
          delete Expr.find['ID'];
          Expr.filter['ID'] = function (id) {
            var attrId = id.replace(runescape, funescape);
            return function (elem) {
              var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode('id');
              return node && node.value === attrId;
            };
          };
        }
        Expr.find['TAG'] = support.getElementsByTagName ? function (tag, context) {
          if (typeof context.getElementsByTagName !== strundefined) {
            return context.getElementsByTagName(tag);
          }
        } : function (tag, context) {
          var elem, tmp = [], i = 0, results = context.getElementsByTagName(tag);
          if (tag === '*') {
            while (elem = results[i++]) {
              if (elem.nodeType === 1) {
                tmp.push(elem);
              }
            }
            return tmp;
          }
          return results;
        };
        Expr.find['CLASS'] = support.getElementsByClassName && function (className, context) {
          if (typeof context.getElementsByClassName !== strundefined && documentIsHTML) {
            return context.getElementsByClassName(className);
          }
        };
        rbuggyMatches = [];
        rbuggyQSA = [];
        if (support.qsa = rnative.test(doc.querySelectorAll)) {
          assert(function (div) {
            div.innerHTML = '<select msallowclip=\'\'><option selected=\'\'></option></select>';
            if (div.querySelectorAll('[msallowclip^=\'\']').length) {
              rbuggyQSA.push('[*^$]=' + whitespace + '*(?:\'\'|"")');
            }
            if (!div.querySelectorAll('[selected]').length) {
              rbuggyQSA.push('\\[' + whitespace + '*(?:value|' + booleans + ')');
            }
            if (!div.querySelectorAll(':checked').length) {
              rbuggyQSA.push(':checked');
            }
          });
          assert(function (div) {
            var input = doc.createElement('input');
            input.setAttribute('type', 'hidden');
            div.appendChild(input).setAttribute('name', 'D');
            if (div.querySelectorAll('[name=d]').length) {
              rbuggyQSA.push('name' + whitespace + '*[*^$|!~]?=');
            }
            if (!div.querySelectorAll(':enabled').length) {
              rbuggyQSA.push(':enabled', ':disabled');
            }
            div.querySelectorAll('*,:x');
            rbuggyQSA.push(',.*:');
          });
        }
        if (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) {
          assert(function (div) {
            support.disconnectedMatch = matches.call(div, 'div');
            matches.call(div, '[s!=\'\']:x');
            rbuggyMatches.push('!=', pseudos);
          });
        }
        rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join('|'));
        rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join('|'));
        hasCompare = rnative.test(docElem.compareDocumentPosition);
        contains = hasCompare || rnative.test(docElem.contains) ? function (a, b) {
          var adown = a.nodeType === 9 ? a.documentElement : a, bup = b && b.parentNode;
          return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
        } : function (a, b) {
          if (b) {
            while (b = b.parentNode) {
              if (b === a) {
                return true;
              }
            }
          }
          return false;
        };
        sortOrder = hasCompare ? function (a, b) {
          if (a === b) {
            hasDuplicate = true;
            return 0;
          }
          var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
          if (compare) {
            return compare;
          }
          compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1;
          if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {
            if (a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
              return -1;
            }
            if (b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
              return 1;
            }
            return sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0;
          }
          return compare & 4 ? -1 : 1;
        } : function (a, b) {
          if (a === b) {
            hasDuplicate = true;
            return 0;
          }
          var cur, i = 0, aup = a.parentNode, bup = b.parentNode, ap = [a], bp = [b];
          if (!aup || !bup) {
            return a === doc ? -1 : b === doc ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0;
          } else if (aup === bup) {
            return siblingCheck(a, b);
          }
          cur = a;
          while (cur = cur.parentNode) {
            ap.unshift(cur);
          }
          cur = b;
          while (cur = cur.parentNode) {
            bp.unshift(cur);
          }
          while (ap[i] === bp[i]) {
            i++;
          }
          return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
        };
        return doc;
      };
      Sizzle.matches = function (expr, elements) {
        return Sizzle(expr, null, null, elements);
      };
      Sizzle.matchesSelector = function (elem, expr) {
        if ((elem.ownerDocument || elem) !== document) {
          setDocument(elem);
        }
        expr = expr.replace(rattributeQuotes, '=\'$1\']');
        if (support.matchesSelector && documentIsHTML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
          try {
            var ret = matches.call(elem, expr);
            if (ret || support.disconnectedMatch || elem.document && elem.document.nodeType !== 11) {
              return ret;
            }
          } catch (e) {
          }
        }
        return Sizzle(expr, document, null, [elem]).length > 0;
      };
      Sizzle.contains = function (context, elem) {
        if ((context.ownerDocument || context) !== document) {
          setDocument(context);
        }
        return contains(context, elem);
      };
      Sizzle.attr = function (elem, name) {
        if ((elem.ownerDocument || elem) !== document) {
          setDocument(elem);
        }
        var fn = Expr.attrHandle[name.toLowerCase()], val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : undefined;
        return val !== undefined ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
      };
      Sizzle.error = function (msg) {
        throw new Error('Syntax error, unrecognized expression: ' + msg);
      };
      Sizzle.uniqueSort = function (results) {
        var elem, duplicates = [], j = 0, i = 0;
        hasDuplicate = !support.detectDuplicates;
        sortInput = !support.sortStable && results.slice(0);
        results.sort(sortOrder);
        if (hasDuplicate) {
          while (elem = results[i++]) {
            if (elem === results[i]) {
              j = duplicates.push(i);
            }
          }
          while (j--) {
            results.splice(duplicates[j], 1);
          }
        }
        sortInput = null;
        return results;
      };
      getText = Sizzle.getText = function (elem) {
        var node, ret = '', i = 0, nodeType = elem.nodeType;
        if (!nodeType) {
          while (node = elem[i++]) {
            ret += getText(node);
          }
        } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
          if (typeof elem.textContent === 'string') {
            return elem.textContent;
          } else {
            for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
              ret += getText(elem);
            }
          }
        } else if (nodeType === 3 || nodeType === 4) {
          return elem.nodeValue;
        }
        return ret;
      };
      Expr = Sizzle.selectors = {
        cacheLength: 50,
        createPseudo: markFunction,
        match: matchExpr,
        attrHandle: {},
        find: {},
        relative: {
          '>': {
            dir: 'parentNode',
            first: true
          },
          ' ': { dir: 'parentNode' },
          '+': {
            dir: 'previousSibling',
            first: true
          },
          '~': { dir: 'previousSibling' }
        },
        preFilter: {
          'ATTR': function (match) {
            match[1] = match[1].replace(runescape, funescape);
            match[3] = (match[3] || match[4] || match[5] || '').replace(runescape, funescape);
            if (match[2] === '~=') {
              match[3] = ' ' + match[3] + ' ';
            }
            return match.slice(0, 4);
          },
          'CHILD': function (match) {
            match[1] = match[1].toLowerCase();
            if (match[1].slice(0, 3) === 'nth') {
              if (!match[3]) {
                Sizzle.error(match[0]);
              }
              match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === 'even' || match[3] === 'odd'));
              match[5] = +(match[7] + match[8] || match[3] === 'odd');
            } else if (match[3]) {
              Sizzle.error(match[0]);
            }
            return match;
          },
          'PSEUDO': function (match) {
            var excess, unquoted = !match[6] && match[2];
            if (matchExpr['CHILD'].test(match[0])) {
              return null;
            }
            if (match[3]) {
              match[2] = match[4] || match[5] || '';
            } else if (unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, true)) && (excess = unquoted.indexOf(')', unquoted.length - excess) - unquoted.length)) {
              match[0] = match[0].slice(0, excess);
              match[2] = unquoted.slice(0, excess);
            }
            return match.slice(0, 3);
          }
        },
        filter: {
          'TAG': function (nodeNameSelector) {
            var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
            return nodeNameSelector === '*' ? function () {
              return true;
            } : function (elem) {
              return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
            };
          },
          'CLASS': function (className) {
            var pattern = classCache[className + ' '];
            return pattern || (pattern = new RegExp('(^|' + whitespace + ')' + className + '(' + whitespace + '|$)')) && classCache(className, function (elem) {
              return pattern.test(typeof elem.className === 'string' && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute('class') || '');
            });
          },
          'ATTR': function (name, operator, check) {
            return function (elem) {
              var result = Sizzle.attr(elem, name);
              if (result == null) {
                return operator === '!=';
              }
              if (!operator) {
                return true;
              }
              result += '';
              return operator === '=' ? result === check : operator === '!=' ? result !== check : operator === '^=' ? check && result.indexOf(check) === 0 : operator === '*=' ? check && result.indexOf(check) > -1 : operator === '$=' ? check && result.slice(-check.length) === check : operator === '~=' ? (' ' + result + ' ').indexOf(check) > -1 : operator === '|=' ? result === check || result.slice(0, check.length + 1) === check + '-' : false;
            };
          },
          'CHILD': function (type, what, argument, first, last) {
            var simple = type.slice(0, 3) !== 'nth', forward = type.slice(-4) !== 'last', ofType = what === 'of-type';
            return first === 1 && last === 0 ? function (elem) {
              return !!elem.parentNode;
            } : function (elem, context, xml) {
              var cache, outerCache, node, diff, nodeIndex, start, dir = simple !== forward ? 'nextSibling' : 'previousSibling', parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType;
              if (parent) {
                if (simple) {
                  while (dir) {
                    node = elem;
                    while (node = node[dir]) {
                      if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
                        return false;
                      }
                    }
                    start = dir = type === 'only' && !start && 'nextSibling';
                  }
                  return true;
                }
                start = [forward ? parent.firstChild : parent.lastChild];
                if (forward && useCache) {
                  outerCache = parent[expando] || (parent[expando] = {});
                  cache = outerCache[type] || [];
                  nodeIndex = cache[0] === dirruns && cache[1];
                  diff = cache[0] === dirruns && cache[2];
                  node = nodeIndex && parent.childNodes[nodeIndex];
                  while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {
                    if (node.nodeType === 1 && ++diff && node === elem) {
                      outerCache[type] = [
                        dirruns,
                        nodeIndex,
                        diff
                      ];
                      break;
                    }
                  }
                } else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) {
                  diff = cache[1];
                } else {
                  while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {
                    if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
                      if (useCache) {
                        (node[expando] || (node[expando] = {}))[type] = [
                          dirruns,
                          diff
                        ];
                      }
                      if (node === elem) {
                        break;
                      }
                    }
                  }
                }
                diff -= last;
                return diff === first || diff % first === 0 && diff / first >= 0;
              }
            };
          },
          'PSEUDO': function (pseudo, argument) {
            var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error('unsupported pseudo: ' + pseudo);
            if (fn[expando]) {
              return fn(argument);
            }
            if (fn.length > 1) {
              args = [
                pseudo,
                pseudo,
                '',
                argument
              ];
              return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function (seed, matches) {
                var idx, matched = fn(seed, argument), i = matched.length;
                while (i--) {
                  idx = indexOf.call(seed, matched[i]);
                  seed[idx] = !(matches[idx] = matched[i]);
                }
              }) : function (elem) {
                return fn(elem, 0, args);
              };
            }
            return fn;
          }
        },
        pseudos: {
          'not': markFunction(function (selector) {
            var input = [], results = [], matcher = compile(selector.replace(rtrim, '$1'));
            return matcher[expando] ? markFunction(function (seed, matches, context, xml) {
              var elem, unmatched = matcher(seed, null, xml, []), i = seed.length;
              while (i--) {
                if (elem = unmatched[i]) {
                  seed[i] = !(matches[i] = elem);
                }
              }
            }) : function (elem, context, xml) {
              input[0] = elem;
              matcher(input, null, xml, results);
              return !results.pop();
            };
          }),
          'has': markFunction(function (selector) {
            return function (elem) {
              return Sizzle(selector, elem).length > 0;
            };
          }),
          'contains': markFunction(function (text) {
            return function (elem) {
              return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
            };
          }),
          'lang': markFunction(function (lang) {
            if (!ridentifier.test(lang || '')) {
              Sizzle.error('unsupported lang: ' + lang);
            }
            lang = lang.replace(runescape, funescape).toLowerCase();
            return function (elem) {
              var elemLang;
              do {
                if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute('xml:lang') || elem.getAttribute('lang')) {
                  elemLang = elemLang.toLowerCase();
                  return elemLang === lang || elemLang.indexOf(lang + '-') === 0;
                }
              } while ((elem = elem.parentNode) && elem.nodeType === 1);
              return false;
            };
          }),
          'target': function (elem) {
            var hash = window.location && window.location.hash;
            return hash && hash.slice(1) === elem.id;
          },
          'root': function (elem) {
            return elem === docElem;
          },
          'focus': function (elem) {
            return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
          },
          'enabled': function (elem) {
            return elem.disabled === false;
          },
          'disabled': function (elem) {
            return elem.disabled === true;
          },
          'checked': function (elem) {
            var nodeName = elem.nodeName.toLowerCase();
            return nodeName === 'input' && !!elem.checked || nodeName === 'option' && !!elem.selected;
          },
          'selected': function (elem) {
            if (elem.parentNode) {
              elem.parentNode.selectedIndex;
            }
            return elem.selected === true;
          },
          'empty': function (elem) {
            for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
              if (elem.nodeType < 6) {
                return false;
              }
            }
            return true;
          },
          'parent': function (elem) {
            return !Expr.pseudos['empty'](elem);
          },
          'header': function (elem) {
            return rheader.test(elem.nodeName);
          },
          'input': function (elem) {
            return rinputs.test(elem.nodeName);
          },
          'button': function (elem) {
            var name = elem.nodeName.toLowerCase();
            return name === 'input' && elem.type === 'button' || name === 'button';
          },
          'text': function (elem) {
            var attr;
            return elem.nodeName.toLowerCase() === 'input' && elem.type === 'text' && ((attr = elem.getAttribute('type')) == null || attr.toLowerCase() === 'text');
          },
          'first': createPositionalPseudo(function () {
            return [0];
          }),
          'last': createPositionalPseudo(function (matchIndexes, length) {
            return [length - 1];
          }),
          'eq': createPositionalPseudo(function (matchIndexes, length, argument) {
            return [argument < 0 ? argument + length : argument];
          }),
          'even': createPositionalPseudo(function (matchIndexes, length) {
            var i = 0;
            for (; i < length; i += 2) {
              matchIndexes.push(i);
            }
            return matchIndexes;
          }),
          'odd': createPositionalPseudo(function (matchIndexes, length) {
            var i = 1;
            for (; i < length; i += 2) {
              matchIndexes.push(i);
            }
            return matchIndexes;
          }),
          'lt': createPositionalPseudo(function (matchIndexes, length, argument) {
            var i = argument < 0 ? argument + length : argument;
            for (; --i >= 0;) {
              matchIndexes.push(i);
            }
            return matchIndexes;
          }),
          'gt': createPositionalPseudo(function (matchIndexes, length, argument) {
            var i = argument < 0 ? argument + length : argument;
            for (; ++i < length;) {
              matchIndexes.push(i);
            }
            return matchIndexes;
          })
        }
      };
      Expr.pseudos['nth'] = Expr.pseudos['eq'];
      for (i in {
          radio: true,
          checkbox: true,
          file: true,
          password: true,
          image: true
        }) {
        Expr.pseudos[i] = createInputPseudo(i);
      }
      for (i in {
          submit: true,
          reset: true
        }) {
        Expr.pseudos[i] = createButtonPseudo(i);
      }
      function setFilters() {
      }
      setFilters.prototype = Expr.filters = Expr.pseudos;
      Expr.setFilters = new setFilters();
      tokenize = Sizzle.tokenize = function (selector, parseOnly) {
        var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + ' '];
        if (cached) {
          return parseOnly ? 0 : cached.slice(0);
        }
        soFar = selector;
        groups = [];
        preFilters = Expr.preFilter;
        while (soFar) {
          if (!matched || (match = rcomma.exec(soFar))) {
            if (match) {
              soFar = soFar.slice(match[0].length) || soFar;
            }
            groups.push(tokens = []);
          }
          matched = false;
          if (match = rcombinators.exec(soFar)) {
            matched = match.shift();
            tokens.push({
              value: matched,
              type: match[0].replace(rtrim, ' ')
            });
            soFar = soFar.slice(matched.length);
          }
          for (type in Expr.filter) {
            if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
              matched = match.shift();
              tokens.push({
                value: matched,
                type: type,
                matches: match
              });
              soFar = soFar.slice(matched.length);
            }
          }
          if (!matched) {
            break;
          }
        }
        return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : tokenCache(selector, groups).slice(0);
      };
      function toSelector(tokens) {
        var i = 0, len = tokens.length, selector = '';
        for (; i < len; i++) {
          selector += tokens[i].value;
        }
        return selector;
      }
      function addCombinator(matcher, combinator, base) {
        var dir = combinator.dir, checkNonElements = base && dir === 'parentNode', doneName = done++;
        return combinator.first ? function (elem, context, xml) {
          while (elem = elem[dir]) {
            if (elem.nodeType === 1 || checkNonElements) {
              return matcher(elem, context, xml);
            }
          }
        } : function (elem, context, xml) {
          var oldCache, outerCache, newCache = [
              dirruns,
              doneName
            ];
          if (xml) {
            while (elem = elem[dir]) {
              if (elem.nodeType === 1 || checkNonElements) {
                if (matcher(elem, context, xml)) {
                  return true;
                }
              }
            }
          } else {
            while (elem = elem[dir]) {
              if (elem.nodeType === 1 || checkNonElements) {
                outerCache = elem[expando] || (elem[expando] = {});
                if ((oldCache = outerCache[dir]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                  return newCache[2] = oldCache[2];
                } else {
                  outerCache[dir] = newCache;
                  if (newCache[2] = matcher(elem, context, xml)) {
                    return true;
                  }
                }
              }
            }
          }
        };
      }
      function elementMatcher(matchers) {
        return matchers.length > 1 ? function (elem, context, xml) {
          var i = matchers.length;
          while (i--) {
            if (!matchers[i](elem, context, xml)) {
              return false;
            }
          }
          return true;
        } : matchers[0];
      }
      function multipleContexts(selector, contexts, results) {
        var i = 0, len = contexts.length;
        for (; i < len; i++) {
          Sizzle(selector, contexts[i], results);
        }
        return results;
      }
      function condense(unmatched, map, filter, context, xml) {
        var elem, newUnmatched = [], i = 0, len = unmatched.length, mapped = map != null;
        for (; i < len; i++) {
          if (elem = unmatched[i]) {
            if (!filter || filter(elem, context, xml)) {
              newUnmatched.push(elem);
              if (mapped) {
                map.push(i);
              }
            }
          }
        }
        return newUnmatched;
      }
      function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
        if (postFilter && !postFilter[expando]) {
          postFilter = setMatcher(postFilter);
        }
        if (postFinder && !postFinder[expando]) {
          postFinder = setMatcher(postFinder, postSelector);
        }
        return markFunction(function (seed, results, context, xml) {
          var temp, i, elem, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(selector || '*', context.nodeType ? [context] : context, []), matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems, matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
          if (matcher) {
            matcher(matcherIn, matcherOut, context, xml);
          }
          if (postFilter) {
            temp = condense(matcherOut, postMap);
            postFilter(temp, [], context, xml);
            i = temp.length;
            while (i--) {
              if (elem = temp[i]) {
                matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
              }
            }
          }
          if (seed) {
            if (postFinder || preFilter) {
              if (postFinder) {
                temp = [];
                i = matcherOut.length;
                while (i--) {
                  if (elem = matcherOut[i]) {
                    temp.push(matcherIn[i] = elem);
                  }
                }
                postFinder(null, matcherOut = [], temp, xml);
              }
              i = matcherOut.length;
              while (i--) {
                if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1) {
                  seed[temp] = !(results[temp] = elem);
                }
              }
            }
          } else {
            matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
            if (postFinder) {
              postFinder(null, results, matcherOut, xml);
            } else {
              push.apply(results, matcherOut);
            }
          }
        });
      }
      function matcherFromTokens(tokens) {
        var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[' '], i = leadingRelative ? 1 : 0, matchContext = addCombinator(function (elem) {
            return elem === checkContext;
          }, implicitRelative, true), matchAnyContext = addCombinator(function (elem) {
            return indexOf.call(checkContext, elem) > -1;
          }, implicitRelative, true), matchers = [function (elem, context, xml) {
              return !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
            }];
        for (; i < len; i++) {
          if (matcher = Expr.relative[tokens[i].type]) {
            matchers = [addCombinator(elementMatcher(matchers), matcher)];
          } else {
            matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);
            if (matcher[expando]) {
              j = ++i;
              for (; j < len; j++) {
                if (Expr.relative[tokens[j].type]) {
                  break;
                }
              }
              return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1).concat({ value: tokens[i - 2].type === ' ' ? '*' : '' })).replace(rtrim, '$1'), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
            }
            matchers.push(matcher);
          }
        }
        return elementMatcher(matchers);
      }
      function matcherFromGroupMatchers(elementMatchers, setMatchers) {
        var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function (seed, context, xml, results, outermost) {
            var elem, j, matcher, matchedCount = 0, i = '0', unmatched = seed && [], setMatched = [], contextBackup = outermostContext, elems = seed || byElement && Expr.find['TAG']('*', outermost), dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1, len = elems.length;
            if (outermost) {
              outermostContext = context !== document && context;
            }
            for (; i !== len && (elem = elems[i]) != null; i++) {
              if (byElement && elem) {
                j = 0;
                while (matcher = elementMatchers[j++]) {
                  if (matcher(elem, context, xml)) {
                    results.push(elem);
                    break;
                  }
                }
                if (outermost) {
                  dirruns = dirrunsUnique;
                }
              }
              if (bySet) {
                if (elem = !matcher && elem) {
                  matchedCount--;
                }
                if (seed) {
                  unmatched.push(elem);
                }
              }
            }
            matchedCount += i;
            if (bySet && i !== matchedCount) {
              j = 0;
              while (matcher = setMatchers[j++]) {
                matcher(unmatched, setMatched, context, xml);
              }
              if (seed) {
                if (matchedCount > 0) {
                  while (i--) {
                    if (!(unmatched[i] || setMatched[i])) {
                      setMatched[i] = pop.call(results);
                    }
                  }
                }
                setMatched = condense(setMatched);
              }
              push.apply(results, setMatched);
              if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
                Sizzle.uniqueSort(results);
              }
            }
            if (outermost) {
              dirruns = dirrunsUnique;
              outermostContext = contextBackup;
            }
            return unmatched;
          };
        return bySet ? markFunction(superMatcher) : superMatcher;
      }
      compile = Sizzle.compile = function (selector, match) {
        var i, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + ' '];
        if (!cached) {
          if (!match) {
            match = tokenize(selector);
          }
          i = match.length;
          while (i--) {
            cached = matcherFromTokens(match[i]);
            if (cached[expando]) {
              setMatchers.push(cached);
            } else {
              elementMatchers.push(cached);
            }
          }
          cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
          cached.selector = selector;
        }
        return cached;
      };
      select = Sizzle.select = function (selector, context, results, seed) {
        var i, tokens, token, type, find, compiled = typeof selector === 'function' && selector, match = !seed && tokenize(selector = compiled.selector || selector);
        results = results || [];
        if (match.length === 1) {
          tokens = match[0] = match[0].slice(0);
          if (tokens.length > 2 && (token = tokens[0]).type === 'ID' && support.getById && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
            context = (Expr.find['ID'](token.matches[0].replace(runescape, funescape), context) || [])[0];
            if (!context) {
              return results;
            } else if (compiled) {
              context = context.parentNode;
            }
            selector = selector.slice(tokens.shift().value.length);
          }
          i = matchExpr['needsContext'].test(selector) ? 0 : tokens.length;
          while (i--) {
            token = tokens[i];
            if (Expr.relative[type = token.type]) {
              break;
            }
            if (find = Expr.find[type]) {
              if (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context)) {
                tokens.splice(i, 1);
                selector = seed.length && toSelector(tokens);
                if (!selector) {
                  push.apply(results, seed);
                  return results;
                }
                break;
              }
            }
          }
        }
        (compiled || compile(selector, match))(seed, context, !documentIsHTML, results, rsibling.test(selector) && testContext(context.parentNode) || context);
        return results;
      };
      support.sortStable = expando.split('').sort(sortOrder).join('') === expando;
      support.detectDuplicates = !!hasDuplicate;
      setDocument();
      support.sortDetached = assert(function (div1) {
        return div1.compareDocumentPosition(document.createElement('div')) & 1;
      });
      if (!assert(function (div) {
          div.innerHTML = '<a href=\'#\'></a>';
          return div.firstChild.getAttribute('href') === '#';
        })) {
        addHandle('type|href|height|width', function (elem, name, isXML) {
          if (!isXML) {
            return elem.getAttribute(name, name.toLowerCase() === 'type' ? 1 : 2);
          }
        });
      }
      if (!support.attributes || !assert(function (div) {
          div.innerHTML = '<input/>';
          div.firstChild.setAttribute('value', '');
          return div.firstChild.getAttribute('value') === '';
        })) {
        addHandle('value', function (elem, name, isXML) {
          if (!isXML && elem.nodeName.toLowerCase() === 'input') {
            return elem.defaultValue;
          }
        });
      }
      if (!assert(function (div) {
          return div.getAttribute('disabled') == null;
        })) {
        addHandle(booleans, function (elem, name, isXML) {
          var val;
          if (!isXML) {
            return elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
          }
        });
      }
      return Sizzle;
    }(window);
  jQuery.find = Sizzle;
  jQuery.expr = Sizzle.selectors;
  jQuery.expr[':'] = jQuery.expr.pseudos;
  jQuery.unique = Sizzle.uniqueSort;
  jQuery.text = Sizzle.getText;
  jQuery.isXMLDoc = Sizzle.isXML;
  jQuery.contains = Sizzle.contains;
  var rneedsContext = jQuery.expr.match.needsContext;
  var rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
  var risSimple = /^.[^:#\[\.,]*$/;
  function winnow(elements, qualifier, not) {
    if (jQuery.isFunction(qualifier)) {
      return jQuery.grep(elements, function (elem, i) {
        return !!qualifier.call(elem, i, elem) !== not;
      });
    }
    if (qualifier.nodeType) {
      return jQuery.grep(elements, function (elem) {
        return elem === qualifier !== not;
      });
    }
    if (typeof qualifier === 'string') {
      if (risSimple.test(qualifier)) {
        return jQuery.filter(qualifier, elements, not);
      }
      qualifier = jQuery.filter(qualifier, elements);
    }
    return jQuery.grep(elements, function (elem) {
      return jQuery.inArray(elem, qualifier) >= 0 !== not;
    });
  }
  jQuery.filter = function (expr, elems, not) {
    var elem = elems[0];
    if (not) {
      expr = ':not(' + expr + ')';
    }
    return elems.length === 1 && elem.nodeType === 1 ? jQuery.find.matchesSelector(elem, expr) ? [elem] : [] : jQuery.find.matches(expr, jQuery.grep(elems, function (elem) {
      return elem.nodeType === 1;
    }));
  };
  jQuery.fn.extend({
    find: function (selector) {
      var i, ret = [], self = this, len = self.length;
      if (typeof selector !== 'string') {
        return this.pushStack(jQuery(selector).filter(function () {
          for (i = 0; i < len; i++) {
            if (jQuery.contains(self[i], this)) {
              return true;
            }
          }
        }));
      }
      for (i = 0; i < len; i++) {
        jQuery.find(selector, self[i], ret);
      }
      ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret);
      ret.selector = this.selector ? this.selector + ' ' + selector : selector;
      return ret;
    },
    filter: function (selector) {
      return this.pushStack(winnow(this, selector || [], false));
    },
    not: function (selector) {
      return this.pushStack(winnow(this, selector || [], true));
    },
    is: function (selector) {
      return !!winnow(this, typeof selector === 'string' && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length;
    }
  });
  var rootjQuery, document = window.document, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, init = jQuery.fn.init = function (selector, context) {
      var match, elem;
      if (!selector) {
        return this;
      }
      if (typeof selector === 'string') {
        if (selector.charAt(0) === '<' && selector.charAt(selector.length - 1) === '>' && selector.length >= 3) {
          match = [
            null,
            selector,
            null
          ];
        } else {
          match = rquickExpr.exec(selector);
        }
        if (match && (match[1] || !context)) {
          if (match[1]) {
            context = context instanceof jQuery ? context[0] : context;
            jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, true));
            if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
              for (match in context) {
                if (jQuery.isFunction(this[match])) {
                  this[match](context[match]);
                } else {
                  this.attr(match, context[match]);
                }
              }
            }
            return this;
          } else {
            elem = document.getElementById(match[2]);
            if (elem && elem.parentNode) {
              if (elem.id !== match[2]) {
                return rootjQuery.find(selector);
              }
              this.length = 1;
              this[0] = elem;
            }
            this.context = document;
            this.selector = selector;
            return this;
          }
        } else if (!context || context.jquery) {
          return (context || rootjQuery).find(selector);
        } else {
          return this.constructor(context).find(selector);
        }
      } else if (selector.nodeType) {
        this.context = this[0] = selector;
        this.length = 1;
        return this;
      } else if (jQuery.isFunction(selector)) {
        return typeof rootjQuery.ready !== 'undefined' ? rootjQuery.ready(selector) : selector(jQuery);
      }
      if (selector.selector !== undefined) {
        this.selector = selector.selector;
        this.context = selector.context;
      }
      return jQuery.makeArray(selector, this);
    };
  init.prototype = jQuery.fn;
  rootjQuery = jQuery(document);
  var rparentsprev = /^(?:parents|prev(?:Until|All))/, guaranteedUnique = {
      children: true,
      contents: true,
      next: true,
      prev: true
    };
  jQuery.extend({
    dir: function (elem, dir, until) {
      var matched = [], cur = elem[dir];
      while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery(cur).is(until))) {
        if (cur.nodeType === 1) {
          matched.push(cur);
        }
        cur = cur[dir];
      }
      return matched;
    },
    sibling: function (n, elem) {
      var r = [];
      for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== elem) {
          r.push(n);
        }
      }
      return r;
    }
  });
  jQuery.fn.extend({
    has: function (target) {
      var i, targets = jQuery(target, this), len = targets.length;
      return this.filter(function () {
        for (i = 0; i < len; i++) {
          if (jQuery.contains(this, targets[i])) {
            return true;
          }
        }
      });
    },
    closest: function (selectors, context) {
      var cur, i = 0, l = this.length, matched = [], pos = rneedsContext.test(selectors) || typeof selectors !== 'string' ? jQuery(selectors, context || this.context) : 0;
      for (; i < l; i++) {
        for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
          if (cur.nodeType < 11 && (pos ? pos.index(cur) > -1 : cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors))) {
            matched.push(cur);
            break;
          }
        }
      }
      return this.pushStack(matched.length > 1 ? jQuery.unique(matched) : matched);
    },
    index: function (elem) {
      if (!elem) {
        return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
      }
      if (typeof elem === 'string') {
        return jQuery.inArray(this[0], jQuery(elem));
      }
      return jQuery.inArray(elem.jquery ? elem[0] : elem, this);
    },
    add: function (selector, context) {
      return this.pushStack(jQuery.unique(jQuery.merge(this.get(), jQuery(selector, context))));
    },
    addBack: function (selector) {
      return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
    }
  });
  function sibling(cur, dir) {
    do {
      cur = cur[dir];
    } while (cur && cur.nodeType !== 1);
    return cur;
  }
  jQuery.each({
    parent: function (elem) {
      var parent = elem.parentNode;
      return parent && parent.nodeType !== 11 ? parent : null;
    },
    parents: function (elem) {
      return jQuery.dir(elem, 'parentNode');
    },
    parentsUntil: function (elem, i, until) {
      return jQuery.dir(elem, 'parentNode', until);
    },
    next: function (elem) {
      return sibling(elem, 'nextSibling');
    },
    prev: function (elem) {
      return sibling(elem, 'previousSibling');
    },
    nextAll: function (elem) {
      return jQuery.dir(elem, 'nextSibling');
    },
    prevAll: function (elem) {
      return jQuery.dir(elem, 'previousSibling');
    },
    nextUntil: function (elem, i, until) {
      return jQuery.dir(elem, 'nextSibling', until);
    },
    prevUntil: function (elem, i, until) {
      return jQuery.dir(elem, 'previousSibling', until);
    },
    siblings: function (elem) {
      return jQuery.sibling((elem.parentNode || {}).firstChild, elem);
    },
    children: function (elem) {
      return jQuery.sibling(elem.firstChild);
    },
    contents: function (elem) {
      return jQuery.nodeName(elem, 'iframe') ? elem.contentDocument || elem.contentWindow.document : jQuery.merge([], elem.childNodes);
    }
  }, function (name, fn) {
    jQuery.fn[name] = function (until, selector) {
      var ret = jQuery.map(this, fn, until);
      if (name.slice(-5) !== 'Until') {
        selector = until;
      }
      if (selector && typeof selector === 'string') {
        ret = jQuery.filter(selector, ret);
      }
      if (this.length > 1) {
        if (!guaranteedUnique[name]) {
          ret = jQuery.unique(ret);
        }
        if (rparentsprev.test(name)) {
          ret = ret.reverse();
        }
      }
      return this.pushStack(ret);
    };
  });
  var rnotwhite = /\S+/g;
  var optionsCache = {};
  function createOptions(options) {
    var object = optionsCache[options] = {};
    jQuery.each(options.match(rnotwhite) || [], function (_, flag) {
      object[flag] = true;
    });
    return object;
  }
  jQuery.Callbacks = function (options) {
    options = typeof options === 'string' ? optionsCache[options] || createOptions(options) : jQuery.extend({}, options);
    var firing, memory, fired, firingLength, firingIndex, firingStart, list = [], stack = !options.once && [], fire = function (data) {
        memory = options.memory && data;
        fired = true;
        firingIndex = firingStart || 0;
        firingStart = 0;
        firingLength = list.length;
        firing = true;
        for (; list && firingIndex < firingLength; firingIndex++) {
          if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
            memory = false;
            break;
          }
        }
        firing = false;
        if (list) {
          if (stack) {
            if (stack.length) {
              fire(stack.shift());
            }
          } else if (memory) {
            list = [];
          } else {
            self.disable();
          }
        }
      }, self = {
        add: function () {
          if (list) {
            var start = list.length;
            (function add(args) {
              jQuery.each(args, function (_, arg) {
                var type = jQuery.type(arg);
                if (type === 'function') {
                  if (!options.unique || !self.has(arg)) {
                    list.push(arg);
                  }
                } else if (arg && arg.length && type !== 'string') {
                  add(arg);
                }
              });
            }(arguments));
            if (firing) {
              firingLength = list.length;
            } else if (memory) {
              firingStart = start;
              fire(memory);
            }
          }
          return this;
        },
        remove: function () {
          if (list) {
            jQuery.each(arguments, function (_, arg) {
              var index;
              while ((index = jQuery.inArray(arg, list, index)) > -1) {
                list.splice(index, 1);
                if (firing) {
                  if (index <= firingLength) {
                    firingLength--;
                  }
                  if (index <= firingIndex) {
                    firingIndex--;
                  }
                }
              }
            });
          }
          return this;
        },
        has: function (fn) {
          return fn ? jQuery.inArray(fn, list) > -1 : !!(list && list.length);
        },
        empty: function () {
          list = [];
          firingLength = 0;
          return this;
        },
        disable: function () {
          list = stack = memory = undefined;
          return this;
        },
        disabled: function () {
          return !list;
        },
        lock: function () {
          stack = undefined;
          if (!memory) {
            self.disable();
          }
          return this;
        },
        locked: function () {
          return !stack;
        },
        fireWith: function (context, args) {
          if (list && (!fired || stack)) {
            args = args || [];
            args = [
              context,
              args.slice ? args.slice() : args
            ];
            if (firing) {
              stack.push(args);
            } else {
              fire(args);
            }
          }
          return this;
        },
        fire: function () {
          self.fireWith(this, arguments);
          return this;
        },
        fired: function () {
          return !!fired;
        }
      };
    return self;
  };
  jQuery.extend({
    Deferred: function (func) {
      var tuples = [
          [
            'resolve',
            'done',
            jQuery.Callbacks('once memory'),
            'resolved'
          ],
          [
            'reject',
            'fail',
            jQuery.Callbacks('once memory'),
            'rejected'
          ],
          [
            'notify',
            'progress',
            jQuery.Callbacks('memory')
          ]
        ], state = 'pending', promise = {
          state: function () {
            return state;
          },
          always: function () {
            deferred.done(arguments).fail(arguments);
            return this;
          },
          then: function () {
            var fns = arguments;
            return jQuery.Deferred(function (newDefer) {
              jQuery.each(tuples, function (i, tuple) {
                var fn = jQuery.isFunction(fns[i]) && fns[i];
                deferred[tuple[1]](function () {
                  var returned = fn && fn.apply(this, arguments);
                  if (returned && jQuery.isFunction(returned.promise)) {
                    returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify);
                  } else {
                    newDefer[tuple[0] + 'With'](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments);
                  }
                });
              });
              fns = null;
            }).promise();
          },
          promise: function (obj) {
            return obj != null ? jQuery.extend(obj, promise) : promise;
          }
        }, deferred = {};
      promise.pipe = promise.then;
      jQuery.each(tuples, function (i, tuple) {
        var list = tuple[2], stateString = tuple[3];
        promise[tuple[1]] = list.add;
        if (stateString) {
          list.add(function () {
            state = stateString;
          }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
        }
        deferred[tuple[0]] = function () {
          deferred[tuple[0] + 'With'](this === deferred ? promise : this, arguments);
          return this;
        };
        deferred[tuple[0] + 'With'] = list.fireWith;
      });
      promise.promise(deferred);
      if (func) {
        func.call(deferred, deferred);
      }
      return deferred;
    },
    when: function (subordinate) {
      var i = 0, resolveValues = slice.call(arguments), length = resolveValues.length, remaining = length !== 1 || subordinate && jQuery.isFunction(subordinate.promise) ? length : 0, deferred = remaining === 1 ? subordinate : jQuery.Deferred(), updateFunc = function (i, contexts, values) {
          return function (value) {
            contexts[i] = this;
            values[i] = arguments.length > 1 ? slice.call(arguments) : value;
            if (values === progressValues) {
              deferred.notifyWith(contexts, values);
            } else if (!--remaining) {
              deferred.resolveWith(contexts, values);
            }
          };
        }, progressValues, progressContexts, resolveContexts;
      if (length > 1) {
        progressValues = new Array(length);
        progressContexts = new Array(length);
        resolveContexts = new Array(length);
        for (; i < length; i++) {
          if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
            resolveValues[i].promise().done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFunc(i, progressContexts, progressValues));
          } else {
            --remaining;
          }
        }
      }
      if (!remaining) {
        deferred.resolveWith(resolveContexts, resolveValues);
      }
      return deferred.promise();
    }
  });
  var readyList;
  jQuery.fn.ready = function (fn) {
    jQuery.ready.promise().done(fn);
    return this;
  };
  jQuery.extend({
    isReady: false,
    readyWait: 1,
    holdReady: function (hold) {
      if (hold) {
        jQuery.readyWait++;
      } else {
        jQuery.ready(true);
      }
    },
    ready: function (wait) {
      if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
        return;
      }
      if (!document.body) {
        return setTimeout(jQuery.ready);
      }
      jQuery.isReady = true;
      if (wait !== true && --jQuery.readyWait > 0) {
        return;
      }
      readyList.resolveWith(document, [jQuery]);
      if (jQuery.fn.triggerHandler) {
        jQuery(document).triggerHandler('ready');
        jQuery(document).off('ready');
      }
    }
  });
  function detach() {
    if (document.addEventListener) {
      document.removeEventListener('DOMContentLoaded', completed, false);
      window.removeEventListener('load', completed, false);
    } else {
      document.detachEvent('onreadystatechange', completed);
      window.detachEvent('onload', completed);
    }
  }
  function completed() {
    if (document.addEventListener || event.type === 'load' || document.readyState === 'complete') {
      detach();
      jQuery.ready();
    }
  }
  jQuery.ready.promise = function (obj) {
    if (!readyList) {
      readyList = jQuery.Deferred();
      if (document.readyState === 'complete') {
        setTimeout(jQuery.ready);
      } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', completed, false);
        window.addEventListener('load', completed, false);
      } else {
        document.attachEvent('onreadystatechange', completed);
        window.attachEvent('onload', completed);
        var top = false;
        try {
          top = window.frameElement == null && document.documentElement;
        } catch (e) {
        }
        if (top && top.doScroll) {
          (function doScrollCheck() {
            if (!jQuery.isReady) {
              try {
                top.doScroll('left');
              } catch (e) {
                return setTimeout(doScrollCheck, 50);
              }
              detach();
              jQuery.ready();
            }
          }());
        }
      }
    }
    return readyList.promise(obj);
  };
  var strundefined = typeof undefined;
  var i;
  for (i in jQuery(support)) {
    break;
  }
  support.ownLast = i !== '0';
  support.inlineBlockNeedsLayout = false;
  jQuery(function () {
    var val, div, body, container;
    body = document.getElementsByTagName('body')[0];
    if (!body || !body.style) {
      return;
    }
    div = document.createElement('div');
    container = document.createElement('div');
    container.style.cssText = 'position:absolute;border:0;width:0;height:0;top:0;left:-9999px';
    body.appendChild(container).appendChild(div);
    if (typeof div.style.zoom !== strundefined) {
      div.style.cssText = 'display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1';
      support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
      if (val) {
        body.style.zoom = 1;
      }
    }
    body.removeChild(container);
  });
  (function () {
    var div = document.createElement('div');
    if (support.deleteExpando == null) {
      support.deleteExpando = true;
      try {
        delete div.test;
      } catch (e) {
        support.deleteExpando = false;
      }
    }
    div = null;
  }());
  jQuery.acceptData = function (elem) {
    var noData = jQuery.noData[(elem.nodeName + ' ').toLowerCase()], nodeType = +elem.nodeType || 1;
    return nodeType !== 1 && nodeType !== 9 ? false : !noData || noData !== true && elem.getAttribute('classid') === noData;
  };
  var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /([A-Z])/g;
  function dataAttr(elem, key, data) {
    if (data === undefined && elem.nodeType === 1) {
      var name = 'data-' + key.replace(rmultiDash, '-$1').toLowerCase();
      data = elem.getAttribute(name);
      if (typeof data === 'string') {
        try {
          data = data === 'true' ? true : data === 'false' ? false : data === 'null' ? null : +data + '' === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data;
        } catch (e) {
        }
        jQuery.data(elem, key, data);
      } else {
        data = undefined;
      }
    }
    return data;
  }
  function isEmptyDataObject(obj) {
    var name;
    for (name in obj) {
      if (name === 'data' && jQuery.isEmptyObject(obj[name])) {
        continue;
      }
      if (name !== 'toJSON') {
        return false;
      }
    }
    return true;
  }
  function internalData(elem, name, data, pvt) {
    if (!jQuery.acceptData(elem)) {
      return;
    }
    var ret, thisCache, internalKey = jQuery.expando, isNode = elem.nodeType, cache = isNode ? jQuery.cache : elem, id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;
    if ((!id || !cache[id] || !pvt && !cache[id].data) && data === undefined && typeof name === 'string') {
      return;
    }
    if (!id) {
      if (isNode) {
        id = elem[internalKey] = deletedIds.pop() || jQuery.guid++;
      } else {
        id = internalKey;
      }
    }
    if (!cache[id]) {
      cache[id] = isNode ? {} : { toJSON: jQuery.noop };
    }
    if (typeof name === 'object' || typeof name === 'function') {
      if (pvt) {
        cache[id] = jQuery.extend(cache[id], name);
      } else {
        cache[id].data = jQuery.extend(cache[id].data, name);
      }
    }
    thisCache = cache[id];
    if (!pvt) {
      if (!thisCache.data) {
        thisCache.data = {};
      }
      thisCache = thisCache.data;
    }
    if (data !== undefined) {
      thisCache[jQuery.camelCase(name)] = data;
    }
    if (typeof name === 'string') {
      ret = thisCache[name];
      if (ret == null) {
        ret = thisCache[jQuery.camelCase(name)];
      }
    } else {
      ret = thisCache;
    }
    return ret;
  }
  function internalRemoveData(elem, name, pvt) {
    if (!jQuery.acceptData(elem)) {
      return;
    }
    var thisCache, i, isNode = elem.nodeType, cache = isNode ? jQuery.cache : elem, id = isNode ? elem[jQuery.expando] : jQuery.expando;
    if (!cache[id]) {
      return;
    }
    if (name) {
      thisCache = pvt ? cache[id] : cache[id].data;
      if (thisCache) {
        if (!jQuery.isArray(name)) {
          if (name in thisCache) {
            name = [name];
          } else {
            name = jQuery.camelCase(name);
            if (name in thisCache) {
              name = [name];
            } else {
              name = name.split(' ');
            }
          }
        } else {
          name = name.concat(jQuery.map(name, jQuery.camelCase));
        }
        i = name.length;
        while (i--) {
          delete thisCache[name[i]];
        }
        if (pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache)) {
          return;
        }
      }
    }
    if (!pvt) {
      delete cache[id].data;
      if (!isEmptyDataObject(cache[id])) {
        return;
      }
    }
    if (isNode) {
      jQuery.cleanData([elem], true);
    } else if (support.deleteExpando || cache != cache.window) {
      delete cache[id];
    } else {
      cache[id] = null;
    }
  }
  jQuery.extend({
    cache: {},
    noData: {
      'applet ': true,
      'embed ': true,
      'object ': 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'
    },
    hasData: function (elem) {
      elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando];
      return !!elem && !isEmptyDataObject(elem);
    },
    data: function (elem, name, data) {
      return internalData(elem, name, data);
    },
    removeData: function (elem, name) {
      return internalRemoveData(elem, name);
    },
    _data: function (elem, name, data) {
      return internalData(elem, name, data, true);
    },
    _removeData: function (elem, name) {
      return internalRemoveData(elem, name, true);
    }
  });
  jQuery.fn.extend({
    data: function (key, value) {
      var i, name, data, elem = this[0], attrs = elem && elem.attributes;
      if (key === undefined) {
        if (this.length) {
          data = jQuery.data(elem);
          if (elem.nodeType === 1 && !jQuery._data(elem, 'parsedAttrs')) {
            i = attrs.length;
            while (i--) {
              if (attrs[i]) {
                name = attrs[i].name;
                if (name.indexOf('data-') === 0) {
                  name = jQuery.camelCase(name.slice(5));
                  dataAttr(elem, name, data[name]);
                }
              }
            }
            jQuery._data(elem, 'parsedAttrs', true);
          }
        }
        return data;
      }
      if (typeof key === 'object') {
        return this.each(function () {
          jQuery.data(this, key);
        });
      }
      return arguments.length > 1 ? this.each(function () {
        jQuery.data(this, key, value);
      }) : elem ? dataAttr(elem, key, jQuery.data(elem, key)) : undefined;
    },
    removeData: function (key) {
      return this.each(function () {
        jQuery.removeData(this, key);
      });
    }
  });
  jQuery.extend({
    queue: function (elem, type, data) {
      var queue;
      if (elem) {
        type = (type || 'fx') + 'queue';
        queue = jQuery._data(elem, type);
        if (data) {
          if (!queue || jQuery.isArray(data)) {
            queue = jQuery._data(elem, type, jQuery.makeArray(data));
          } else {
            queue.push(data);
          }
        }
        return queue || [];
      }
    },
    dequeue: function (elem, type) {
      type = type || 'fx';
      var queue = jQuery.queue(elem, type), startLength = queue.length, fn = queue.shift(), hooks = jQuery._queueHooks(elem, type), next = function () {
          jQuery.dequeue(elem, type);
        };
      if (fn === 'inprogress') {
        fn = queue.shift();
        startLength--;
      }
      if (fn) {
        if (type === 'fx') {
          queue.unshift('inprogress');
        }
        delete hooks.stop;
        fn.call(elem, next, hooks);
      }
      if (!startLength && hooks) {
        hooks.empty.fire();
      }
    },
    _queueHooks: function (elem, type) {
      var key = type + 'queueHooks';
      return jQuery._data(elem, key) || jQuery._data(elem, key, {
        empty: jQuery.Callbacks('once memory').add(function () {
          jQuery._removeData(elem, type + 'queue');
          jQuery._removeData(elem, key);
        })
      });
    }
  });
  jQuery.fn.extend({
    queue: function (type, data) {
      var setter = 2;
      if (typeof type !== 'string') {
        data = type;
        type = 'fx';
        setter--;
      }
      if (arguments.length < setter) {
        return jQuery.queue(this[0], type);
      }
      return data === undefined ? this : this.each(function () {
        var queue = jQuery.queue(this, type, data);
        jQuery._queueHooks(this, type);
        if (type === 'fx' && queue[0] !== 'inprogress') {
          jQuery.dequeue(this, type);
        }
      });
    },
    dequeue: function (type) {
      return this.each(function () {
        jQuery.dequeue(this, type);
      });
    },
    clearQueue: function (type) {
      return this.queue(type || 'fx', []);
    },
    promise: function (type, obj) {
      var tmp, count = 1, defer = jQuery.Deferred(), elements = this, i = this.length, resolve = function () {
          if (!--count) {
            defer.resolveWith(elements, [elements]);
          }
        };
      if (typeof type !== 'string') {
        obj = type;
        type = undefined;
      }
      type = type || 'fx';
      while (i--) {
        tmp = jQuery._data(elements[i], type + 'queueHooks');
        if (tmp && tmp.empty) {
          count++;
          tmp.empty.add(resolve);
        }
      }
      resolve();
      return defer.promise(obj);
    }
  });
  var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
  var cssExpand = [
      'Top',
      'Right',
      'Bottom',
      'Left'
    ];
  var isHidden = function (elem, el) {
    elem = el || elem;
    return jQuery.css(elem, 'display') === 'none' || !jQuery.contains(elem.ownerDocument, elem);
  };
  var access = jQuery.access = function (elems, fn, key, value, chainable, emptyGet, raw) {
      var i = 0, length = elems.length, bulk = key == null;
      if (jQuery.type(key) === 'object') {
        chainable = true;
        for (i in key) {
          jQuery.access(elems, fn, i, key[i], true, emptyGet, raw);
        }
      } else if (value !== undefined) {
        chainable = true;
        if (!jQuery.isFunction(value)) {
          raw = true;
        }
        if (bulk) {
          if (raw) {
            fn.call(elems, value);
            fn = null;
          } else {
            bulk = fn;
            fn = function (elem, key, value) {
              return bulk.call(jQuery(elem), value);
            };
          }
        }
        if (fn) {
          for (; i < length; i++) {
            fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
          }
        }
      }
      return chainable ? elems : bulk ? fn.call(elems) : length ? fn(elems[0], key) : emptyGet;
    };
  var rcheckableType = /^(?:checkbox|radio)$/i;
  (function () {
    var input = document.createElement('input'), div = document.createElement('div'), fragment = document.createDocumentFragment();
    div.innerHTML = '  <link/><table></table><a href=\'/a\'>a</a><input type=\'checkbox\'/>';
    support.leadingWhitespace = div.firstChild.nodeType === 3;
    support.tbody = !div.getElementsByTagName('tbody').length;
    support.htmlSerialize = !!div.getElementsByTagName('link').length;
    support.html5Clone = document.createElement('nav').cloneNode(true).outerHTML !== '<:nav></:nav>';
    input.type = 'checkbox';
    input.checked = true;
    fragment.appendChild(input);
    support.appendChecked = input.checked;
    div.innerHTML = '<textarea>x</textarea>';
    support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
    fragment.appendChild(div);
    div.innerHTML = '<input type=\'radio\' checked=\'checked\' name=\'t\'/>';
    support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
    support.noCloneEvent = true;
    if (div.attachEvent) {
      div.attachEvent('onclick', function () {
        support.noCloneEvent = false;
      });
      div.cloneNode(true).click();
    }
    if (support.deleteExpando == null) {
      support.deleteExpando = true;
      try {
        delete div.test;
      } catch (e) {
        support.deleteExpando = false;
      }
    }
  }());
  (function () {
    var i, eventName, div = document.createElement('div');
    for (i in {
        submit: true,
        change: true,
        focusin: true
      }) {
      eventName = 'on' + i;
      if (!(support[i + 'Bubbles'] = eventName in window)) {
        div.setAttribute(eventName, 't');
        support[i + 'Bubbles'] = div.attributes[eventName].expando === false;
      }
    }
    div = null;
  }());
  var rformElems = /^(?:input|select|textarea)$/i, rkeyEvent = /^key/, rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/, rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
  function returnTrue() {
    return true;
  }
  function returnFalse() {
    return false;
  }
  function safeActiveElement() {
    try {
      return document.activeElement;
    } catch (err) {
    }
  }
  jQuery.event = {
    global: {},
    add: function (elem, types, handler, data, selector) {
      var tmp, events, t, handleObjIn, special, eventHandle, handleObj, handlers, type, namespaces, origType, elemData = jQuery._data(elem);
      if (!elemData) {
        return;
      }
      if (handler.handler) {
        handleObjIn = handler;
        handler = handleObjIn.handler;
        selector = handleObjIn.selector;
      }
      if (!handler.guid) {
        handler.guid = jQuery.guid++;
      }
      if (!(events = elemData.events)) {
        events = elemData.events = {};
      }
      if (!(eventHandle = elemData.handle)) {
        eventHandle = elemData.handle = function (e) {
          return typeof jQuery !== strundefined && (!e || jQuery.event.triggered !== e.type) ? jQuery.event.dispatch.apply(eventHandle.elem, arguments) : undefined;
        };
        eventHandle.elem = elem;
      }
      types = (types || '').match(rnotwhite) || [''];
      t = types.length;
      while (t--) {
        tmp = rtypenamespace.exec(types[t]) || [];
        type = origType = tmp[1];
        namespaces = (tmp[2] || '').split('.').sort();
        if (!type) {
          continue;
        }
        special = jQuery.event.special[type] || {};
        type = (selector ? special.delegateType : special.bindType) || type;
        special = jQuery.event.special[type] || {};
        handleObj = jQuery.extend({
          type: type,
          origType: origType,
          data: data,
          handler: handler,
          guid: handler.guid,
          selector: selector,
          needsContext: selector && jQuery.expr.match.needsContext.test(selector),
          namespace: namespaces.join('.')
        }, handleObjIn);
        if (!(handlers = events[type])) {
          handlers = events[type] = [];
          handlers.delegateCount = 0;
          if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
            if (elem.addEventListener) {
              elem.addEventListener(type, eventHandle, false);
            } else if (elem.attachEvent) {
              elem.attachEvent('on' + type, eventHandle);
            }
          }
        }
        if (special.add) {
          special.add.call(elem, handleObj);
          if (!handleObj.handler.guid) {
            handleObj.handler.guid = handler.guid;
          }
        }
        if (selector) {
          handlers.splice(handlers.delegateCount++, 0, handleObj);
        } else {
          handlers.push(handleObj);
        }
        jQuery.event.global[type] = true;
      }
      elem = null;
    },
    remove: function (elem, types, handler, selector, mappedTypes) {
      var j, handleObj, tmp, origCount, t, events, special, handlers, type, namespaces, origType, elemData = jQuery.hasData(elem) && jQuery._data(elem);
      if (!elemData || !(events = elemData.events)) {
        return;
      }
      types = (types || '').match(rnotwhite) || [''];
      t = types.length;
      while (t--) {
        tmp = rtypenamespace.exec(types[t]) || [];
        type = origType = tmp[1];
        namespaces = (tmp[2] || '').split('.').sort();
        if (!type) {
          for (type in events) {
            jQuery.event.remove(elem, type + types[t], handler, selector, true);
          }
          continue;
        }
        special = jQuery.event.special[type] || {};
        type = (selector ? special.delegateType : special.bindType) || type;
        handlers = events[type] || [];
        tmp = tmp[2] && new RegExp('(^|\\.)' + namespaces.join('\\.(?:.*\\.|)') + '(\\.|$)');
        origCount = j = handlers.length;
        while (j--) {
          handleObj = handlers[j];
          if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === '**' && handleObj.selector)) {
            handlers.splice(j, 1);
            if (handleObj.selector) {
              handlers.delegateCount--;
            }
            if (special.remove) {
              special.remove.call(elem, handleObj);
            }
          }
        }
        if (origCount && !handlers.length) {
          if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
            jQuery.removeEvent(elem, type, elemData.handle);
          }
          delete events[type];
        }
      }
      if (jQuery.isEmptyObject(events)) {
        delete elemData.handle;
        jQuery._removeData(elem, 'events');
      }
    },
    trigger: function (event, data, elem, onlyHandlers) {
      var handle, ontype, cur, bubbleType, special, tmp, i, eventPath = [elem || document], type = hasOwn.call(event, 'type') ? event.type : event, namespaces = hasOwn.call(event, 'namespace') ? event.namespace.split('.') : [];
      cur = tmp = elem = elem || document;
      if (elem.nodeType === 3 || elem.nodeType === 8) {
        return;
      }
      if (rfocusMorph.test(type + jQuery.event.triggered)) {
        return;
      }
      if (type.indexOf('.') >= 0) {
        namespaces = type.split('.');
        type = namespaces.shift();
        namespaces.sort();
      }
      ontype = type.indexOf(':') < 0 && 'on' + type;
      event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === 'object' && event);
      event.isTrigger = onlyHandlers ? 2 : 3;
      event.namespace = namespaces.join('.');
      event.namespace_re = event.namespace ? new RegExp('(^|\\.)' + namespaces.join('\\.(?:.*\\.|)') + '(\\.|$)') : null;
      event.result = undefined;
      if (!event.target) {
        event.target = elem;
      }
      data = data == null ? [event] : jQuery.makeArray(data, [event]);
      special = jQuery.event.special[type] || {};
      if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
        return;
      }
      if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
        bubbleType = special.delegateType || type;
        if (!rfocusMorph.test(bubbleType + type)) {
          cur = cur.parentNode;
        }
        for (; cur; cur = cur.parentNode) {
          eventPath.push(cur);
          tmp = cur;
        }
        if (tmp === (elem.ownerDocument || document)) {
          eventPath.push(tmp.defaultView || tmp.parentWindow || window);
        }
      }
      i = 0;
      while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
        event.type = i > 1 ? bubbleType : special.bindType || type;
        handle = (jQuery._data(cur, 'events') || {})[event.type] && jQuery._data(cur, 'handle');
        if (handle) {
          handle.apply(cur, data);
        }
        handle = ontype && cur[ontype];
        if (handle && handle.apply && jQuery.acceptData(cur)) {
          event.result = handle.apply(cur, data);
          if (event.result === false) {
            event.preventDefault();
          }
        }
      }
      event.type = type;
      if (!onlyHandlers && !event.isDefaultPrevented()) {
        if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && jQuery.acceptData(elem)) {
          if (ontype && elem[type] && !jQuery.isWindow(elem)) {
            tmp = elem[ontype];
            if (tmp) {
              elem[ontype] = null;
            }
            jQuery.event.triggered = type;
            try {
              elem[type]();
            } catch (e) {
            }
            jQuery.event.triggered = undefined;
            if (tmp) {
              elem[ontype] = tmp;
            }
          }
        }
      }
      return event.result;
    },
    dispatch: function (event) {
      event = jQuery.event.fix(event);
      var i, ret, handleObj, matched, j, handlerQueue = [], args = slice.call(arguments), handlers = (jQuery._data(this, 'events') || {})[event.type] || [], special = jQuery.event.special[event.type] || {};
      args[0] = event;
      event.delegateTarget = this;
      if (special.preDispatch && special.preDispatch.call(this, event) === false) {
        return;
      }
      handlerQueue = jQuery.event.handlers.call(this, event, handlers);
      i = 0;
      while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
        event.currentTarget = matched.elem;
        j = 0;
        while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
          if (!event.namespace_re || event.namespace_re.test(handleObj.namespace)) {
            event.handleObj = handleObj;
            event.data = handleObj.data;
            ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
            if (ret !== undefined) {
              if ((event.result = ret) === false) {
                event.preventDefault();
                event.stopPropagation();
              }
            }
          }
        }
      }
      if (special.postDispatch) {
        special.postDispatch.call(this, event);
      }
      return event.result;
    },
    handlers: function (event, handlers) {
      var sel, handleObj, matches, i, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
      if (delegateCount && cur.nodeType && (!event.button || event.type !== 'click')) {
        for (; cur != this; cur = cur.parentNode || this) {
          if (cur.nodeType === 1 && (cur.disabled !== true || event.type !== 'click')) {
            matches = [];
            for (i = 0; i < delegateCount; i++) {
              handleObj = handlers[i];
              sel = handleObj.selector + ' ';
              if (matches[sel] === undefined) {
                matches[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) >= 0 : jQuery.find(sel, this, null, [cur]).length;
              }
              if (matches[sel]) {
                matches.push(handleObj);
              }
            }
            if (matches.length) {
              handlerQueue.push({
                elem: cur,
                handlers: matches
              });
            }
          }
        }
      }
      if (delegateCount < handlers.length) {
        handlerQueue.push({
          elem: this,
          handlers: handlers.slice(delegateCount)
        });
      }
      return handlerQueue;
    },
    fix: function (event) {
      if (event[jQuery.expando]) {
        return event;
      }
      var i, prop, copy, type = event.type, originalEvent = event, fixHook = this.fixHooks[type];
      if (!fixHook) {
        this.fixHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : {};
      }
      copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
      event = new jQuery.Event(originalEvent);
      i = copy.length;
      while (i--) {
        prop = copy[i];
        event[prop] = originalEvent[prop];
      }
      if (!event.target) {
        event.target = originalEvent.srcElement || document;
      }
      if (event.target.nodeType === 3) {
        event.target = event.target.parentNode;
      }
      event.metaKey = !!event.metaKey;
      return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
    },
    props: 'altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which'.split(' '),
    fixHooks: {},
    keyHooks: {
      props: 'char charCode key keyCode'.split(' '),
      filter: function (event, original) {
        if (event.which == null) {
          event.which = original.charCode != null ? original.charCode : original.keyCode;
        }
        return event;
      }
    },
    mouseHooks: {
      props: 'button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement'.split(' '),
      filter: function (event, original) {
        var body, eventDoc, doc, button = original.button, fromElement = original.fromElement;
        if (event.pageX == null && original.clientX != null) {
          eventDoc = event.target.ownerDocument || document;
          doc = eventDoc.documentElement;
          body = eventDoc.body;
          event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
          event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
        }
        if (!event.relatedTarget && fromElement) {
          event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
        }
        if (!event.which && button !== undefined) {
          event.which = button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
        }
        return event;
      }
    },
    special: {
      load: { noBubble: true },
      focus: {
        trigger: function () {
          if (this !== safeActiveElement() && this.focus) {
            try {
              this.focus();
              return false;
            } catch (e) {
            }
          }
        },
        delegateType: 'focusin'
      },
      blur: {
        trigger: function () {
          if (this === safeActiveElement() && this.blur) {
            this.blur();
            return false;
          }
        },
        delegateType: 'focusout'
      },
      click: {
        trigger: function () {
          if (jQuery.nodeName(this, 'input') && this.type === 'checkbox' && this.click) {
            this.click();
            return false;
          }
        },
        _default: function (event) {
          return jQuery.nodeName(event.target, 'a');
        }
      },
      beforeunload: {
        postDispatch: function (event) {
          if (event.result !== undefined && event.originalEvent) {
            event.originalEvent.returnValue = event.result;
          }
        }
      }
    },
    simulate: function (type, elem, event, bubble) {
      var e = jQuery.extend(new jQuery.Event(), event, {
          type: type,
          isSimulated: true,
          originalEvent: {}
        });
      if (bubble) {
        jQuery.event.trigger(e, null, elem);
      } else {
        jQuery.event.dispatch.call(elem, e);
      }
      if (e.isDefaultPrevented()) {
        event.preventDefault();
      }
    }
  };
  jQuery.removeEvent = document.removeEventListener ? function (elem, type, handle) {
    if (elem.removeEventListener) {
      elem.removeEventListener(type, handle, false);
    }
  } : function (elem, type, handle) {
    var name = 'on' + type;
    if (elem.detachEvent) {
      if (typeof elem[name] === strundefined) {
        elem[name] = null;
      }
      elem.detachEvent(name, handle);
    }
  };
  jQuery.Event = function (src, props) {
    if (!(this instanceof jQuery.Event)) {
      return new jQuery.Event(src, props);
    }
    if (src && src.type) {
      this.originalEvent = src;
      this.type = src.type;
      this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === undefined && src.returnValue === false ? returnTrue : returnFalse;
    } else {
      this.type = src;
    }
    if (props) {
      jQuery.extend(this, props);
    }
    this.timeStamp = src && src.timeStamp || jQuery.now();
    this[jQuery.expando] = true;
  };
  jQuery.Event.prototype = {
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse,
    preventDefault: function () {
      var e = this.originalEvent;
      this.isDefaultPrevented = returnTrue;
      if (!e) {
        return;
      }
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    },
    stopPropagation: function () {
      var e = this.originalEvent;
      this.isPropagationStopped = returnTrue;
      if (!e) {
        return;
      }
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      e.cancelBubble = true;
    },
    stopImmediatePropagation: function () {
      var e = this.originalEvent;
      this.isImmediatePropagationStopped = returnTrue;
      if (e && e.stopImmediatePropagation) {
        e.stopImmediatePropagation();
      }
      this.stopPropagation();
    }
  };
  jQuery.each({
    mouseenter: 'mouseover',
    mouseleave: 'mouseout',
    pointerenter: 'pointerover',
    pointerleave: 'pointerout'
  }, function (orig, fix) {
    jQuery.event.special[orig] = {
      delegateType: fix,
      bindType: fix,
      handle: function (event) {
        var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
        if (!related || related !== target && !jQuery.contains(target, related)) {
          event.type = handleObj.origType;
          ret = handleObj.handler.apply(this, arguments);
          event.type = fix;
        }
        return ret;
      }
    };
  });
  if (!support.submitBubbles) {
    jQuery.event.special.submit = {
      setup: function () {
        if (jQuery.nodeName(this, 'form')) {
          return false;
        }
        jQuery.event.add(this, 'click._submit keypress._submit', function (e) {
          var elem = e.target, form = jQuery.nodeName(elem, 'input') || jQuery.nodeName(elem, 'button') ? elem.form : undefined;
          if (form && !jQuery._data(form, 'submitBubbles')) {
            jQuery.event.add(form, 'submit._submit', function (event) {
              event._submit_bubble = true;
            });
            jQuery._data(form, 'submitBubbles', true);
          }
        });
      },
      postDispatch: function (event) {
        if (event._submit_bubble) {
          delete event._submit_bubble;
          if (this.parentNode && !event.isTrigger) {
            jQuery.event.simulate('submit', this.parentNode, event, true);
          }
        }
      },
      teardown: function () {
        if (jQuery.nodeName(this, 'form')) {
          return false;
        }
        jQuery.event.remove(this, '._submit');
      }
    };
  }
  if (!support.changeBubbles) {
    jQuery.event.special.change = {
      setup: function () {
        if (rformElems.test(this.nodeName)) {
          if (this.type === 'checkbox' || this.type === 'radio') {
            jQuery.event.add(this, 'propertychange._change', function (event) {
              if (event.originalEvent.propertyName === 'checked') {
                this._just_changed = true;
              }
            });
            jQuery.event.add(this, 'click._change', function (event) {
              if (this._just_changed && !event.isTrigger) {
                this._just_changed = false;
              }
              jQuery.event.simulate('change', this, event, true);
            });
          }
          return false;
        }
        jQuery.event.add(this, 'beforeactivate._change', function (e) {
          var elem = e.target;
          if (rformElems.test(elem.nodeName) && !jQuery._data(elem, 'changeBubbles')) {
            jQuery.event.add(elem, 'change._change', function (event) {
              if (this.parentNode && !event.isSimulated && !event.isTrigger) {
                jQuery.event.simulate('change', this.parentNode, event, true);
              }
            });
            jQuery._data(elem, 'changeBubbles', true);
          }
        });
      },
      handle: function (event) {
        var elem = event.target;
        if (this !== elem || event.isSimulated || event.isTrigger || elem.type !== 'radio' && elem.type !== 'checkbox') {
          return event.handleObj.handler.apply(this, arguments);
        }
      },
      teardown: function () {
        jQuery.event.remove(this, '._change');
        return !rformElems.test(this.nodeName);
      }
    };
  }
  if (!support.focusinBubbles) {
    jQuery.each({
      focus: 'focusin',
      blur: 'focusout'
    }, function (orig, fix) {
      var handler = function (event) {
        jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), true);
      };
      jQuery.event.special[fix] = {
        setup: function () {
          var doc = this.ownerDocument || this, attaches = jQuery._data(doc, fix);
          if (!attaches) {
            doc.addEventListener(orig, handler, true);
          }
          jQuery._data(doc, fix, (attaches || 0) + 1);
        },
        teardown: function () {
          var doc = this.ownerDocument || this, attaches = jQuery._data(doc, fix) - 1;
          if (!attaches) {
            doc.removeEventListener(orig, handler, true);
            jQuery._removeData(doc, fix);
          } else {
            jQuery._data(doc, fix, attaches);
          }
        }
      };
    });
  }
  jQuery.fn.extend({
    on: function (types, selector, data, fn, one) {
      var type, origFn;
      if (typeof types === 'object') {
        if (typeof selector !== 'string') {
          data = data || selector;
          selector = undefined;
        }
        for (type in types) {
          this.on(type, selector, data, types[type], one);
        }
        return this;
      }
      if (data == null && fn == null) {
        fn = selector;
        data = selector = undefined;
      } else if (fn == null) {
        if (typeof selector === 'string') {
          fn = data;
          data = undefined;
        } else {
          fn = data;
          data = selector;
          selector = undefined;
        }
      }
      if (fn === false) {
        fn = returnFalse;
      } else if (!fn) {
        return this;
      }
      if (one === 1) {
        origFn = fn;
        fn = function (event) {
          jQuery().off(event);
          return origFn.apply(this, arguments);
        };
        fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
      }
      return this.each(function () {
        jQuery.event.add(this, types, fn, data, selector);
      });
    },
    one: function (types, selector, data, fn) {
      return this.on(types, selector, data, fn, 1);
    },
    off: function (types, selector, fn) {
      var handleObj, type;
      if (types && types.preventDefault && types.handleObj) {
        handleObj = types.handleObj;
        jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + '.' + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler);
        return this;
      }
      if (typeof types === 'object') {
        for (type in types) {
          this.off(type, selector, types[type]);
        }
        return this;
      }
      if (selector === false || typeof selector === 'function') {
        fn = selector;
        selector = undefined;
      }
      if (fn === false) {
        fn = returnFalse;
      }
      return this.each(function () {
        jQuery.event.remove(this, types, fn, selector);
      });
    },
    trigger: function (type, data) {
      return this.each(function () {
        jQuery.event.trigger(type, data, this);
      });
    },
    triggerHandler: function (type, data) {
      var elem = this[0];
      if (elem) {
        return jQuery.event.trigger(type, data, elem, true);
      }
    }
  });
  function createSafeFragment(document) {
    var list = nodeNames.split('|'), safeFrag = document.createDocumentFragment();
    if (safeFrag.createElement) {
      while (list.length) {
        safeFrag.createElement(list.pop());
      }
    }
    return safeFrag;
  }
  var nodeNames = 'abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|' + 'header|hgroup|mark|meter|nav|output|progress|section|summary|time|video', rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g, rnoshimcache = new RegExp('<(?:' + nodeNames + ')[\\s/>]', 'i'), rleadingWhitespace = /^\s+/, rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, rtagName = /<([\w:]+)/, rtbody = /<tbody/i, rhtml = /<|&#?\w+;/, rnoInnerhtml = /<(?:script|style|link)/i, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rscriptType = /^$|\/(?:java|ecma)script/i, rscriptTypeMasked = /^true\/(.*)/, rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, wrapMap = {
      option: [
        1,
        '<select multiple=\'multiple\'>',
        '</select>'
      ],
      legend: [
        1,
        '<fieldset>',
        '</fieldset>'
      ],
      area: [
        1,
        '<map>',
        '</map>'
      ],
      param: [
        1,
        '<object>',
        '</object>'
      ],
      thead: [
        1,
        '<table>',
        '</table>'
      ],
      tr: [
        2,
        '<table><tbody>',
        '</tbody></table>'
      ],
      col: [
        2,
        '<table><tbody></tbody><colgroup>',
        '</colgroup></table>'
      ],
      td: [
        3,
        '<table><tbody><tr>',
        '</tr></tbody></table>'
      ],
      _default: support.htmlSerialize ? [
        0,
        '',
        ''
      ] : [
        1,
        'X<div>',
        '</div>'
      ]
    }, safeFragment = createSafeFragment(document), fragmentDiv = safeFragment.appendChild(document.createElement('div'));
  wrapMap.optgroup = wrapMap.option;
  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
  wrapMap.th = wrapMap.td;
  function getAll(context, tag) {
    var elems, elem, i = 0, found = typeof context.getElementsByTagName !== strundefined ? context.getElementsByTagName(tag || '*') : typeof context.querySelectorAll !== strundefined ? context.querySelectorAll(tag || '*') : undefined;
    if (!found) {
      for (found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++) {
        if (!tag || jQuery.nodeName(elem, tag)) {
          found.push(elem);
        } else {
          jQuery.merge(found, getAll(elem, tag));
        }
      }
    }
    return tag === undefined || tag && jQuery.nodeName(context, tag) ? jQuery.merge([context], found) : found;
  }
  function fixDefaultChecked(elem) {
    if (rcheckableType.test(elem.type)) {
      elem.defaultChecked = elem.checked;
    }
  }
  function manipulationTarget(elem, content) {
    return jQuery.nodeName(elem, 'table') && jQuery.nodeName(content.nodeType !== 11 ? content : content.firstChild, 'tr') ? elem.getElementsByTagName('tbody')[0] || elem.appendChild(elem.ownerDocument.createElement('tbody')) : elem;
  }
  function disableScript(elem) {
    elem.type = (jQuery.find.attr(elem, 'type') !== null) + '/' + elem.type;
    return elem;
  }
  function restoreScript(elem) {
    var match = rscriptTypeMasked.exec(elem.type);
    if (match) {
      elem.type = match[1];
    } else {
      elem.removeAttribute('type');
    }
    return elem;
  }
  function setGlobalEval(elems, refElements) {
    var elem, i = 0;
    for (; (elem = elems[i]) != null; i++) {
      jQuery._data(elem, 'globalEval', !refElements || jQuery._data(refElements[i], 'globalEval'));
    }
  }
  function cloneCopyEvent(src, dest) {
    if (dest.nodeType !== 1 || !jQuery.hasData(src)) {
      return;
    }
    var type, i, l, oldData = jQuery._data(src), curData = jQuery._data(dest, oldData), events = oldData.events;
    if (events) {
      delete curData.handle;
      curData.events = {};
      for (type in events) {
        for (i = 0, l = events[type].length; i < l; i++) {
          jQuery.event.add(dest, type, events[type][i]);
        }
      }
    }
    if (curData.data) {
      curData.data = jQuery.extend({}, curData.data);
    }
  }
  function fixCloneNodeIssues(src, dest) {
    var nodeName, e, data;
    if (dest.nodeType !== 1) {
      return;
    }
    nodeName = dest.nodeName.toLowerCase();
    if (!support.noCloneEvent && dest[jQuery.expando]) {
      data = jQuery._data(dest);
      for (e in data.events) {
        jQuery.removeEvent(dest, e, data.handle);
      }
      dest.removeAttribute(jQuery.expando);
    }
    if (nodeName === 'script' && dest.text !== src.text) {
      disableScript(dest).text = src.text;
      restoreScript(dest);
    } else if (nodeName === 'object') {
      if (dest.parentNode) {
        dest.outerHTML = src.outerHTML;
      }
      if (support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML))) {
        dest.innerHTML = src.innerHTML;
      }
    } else if (nodeName === 'input' && rcheckableType.test(src.type)) {
      dest.defaultChecked = dest.checked = src.checked;
      if (dest.value !== src.value) {
        dest.value = src.value;
      }
    } else if (nodeName === 'option') {
      dest.defaultSelected = dest.selected = src.defaultSelected;
    } else if (nodeName === 'input' || nodeName === 'textarea') {
      dest.defaultValue = src.defaultValue;
    }
  }
  jQuery.extend({
    clone: function (elem, dataAndEvents, deepDataAndEvents) {
      var destElements, node, clone, i, srcElements, inPage = jQuery.contains(elem.ownerDocument, elem);
      if (support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test('<' + elem.nodeName + '>')) {
        clone = elem.cloneNode(true);
      } else {
        fragmentDiv.innerHTML = elem.outerHTML;
        fragmentDiv.removeChild(clone = fragmentDiv.firstChild);
      }
      if ((!support.noCloneEvent || !support.noCloneChecked) && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
        destElements = getAll(clone);
        srcElements = getAll(elem);
        for (i = 0; (node = srcElements[i]) != null; ++i) {
          if (destElements[i]) {
            fixCloneNodeIssues(node, destElements[i]);
          }
        }
      }
      if (dataAndEvents) {
        if (deepDataAndEvents) {
          srcElements = srcElements || getAll(elem);
          destElements = destElements || getAll(clone);
          for (i = 0; (node = srcElements[i]) != null; i++) {
            cloneCopyEvent(node, destElements[i]);
          }
        } else {
          cloneCopyEvent(elem, clone);
        }
      }
      destElements = getAll(clone, 'script');
      if (destElements.length > 0) {
        setGlobalEval(destElements, !inPage && getAll(elem, 'script'));
      }
      destElements = srcElements = node = null;
      return clone;
    },
    buildFragment: function (elems, context, scripts, selection) {
      var j, elem, contains, tmp, tag, tbody, wrap, l = elems.length, safe = createSafeFragment(context), nodes = [], i = 0;
      for (; i < l; i++) {
        elem = elems[i];
        if (elem || elem === 0) {
          if (jQuery.type(elem) === 'object') {
            jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
          } else if (!rhtml.test(elem)) {
            nodes.push(context.createTextNode(elem));
          } else {
            tmp = tmp || safe.appendChild(context.createElement('div'));
            tag = (rtagName.exec(elem) || [
              '',
              ''
            ])[1].toLowerCase();
            wrap = wrapMap[tag] || wrapMap._default;
            tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, '<$1></$2>') + wrap[2];
            j = wrap[0];
            while (j--) {
              tmp = tmp.lastChild;
            }
            if (!support.leadingWhitespace && rleadingWhitespace.test(elem)) {
              nodes.push(context.createTextNode(rleadingWhitespace.exec(elem)[0]));
            }
            if (!support.tbody) {
              elem = tag === 'table' && !rtbody.test(elem) ? tmp.firstChild : wrap[1] === '<table>' && !rtbody.test(elem) ? tmp : 0;
              j = elem && elem.childNodes.length;
              while (j--) {
                if (jQuery.nodeName(tbody = elem.childNodes[j], 'tbody') && !tbody.childNodes.length) {
                  elem.removeChild(tbody);
                }
              }
            }
            jQuery.merge(nodes, tmp.childNodes);
            tmp.textContent = '';
            while (tmp.firstChild) {
              tmp.removeChild(tmp.firstChild);
            }
            tmp = safe.lastChild;
          }
        }
      }
      if (tmp) {
        safe.removeChild(tmp);
      }
      if (!support.appendChecked) {
        jQuery.grep(getAll(nodes, 'input'), fixDefaultChecked);
      }
      i = 0;
      while (elem = nodes[i++]) {
        if (selection && jQuery.inArray(elem, selection) !== -1) {
          continue;
        }
        contains = jQuery.contains(elem.ownerDocument, elem);
        tmp = getAll(safe.appendChild(elem), 'script');
        if (contains) {
          setGlobalEval(tmp);
        }
        if (scripts) {
          j = 0;
          while (elem = tmp[j++]) {
            if (rscriptType.test(elem.type || '')) {
              scripts.push(elem);
            }
          }
        }
      }
      tmp = null;
      return safe;
    },
    cleanData: function (elems, acceptData) {
      var elem, type, id, data, i = 0, internalKey = jQuery.expando, cache = jQuery.cache, deleteExpando = support.deleteExpando, special = jQuery.event.special;
      for (; (elem = elems[i]) != null; i++) {
        if (acceptData || jQuery.acceptData(elem)) {
          id = elem[internalKey];
          data = id && cache[id];
          if (data) {
            if (data.events) {
              for (type in data.events) {
                if (special[type]) {
                  jQuery.event.remove(elem, type);
                } else {
                  jQuery.removeEvent(elem, type, data.handle);
                }
              }
            }
            if (cache[id]) {
              delete cache[id];
              if (deleteExpando) {
                delete elem[internalKey];
              } else if (typeof elem.removeAttribute !== strundefined) {
                elem.removeAttribute(internalKey);
              } else {
                elem[internalKey] = null;
              }
              deletedIds.push(id);
            }
          }
        }
      }
    }
  });
  jQuery.fn.extend({
    text: function (value) {
      return access(this, function (value) {
        return value === undefined ? jQuery.text(this) : this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(value));
      }, null, value, arguments.length);
    },
    append: function () {
      return this.domManip(arguments, function (elem) {
        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
          var target = manipulationTarget(this, elem);
          target.appendChild(elem);
        }
      });
    },
    prepend: function () {
      return this.domManip(arguments, function (elem) {
        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
          var target = manipulationTarget(this, elem);
          target.insertBefore(elem, target.firstChild);
        }
      });
    },
    before: function () {
      return this.domManip(arguments, function (elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this);
        }
      });
    },
    after: function () {
      return this.domManip(arguments, function (elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this.nextSibling);
        }
      });
    },
    remove: function (selector, keepData) {
      var elem, elems = selector ? jQuery.filter(selector, this) : this, i = 0;
      for (; (elem = elems[i]) != null; i++) {
        if (!keepData && elem.nodeType === 1) {
          jQuery.cleanData(getAll(elem));
        }
        if (elem.parentNode) {
          if (keepData && jQuery.contains(elem.ownerDocument, elem)) {
            setGlobalEval(getAll(elem, 'script'));
          }
          elem.parentNode.removeChild(elem);
        }
      }
      return this;
    },
    empty: function () {
      var elem, i = 0;
      for (; (elem = this[i]) != null; i++) {
        if (elem.nodeType === 1) {
          jQuery.cleanData(getAll(elem, false));
        }
        while (elem.firstChild) {
          elem.removeChild(elem.firstChild);
        }
        if (elem.options && jQuery.nodeName(elem, 'select')) {
          elem.options.length = 0;
        }
      }
      return this;
    },
    clone: function (dataAndEvents, deepDataAndEvents) {
      dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
      deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
      return this.map(function () {
        return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
      });
    },
    html: function (value) {
      return access(this, function (value) {
        var elem = this[0] || {}, i = 0, l = this.length;
        if (value === undefined) {
          return elem.nodeType === 1 ? elem.innerHTML.replace(rinlinejQuery, '') : undefined;
        }
        if (typeof value === 'string' && !rnoInnerhtml.test(value) && (support.htmlSerialize || !rnoshimcache.test(value)) && (support.leadingWhitespace || !rleadingWhitespace.test(value)) && !wrapMap[(rtagName.exec(value) || [
            '',
            ''
          ])[1].toLowerCase()]) {
          value = value.replace(rxhtmlTag, '<$1></$2>');
          try {
            for (; i < l; i++) {
              elem = this[i] || {};
              if (elem.nodeType === 1) {
                jQuery.cleanData(getAll(elem, false));
                elem.innerHTML = value;
              }
            }
            elem = 0;
          } catch (e) {
          }
        }
        if (elem) {
          this.empty().append(value);
        }
      }, null, value, arguments.length);
    },
    replaceWith: function () {
      var arg = arguments[0];
      this.domManip(arguments, function (elem) {
        arg = this.parentNode;
        jQuery.cleanData(getAll(this));
        if (arg) {
          arg.replaceChild(elem, this);
        }
      });
      return arg && (arg.length || arg.nodeType) ? this : this.remove();
    },
    detach: function (selector) {
      return this.remove(selector, true);
    },
    domManip: function (args, callback) {
      args = concat.apply([], args);
      var first, node, hasScripts, scripts, doc, fragment, i = 0, l = this.length, set = this, iNoClone = l - 1, value = args[0], isFunction = jQuery.isFunction(value);
      if (isFunction || l > 1 && typeof value === 'string' && !support.checkClone && rchecked.test(value)) {
        return this.each(function (index) {
          var self = set.eq(index);
          if (isFunction) {
            args[0] = value.call(this, index, self.html());
          }
          self.domManip(args, callback);
        });
      }
      if (l) {
        fragment = jQuery.buildFragment(args, this[0].ownerDocument, false, this);
        first = fragment.firstChild;
        if (fragment.childNodes.length === 1) {
          fragment = first;
        }
        if (first) {
          scripts = jQuery.map(getAll(fragment, 'script'), disableScript);
          hasScripts = scripts.length;
          for (; i < l; i++) {
            node = fragment;
            if (i !== iNoClone) {
              node = jQuery.clone(node, true, true);
              if (hasScripts) {
                jQuery.merge(scripts, getAll(node, 'script'));
              }
            }
            callback.call(this[i], node, i);
          }
          if (hasScripts) {
            doc = scripts[scripts.length - 1].ownerDocument;
            jQuery.map(scripts, restoreScript);
            for (i = 0; i < hasScripts; i++) {
              node = scripts[i];
              if (rscriptType.test(node.type || '') && !jQuery._data(node, 'globalEval') && jQuery.contains(doc, node)) {
                if (node.src) {
                  if (jQuery._evalUrl) {
                    jQuery._evalUrl(node.src);
                  }
                } else {
                  jQuery.globalEval((node.text || node.textContent || node.innerHTML || '').replace(rcleanScript, ''));
                }
              }
            }
          }
          fragment = first = null;
        }
      }
      return this;
    }
  });
  jQuery.each({
    appendTo: 'append',
    prependTo: 'prepend',
    insertBefore: 'before',
    insertAfter: 'after',
    replaceAll: 'replaceWith'
  }, function (name, original) {
    jQuery.fn[name] = function (selector) {
      var elems, i = 0, ret = [], insert = jQuery(selector), last = insert.length - 1;
      for (; i <= last; i++) {
        elems = i === last ? this : this.clone(true);
        jQuery(insert[i])[original](elems);
        push.apply(ret, elems.get());
      }
      return this.pushStack(ret);
    };
  });
  var iframe, elemdisplay = {};
  function actualDisplay(name, doc) {
    var style, elem = jQuery(doc.createElement(name)).appendTo(doc.body), display = window.getDefaultComputedStyle && (style = window.getDefaultComputedStyle(elem[0])) ? style.display : jQuery.css(elem[0], 'display');
    elem.detach();
    return display;
  }
  function defaultDisplay(nodeName) {
    var doc = document, display = elemdisplay[nodeName];
    if (!display) {
      display = actualDisplay(nodeName, doc);
      if (display === 'none' || !display) {
        iframe = (iframe || jQuery('<iframe frameborder=\'0\' width=\'0\' height=\'0\'/>')).appendTo(doc.documentElement);
        doc = (iframe[0].contentWindow || iframe[0].contentDocument).document;
        doc.write();
        doc.close();
        display = actualDisplay(nodeName, doc);
        iframe.detach();
      }
      elemdisplay[nodeName] = display;
    }
    return display;
  }
  (function () {
    var shrinkWrapBlocksVal;
    support.shrinkWrapBlocks = function () {
      if (shrinkWrapBlocksVal != null) {
        return shrinkWrapBlocksVal;
      }
      shrinkWrapBlocksVal = false;
      var div, body, container;
      body = document.getElementsByTagName('body')[0];
      if (!body || !body.style) {
        return;
      }
      div = document.createElement('div');
      container = document.createElement('div');
      container.style.cssText = 'position:absolute;border:0;width:0;height:0;top:0;left:-9999px';
      body.appendChild(container).appendChild(div);
      if (typeof div.style.zoom !== strundefined) {
        div.style.cssText = '-webkit-box-sizing:content-box;-moz-box-sizing:content-box;' + 'box-sizing:content-box;display:block;margin:0;border:0;' + 'padding:1px;width:1px;zoom:1';
        div.appendChild(document.createElement('div')).style.width = '5px';
        shrinkWrapBlocksVal = div.offsetWidth !== 3;
      }
      body.removeChild(container);
      return shrinkWrapBlocksVal;
    };
  }());
  var rmargin = /^margin/;
  var rnumnonpx = new RegExp('^(' + pnum + ')(?!px)[a-z%]+$', 'i');
  var getStyles, curCSS, rposition = /^(top|right|bottom|left)$/;
  if (window.getComputedStyle) {
    getStyles = function (elem) {
      return elem.ownerDocument.defaultView.getComputedStyle(elem, null);
    };
    curCSS = function (elem, name, computed) {
      var width, minWidth, maxWidth, ret, style = elem.style;
      computed = computed || getStyles(elem);
      ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined;
      if (computed) {
        if (ret === '' && !jQuery.contains(elem.ownerDocument, elem)) {
          ret = jQuery.style(elem, name);
        }
        if (rnumnonpx.test(ret) && rmargin.test(name)) {
          width = style.width;
          minWidth = style.minWidth;
          maxWidth = style.maxWidth;
          style.minWidth = style.maxWidth = style.width = ret;
          ret = computed.width;
          style.width = width;
          style.minWidth = minWidth;
          style.maxWidth = maxWidth;
        }
      }
      return ret === undefined ? ret : ret + '';
    };
  } else if (document.documentElement.currentStyle) {
    getStyles = function (elem) {
      return elem.currentStyle;
    };
    curCSS = function (elem, name, computed) {
      var left, rs, rsLeft, ret, style = elem.style;
      computed = computed || getStyles(elem);
      ret = computed ? computed[name] : undefined;
      if (ret == null && style && style[name]) {
        ret = style[name];
      }
      if (rnumnonpx.test(ret) && !rposition.test(name)) {
        left = style.left;
        rs = elem.runtimeStyle;
        rsLeft = rs && rs.left;
        if (rsLeft) {
          rs.left = elem.currentStyle.left;
        }
        style.left = name === 'fontSize' ? '1em' : ret;
        ret = style.pixelLeft + 'px';
        style.left = left;
        if (rsLeft) {
          rs.left = rsLeft;
        }
      }
      return ret === undefined ? ret : ret + '' || 'auto';
    };
  }
  function addGetHookIf(conditionFn, hookFn) {
    return {
      get: function () {
        var condition = conditionFn();
        if (condition == null) {
          return;
        }
        if (condition) {
          delete this.get;
          return;
        }
        return (this.get = hookFn).apply(this, arguments);
      }
    };
  }
  (function () {
    var div, style, a, pixelPositionVal, boxSizingReliableVal, reliableHiddenOffsetsVal, reliableMarginRightVal;
    div = document.createElement('div');
    div.innerHTML = '  <link/><table></table><a href=\'/a\'>a</a><input type=\'checkbox\'/>';
    a = div.getElementsByTagName('a')[0];
    style = a && a.style;
    if (!style) {
      return;
    }
    style.cssText = 'float:left;opacity:.5';
    support.opacity = style.opacity === '0.5';
    support.cssFloat = !!style.cssFloat;
    div.style.backgroundClip = 'content-box';
    div.cloneNode(true).style.backgroundClip = '';
    support.clearCloneStyle = div.style.backgroundClip === 'content-box';
    support.boxSizing = style.boxSizing === '' || style.MozBoxSizing === '' || style.WebkitBoxSizing === '';
    jQuery.extend(support, {
      reliableHiddenOffsets: function () {
        if (reliableHiddenOffsetsVal == null) {
          computeStyleTests();
        }
        return reliableHiddenOffsetsVal;
      },
      boxSizingReliable: function () {
        if (boxSizingReliableVal == null) {
          computeStyleTests();
        }
        return boxSizingReliableVal;
      },
      pixelPosition: function () {
        if (pixelPositionVal == null) {
          computeStyleTests();
        }
        return pixelPositionVal;
      },
      reliableMarginRight: function () {
        if (reliableMarginRightVal == null) {
          computeStyleTests();
        }
        return reliableMarginRightVal;
      }
    });
    function computeStyleTests() {
      var div, body, container, contents;
      body = document.getElementsByTagName('body')[0];
      if (!body || !body.style) {
        return;
      }
      div = document.createElement('div');
      container = document.createElement('div');
      container.style.cssText = 'position:absolute;border:0;width:0;height:0;top:0;left:-9999px';
      body.appendChild(container).appendChild(div);
      div.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;' + 'box-sizing:border-box;display:block;margin-top:1%;top:1%;' + 'border:1px;padding:1px;width:4px;position:absolute';
      pixelPositionVal = boxSizingReliableVal = false;
      reliableMarginRightVal = true;
      if (window.getComputedStyle) {
        pixelPositionVal = (window.getComputedStyle(div, null) || {}).top !== '1%';
        boxSizingReliableVal = (window.getComputedStyle(div, null) || { width: '4px' }).width === '4px';
        contents = div.appendChild(document.createElement('div'));
        contents.style.cssText = div.style.cssText = '-webkit-box-sizing:content-box;-moz-box-sizing:content-box;' + 'box-sizing:content-box;display:block;margin:0;border:0;padding:0';
        contents.style.marginRight = contents.style.width = '0';
        div.style.width = '1px';
        reliableMarginRightVal = !parseFloat((window.getComputedStyle(contents, null) || {}).marginRight);
      }
      div.innerHTML = '<table><tr><td></td><td>t</td></tr></table>';
      contents = div.getElementsByTagName('td');
      contents[0].style.cssText = 'margin:0;border:0;padding:0;display:none';
      reliableHiddenOffsetsVal = contents[0].offsetHeight === 0;
      if (reliableHiddenOffsetsVal) {
        contents[0].style.display = '';
        contents[1].style.display = 'none';
        reliableHiddenOffsetsVal = contents[0].offsetHeight === 0;
      }
      body.removeChild(container);
    }
  }());
  jQuery.swap = function (elem, options, callback, args) {
    var ret, name, old = {};
    for (name in options) {
      old[name] = elem.style[name];
      elem.style[name] = options[name];
    }
    ret = callback.apply(elem, args || []);
    for (name in options) {
      elem.style[name] = old[name];
    }
    return ret;
  };
  var ralpha = /alpha\([^)]*\)/i, ropacity = /opacity\s*=\s*([^)]*)/, rdisplayswap = /^(none|table(?!-c[ea]).+)/, rnumsplit = new RegExp('^(' + pnum + ')(.*)$', 'i'), rrelNum = new RegExp('^([+-])=(' + pnum + ')', 'i'), cssShow = {
      position: 'absolute',
      visibility: 'hidden',
      display: 'block'
    }, cssNormalTransform = {
      letterSpacing: '0',
      fontWeight: '400'
    }, cssPrefixes = [
      'Webkit',
      'O',
      'Moz',
      'ms'
    ];
  function vendorPropName(style, name) {
    if (name in style) {
      return name;
    }
    var capName = name.charAt(0).toUpperCase() + name.slice(1), origName = name, i = cssPrefixes.length;
    while (i--) {
      name = cssPrefixes[i] + capName;
      if (name in style) {
        return name;
      }
    }
    return origName;
  }
  function showHide(elements, show) {
    var display, elem, hidden, values = [], index = 0, length = elements.length;
    for (; index < length; index++) {
      elem = elements[index];
      if (!elem.style) {
        continue;
      }
      values[index] = jQuery._data(elem, 'olddisplay');
      display = elem.style.display;
      if (show) {
        if (!values[index] && display === 'none') {
          elem.style.display = '';
        }
        if (elem.style.display === '' && isHidden(elem)) {
          values[index] = jQuery._data(elem, 'olddisplay', defaultDisplay(elem.nodeName));
        }
      } else {
        hidden = isHidden(elem);
        if (display && display !== 'none' || !hidden) {
          jQuery._data(elem, 'olddisplay', hidden ? display : jQuery.css(elem, 'display'));
        }
      }
    }
    for (index = 0; index < length; index++) {
      elem = elements[index];
      if (!elem.style) {
        continue;
      }
      if (!show || elem.style.display === 'none' || elem.style.display === '') {
        elem.style.display = show ? values[index] || '' : 'none';
      }
    }
    return elements;
  }
  function setPositiveNumber(elem, value, subtract) {
    var matches = rnumsplit.exec(value);
    return matches ? Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || 'px') : value;
  }
  function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
    var i = extra === (isBorderBox ? 'border' : 'content') ? 4 : name === 'width' ? 1 : 0, val = 0;
    for (; i < 4; i += 2) {
      if (extra === 'margin') {
        val += jQuery.css(elem, extra + cssExpand[i], true, styles);
      }
      if (isBorderBox) {
        if (extra === 'content') {
          val -= jQuery.css(elem, 'padding' + cssExpand[i], true, styles);
        }
        if (extra !== 'margin') {
          val -= jQuery.css(elem, 'border' + cssExpand[i] + 'Width', true, styles);
        }
      } else {
        val += jQuery.css(elem, 'padding' + cssExpand[i], true, styles);
        if (extra !== 'padding') {
          val += jQuery.css(elem, 'border' + cssExpand[i] + 'Width', true, styles);
        }
      }
    }
    return val;
  }
  function getWidthOrHeight(elem, name, extra) {
    var valueIsBorderBox = true, val = name === 'width' ? elem.offsetWidth : elem.offsetHeight, styles = getStyles(elem), isBorderBox = support.boxSizing && jQuery.css(elem, 'boxSizing', false, styles) === 'border-box';
    if (val <= 0 || val == null) {
      val = curCSS(elem, name, styles);
      if (val < 0 || val == null) {
        val = elem.style[name];
      }
      if (rnumnonpx.test(val)) {
        return val;
      }
      valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === elem.style[name]);
      val = parseFloat(val) || 0;
    }
    return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? 'border' : 'content'), valueIsBorderBox, styles) + 'px';
  }
  jQuery.extend({
    cssHooks: {
      opacity: {
        get: function (elem, computed) {
          if (computed) {
            var ret = curCSS(elem, 'opacity');
            return ret === '' ? '1' : ret;
          }
        }
      }
    },
    cssNumber: {
      'columnCount': true,
      'fillOpacity': true,
      'flexGrow': true,
      'flexShrink': true,
      'fontWeight': true,
      'lineHeight': true,
      'opacity': true,
      'order': true,
      'orphans': true,
      'widows': true,
      'zIndex': true,
      'zoom': true
    },
    cssProps: { 'float': support.cssFloat ? 'cssFloat' : 'styleFloat' },
    style: function (elem, name, value, extra) {
      if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
        return;
      }
      var ret, type, hooks, origName = jQuery.camelCase(name), style = elem.style;
      name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName));
      hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
      if (value !== undefined) {
        type = typeof value;
        if (type === 'string' && (ret = rrelNum.exec(value))) {
          value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name));
          type = 'number';
        }
        if (value == null || value !== value) {
          return;
        }
        if (type === 'number' && !jQuery.cssNumber[origName]) {
          value += 'px';
        }
        if (!support.clearCloneStyle && value === '' && name.indexOf('background') === 0) {
          style[name] = 'inherit';
        }
        if (!hooks || !('set' in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
          try {
            style[name] = value;
          } catch (e) {
          }
        }
      } else {
        if (hooks && 'get' in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
          return ret;
        }
        return style[name];
      }
    },
    css: function (elem, name, extra, styles) {
      var num, val, hooks, origName = jQuery.camelCase(name);
      name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(elem.style, origName));
      hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
      if (hooks && 'get' in hooks) {
        val = hooks.get(elem, true, extra);
      }
      if (val === undefined) {
        val = curCSS(elem, name, styles);
      }
      if (val === 'normal' && name in cssNormalTransform) {
        val = cssNormalTransform[name];
      }
      if (extra === '' || extra) {
        num = parseFloat(val);
        return extra === true || jQuery.isNumeric(num) ? num || 0 : val;
      }
      return val;
    }
  });
  jQuery.each([
    'height',
    'width'
  ], function (i, name) {
    jQuery.cssHooks[name] = {
      get: function (elem, computed, extra) {
        if (computed) {
          return rdisplayswap.test(jQuery.css(elem, 'display')) && elem.offsetWidth === 0 ? jQuery.swap(elem, cssShow, function () {
            return getWidthOrHeight(elem, name, extra);
          }) : getWidthOrHeight(elem, name, extra);
        }
      },
      set: function (elem, value, extra) {
        var styles = extra && getStyles(elem);
        return setPositiveNumber(elem, value, extra ? augmentWidthOrHeight(elem, name, extra, support.boxSizing && jQuery.css(elem, 'boxSizing', false, styles) === 'border-box', styles) : 0);
      }
    };
  });
  if (!support.opacity) {
    jQuery.cssHooks.opacity = {
      get: function (elem, computed) {
        return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || '') ? 0.01 * parseFloat(RegExp.$1) + '' : computed ? '1' : '';
      },
      set: function (elem, value) {
        var style = elem.style, currentStyle = elem.currentStyle, opacity = jQuery.isNumeric(value) ? 'alpha(opacity=' + value * 100 + ')' : '', filter = currentStyle && currentStyle.filter || style.filter || '';
        style.zoom = 1;
        if ((value >= 1 || value === '') && jQuery.trim(filter.replace(ralpha, '')) === '' && style.removeAttribute) {
          style.removeAttribute('filter');
          if (value === '' || currentStyle && !currentStyle.filter) {
            return;
          }
        }
        style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + ' ' + opacity;
      }
    };
  }
  jQuery.cssHooks.marginRight = addGetHookIf(support.reliableMarginRight, function (elem, computed) {
    if (computed) {
      return jQuery.swap(elem, { 'display': 'inline-block' }, curCSS, [
        elem,
        'marginRight'
      ]);
    }
  });
  jQuery.each({
    margin: '',
    padding: '',
    border: 'Width'
  }, function (prefix, suffix) {
    jQuery.cssHooks[prefix + suffix] = {
      expand: function (value) {
        var i = 0, expanded = {}, parts = typeof value === 'string' ? value.split(' ') : [value];
        for (; i < 4; i++) {
          expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
        }
        return expanded;
      }
    };
    if (!rmargin.test(prefix)) {
      jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
    }
  });
  jQuery.fn.extend({
    css: function (name, value) {
      return access(this, function (elem, name, value) {
        var styles, len, map = {}, i = 0;
        if (jQuery.isArray(name)) {
          styles = getStyles(elem);
          len = name.length;
          for (; i < len; i++) {
            map[name[i]] = jQuery.css(elem, name[i], false, styles);
          }
          return map;
        }
        return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
      }, name, value, arguments.length > 1);
    },
    show: function () {
      return showHide(this, true);
    },
    hide: function () {
      return showHide(this);
    },
    toggle: function (state) {
      if (typeof state === 'boolean') {
        return state ? this.show() : this.hide();
      }
      return this.each(function () {
        if (isHidden(this)) {
          jQuery(this).show();
        } else {
          jQuery(this).hide();
        }
      });
    }
  });
  function Tween(elem, options, prop, end, easing) {
    return new Tween.prototype.init(elem, options, prop, end, easing);
  }
  jQuery.Tween = Tween;
  Tween.prototype = {
    constructor: Tween,
    init: function (elem, options, prop, end, easing, unit) {
      this.elem = elem;
      this.prop = prop;
      this.easing = easing || 'swing';
      this.options = options;
      this.start = this.now = this.cur();
      this.end = end;
      this.unit = unit || (jQuery.cssNumber[prop] ? '' : 'px');
    },
    cur: function () {
      var hooks = Tween.propHooks[this.prop];
      return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
    },
    run: function (percent) {
      var eased, hooks = Tween.propHooks[this.prop];
      if (this.options.duration) {
        this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration);
      } else {
        this.pos = eased = percent;
      }
      this.now = (this.end - this.start) * eased + this.start;
      if (this.options.step) {
        this.options.step.call(this.elem, this.now, this);
      }
      if (hooks && hooks.set) {
        hooks.set(this);
      } else {
        Tween.propHooks._default.set(this);
      }
      return this;
    }
  };
  Tween.prototype.init.prototype = Tween.prototype;
  Tween.propHooks = {
    _default: {
      get: function (tween) {
        var result;
        if (tween.elem[tween.prop] != null && (!tween.elem.style || tween.elem.style[tween.prop] == null)) {
          return tween.elem[tween.prop];
        }
        result = jQuery.css(tween.elem, tween.prop, '');
        return !result || result === 'auto' ? 0 : result;
      },
      set: function (tween) {
        if (jQuery.fx.step[tween.prop]) {
          jQuery.fx.step[tween.prop](tween);
        } else if (tween.elem.style && (tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop])) {
          jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
        } else {
          tween.elem[tween.prop] = tween.now;
        }
      }
    }
  };
  Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
    set: function (tween) {
      if (tween.elem.nodeType && tween.elem.parentNode) {
        tween.elem[tween.prop] = tween.now;
      }
    }
  };
  jQuery.easing = {
    linear: function (p) {
      return p;
    },
    swing: function (p) {
      return 0.5 - Math.cos(p * Math.PI) / 2;
    }
  };
  jQuery.fx = Tween.prototype.init;
  jQuery.fx.step = {};
  var fxNow, timerId, rfxtypes = /^(?:toggle|show|hide)$/, rfxnum = new RegExp('^(?:([+-])=|)(' + pnum + ')([a-z%]*)$', 'i'), rrun = /queueHooks$/, animationPrefilters = [defaultPrefilter], tweeners = {
      '*': [function (prop, value) {
          var tween = this.createTween(prop, value), target = tween.cur(), parts = rfxnum.exec(value), unit = parts && parts[3] || (jQuery.cssNumber[prop] ? '' : 'px'), start = (jQuery.cssNumber[prop] || unit !== 'px' && +target) && rfxnum.exec(jQuery.css(tween.elem, prop)), scale = 1, maxIterations = 20;
          if (start && start[3] !== unit) {
            unit = unit || start[3];
            parts = parts || [];
            start = +target || 1;
            do {
              scale = scale || '.5';
              start = start / scale;
              jQuery.style(tween.elem, prop, start + unit);
            } while (scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations);
          }
          if (parts) {
            start = tween.start = +start || +target || 0;
            tween.unit = unit;
            tween.end = parts[1] ? start + (parts[1] + 1) * parts[2] : +parts[2];
          }
          return tween;
        }]
    };
  function createFxNow() {
    setTimeout(function () {
      fxNow = undefined;
    });
    return fxNow = jQuery.now();
  }
  function genFx(type, includeWidth) {
    var which, attrs = { height: type }, i = 0;
    includeWidth = includeWidth ? 1 : 0;
    for (; i < 4; i += 2 - includeWidth) {
      which = cssExpand[i];
      attrs['margin' + which] = attrs['padding' + which] = type;
    }
    if (includeWidth) {
      attrs.opacity = attrs.width = type;
    }
    return attrs;
  }
  function createTween(value, prop, animation) {
    var tween, collection = (tweeners[prop] || []).concat(tweeners['*']), index = 0, length = collection.length;
    for (; index < length; index++) {
      if (tween = collection[index].call(animation, prop, value)) {
        return tween;
      }
    }
  }
  function defaultPrefilter(elem, props, opts) {
    var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay, anim = this, orig = {}, style = elem.style, hidden = elem.nodeType && isHidden(elem), dataShow = jQuery._data(elem, 'fxshow');
    if (!opts.queue) {
      hooks = jQuery._queueHooks(elem, 'fx');
      if (hooks.unqueued == null) {
        hooks.unqueued = 0;
        oldfire = hooks.empty.fire;
        hooks.empty.fire = function () {
          if (!hooks.unqueued) {
            oldfire();
          }
        };
      }
      hooks.unqueued++;
      anim.always(function () {
        anim.always(function () {
          hooks.unqueued--;
          if (!jQuery.queue(elem, 'fx').length) {
            hooks.empty.fire();
          }
        });
      });
    }
    if (elem.nodeType === 1 && ('height' in props || 'width' in props)) {
      opts.overflow = [
        style.overflow,
        style.overflowX,
        style.overflowY
      ];
      display = jQuery.css(elem, 'display');
      checkDisplay = display === 'none' ? jQuery._data(elem, 'olddisplay') || defaultDisplay(elem.nodeName) : display;
      if (checkDisplay === 'inline' && jQuery.css(elem, 'float') === 'none') {
        if (!support.inlineBlockNeedsLayout || defaultDisplay(elem.nodeName) === 'inline') {
          style.display = 'inline-block';
        } else {
          style.zoom = 1;
        }
      }
    }
    if (opts.overflow) {
      style.overflow = 'hidden';
      if (!support.shrinkWrapBlocks()) {
        anim.always(function () {
          style.overflow = opts.overflow[0];
          style.overflowX = opts.overflow[1];
          style.overflowY = opts.overflow[2];
        });
      }
    }
    for (prop in props) {
      value = props[prop];
      if (rfxtypes.exec(value)) {
        delete props[prop];
        toggle = toggle || value === 'toggle';
        if (value === (hidden ? 'hide' : 'show')) {
          if (value === 'show' && dataShow && dataShow[prop] !== undefined) {
            hidden = true;
          } else {
            continue;
          }
        }
        orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
      } else {
        display = undefined;
      }
    }
    if (!jQuery.isEmptyObject(orig)) {
      if (dataShow) {
        if ('hidden' in dataShow) {
          hidden = dataShow.hidden;
        }
      } else {
        dataShow = jQuery._data(elem, 'fxshow', {});
      }
      if (toggle) {
        dataShow.hidden = !hidden;
      }
      if (hidden) {
        jQuery(elem).show();
      } else {
        anim.done(function () {
          jQuery(elem).hide();
        });
      }
      anim.done(function () {
        var prop;
        jQuery._removeData(elem, 'fxshow');
        for (prop in orig) {
          jQuery.style(elem, prop, orig[prop]);
        }
      });
      for (prop in orig) {
        tween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
        if (!(prop in dataShow)) {
          dataShow[prop] = tween.start;
          if (hidden) {
            tween.end = tween.start;
            tween.start = prop === 'width' || prop === 'height' ? 1 : 0;
          }
        }
      }
    } else if ((display === 'none' ? defaultDisplay(elem.nodeName) : display) === 'inline') {
      style.display = display;
    }
  }
  function propFilter(props, specialEasing) {
    var index, name, easing, value, hooks;
    for (index in props) {
      name = jQuery.camelCase(index);
      easing = specialEasing[name];
      value = props[index];
      if (jQuery.isArray(value)) {
        easing = value[1];
        value = props[index] = value[0];
      }
      if (index !== name) {
        props[name] = value;
        delete props[index];
      }
      hooks = jQuery.cssHooks[name];
      if (hooks && 'expand' in hooks) {
        value = hooks.expand(value);
        delete props[name];
        for (index in value) {
          if (!(index in props)) {
            props[index] = value[index];
            specialEasing[index] = easing;
          }
        }
      } else {
        specialEasing[name] = easing;
      }
    }
  }
  function Animation(elem, properties, options) {
    var result, stopped, index = 0, length = animationPrefilters.length, deferred = jQuery.Deferred().always(function () {
        delete tick.elem;
      }), tick = function () {
        if (stopped) {
          return false;
        }
        var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), temp = remaining / animation.duration || 0, percent = 1 - temp, index = 0, length = animation.tweens.length;
        for (; index < length; index++) {
          animation.tweens[index].run(percent);
        }
        deferred.notifyWith(elem, [
          animation,
          percent,
          remaining
        ]);
        if (percent < 1 && length) {
          return remaining;
        } else {
          deferred.resolveWith(elem, [animation]);
          return false;
        }
      }, animation = deferred.promise({
        elem: elem,
        props: jQuery.extend({}, properties),
        opts: jQuery.extend(true, { specialEasing: {} }, options),
        originalProperties: properties,
        originalOptions: options,
        startTime: fxNow || createFxNow(),
        duration: options.duration,
        tweens: [],
        createTween: function (prop, end) {
          var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
          animation.tweens.push(tween);
          return tween;
        },
        stop: function (gotoEnd) {
          var index = 0, length = gotoEnd ? animation.tweens.length : 0;
          if (stopped) {
            return this;
          }
          stopped = true;
          for (; index < length; index++) {
            animation.tweens[index].run(1);
          }
          if (gotoEnd) {
            deferred.resolveWith(elem, [
              animation,
              gotoEnd
            ]);
          } else {
            deferred.rejectWith(elem, [
              animation,
              gotoEnd
            ]);
          }
          return this;
        }
      }), props = animation.props;
    propFilter(props, animation.opts.specialEasing);
    for (; index < length; index++) {
      result = animationPrefilters[index].call(animation, elem, props, animation.opts);
      if (result) {
        return result;
      }
    }
    jQuery.map(props, createTween, animation);
    if (jQuery.isFunction(animation.opts.start)) {
      animation.opts.start.call(elem, animation);
    }
    jQuery.fx.timer(jQuery.extend(tick, {
      elem: elem,
      anim: animation,
      queue: animation.opts.queue
    }));
    return animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
  }
  jQuery.Animation = jQuery.extend(Animation, {
    tweener: function (props, callback) {
      if (jQuery.isFunction(props)) {
        callback = props;
        props = ['*'];
      } else {
        props = props.split(' ');
      }
      var prop, index = 0, length = props.length;
      for (; index < length; index++) {
        prop = props[index];
        tweeners[prop] = tweeners[prop] || [];
        tweeners[prop].unshift(callback);
      }
    },
    prefilter: function (callback, prepend) {
      if (prepend) {
        animationPrefilters.unshift(callback);
      } else {
        animationPrefilters.push(callback);
      }
    }
  });
  jQuery.speed = function (speed, easing, fn) {
    var opt = speed && typeof speed === 'object' ? jQuery.extend({}, speed) : {
        complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
        duration: speed,
        easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
      };
    opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === 'number' ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;
    if (opt.queue == null || opt.queue === true) {
      opt.queue = 'fx';
    }
    opt.old = opt.complete;
    opt.complete = function () {
      if (jQuery.isFunction(opt.old)) {
        opt.old.call(this);
      }
      if (opt.queue) {
        jQuery.dequeue(this, opt.queue);
      }
    };
    return opt;
  };
  jQuery.fn.extend({
    fadeTo: function (speed, to, easing, callback) {
      return this.filter(isHidden).css('opacity', 0).show().end().animate({ opacity: to }, speed, easing, callback);
    },
    animate: function (prop, speed, easing, callback) {
      var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function () {
          var anim = Animation(this, jQuery.extend({}, prop), optall);
          if (empty || jQuery._data(this, 'finish')) {
            anim.stop(true);
          }
        };
      doAnimation.finish = doAnimation;
      return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
    },
    stop: function (type, clearQueue, gotoEnd) {
      var stopQueue = function (hooks) {
        var stop = hooks.stop;
        delete hooks.stop;
        stop(gotoEnd);
      };
      if (typeof type !== 'string') {
        gotoEnd = clearQueue;
        clearQueue = type;
        type = undefined;
      }
      if (clearQueue && type !== false) {
        this.queue(type || 'fx', []);
      }
      return this.each(function () {
        var dequeue = true, index = type != null && type + 'queueHooks', timers = jQuery.timers, data = jQuery._data(this);
        if (index) {
          if (data[index] && data[index].stop) {
            stopQueue(data[index]);
          }
        } else {
          for (index in data) {
            if (data[index] && data[index].stop && rrun.test(index)) {
              stopQueue(data[index]);
            }
          }
        }
        for (index = timers.length; index--;) {
          if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
            timers[index].anim.stop(gotoEnd);
            dequeue = false;
            timers.splice(index, 1);
          }
        }
        if (dequeue || !gotoEnd) {
          jQuery.dequeue(this, type);
        }
      });
    },
    finish: function (type) {
      if (type !== false) {
        type = type || 'fx';
      }
      return this.each(function () {
        var index, data = jQuery._data(this), queue = data[type + 'queue'], hooks = data[type + 'queueHooks'], timers = jQuery.timers, length = queue ? queue.length : 0;
        data.finish = true;
        jQuery.queue(this, type, []);
        if (hooks && hooks.stop) {
          hooks.stop.call(this, true);
        }
        for (index = timers.length; index--;) {
          if (timers[index].elem === this && timers[index].queue === type) {
            timers[index].anim.stop(true);
            timers.splice(index, 1);
          }
        }
        for (index = 0; index < length; index++) {
          if (queue[index] && queue[index].finish) {
            queue[index].finish.call(this);
          }
        }
        delete data.finish;
      });
    }
  });
  jQuery.each([
    'toggle',
    'show',
    'hide'
  ], function (i, name) {
    var cssFn = jQuery.fn[name];
    jQuery.fn[name] = function (speed, easing, callback) {
      return speed == null || typeof speed === 'boolean' ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
    };
  });
  jQuery.each({
    slideDown: genFx('show'),
    slideUp: genFx('hide'),
    slideToggle: genFx('toggle'),
    fadeIn: { opacity: 'show' },
    fadeOut: { opacity: 'hide' },
    fadeToggle: { opacity: 'toggle' }
  }, function (name, props) {
    jQuery.fn[name] = function (speed, easing, callback) {
      return this.animate(props, speed, easing, callback);
    };
  });
  jQuery.timers = [];
  jQuery.fx.tick = function () {
    var timer, timers = jQuery.timers, i = 0;
    fxNow = jQuery.now();
    for (; i < timers.length; i++) {
      timer = timers[i];
      if (!timer() && timers[i] === timer) {
        timers.splice(i--, 1);
      }
    }
    if (!timers.length) {
      jQuery.fx.stop();
    }
    fxNow = undefined;
  };
  jQuery.fx.timer = function (timer) {
    jQuery.timers.push(timer);
    if (timer()) {
      jQuery.fx.start();
    } else {
      jQuery.timers.pop();
    }
  };
  jQuery.fx.interval = 13;
  jQuery.fx.start = function () {
    if (!timerId) {
      timerId = setInterval(jQuery.fx.tick, jQuery.fx.interval);
    }
  };
  jQuery.fx.stop = function () {
    clearInterval(timerId);
    timerId = null;
  };
  jQuery.fx.speeds = {
    slow: 600,
    fast: 200,
    _default: 400
  };
  jQuery.fn.delay = function (time, type) {
    time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
    type = type || 'fx';
    return this.queue(type, function (next, hooks) {
      var timeout = setTimeout(next, time);
      hooks.stop = function () {
        clearTimeout(timeout);
      };
    });
  };
  (function () {
    var input, div, select, a, opt;
    div = document.createElement('div');
    div.setAttribute('className', 't');
    div.innerHTML = '  <link/><table></table><a href=\'/a\'>a</a><input type=\'checkbox\'/>';
    a = div.getElementsByTagName('a')[0];
    select = document.createElement('select');
    opt = select.appendChild(document.createElement('option'));
    input = div.getElementsByTagName('input')[0];
    a.style.cssText = 'top:1px';
    support.getSetAttribute = div.className !== 't';
    support.style = /top/.test(a.getAttribute('style'));
    support.hrefNormalized = a.getAttribute('href') === '/a';
    support.checkOn = !!input.value;
    support.optSelected = opt.selected;
    support.enctype = !!document.createElement('form').enctype;
    select.disabled = true;
    support.optDisabled = !opt.disabled;
    input = document.createElement('input');
    input.setAttribute('value', '');
    support.input = input.getAttribute('value') === '';
    input.value = 't';
    input.setAttribute('type', 'radio');
    support.radioValue = input.value === 't';
  }());
  var rreturn = /\r/g;
  jQuery.fn.extend({
    val: function (value) {
      var hooks, ret, isFunction, elem = this[0];
      if (!arguments.length) {
        if (elem) {
          hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];
          if (hooks && 'get' in hooks && (ret = hooks.get(elem, 'value')) !== undefined) {
            return ret;
          }
          ret = elem.value;
          return typeof ret === 'string' ? ret.replace(rreturn, '') : ret == null ? '' : ret;
        }
        return;
      }
      isFunction = jQuery.isFunction(value);
      return this.each(function (i) {
        var val;
        if (this.nodeType !== 1) {
          return;
        }
        if (isFunction) {
          val = value.call(this, i, jQuery(this).val());
        } else {
          val = value;
        }
        if (val == null) {
          val = '';
        } else if (typeof val === 'number') {
          val += '';
        } else if (jQuery.isArray(val)) {
          val = jQuery.map(val, function (value) {
            return value == null ? '' : value + '';
          });
        }
        hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
        if (!hooks || !('set' in hooks) || hooks.set(this, val, 'value') === undefined) {
          this.value = val;
        }
      });
    }
  });
  jQuery.extend({
    valHooks: {
      option: {
        get: function (elem) {
          var val = jQuery.find.attr(elem, 'value');
          return val != null ? val : jQuery.trim(jQuery.text(elem));
        }
      },
      select: {
        get: function (elem) {
          var value, option, options = elem.options, index = elem.selectedIndex, one = elem.type === 'select-one' || index < 0, values = one ? null : [], max = one ? index + 1 : options.length, i = index < 0 ? max : one ? index : 0;
          for (; i < max; i++) {
            option = options[i];
            if ((option.selected || i === index) && (support.optDisabled ? !option.disabled : option.getAttribute('disabled') === null) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, 'optgroup'))) {
              value = jQuery(option).val();
              if (one) {
                return value;
              }
              values.push(value);
            }
          }
          return values;
        },
        set: function (elem, value) {
          var optionSet, option, options = elem.options, values = jQuery.makeArray(value), i = options.length;
          while (i--) {
            option = options[i];
            if (jQuery.inArray(jQuery.valHooks.option.get(option), values) >= 0) {
              try {
                option.selected = optionSet = true;
              } catch (_) {
                option.scrollHeight;
              }
            } else {
              option.selected = false;
            }
          }
          if (!optionSet) {
            elem.selectedIndex = -1;
          }
          return options;
        }
      }
    }
  });
  jQuery.each([
    'radio',
    'checkbox'
  ], function () {
    jQuery.valHooks[this] = {
      set: function (elem, value) {
        if (jQuery.isArray(value)) {
          return elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0;
        }
      }
    };
    if (!support.checkOn) {
      jQuery.valHooks[this].get = function (elem) {
        return elem.getAttribute('value') === null ? 'on' : elem.value;
      };
    }
  });
  var nodeHook, boolHook, attrHandle = jQuery.expr.attrHandle, ruseDefault = /^(?:checked|selected)$/i, getSetAttribute = support.getSetAttribute, getSetInput = support.input;
  jQuery.fn.extend({
    attr: function (name, value) {
      return access(this, jQuery.attr, name, value, arguments.length > 1);
    },
    removeAttr: function (name) {
      return this.each(function () {
        jQuery.removeAttr(this, name);
      });
    }
  });
  jQuery.extend({
    attr: function (elem, name, value) {
      var hooks, ret, nType = elem.nodeType;
      if (!elem || nType === 3 || nType === 8 || nType === 2) {
        return;
      }
      if (typeof elem.getAttribute === strundefined) {
        return jQuery.prop(elem, name, value);
      }
      if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
        name = name.toLowerCase();
        hooks = jQuery.attrHooks[name] || (jQuery.expr.match.bool.test(name) ? boolHook : nodeHook);
      }
      if (value !== undefined) {
        if (value === null) {
          jQuery.removeAttr(elem, name);
        } else if (hooks && 'set' in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
          return ret;
        } else {
          elem.setAttribute(name, value + '');
          return value;
        }
      } else if (hooks && 'get' in hooks && (ret = hooks.get(elem, name)) !== null) {
        return ret;
      } else {
        ret = jQuery.find.attr(elem, name);
        return ret == null ? undefined : ret;
      }
    },
    removeAttr: function (elem, value) {
      var name, propName, i = 0, attrNames = value && value.match(rnotwhite);
      if (attrNames && elem.nodeType === 1) {
        while (name = attrNames[i++]) {
          propName = jQuery.propFix[name] || name;
          if (jQuery.expr.match.bool.test(name)) {
            if (getSetInput && getSetAttribute || !ruseDefault.test(name)) {
              elem[propName] = false;
            } else {
              elem[jQuery.camelCase('default-' + name)] = elem[propName] = false;
            }
          } else {
            jQuery.attr(elem, name, '');
          }
          elem.removeAttribute(getSetAttribute ? name : propName);
        }
      }
    },
    attrHooks: {
      type: {
        set: function (elem, value) {
          if (!support.radioValue && value === 'radio' && jQuery.nodeName(elem, 'input')) {
            var val = elem.value;
            elem.setAttribute('type', value);
            if (val) {
              elem.value = val;
            }
            return value;
          }
        }
      }
    }
  });
  boolHook = {
    set: function (elem, value, name) {
      if (value === false) {
        jQuery.removeAttr(elem, name);
      } else if (getSetInput && getSetAttribute || !ruseDefault.test(name)) {
        elem.setAttribute(!getSetAttribute && jQuery.propFix[name] || name, name);
      } else {
        elem[jQuery.camelCase('default-' + name)] = elem[name] = true;
      }
      return name;
    }
  };
  jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function (i, name) {
    var getter = attrHandle[name] || jQuery.find.attr;
    attrHandle[name] = getSetInput && getSetAttribute || !ruseDefault.test(name) ? function (elem, name, isXML) {
      var ret, handle;
      if (!isXML) {
        handle = attrHandle[name];
        attrHandle[name] = ret;
        ret = getter(elem, name, isXML) != null ? name.toLowerCase() : null;
        attrHandle[name] = handle;
      }
      return ret;
    } : function (elem, name, isXML) {
      if (!isXML) {
        return elem[jQuery.camelCase('default-' + name)] ? name.toLowerCase() : null;
      }
    };
  });
  if (!getSetInput || !getSetAttribute) {
    jQuery.attrHooks.value = {
      set: function (elem, value, name) {
        if (jQuery.nodeName(elem, 'input')) {
          elem.defaultValue = value;
        } else {
          return nodeHook && nodeHook.set(elem, value, name);
        }
      }
    };
  }
  if (!getSetAttribute) {
    nodeHook = {
      set: function (elem, value, name) {
        var ret = elem.getAttributeNode(name);
        if (!ret) {
          elem.setAttributeNode(ret = elem.ownerDocument.createAttribute(name));
        }
        ret.value = value += '';
        if (name === 'value' || value === elem.getAttribute(name)) {
          return value;
        }
      }
    };
    attrHandle.id = attrHandle.name = attrHandle.coords = function (elem, name, isXML) {
      var ret;
      if (!isXML) {
        return (ret = elem.getAttributeNode(name)) && ret.value !== '' ? ret.value : null;
      }
    };
    jQuery.valHooks.button = {
      get: function (elem, name) {
        var ret = elem.getAttributeNode(name);
        if (ret && ret.specified) {
          return ret.value;
        }
      },
      set: nodeHook.set
    };
    jQuery.attrHooks.contenteditable = {
      set: function (elem, value, name) {
        nodeHook.set(elem, value === '' ? false : value, name);
      }
    };
    jQuery.each([
      'width',
      'height'
    ], function (i, name) {
      jQuery.attrHooks[name] = {
        set: function (elem, value) {
          if (value === '') {
            elem.setAttribute(name, 'auto');
            return value;
          }
        }
      };
    });
  }
  if (!support.style) {
    jQuery.attrHooks.style = {
      get: function (elem) {
        return elem.style.cssText || undefined;
      },
      set: function (elem, value) {
        return elem.style.cssText = value + '';
      }
    };
  }
  var rfocusable = /^(?:input|select|textarea|button|object)$/i, rclickable = /^(?:a|area)$/i;
  jQuery.fn.extend({
    prop: function (name, value) {
      return access(this, jQuery.prop, name, value, arguments.length > 1);
    },
    removeProp: function (name) {
      name = jQuery.propFix[name] || name;
      return this.each(function () {
        try {
          this[name] = undefined;
          delete this[name];
        } catch (e) {
        }
      });
    }
  });
  jQuery.extend({
    propFix: {
      'for': 'htmlFor',
      'class': 'className'
    },
    prop: function (elem, name, value) {
      var ret, hooks, notxml, nType = elem.nodeType;
      if (!elem || nType === 3 || nType === 8 || nType === 2) {
        return;
      }
      notxml = nType !== 1 || !jQuery.isXMLDoc(elem);
      if (notxml) {
        name = jQuery.propFix[name] || name;
        hooks = jQuery.propHooks[name];
      }
      if (value !== undefined) {
        return hooks && 'set' in hooks && (ret = hooks.set(elem, value, name)) !== undefined ? ret : elem[name] = value;
      } else {
        return hooks && 'get' in hooks && (ret = hooks.get(elem, name)) !== null ? ret : elem[name];
      }
    },
    propHooks: {
      tabIndex: {
        get: function (elem) {
          var tabindex = jQuery.find.attr(elem, 'tabindex');
          return tabindex ? parseInt(tabindex, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : -1;
        }
      }
    }
  });
  if (!support.hrefNormalized) {
    jQuery.each([
      'href',
      'src'
    ], function (i, name) {
      jQuery.propHooks[name] = {
        get: function (elem) {
          return elem.getAttribute(name, 4);
        }
      };
    });
  }
  if (!support.optSelected) {
    jQuery.propHooks.selected = {
      get: function (elem) {
        var parent = elem.parentNode;
        if (parent) {
          parent.selectedIndex;
          if (parent.parentNode) {
            parent.parentNode.selectedIndex;
          }
        }
        return null;
      }
    };
  }
  jQuery.each([
    'tabIndex',
    'readOnly',
    'maxLength',
    'cellSpacing',
    'cellPadding',
    'rowSpan',
    'colSpan',
    'useMap',
    'frameBorder',
    'contentEditable'
  ], function () {
    jQuery.propFix[this.toLowerCase()] = this;
  });
  if (!support.enctype) {
    jQuery.propFix.enctype = 'encoding';
  }
  var rclass = /[\t\r\n\f]/g;
  jQuery.fn.extend({
    addClass: function (value) {
      var classes, elem, cur, clazz, j, finalValue, i = 0, len = this.length, proceed = typeof value === 'string' && value;
      if (jQuery.isFunction(value)) {
        return this.each(function (j) {
          jQuery(this).addClass(value.call(this, j, this.className));
        });
      }
      if (proceed) {
        classes = (value || '').match(rnotwhite) || [];
        for (; i < len; i++) {
          elem = this[i];
          cur = elem.nodeType === 1 && (elem.className ? (' ' + elem.className + ' ').replace(rclass, ' ') : ' ');
          if (cur) {
            j = 0;
            while (clazz = classes[j++]) {
              if (cur.indexOf(' ' + clazz + ' ') < 0) {
                cur += clazz + ' ';
              }
            }
            finalValue = jQuery.trim(cur);
            if (elem.className !== finalValue) {
              elem.className = finalValue;
            }
          }
        }
      }
      return this;
    },
    removeClass: function (value) {
      var classes, elem, cur, clazz, j, finalValue, i = 0, len = this.length, proceed = arguments.length === 0 || typeof value === 'string' && value;
      if (jQuery.isFunction(value)) {
        return this.each(function (j) {
          jQuery(this).removeClass(value.call(this, j, this.className));
        });
      }
      if (proceed) {
        classes = (value || '').match(rnotwhite) || [];
        for (; i < len; i++) {
          elem = this[i];
          cur = elem.nodeType === 1 && (elem.className ? (' ' + elem.className + ' ').replace(rclass, ' ') : '');
          if (cur) {
            j = 0;
            while (clazz = classes[j++]) {
              while (cur.indexOf(' ' + clazz + ' ') >= 0) {
                cur = cur.replace(' ' + clazz + ' ', ' ');
              }
            }
            finalValue = value ? jQuery.trim(cur) : '';
            if (elem.className !== finalValue) {
              elem.className = finalValue;
            }
          }
        }
      }
      return this;
    },
    toggleClass: function (value, stateVal) {
      var type = typeof value;
      if (typeof stateVal === 'boolean' && type === 'string') {
        return stateVal ? this.addClass(value) : this.removeClass(value);
      }
      if (jQuery.isFunction(value)) {
        return this.each(function (i) {
          jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
        });
      }
      return this.each(function () {
        if (type === 'string') {
          var className, i = 0, self = jQuery(this), classNames = value.match(rnotwhite) || [];
          while (className = classNames[i++]) {
            if (self.hasClass(className)) {
              self.removeClass(className);
            } else {
              self.addClass(className);
            }
          }
        } else if (type === strundefined || type === 'boolean') {
          if (this.className) {
            jQuery._data(this, '__className__', this.className);
          }
          this.className = this.className || value === false ? '' : jQuery._data(this, '__className__') || '';
        }
      });
    },
    hasClass: function (selector) {
      var className = ' ' + selector + ' ', i = 0, l = this.length;
      for (; i < l; i++) {
        if (this[i].nodeType === 1 && (' ' + this[i].className + ' ').replace(rclass, ' ').indexOf(className) >= 0) {
          return true;
        }
      }
      return false;
    }
  });
  jQuery.each(('blur focus focusin focusout load resize scroll unload click dblclick ' + 'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' + 'change select submit keydown keypress keyup error contextmenu').split(' '), function (i, name) {
    jQuery.fn[name] = function (data, fn) {
      return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
    };
  });
  jQuery.fn.extend({
    hover: function (fnOver, fnOut) {
      return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
    },
    bind: function (types, data, fn) {
      return this.on(types, null, data, fn);
    },
    unbind: function (types, fn) {
      return this.off(types, null, fn);
    },
    delegate: function (selector, types, data, fn) {
      return this.on(types, selector, data, fn);
    },
    undelegate: function (selector, types, fn) {
      return arguments.length === 1 ? this.off(selector, '**') : this.off(types, selector || '**', fn);
    }
  });
  var nonce = jQuery.now();
  var rquery = /\?/;
  var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
  jQuery.parseJSON = function (data) {
    if (window.JSON && window.JSON.parse) {
      return window.JSON.parse(data + '');
    }
    var requireNonComma, depth = null, str = jQuery.trim(data + '');
    return str && !jQuery.trim(str.replace(rvalidtokens, function (token, comma, open, close) {
      if (requireNonComma && comma) {
        depth = 0;
      }
      if (depth === 0) {
        return token;
      }
      requireNonComma = open || comma;
      depth += !close - !open;
      return '';
    })) ? Function('return ' + str)() : jQuery.error('Invalid JSON: ' + data);
  };
  jQuery.parseXML = function (data) {
    var xml, tmp;
    if (!data || typeof data !== 'string') {
      return null;
    }
    try {
      if (window.DOMParser) {
        tmp = new DOMParser();
        xml = tmp.parseFromString(data, 'text/xml');
      } else {
        xml = new ActiveXObject('Microsoft.XMLDOM');
        xml.async = 'false';
        xml.loadXML(data);
      }
    } catch (e) {
      xml = undefined;
    }
    if (!xml || !xml.documentElement || xml.getElementsByTagName('parsererror').length) {
      jQuery.error('Invalid XML: ' + data);
    }
    return xml;
  };
  var ajaxLocParts, ajaxLocation, rhash = /#.*$/, rts = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, prefilters = {}, transports = {}, allTypes = '*/'.concat('*');
  try {
    ajaxLocation = location.href;
  } catch (e) {
    ajaxLocation = document.createElement('a');
    ajaxLocation.href = '';
    ajaxLocation = ajaxLocation.href;
  }
  ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];
  function addToPrefiltersOrTransports(structure) {
    return function (dataTypeExpression, func) {
      if (typeof dataTypeExpression !== 'string') {
        func = dataTypeExpression;
        dataTypeExpression = '*';
      }
      var dataType, i = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnotwhite) || [];
      if (jQuery.isFunction(func)) {
        while (dataType = dataTypes[i++]) {
          if (dataType.charAt(0) === '+') {
            dataType = dataType.slice(1) || '*';
            (structure[dataType] = structure[dataType] || []).unshift(func);
          } else {
            (structure[dataType] = structure[dataType] || []).push(func);
          }
        }
      }
    };
  }
  function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
    var inspected = {}, seekingTransport = structure === transports;
    function inspect(dataType) {
      var selected;
      inspected[dataType] = true;
      jQuery.each(structure[dataType] || [], function (_, prefilterOrFactory) {
        var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
        if (typeof dataTypeOrTransport === 'string' && !seekingTransport && !inspected[dataTypeOrTransport]) {
          options.dataTypes.unshift(dataTypeOrTransport);
          inspect(dataTypeOrTransport);
          return false;
        } else if (seekingTransport) {
          return !(selected = dataTypeOrTransport);
        }
      });
      return selected;
    }
    return inspect(options.dataTypes[0]) || !inspected['*'] && inspect('*');
  }
  function ajaxExtend(target, src) {
    var deep, key, flatOptions = jQuery.ajaxSettings.flatOptions || {};
    for (key in src) {
      if (src[key] !== undefined) {
        (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
      }
    }
    if (deep) {
      jQuery.extend(true, target, deep);
    }
    return target;
  }
  function ajaxHandleResponses(s, jqXHR, responses) {
    var firstDataType, ct, finalDataType, type, contents = s.contents, dataTypes = s.dataTypes;
    while (dataTypes[0] === '*') {
      dataTypes.shift();
      if (ct === undefined) {
        ct = s.mimeType || jqXHR.getResponseHeader('Content-Type');
      }
    }
    if (ct) {
      for (type in contents) {
        if (contents[type] && contents[type].test(ct)) {
          dataTypes.unshift(type);
          break;
        }
      }
    }
    if (dataTypes[0] in responses) {
      finalDataType = dataTypes[0];
    } else {
      for (type in responses) {
        if (!dataTypes[0] || s.converters[type + ' ' + dataTypes[0]]) {
          finalDataType = type;
          break;
        }
        if (!firstDataType) {
          firstDataType = type;
        }
      }
      finalDataType = finalDataType || firstDataType;
    }
    if (finalDataType) {
      if (finalDataType !== dataTypes[0]) {
        dataTypes.unshift(finalDataType);
      }
      return responses[finalDataType];
    }
  }
  function ajaxConvert(s, response, jqXHR, isSuccess) {
    var conv2, current, conv, tmp, prev, converters = {}, dataTypes = s.dataTypes.slice();
    if (dataTypes[1]) {
      for (conv in s.converters) {
        converters[conv.toLowerCase()] = s.converters[conv];
      }
    }
    current = dataTypes.shift();
    while (current) {
      if (s.responseFields[current]) {
        jqXHR[s.responseFields[current]] = response;
      }
      if (!prev && isSuccess && s.dataFilter) {
        response = s.dataFilter(response, s.dataType);
      }
      prev = current;
      current = dataTypes.shift();
      if (current) {
        if (current === '*') {
          current = prev;
        } else if (prev !== '*' && prev !== current) {
          conv = converters[prev + ' ' + current] || converters['* ' + current];
          if (!conv) {
            for (conv2 in converters) {
              tmp = conv2.split(' ');
              if (tmp[1] === current) {
                conv = converters[prev + ' ' + tmp[0]] || converters['* ' + tmp[0]];
                if (conv) {
                  if (conv === true) {
                    conv = converters[conv2];
                  } else if (converters[conv2] !== true) {
                    current = tmp[0];
                    dataTypes.unshift(tmp[1]);
                  }
                  break;
                }
              }
            }
          }
          if (conv !== true) {
            if (conv && s['throws']) {
              response = conv(response);
            } else {
              try {
                response = conv(response);
              } catch (e) {
                return {
                  state: 'parsererror',
                  error: conv ? e : 'No conversion from ' + prev + ' to ' + current
                };
              }
            }
          }
        }
      }
    }
    return {
      state: 'success',
      data: response
    };
  }
  jQuery.extend({
    active: 0,
    lastModified: {},
    etag: {},
    ajaxSettings: {
      url: ajaxLocation,
      type: 'GET',
      isLocal: rlocalProtocol.test(ajaxLocParts[1]),
      global: true,
      processData: true,
      async: true,
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      accepts: {
        '*': allTypes,
        text: 'text/plain',
        html: 'text/html',
        xml: 'application/xml, text/xml',
        json: 'application/json, text/javascript'
      },
      contents: {
        xml: /xml/,
        html: /html/,
        json: /json/
      },
      responseFields: {
        xml: 'responseXML',
        text: 'responseText',
        json: 'responseJSON'
      },
      converters: {
        '* text': String,
        'text html': true,
        'text json': jQuery.parseJSON,
        'text xml': jQuery.parseXML
      },
      flatOptions: {
        url: true,
        context: true
      }
    },
    ajaxSetup: function (target, settings) {
      return settings ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : ajaxExtend(jQuery.ajaxSettings, target);
    },
    ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
    ajaxTransport: addToPrefiltersOrTransports(transports),
    ajax: function (url, options) {
      if (typeof url === 'object') {
        options = url;
        url = undefined;
      }
      options = options || {};
      var parts, i, cacheURL, responseHeadersString, timeoutTimer, fireGlobals, transport, responseHeaders, s = jQuery.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event, deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks('once memory'), statusCode = s.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, state = 0, strAbort = 'canceled', jqXHR = {
          readyState: 0,
          getResponseHeader: function (key) {
            var match;
            if (state === 2) {
              if (!responseHeaders) {
                responseHeaders = {};
                while (match = rheaders.exec(responseHeadersString)) {
                  responseHeaders[match[1].toLowerCase()] = match[2];
                }
              }
              match = responseHeaders[key.toLowerCase()];
            }
            return match == null ? null : match;
          },
          getAllResponseHeaders: function () {
            return state === 2 ? responseHeadersString : null;
          },
          setRequestHeader: function (name, value) {
            var lname = name.toLowerCase();
            if (!state) {
              name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
              requestHeaders[name] = value;
            }
            return this;
          },
          overrideMimeType: function (type) {
            if (!state) {
              s.mimeType = type;
            }
            return this;
          },
          statusCode: function (map) {
            var code;
            if (map) {
              if (state < 2) {
                for (code in map) {
                  statusCode[code] = [
                    statusCode[code],
                    map[code]
                  ];
                }
              } else {
                jqXHR.always(map[jqXHR.status]);
              }
            }
            return this;
          },
          abort: function (statusText) {
            var finalText = statusText || strAbort;
            if (transport) {
              transport.abort(finalText);
            }
            done(0, finalText);
            return this;
          }
        };
      deferred.promise(jqXHR).complete = completeDeferred.add;
      jqXHR.success = jqXHR.done;
      jqXHR.error = jqXHR.fail;
      s.url = ((url || s.url || ajaxLocation) + '').replace(rhash, '').replace(rprotocol, ajaxLocParts[1] + '//');
      s.type = options.method || options.type || s.method || s.type;
      s.dataTypes = jQuery.trim(s.dataType || '*').toLowerCase().match(rnotwhite) || [''];
      if (s.crossDomain == null) {
        parts = rurl.exec(s.url.toLowerCase());
        s.crossDomain = !!(parts && (parts[1] !== ajaxLocParts[1] || parts[2] !== ajaxLocParts[2] || (parts[3] || (parts[1] === 'http:' ? '80' : '443')) !== (ajaxLocParts[3] || (ajaxLocParts[1] === 'http:' ? '80' : '443'))));
      }
      if (s.data && s.processData && typeof s.data !== 'string') {
        s.data = jQuery.param(s.data, s.traditional);
      }
      inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
      if (state === 2) {
        return jqXHR;
      }
      fireGlobals = s.global;
      if (fireGlobals && jQuery.active++ === 0) {
        jQuery.event.trigger('ajaxStart');
      }
      s.type = s.type.toUpperCase();
      s.hasContent = !rnoContent.test(s.type);
      cacheURL = s.url;
      if (!s.hasContent) {
        if (s.data) {
          cacheURL = s.url += (rquery.test(cacheURL) ? '&' : '?') + s.data;
          delete s.data;
        }
        if (s.cache === false) {
          s.url = rts.test(cacheURL) ? cacheURL.replace(rts, '$1_=' + nonce++) : cacheURL + (rquery.test(cacheURL) ? '&' : '?') + '_=' + nonce++;
        }
      }
      if (s.ifModified) {
        if (jQuery.lastModified[cacheURL]) {
          jqXHR.setRequestHeader('If-Modified-Since', jQuery.lastModified[cacheURL]);
        }
        if (jQuery.etag[cacheURL]) {
          jqXHR.setRequestHeader('If-None-Match', jQuery.etag[cacheURL]);
        }
      }
      if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
        jqXHR.setRequestHeader('Content-Type', s.contentType);
      }
      jqXHR.setRequestHeader('Accept', s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== '*' ? ', ' + allTypes + '; q=0.01' : '') : s.accepts['*']);
      for (i in s.headers) {
        jqXHR.setRequestHeader(i, s.headers[i]);
      }
      if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)) {
        return jqXHR.abort();
      }
      strAbort = 'abort';
      for (i in {
          success: 1,
          error: 1,
          complete: 1
        }) {
        jqXHR[i](s[i]);
      }
      transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
      if (!transport) {
        done(-1, 'No Transport');
      } else {
        jqXHR.readyState = 1;
        if (fireGlobals) {
          globalEventContext.trigger('ajaxSend', [
            jqXHR,
            s
          ]);
        }
        if (s.async && s.timeout > 0) {
          timeoutTimer = setTimeout(function () {
            jqXHR.abort('timeout');
          }, s.timeout);
        }
        try {
          state = 1;
          transport.send(requestHeaders, done);
        } catch (e) {
          if (state < 2) {
            done(-1, e);
          } else {
            throw e;
          }
        }
      }
      function done(status, nativeStatusText, responses, headers) {
        var isSuccess, success, error, response, modified, statusText = nativeStatusText;
        if (state === 2) {
          return;
        }
        state = 2;
        if (timeoutTimer) {
          clearTimeout(timeoutTimer);
        }
        transport = undefined;
        responseHeadersString = headers || '';
        jqXHR.readyState = status > 0 ? 4 : 0;
        isSuccess = status >= 200 && status < 300 || status === 304;
        if (responses) {
          response = ajaxHandleResponses(s, jqXHR, responses);
        }
        response = ajaxConvert(s, response, jqXHR, isSuccess);
        if (isSuccess) {
          if (s.ifModified) {
            modified = jqXHR.getResponseHeader('Last-Modified');
            if (modified) {
              jQuery.lastModified[cacheURL] = modified;
            }
            modified = jqXHR.getResponseHeader('etag');
            if (modified) {
              jQuery.etag[cacheURL] = modified;
            }
          }
          if (status === 204 || s.type === 'HEAD') {
            statusText = 'nocontent';
          } else if (status === 304) {
            statusText = 'notmodified';
          } else {
            statusText = response.state;
            success = response.data;
            error = response.error;
            isSuccess = !error;
          }
        } else {
          error = statusText;
          if (status || !statusText) {
            statusText = 'error';
            if (status < 0) {
              status = 0;
            }
          }
        }
        jqXHR.status = status;
        jqXHR.statusText = (nativeStatusText || statusText) + '';
        if (isSuccess) {
          deferred.resolveWith(callbackContext, [
            success,
            statusText,
            jqXHR
          ]);
        } else {
          deferred.rejectWith(callbackContext, [
            jqXHR,
            statusText,
            error
          ]);
        }
        jqXHR.statusCode(statusCode);
        statusCode = undefined;
        if (fireGlobals) {
          globalEventContext.trigger(isSuccess ? 'ajaxSuccess' : 'ajaxError', [
            jqXHR,
            s,
            isSuccess ? success : error
          ]);
        }
        completeDeferred.fireWith(callbackContext, [
          jqXHR,
          statusText
        ]);
        if (fireGlobals) {
          globalEventContext.trigger('ajaxComplete', [
            jqXHR,
            s
          ]);
          if (!--jQuery.active) {
            jQuery.event.trigger('ajaxStop');
          }
        }
      }
      return jqXHR;
    },
    getJSON: function (url, data, callback) {
      return jQuery.get(url, data, callback, 'json');
    },
    getScript: function (url, callback) {
      return jQuery.get(url, undefined, callback, 'script');
    }
  });
  jQuery.each([
    'get',
    'post'
  ], function (i, method) {
    jQuery[method] = function (url, data, callback, type) {
      if (jQuery.isFunction(data)) {
        type = type || callback;
        callback = data;
        data = undefined;
      }
      return jQuery.ajax({
        url: url,
        type: method,
        dataType: type,
        data: data,
        success: callback
      });
    };
  });
  jQuery.each([
    'ajaxStart',
    'ajaxStop',
    'ajaxComplete',
    'ajaxError',
    'ajaxSuccess',
    'ajaxSend'
  ], function (i, type) {
    jQuery.fn[type] = function (fn) {
      return this.on(type, fn);
    };
  });
  jQuery._evalUrl = function (url) {
    return jQuery.ajax({
      url: url,
      type: 'GET',
      dataType: 'script',
      async: false,
      global: false,
      'throws': true
    });
  };
  jQuery.fn.extend({
    wrapAll: function (html) {
      if (jQuery.isFunction(html)) {
        return this.each(function (i) {
          jQuery(this).wrapAll(html.call(this, i));
        });
      }
      if (this[0]) {
        var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
        if (this[0].parentNode) {
          wrap.insertBefore(this[0]);
        }
        wrap.map(function () {
          var elem = this;
          while (elem.firstChild && elem.firstChild.nodeType === 1) {
            elem = elem.firstChild;
          }
          return elem;
        }).append(this);
      }
      return this;
    },
    wrapInner: function (html) {
      if (jQuery.isFunction(html)) {
        return this.each(function (i) {
          jQuery(this).wrapInner(html.call(this, i));
        });
      }
      return this.each(function () {
        var self = jQuery(this), contents = self.contents();
        if (contents.length) {
          contents.wrapAll(html);
        } else {
          self.append(html);
        }
      });
    },
    wrap: function (html) {
      var isFunction = jQuery.isFunction(html);
      return this.each(function (i) {
        jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
      });
    },
    unwrap: function () {
      return this.parent().each(function () {
        if (!jQuery.nodeName(this, 'body')) {
          jQuery(this).replaceWith(this.childNodes);
        }
      }).end();
    }
  });
  jQuery.expr.filters.hidden = function (elem) {
    return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 || !support.reliableHiddenOffsets() && (elem.style && elem.style.display || jQuery.css(elem, 'display')) === 'none';
  };
  jQuery.expr.filters.visible = function (elem) {
    return !jQuery.expr.filters.hidden(elem);
  };
  var r20 = /%20/g, rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
  function buildParams(prefix, obj, traditional, add) {
    var name;
    if (jQuery.isArray(obj)) {
      jQuery.each(obj, function (i, v) {
        if (traditional || rbracket.test(prefix)) {
          add(prefix, v);
        } else {
          buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, traditional, add);
        }
      });
    } else if (!traditional && jQuery.type(obj) === 'object') {
      for (name in obj) {
        buildParams(prefix + '[' + name + ']', obj[name], traditional, add);
      }
    } else {
      add(prefix, obj);
    }
  }
  jQuery.param = function (a, traditional) {
    var prefix, s = [], add = function (key, value) {
        value = jQuery.isFunction(value) ? value() : value == null ? '' : value;
        s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
      };
    if (traditional === undefined) {
      traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
    }
    if (jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {
      jQuery.each(a, function () {
        add(this.name, this.value);
      });
    } else {
      for (prefix in a) {
        buildParams(prefix, a[prefix], traditional, add);
      }
    }
    return s.join('&').replace(r20, '+');
  };
  jQuery.fn.extend({
    serialize: function () {
      return jQuery.param(this.serializeArray());
    },
    serializeArray: function () {
      return this.map(function () {
        var elements = jQuery.prop(this, 'elements');
        return elements ? jQuery.makeArray(elements) : this;
      }).filter(function () {
        var type = this.type;
        return this.name && !jQuery(this).is(':disabled') && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
      }).map(function (i, elem) {
        var val = jQuery(this).val();
        return val == null ? null : jQuery.isArray(val) ? jQuery.map(val, function (val) {
          return {
            name: elem.name,
            value: val.replace(rCRLF, '\r\n')
          };
        }) : {
          name: elem.name,
          value: val.replace(rCRLF, '\r\n')
        };
      }).get();
    }
  });
  jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ? function () {
    return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && createStandardXHR() || createActiveXHR();
  } : createStandardXHR;
  var xhrId = 0, xhrCallbacks = {}, xhrSupported = jQuery.ajaxSettings.xhr();
  if (window.ActiveXObject) {
    jQuery(window).on('unload', function () {
      for (var key in xhrCallbacks) {
        xhrCallbacks[key](undefined, true);
      }
    });
  }
  support.cors = !!xhrSupported && 'withCredentials' in xhrSupported;
  xhrSupported = support.ajax = !!xhrSupported;
  if (xhrSupported) {
    jQuery.ajaxTransport(function (options) {
      if (!options.crossDomain || support.cors) {
        var callback;
        return {
          send: function (headers, complete) {
            var i, xhr = options.xhr(), id = ++xhrId;
            xhr.open(options.type, options.url, options.async, options.username, options.password);
            if (options.xhrFields) {
              for (i in options.xhrFields) {
                xhr[i] = options.xhrFields[i];
              }
            }
            if (options.mimeType && xhr.overrideMimeType) {
              xhr.overrideMimeType(options.mimeType);
            }
            if (!options.crossDomain && !headers['X-Requested-With']) {
              headers['X-Requested-With'] = 'XMLHttpRequest';
            }
            for (i in headers) {
              if (headers[i] !== undefined) {
                xhr.setRequestHeader(i, headers[i] + '');
              }
            }
            xhr.send(options.hasContent && options.data || null);
            callback = function (_, isAbort) {
              var status, statusText, responses;
              if (callback && (isAbort || xhr.readyState === 4)) {
                delete xhrCallbacks[id];
                callback = undefined;
                xhr.onreadystatechange = jQuery.noop;
                if (isAbort) {
                  if (xhr.readyState !== 4) {
                    xhr.abort();
                  }
                } else {
                  responses = {};
                  status = xhr.status;
                  if (typeof xhr.responseText === 'string') {
                    responses.text = xhr.responseText;
                  }
                  try {
                    statusText = xhr.statusText;
                  } catch (e) {
                    statusText = '';
                  }
                  if (!status && options.isLocal && !options.crossDomain) {
                    status = responses.text ? 200 : 404;
                  } else if (status === 1223) {
                    status = 204;
                  }
                }
              }
              if (responses) {
                complete(status, statusText, responses, xhr.getAllResponseHeaders());
              }
            };
            if (!options.async) {
              callback();
            } else if (xhr.readyState === 4) {
              setTimeout(callback);
            } else {
              xhr.onreadystatechange = xhrCallbacks[id] = callback;
            }
          },
          abort: function () {
            if (callback) {
              callback(undefined, true);
            }
          }
        };
      }
    });
  }
  function createStandardXHR() {
    try {
      return new window.XMLHttpRequest();
    } catch (e) {
    }
  }
  function createActiveXHR() {
    try {
      return new window.ActiveXObject('Microsoft.XMLHTTP');
    } catch (e) {
    }
  }
  jQuery.ajaxSetup({
    accepts: { script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript' },
    contents: { script: /(?:java|ecma)script/ },
    converters: {
      'text script': function (text) {
        jQuery.globalEval(text);
        return text;
      }
    }
  });
  jQuery.ajaxPrefilter('script', function (s) {
    if (s.cache === undefined) {
      s.cache = false;
    }
    if (s.crossDomain) {
      s.type = 'GET';
      s.global = false;
    }
  });
  jQuery.ajaxTransport('script', function (s) {
    if (s.crossDomain) {
      var script, head = document.head || jQuery('head')[0] || document.documentElement;
      return {
        send: function (_, callback) {
          script = document.createElement('script');
          script.async = true;
          if (s.scriptCharset) {
            script.charset = s.scriptCharset;
          }
          script.src = s.url;
          script.onload = script.onreadystatechange = function (_, isAbort) {
            if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
              script.onload = script.onreadystatechange = null;
              if (script.parentNode) {
                script.parentNode.removeChild(script);
              }
              script = null;
              if (!isAbort) {
                callback(200, 'success');
              }
            }
          };
          head.insertBefore(script, head.firstChild);
        },
        abort: function () {
          if (script) {
            script.onload(undefined, true);
          }
        }
      };
    }
  });
  var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
  jQuery.ajaxSetup({
    jsonp: 'callback',
    jsonpCallback: function () {
      var callback = oldCallbacks.pop() || jQuery.expando + '_' + nonce++;
      this[callback] = true;
      return callback;
    }
  });
  jQuery.ajaxPrefilter('json jsonp', function (s, originalSettings, jqXHR) {
    var callbackName, overwritten, responseContainer, jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? 'url' : typeof s.data === 'string' && !(s.contentType || '').indexOf('application/x-www-form-urlencoded') && rjsonp.test(s.data) && 'data');
    if (jsonProp || s.dataTypes[0] === 'jsonp') {
      callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
      if (jsonProp) {
        s[jsonProp] = s[jsonProp].replace(rjsonp, '$1' + callbackName);
      } else if (s.jsonp !== false) {
        s.url += (rquery.test(s.url) ? '&' : '?') + s.jsonp + '=' + callbackName;
      }
      s.converters['script json'] = function () {
        if (!responseContainer) {
          jQuery.error(callbackName + ' was not called');
        }
        return responseContainer[0];
      };
      s.dataTypes[0] = 'json';
      overwritten = window[callbackName];
      window[callbackName] = function () {
        responseContainer = arguments;
      };
      jqXHR.always(function () {
        window[callbackName] = overwritten;
        if (s[callbackName]) {
          s.jsonpCallback = originalSettings.jsonpCallback;
          oldCallbacks.push(callbackName);
        }
        if (responseContainer && jQuery.isFunction(overwritten)) {
          overwritten(responseContainer[0]);
        }
        responseContainer = overwritten = undefined;
      });
      return 'script';
    }
  });
  jQuery.parseHTML = function (data, context, keepScripts) {
    if (!data || typeof data !== 'string') {
      return null;
    }
    if (typeof context === 'boolean') {
      keepScripts = context;
      context = false;
    }
    context = context || document;
    var parsed = rsingleTag.exec(data), scripts = !keepScripts && [];
    if (parsed) {
      return [context.createElement(parsed[1])];
    }
    parsed = jQuery.buildFragment([data], context, scripts);
    if (scripts && scripts.length) {
      jQuery(scripts).remove();
    }
    return jQuery.merge([], parsed.childNodes);
  };
  var _load = jQuery.fn.load;
  jQuery.fn.load = function (url, params, callback) {
    if (typeof url !== 'string' && _load) {
      return _load.apply(this, arguments);
    }
    var selector, response, type, self = this, off = url.indexOf(' ');
    if (off >= 0) {
      selector = jQuery.trim(url.slice(off, url.length));
      url = url.slice(0, off);
    }
    if (jQuery.isFunction(params)) {
      callback = params;
      params = undefined;
    } else if (params && typeof params === 'object') {
      type = 'POST';
    }
    if (self.length > 0) {
      jQuery.ajax({
        url: url,
        type: type,
        dataType: 'html',
        data: params
      }).done(function (responseText) {
        response = arguments;
        self.html(selector ? jQuery('<div>').append(jQuery.parseHTML(responseText)).find(selector) : responseText);
      }).complete(callback && function (jqXHR, status) {
        self.each(callback, response || [
          jqXHR.responseText,
          status,
          jqXHR
        ]);
      });
    }
    return this;
  };
  jQuery.expr.filters.animated = function (elem) {
    return jQuery.grep(jQuery.timers, function (fn) {
      return elem === fn.elem;
    }).length;
  };
  var docElem = window.document.documentElement;
  function getWindow(elem) {
    return jQuery.isWindow(elem) ? elem : elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : false;
  }
  jQuery.offset = {
    setOffset: function (elem, options, i) {
      var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition, position = jQuery.css(elem, 'position'), curElem = jQuery(elem), props = {};
      if (position === 'static') {
        elem.style.position = 'relative';
      }
      curOffset = curElem.offset();
      curCSSTop = jQuery.css(elem, 'top');
      curCSSLeft = jQuery.css(elem, 'left');
      calculatePosition = (position === 'absolute' || position === 'fixed') && jQuery.inArray('auto', [
        curCSSTop,
        curCSSLeft
      ]) > -1;
      if (calculatePosition) {
        curPosition = curElem.position();
        curTop = curPosition.top;
        curLeft = curPosition.left;
      } else {
        curTop = parseFloat(curCSSTop) || 0;
        curLeft = parseFloat(curCSSLeft) || 0;
      }
      if (jQuery.isFunction(options)) {
        options = options.call(elem, i, curOffset);
      }
      if (options.top != null) {
        props.top = options.top - curOffset.top + curTop;
      }
      if (options.left != null) {
        props.left = options.left - curOffset.left + curLeft;
      }
      if ('using' in options) {
        options.using.call(elem, props);
      } else {
        curElem.css(props);
      }
    }
  };
  jQuery.fn.extend({
    offset: function (options) {
      if (arguments.length) {
        return options === undefined ? this : this.each(function (i) {
          jQuery.offset.setOffset(this, options, i);
        });
      }
      var docElem, win, box = {
          top: 0,
          left: 0
        }, elem = this[0], doc = elem && elem.ownerDocument;
      if (!doc) {
        return;
      }
      docElem = doc.documentElement;
      if (!jQuery.contains(docElem, elem)) {
        return box;
      }
      if (typeof elem.getBoundingClientRect !== strundefined) {
        box = elem.getBoundingClientRect();
      }
      win = getWindow(doc);
      return {
        top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
        left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
      };
    },
    position: function () {
      if (!this[0]) {
        return;
      }
      var offsetParent, offset, parentOffset = {
          top: 0,
          left: 0
        }, elem = this[0];
      if (jQuery.css(elem, 'position') === 'fixed') {
        offset = elem.getBoundingClientRect();
      } else {
        offsetParent = this.offsetParent();
        offset = this.offset();
        if (!jQuery.nodeName(offsetParent[0], 'html')) {
          parentOffset = offsetParent.offset();
        }
        parentOffset.top += jQuery.css(offsetParent[0], 'borderTopWidth', true);
        parentOffset.left += jQuery.css(offsetParent[0], 'borderLeftWidth', true);
      }
      return {
        top: offset.top - parentOffset.top - jQuery.css(elem, 'marginTop', true),
        left: offset.left - parentOffset.left - jQuery.css(elem, 'marginLeft', true)
      };
    },
    offsetParent: function () {
      return this.map(function () {
        var offsetParent = this.offsetParent || docElem;
        while (offsetParent && (!jQuery.nodeName(offsetParent, 'html') && jQuery.css(offsetParent, 'position') === 'static')) {
          offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || docElem;
      });
    }
  });
  jQuery.each({
    scrollLeft: 'pageXOffset',
    scrollTop: 'pageYOffset'
  }, function (method, prop) {
    var top = /Y/.test(prop);
    jQuery.fn[method] = function (val) {
      return access(this, function (elem, method, val) {
        var win = getWindow(elem);
        if (val === undefined) {
          return win ? prop in win ? win[prop] : win.document.documentElement[method] : elem[method];
        }
        if (win) {
          win.scrollTo(!top ? val : jQuery(win).scrollLeft(), top ? val : jQuery(win).scrollTop());
        } else {
          elem[method] = val;
        }
      }, method, val, arguments.length, null);
    };
  });
  jQuery.each([
    'top',
    'left'
  ], function (i, prop) {
    jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function (elem, computed) {
      if (computed) {
        computed = curCSS(elem, prop);
        return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + 'px' : computed;
      }
    });
  });
  jQuery.each({
    Height: 'height',
    Width: 'width'
  }, function (name, type) {
    jQuery.each({
      padding: 'inner' + name,
      content: type,
      '': 'outer' + name
    }, function (defaultExtra, funcName) {
      jQuery.fn[funcName] = function (margin, value) {
        var chainable = arguments.length && (defaultExtra || typeof margin !== 'boolean'), extra = defaultExtra || (margin === true || value === true ? 'margin' : 'border');
        return access(this, function (elem, type, value) {
          var doc;
          if (jQuery.isWindow(elem)) {
            return elem.document.documentElement['client' + name];
          }
          if (elem.nodeType === 9) {
            doc = elem.documentElement;
            return Math.max(elem.body['scroll' + name], doc['scroll' + name], elem.body['offset' + name], doc['offset' + name], doc['client' + name]);
          }
          return value === undefined ? jQuery.css(elem, type, extra) : jQuery.style(elem, type, value, extra);
        }, type, chainable ? margin : undefined, chainable, null);
      };
    });
  });
  jQuery.fn.size = function () {
    return this.length;
  };
  jQuery.fn.andSelf = jQuery.fn.addBack;
  if (typeof define === 'function' && define.amd) {
    define('jquery', [], function () {
      return jQuery;
    });
  }
  var _jQuery = window.jQuery, _$ = window.$;
  jQuery.noConflict = function (deep) {
    if (window.$ === jQuery) {
      window.$ = _$;
    }
    if (deep && window.jQuery === jQuery) {
      window.jQuery = _jQuery;
    }
    return jQuery;
  };
  if (typeof noGlobal === strundefined) {
    window.jQuery = window.$ = jQuery;
  }
  return jQuery;
}));(function ($, undefined) {
  if ($.rails !== undefined) {
    $.error('jquery-ujs has already been loaded!');
  }
  var rails;
  var $document = $(document);
  $.rails = rails = {
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with], a[data-disable]',
    buttonClickSelector: 'button[data-remote]:not(form button), button[data-confirm]:not(form button)',
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',
    formSubmitSelector: 'form',
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',
    disableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',
    fileInputSelector: 'input[type=file]',
    linkDisableSelector: 'a[data-disable-with], a[data-disable]',
    buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]',
    CSRFProtection: function (xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token)
        xhr.setRequestHeader('X-CSRF-Token', token);
    },
    refreshCSRFTokens: function () {
      var csrfToken = $('meta[name=csrf-token]').attr('content');
      var csrfParam = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrfParam + '"]').val(csrfToken);
    },
    fire: function (obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },
    confirm: function (message) {
      return confirm(message);
    },
    ajax: function (options) {
      return $.ajax(options);
    },
    href: function (element) {
      return element.attr('href');
    },
    handleRemote: function (element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;
      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || $.ajaxSettings && $.ajaxSettings.dataType;
        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params'))
            data = data + '&' + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params'))
            data = data + '&' + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }
        options = {
          type: method || 'GET',
          data: data,
          dataType: dataType,
          beforeSend: function (xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            if (rails.fire(element, 'ajax:beforeSend', [
                xhr,
                settings
              ])) {
              element.trigger('ajax:send', xhr);
            } else {
              return false;
            }
          },
          success: function (data, status, xhr) {
            element.trigger('ajax:success', [
              data,
              status,
              xhr
            ]);
          },
          complete: function (xhr, status) {
            element.trigger('ajax:complete', [
              xhr,
              status
            ]);
          },
          error: function (xhr, status, error) {
            element.trigger('ajax:error', [
              xhr,
              status,
              error
            ]);
          },
          crossDomain: crossDomain
        };
        if (withCredentials) {
          options.xhrFields = { withCredentials: withCredentials };
        }
        if (url) {
          options.url = url;
        }
        return rails.ajax(options);
      } else {
        return false;
      }
    },
    handleMethod: function (link) {
      var href = rails.href(link), method = link.data('method'), target = link.attr('target'), csrfToken = $('meta[name=csrf-token]').attr('content'), csrfParam = $('meta[name=csrf-param]').attr('content'), form = $('<form method="post" action="' + href + '"></form>'), metadataInput = '<input name="_method" value="' + method + '" type="hidden" />';
      if (csrfParam !== undefined && csrfToken !== undefined) {
        metadataInput += '<input name="' + csrfParam + '" value="' + csrfToken + '" type="hidden" />';
      }
      if (target) {
        form.attr('target', target);
      }
      form.hide().append(metadataInput).appendTo('body');
      form.submit();
    },
    formElements: function (form, selector) {
      return form.is('form') ? $(form[0].elements).filter(selector) : form.find(selector);
    },
    disableFormElements: function (form) {
      rails.formElements(form, rails.disableSelector).each(function () {
        rails.disableFormElement($(this));
      });
    },
    disableFormElement: function (element) {
      var method, replacement;
      method = element.is('button') ? 'html' : 'val';
      replacement = element.data('disable-with');
      element.data('ujs:enable-with', element[method]());
      if (replacement !== undefined) {
        element[method](replacement);
      }
      element.prop('disabled', true);
    },
    enableFormElements: function (form) {
      rails.formElements(form, rails.enableSelector).each(function () {
        rails.enableFormElement($(this));
      });
    },
    enableFormElement: function (element) {
      var method = element.is('button') ? 'html' : 'val';
      if (element.data('ujs:enable-with'))
        element[method](element.data('ujs:enable-with'));
      element.prop('disabled', false);
    },
    allowAction: function (element) {
      var message = element.data('confirm'), answer = false, callback;
      if (!message) {
        return true;
      }
      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },
    blankInputs: function (form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck, selector = specifiedSelector || 'input,textarea', allInputs = form.find(selector);
      allInputs.each(function () {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        if (!valueToCheck === !nonBlank) {
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true;
          }
          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },
    nonBlankInputs: function (form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true);
    },
    stopEverything: function (e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },
    disableElement: function (element) {
      var replacement = element.data('disable-with');
      element.data('ujs:enable-with', element.html());
      if (replacement !== undefined) {
        element.html(replacement);
      }
      element.bind('click.railsDisable', function (e) {
        return rails.stopEverything(e);
      });
    },
    enableElement: function (element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with'));
        element.removeData('ujs:enable-with');
      }
      element.unbind('click.railsDisable');
    }
  };
  if (rails.fire($document, 'rails:attachBindings')) {
    $.ajaxPrefilter(function (options, originalOptions, xhr) {
      if (!options.crossDomain) {
        rails.CSRFProtection(xhr);
      }
    });
    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function () {
      rails.enableElement($(this));
    });
    $document.delegate(rails.buttonDisableSelector, 'ajax:complete', function () {
      rails.enableFormElement($(this));
    });
    $document.delegate(rails.linkClickSelector, 'click.rails', function (e) {
      var link = $(this), method = link.data('method'), data = link.data('params'), metaClick = e.metaKey || e.ctrlKey;
      if (!rails.allowAction(link))
        return rails.stopEverything(e);
      if (!metaClick && link.is(rails.linkDisableSelector))
        rails.disableElement(link);
      if (link.data('remote') !== undefined) {
        if (metaClick && (!method || method === 'GET') && !data) {
          return true;
        }
        var handleRemote = rails.handleRemote(link);
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error(function () {
            rails.enableElement(link);
          });
        }
        return false;
      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });
    $document.delegate(rails.buttonClickSelector, 'click.rails', function (e) {
      var button = $(this);
      if (!rails.allowAction(button))
        return rails.stopEverything(e);
      if (button.is(rails.buttonDisableSelector))
        rails.disableFormElement(button);
      var handleRemote = rails.handleRemote(button);
      if (handleRemote === false) {
        rails.enableFormElement(button);
      } else {
        handleRemote.error(function () {
          rails.enableFormElement(button);
        });
      }
      return false;
    });
    $document.delegate(rails.inputChangeSelector, 'change.rails', function (e) {
      var link = $(this);
      if (!rails.allowAction(link))
        return rails.stopEverything(e);
      rails.handleRemote(link);
      return false;
    });
    $document.delegate(rails.formSubmitSelector, 'submit.rails', function (e) {
      var form = $(this), remote = form.data('remote') !== undefined, blankRequiredInputs, nonBlankFileInputs;
      if (!rails.allowAction(form))
        return rails.stopEverything(e);
      if (form.attr('novalidate') == undefined) {
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector);
        if (blankRequiredInputs && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
          return rails.stopEverything(e);
        }
      }
      if (remote) {
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);
        if (nonBlankFileInputs) {
          setTimeout(function () {
            rails.disableFormElements(form);
          }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);
          if (!aborted) {
            setTimeout(function () {
              rails.enableFormElements(form);
            }, 13);
          }
          return aborted;
        }
        rails.handleRemote(form);
        return false;
      } else {
        setTimeout(function () {
          rails.disableFormElements(form);
        }, 13);
      }
    });
    $document.delegate(rails.formInputClickSelector, 'click.rails', function (event) {
      var button = $(this);
      if (!rails.allowAction(button))
        return rails.stopEverything(event);
      var name = button.attr('name'), data = name ? {
          name: name,
          value: button.val()
        } : null;
      button.closest('form').data('ujs:submit-button', data);
    });
    $document.delegate(rails.formSubmitSelector, 'ajax:send.rails', function (event) {
      if (this == event.target)
        rails.disableFormElements($(this));
    });
    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function (event) {
      if (this == event.target)
        rails.enableFormElements($(this));
    });
    $(function () {
      rails.refreshCSRFTokens();
    });
  }
}(jQuery));(function ($, window, document, undefined) {
  'use strict';
  var header_helpers = function (class_array) {
    var i = class_array.length;
    var head = $('head');
    while (i--) {
      if (head.has('.' + class_array[i]).length === 0) {
        head.append('<meta class="' + class_array[i] + '" />');
      }
    }
  };
  header_helpers([
    'foundation-mq-small',
    'foundation-mq-medium',
    'foundation-mq-large',
    'foundation-mq-xlarge',
    'foundation-mq-xxlarge',
    'foundation-data-attribute-namespace'
  ]);
  $(function () {
    if (typeof FastClick !== 'undefined') {
      if (typeof document.body !== 'undefined') {
        FastClick.attach(document.body);
      }
    }
  });
  var S = function (selector, context) {
    if (typeof selector === 'string') {
      if (context) {
        var cont;
        if (context.jquery) {
          cont = context[0];
          if (!cont)
            return context;
        } else {
          cont = context;
        }
        return $(cont.querySelectorAll(selector));
      }
      return $(document.querySelectorAll(selector));
    }
    return $(selector, context);
  };
  var attr_name = function (init) {
    var arr = [];
    if (!init)
      arr.push('data');
    if (this.namespace.length > 0)
      arr.push(this.namespace);
    arr.push(this.name);
    return arr.join('-');
  };
  var add_namespace = function (str) {
    var parts = str.split('-'), i = parts.length, arr = [];
    while (i--) {
      if (i !== 0) {
        arr.push(parts[i]);
      } else {
        if (this.namespace.length > 0) {
          arr.push(this.namespace, parts[i]);
        } else {
          arr.push(parts[i]);
        }
      }
    }
    return arr.reverse().join('-');
  };
  var bindings = function (method, options) {
    var self = this, should_bind_events = !S(this).data(this.attr_name(true));
    if (S(this.scope).is('[' + this.attr_name() + ']')) {
      S(this.scope).data(this.attr_name(true) + '-init', $.extend({}, this.settings, options || method, this.data_options(S(this.scope))));
      if (should_bind_events) {
        this.events(this.scope);
      }
    } else {
      S('[' + this.attr_name() + ']', this.scope).each(function () {
        var should_bind_events = !S(this).data(self.attr_name(true) + '-init');
        S(this).data(self.attr_name(true) + '-init', $.extend({}, self.settings, options || method, self.data_options(S(this))));
        if (should_bind_events) {
          self.events(this);
        }
      });
    }
    if (typeof method === 'string') {
      return this[method].call(this, options);
    }
  };
  var single_image_loaded = function (image, callback) {
    function loaded() {
      callback(image[0]);
    }
    function bindLoad() {
      this.one('load', loaded);
      if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
        var src = this.attr('src'), param = src.match(/\?/) ? '&' : '?';
        param += 'random=' + new Date().getTime();
        this.attr('src', src + param);
      }
    }
    if (!image.attr('src')) {
      loaded();
      return;
    }
    if (image[0].complete || image[0].readyState === 4) {
      loaded();
    } else {
      bindLoad.call(image);
    }
  };
  window.matchMedia = window.matchMedia || function (doc) {
    'use strict';
    var bool, docElem = doc.documentElement, refNode = docElem.firstElementChild || docElem.firstChild, fakeBody = doc.createElement('body'), div = doc.createElement('div');
    div.id = 'mq-test-1';
    div.style.cssText = 'position:absolute;top:-100em';
    fakeBody.style.background = 'none';
    fakeBody.appendChild(div);
    return function (q) {
      div.innerHTML = '&shy;<style media="' + q + '"> #mq-test-1 { width: 42px; }</style>';
      docElem.insertBefore(fakeBody, refNode);
      bool = div.offsetWidth === 42;
      docElem.removeChild(fakeBody);
      return {
        matches: bool,
        media: q
      };
    };
  }(document);
  (function ($) {
    var animating, lastTime = 0, vendors = [
        'webkit',
        'moz'
      ], requestAnimationFrame = window.requestAnimationFrame, cancelAnimationFrame = window.cancelAnimationFrame, jqueryFxAvailable = 'undefined' !== typeof jQuery.fx;
    for (; lastTime < vendors.length && !requestAnimationFrame; lastTime++) {
      requestAnimationFrame = window[vendors[lastTime] + 'RequestAnimationFrame'];
      cancelAnimationFrame = cancelAnimationFrame || window[vendors[lastTime] + 'CancelAnimationFrame'] || window[vendors[lastTime] + 'CancelRequestAnimationFrame'];
    }
    function raf() {
      if (animating) {
        requestAnimationFrame(raf);
        if (jqueryFxAvailable) {
          jQuery.fx.tick();
        }
      }
    }
    if (requestAnimationFrame) {
      window.requestAnimationFrame = requestAnimationFrame;
      window.cancelAnimationFrame = cancelAnimationFrame;
      if (jqueryFxAvailable) {
        jQuery.fx.timer = function (timer) {
          if (timer() && jQuery.timers.push(timer) && !animating) {
            animating = true;
            raf();
          }
        };
        jQuery.fx.stop = function () {
          animating = false;
        };
      }
    } else {
      window.requestAnimationFrame = function (callback) {
        var currTime = new Date().getTime(), timeToCall = Math.max(0, 16 - (currTime - lastTime)), id = window.setTimeout(function () {
            callback(currTime + timeToCall);
          }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
    }
  }(jQuery));
  function removeQuotes(string) {
    if (typeof string === 'string' || string instanceof String) {
      string = string.replace(/^['\\/"]+|(;\s?})+|['\\/"]+$/g, '');
    }
    return string;
  }
  window.Foundation = {
    name: 'Foundation',
    version: '5.4.5',
    media_queries: {
      small: S('.foundation-mq-small').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      medium: S('.foundation-mq-medium').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      large: S('.foundation-mq-large').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      xlarge: S('.foundation-mq-xlarge').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      xxlarge: S('.foundation-mq-xxlarge').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, '')
    },
    stylesheet: $('<style></style>').appendTo('head')[0].sheet,
    global: { namespace: undefined },
    init: function (scope, libraries, method, options, response) {
      var args = [
          scope,
          method,
          options,
          response
        ], responses = [];
      this.rtl = /rtl/i.test(S('html').attr('dir'));
      this.scope = scope || this.scope;
      this.set_namespace();
      if (libraries && typeof libraries === 'string' && !/reflow/i.test(libraries)) {
        if (this.libs.hasOwnProperty(libraries)) {
          responses.push(this.init_lib(libraries, args));
        }
      } else {
        for (var lib in this.libs) {
          responses.push(this.init_lib(lib, libraries));
        }
      }
      S(window).load(function () {
        S(window).trigger('resize.fndtn.clearing').trigger('resize.fndtn.dropdown').trigger('resize.fndtn.equalizer').trigger('resize.fndtn.interchange').trigger('resize.fndtn.joyride').trigger('resize.fndtn.magellan').trigger('resize.fndtn.topbar').trigger('resize.fndtn.slider');
      });
      return scope;
    },
    init_lib: function (lib, args) {
      if (this.libs.hasOwnProperty(lib)) {
        this.patch(this.libs[lib]);
        if (args && args.hasOwnProperty(lib)) {
          if (typeof this.libs[lib].settings !== 'undefined') {
            $.extend(true, this.libs[lib].settings, args[lib]);
          } else if (typeof this.libs[lib].defaults !== 'undefined') {
            $.extend(true, this.libs[lib].defaults, args[lib]);
          }
          return this.libs[lib].init.apply(this.libs[lib], [
            this.scope,
            args[lib]
          ]);
        }
        args = args instanceof Array ? args : new Array(args);
        return this.libs[lib].init.apply(this.libs[lib], args);
      }
      return function () {
      };
    },
    patch: function (lib) {
      lib.scope = this.scope;
      lib.namespace = this.global.namespace;
      lib.rtl = this.rtl;
      lib['data_options'] = this.utils.data_options;
      lib['attr_name'] = attr_name;
      lib['add_namespace'] = add_namespace;
      lib['bindings'] = bindings;
      lib['S'] = this.utils.S;
    },
    inherit: function (scope, methods) {
      var methods_arr = methods.split(' '), i = methods_arr.length;
      while (i--) {
        if (this.utils.hasOwnProperty(methods_arr[i])) {
          scope[methods_arr[i]] = this.utils[methods_arr[i]];
        }
      }
    },
    set_namespace: function () {
      var namespace = this.global.namespace === undefined ? $('.foundation-data-attribute-namespace').css('font-family') : this.global.namespace;
      this.global.namespace = namespace === undefined || /false/i.test(namespace) ? '' : namespace;
    },
    libs: {},
    utils: {
      S: S,
      throttle: function (func, delay) {
        var timer = null;
        return function () {
          var context = this, args = arguments;
          if (timer == null) {
            timer = setTimeout(function () {
              func.apply(context, args);
              timer = null;
            }, delay);
          }
        };
      },
      debounce: function (func, delay, immediate) {
        var timeout, result;
        return function () {
          var context = this, args = arguments;
          var later = function () {
            timeout = null;
            if (!immediate)
              result = func.apply(context, args);
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, delay);
          if (callNow)
            result = func.apply(context, args);
          return result;
        };
      },
      data_options: function (el, data_attr_name) {
        data_attr_name = data_attr_name || 'options';
        var opts = {}, ii, p, opts_arr, data_options = function (el) {
            var namespace = Foundation.global.namespace;
            if (namespace.length > 0) {
              return el.data(namespace + '-' + data_attr_name);
            }
            return el.data(data_attr_name);
          };
        var cached_options = data_options(el);
        if (typeof cached_options === 'object') {
          return cached_options;
        }
        opts_arr = (cached_options || ':').split(';');
        ii = opts_arr.length;
        function isNumber(o) {
          return !isNaN(o - 0) && o !== null && o !== '' && o !== false && o !== true;
        }
        function trim(str) {
          if (typeof str === 'string')
            return $.trim(str);
          return str;
        }
        while (ii--) {
          p = opts_arr[ii].split(':');
          p = [
            p[0],
            p.slice(1).join(':')
          ];
          if (/true/i.test(p[1]))
            p[1] = true;
          if (/false/i.test(p[1]))
            p[1] = false;
          if (isNumber(p[1])) {
            if (p[1].indexOf('.') === -1) {
              p[1] = parseInt(p[1], 10);
            } else {
              p[1] = parseFloat(p[1]);
            }
          }
          if (p.length === 2 && p[0].length > 0) {
            opts[trim(p[0])] = trim(p[1]);
          }
        }
        return opts;
      },
      register_media: function (media, media_class) {
        if (Foundation.media_queries[media] === undefined) {
          $('head').append('<meta class="' + media_class + '"/>');
          Foundation.media_queries[media] = removeQuotes($('.' + media_class).css('font-family'));
        }
      },
      add_custom_rule: function (rule, media) {
        if (media === undefined && Foundation.stylesheet) {
          Foundation.stylesheet.insertRule(rule, Foundation.stylesheet.cssRules.length);
        } else {
          var query = Foundation.media_queries[media];
          if (query !== undefined) {
            Foundation.stylesheet.insertRule('@media ' + Foundation.media_queries[media] + '{ ' + rule + ' }');
          }
        }
      },
      image_loaded: function (images, callback) {
        var self = this, unloaded = images.length;
        if (unloaded === 0) {
          callback(images);
        }
        images.each(function () {
          single_image_loaded(self.S(this), function () {
            unloaded -= 1;
            if (unloaded === 0) {
              callback(images);
            }
          });
        });
      },
      random_str: function () {
        if (!this.fidx)
          this.fidx = 0;
        this.prefix = this.prefix || [
          this.name || 'F',
          (+new Date()).toString(36)
        ].join('-');
        return this.prefix + (this.fidx++).toString(36);
      }
    }
  };
  $.fn.foundation = function () {
    var args = Array.prototype.slice.call(arguments, 0);
    return this.each(function () {
      Foundation.init.apply(Foundation, [this].concat(args));
      return this;
    });
  };
}(jQuery, window, window.document));;
(function ($, window, document, undefined) {
  'use strict';
  Foundation.libs.abide = {
    name: 'abide',
    version: '5.4.5',
    settings: {
      live_validate: true,
      focus_on_invalid: true,
      error_labels: true,
      timeout: 1000,
      patterns: {
        alpha: /^[a-zA-Z]+$/,
        alpha_numeric: /^[a-zA-Z0-9]+$/,
        integer: /^[-+]?\d+$/,
        number: /^[-+]?\d*(?:[\.\,]\d+)?$/,
        card: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
        cvv: /^([0-9]){3,4}$/,
        email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,
        url: /^(https?|ftp|file|ssh):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/,
        domain: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/,
        datetime: /^([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))$/,
        date: /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))$/,
        time: /^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}$/,
        dateISO: /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,
        month_day_year: /^(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.]\d{4}$/,
        day_month_year: /^(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.]\d{4}$/,
        color: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
      },
      validators: {
        equalTo: function (el, required, parent) {
          var from = document.getElementById(el.getAttribute(this.add_namespace('data-equalto'))).value, to = el.value, valid = from === to;
          return valid;
        }
      }
    },
    timer: null,
    init: function (scope, method, options) {
      this.bindings(method, options);
    },
    events: function (scope) {
      var self = this, form = self.S(scope).attr('novalidate', 'novalidate'), settings = form.data(this.attr_name(true) + '-init') || {};
      this.invalid_attr = this.add_namespace('data-invalid');
      form.off('.abide').on('submit.fndtn.abide validate.fndtn.abide', function (e) {
        var is_ajax = /ajax/i.test(self.S(this).attr(self.attr_name()));
        return self.validate(self.S(this).find('input, textarea, select').get(), e, is_ajax);
      }).on('reset', function () {
        return self.reset($(this));
      }).find('input, textarea, select').off('.abide').on('blur.fndtn.abide change.fndtn.abide', function (e) {
        self.validate([this], e);
      }).on('keydown.fndtn.abide', function (e) {
        if (settings.live_validate === true) {
          clearTimeout(self.timer);
          self.timer = setTimeout(function () {
            self.validate([this], e);
          }.bind(this), settings.timeout);
        }
      });
    },
    reset: function (form) {
      form.removeAttr(this.invalid_attr);
      $(this.invalid_attr, form).removeAttr(this.invalid_attr);
      $('.error', form).not('small').removeClass('error');
    },
    validate: function (els, e, is_ajax) {
      var validations = this.parse_patterns(els), validation_count = validations.length, form = this.S(els[0]).closest('form'), submit_event = /submit/.test(e.type);
      for (var i = 0; i < validation_count; i++) {
        if (!validations[i] && (submit_event || is_ajax)) {
          if (this.settings.focus_on_invalid)
            els[i].focus();
          form.trigger('invalid');
          this.S(els[i]).closest('form').attr(this.invalid_attr, '');
          return false;
        }
      }
      if (submit_event || is_ajax) {
        form.trigger('valid');
      }
      form.removeAttr(this.invalid_attr);
      if (is_ajax)
        return false;
      return true;
    },
    parse_patterns: function (els) {
      var i = els.length, el_patterns = [];
      while (i--) {
        el_patterns.push(this.pattern(els[i]));
      }
      return this.check_validation_and_apply_styles(el_patterns);
    },
    pattern: function (el) {
      var type = el.getAttribute('type'), required = typeof el.getAttribute('required') === 'string';
      var pattern = el.getAttribute('pattern') || '';
      if (this.settings.patterns.hasOwnProperty(pattern) && pattern.length > 0) {
        return [
          el,
          this.settings.patterns[pattern],
          required
        ];
      } else if (pattern.length > 0) {
        return [
          el,
          new RegExp(pattern),
          required
        ];
      }
      if (this.settings.patterns.hasOwnProperty(type)) {
        return [
          el,
          this.settings.patterns[type],
          required
        ];
      }
      pattern = /.*/;
      return [
        el,
        pattern,
        required
      ];
    },
    check_validation_and_apply_styles: function (el_patterns) {
      var i = el_patterns.length, validations = [], form = this.S(el_patterns[0][0]).closest('[data-' + this.attr_name(true) + ']'), settings = form.data(this.attr_name(true) + '-init') || {};
      while (i--) {
        var el = el_patterns[i][0], required = el_patterns[i][2], value = el.value.trim(), direct_parent = this.S(el).parent(), validator = el.getAttribute(this.add_namespace('data-abide-validator')), is_radio = el.type === 'radio', is_checkbox = el.type === 'checkbox', label = this.S('label[for="' + el.getAttribute('id') + '"]'), valid_length = required ? el.value.length > 0 : true, el_validations = [];
        var parent, valid;
        if (el.getAttribute(this.add_namespace('data-equalto'))) {
          validator = 'equalTo';
        }
        if (!direct_parent.is('label')) {
          parent = direct_parent;
        } else {
          parent = direct_parent.parent();
        }
        if (validator) {
          valid = this.settings.validators[validator].apply(this, [
            el,
            required,
            parent
          ]);
          el_validations.push(valid);
        }
        if (is_radio && required) {
          el_validations.push(this.valid_radio(el, required));
        } else if (is_checkbox && required) {
          el_validations.push(this.valid_checkbox(el, required));
        } else {
          if (el_patterns[i][1].test(value) && valid_length || !required && el.value.length < 1 || $(el).attr('disabled')) {
            el_validations.push(true);
          } else {
            el_validations.push(false);
          }
          el_validations = [el_validations.every(function (valid) {
              return valid;
            })];
          if (el_validations[0]) {
            this.S(el).removeAttr(this.invalid_attr);
            el.setAttribute('aria-invalid', 'false');
            el.removeAttribute('aria-describedby');
            parent.removeClass('error');
            if (label.length > 0 && this.settings.error_labels) {
              label.removeClass('error').removeAttr('role');
            }
            $(el).triggerHandler('valid');
          } else {
            this.S(el).attr(this.invalid_attr, '');
            el.setAttribute('aria-invalid', 'true');
            var errorElem = parent.find('small.error, span.error');
            var errorID = errorElem.length > 0 ? errorElem[0].id : '';
            if (errorID.length > 0)
              el.setAttribute('aria-describedby', errorID);
            parent.addClass('error');
            if (label.length > 0 && this.settings.error_labels) {
              label.addClass('error').attr('role', 'alert');
            }
            $(el).triggerHandler('invalid');
          }
          validations.push(el_validations[0]);
        }
      }
      validations = [validations.every(function (valid) {
          return valid;
        })];
      return validations;
    },
    valid_checkbox: function (el, required) {
      var el = this.S(el), valid = el.is(':checked') || !required;
      if (valid) {
        el.removeAttr(this.invalid_attr).parent().removeClass('error');
      } else {
        el.attr(this.invalid_attr, '').parent().addClass('error');
      }
      return valid;
    },
    valid_radio: function (el, required) {
      var name = el.getAttribute('name'), group = this.S(el).closest('[data-' + this.attr_name(true) + ']').find('[name=\'' + name + '\']'), count = group.length, valid = false;
      for (var i = 0; i < count; i++) {
        if (group[i].checked)
          valid = true;
      }
      for (var i = 0; i < count; i++) {
        if (valid) {
          this.S(group[i]).removeAttr(this.invalid_attr).parent().removeClass('error');
        } else {
          this.S(group[i]).attr(this.invalid_attr, '').parent().addClass('error');
        }
      }
      return valid;
    },
    valid_equal: function (el, required, parent) {
      var from = document.getElementById(el.getAttribute(this.add_namespace('data-equalto'))).value, to = el.value, valid = from === to;
      if (valid) {
        this.S(el).removeAttr(this.invalid_attr);
        parent.removeClass('error');
        if (label.length > 0 && settings.error_labels)
          label.removeClass('error');
      } else {
        this.S(el).attr(this.invalid_attr, '');
        parent.addClass('error');
        if (label.length > 0 && settings.error_labels)
          label.addClass('error');
      }
      return valid;
    },
    valid_oneof: function (el, required, parent, doNotValidateOthers) {
      var el = this.S(el), others = this.S('[' + this.add_namespace('data-oneof') + ']'), valid = others.filter(':checked').length > 0;
      if (valid) {
        el.removeAttr(this.invalid_attr).parent().removeClass('error');
      } else {
        el.attr(this.invalid_attr, '').parent().addClass('error');
      }
      if (!doNotValidateOthers) {
        var _this = this;
        others.each(function () {
          _this.valid_oneof.call(_this, this, null, null, true);
        });
      }
      return valid;
    }
  };
}(jQuery, window, window.document));;
(function ($, window, document, undefined) {
  'use strict';
  Foundation.libs.accordion = {
    name: 'accordion',
    version: '5.4.5',
    settings: {
      active_class: 'active',
      multi_expand: false,
      toggleable: true,
      callback: function () {
      }
    },
    init: function (scope, method, options) {
      this.bindings(method, options);
    },
    events: function () {
      var self = this;
      var S = this.S;
      S(this.scope).off('.fndtn.accordion').on('click.fndtn.accordion', '[' + this.attr_name() + '] > dd > a', function (e) {
        var accordion = S(this).closest('[' + self.attr_name() + ']'), groupSelector = self.attr_name() + '=' + accordion.attr(self.attr_name()), settings = accordion.data(self.attr_name(true) + '-init'), target = S('#' + this.href.split('#')[1]), aunts = $('> dd', accordion), siblings = aunts.children('.content'), active_content = siblings.filter('.' + settings.active_class);
        e.preventDefault();
        if (accordion.attr(self.attr_name())) {
          siblings = siblings.add('[' + groupSelector + '] dd > .content');
          aunts = aunts.add('[' + groupSelector + '] dd');
        }
        if (settings.toggleable && target.is(active_content)) {
          target.parent('dd').toggleClass(settings.active_class, false);
          target.toggleClass(settings.active_class, false);
          settings.callback(target);
          target.triggerHandler('toggled', [accordion]);
          accordion.triggerHandler('toggled', [target]);
          return;
        }
        if (!settings.multi_expand) {
          siblings.removeClass(settings.active_class);
          aunts.removeClass(settings.active_class);
        }
        target.addClass(settings.active_class).parent().addClass(settings.active_class);
        settings.callback(target);
        target.triggerHandler('toggled', [accordion]);
        accordion.triggerHandler('toggled', [target]);
      });
    },
    off: function () {
    },
    reflow: function () {
    }
  };
}(jQuery, window, window.document));;
(function ($, window, document, undefined) {
  'use strict';
  Foundation.libs.alert = {
    name: 'alert',
    version: '5.4.5',
    settings: {
      callback: function () {
      }
    },
    init: function (scope, method, options) {
      this.bindings(method, options);
    },
    events: function () {
      var self = this, S = this.S;
      $(this.scope).off('.alert').on('click.fndtn.alert', '[' + this.attr_name() + '] .close', function (e) {
        var alertBox = S(this).closest('[' + self.attr_name() + ']'), settings = alertBox.data(self.attr_name(true) + '-init') || self.settings;
        e.preventDefault();
        if (Modernizr.csstransitions) {
          alertBox.addClass('alert-close');
          alertBox.on('transitionend webkitTransitionEnd oTransitionEnd', function (e) {
            S(this).trigger('close').trigger('close.fndtn.alert').remove();
            settings.callback();
          });
        } else {
          alertBox.fadeOut(300, function () {
            S(this).trigger('close').trigger('close.fndtn.alert').remove();
            settings.callback();
          });
        }
      });
    },
    reflow: function () {
    }
  };
}(jQuery, window, window.document));;
(function ($, window, document, undefined) {
  'use strict';
  Foundation.libs.clearing = {
    name: 'clearing',
    version: '5.4.5',
    settings: {
      templates: { viewing: '<a href="#" class="clearing-close">&times;</a>' + '<div class="visible-img" style="display: none"><div class="clearing-touch-label"></div><img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" alt="" />' + '<p class="clearing-caption"></p><a href="#" class="clearing-main-prev"><span></span></a>' + '<a href="#" class="clearing-main-next"><span></span></a></div>' },
      close_selectors: '.clearing-close, div.clearing-blackout',
      open_selectors: '',
      skip_selector: '',
      touch_label: '',
      init: false,
      locked: false
    },
    init: function (scope, method, options) {
      var self = this;
      Foundation.inherit(this, 'throttle image_loaded');
      this.bindings(method, options);
      if (self.S(this.scope).is('[' + this.attr_name() + ']')) {
        this.assemble(self.S('li', this.scope));
      } else {
        self.S('[' + this.attr_name() + ']', this.scope).each(function () {
          self.assemble(self.S('li', this));
        });
      }
    },
    events: function (scope) {
      var self = this, S = self.S, $scroll_container = $('.scroll-container');
      if ($scroll_container.length > 0) {
        this.scope = $scroll_container;
      }
      S(this.scope).off('.clearing').on('click.fndtn.clearing', 'ul[' + this.attr_name() + '] li ' + this.settings.open_selectors, function (e, current, target) {
        var current = current || S(this), target = target || current, next = current.next('li'), settings = current.closest('[' + self.attr_name() + ']').data(self.attr_name(true) + '-init'), image = S(e.target);
        e.preventDefault();
        if (!settings) {
          self.init();
          settings = current.closest('[' + self.attr_name() + ']').data(self.attr_name(true) + '-init');
        }
        if (target.hasClass('visible') && current[0] === target[0] && next.length > 0 && self.is_open(current)) {
          target = next;
          image = S('img', target);
        }
        self.open(image, current, target);
        self.update_paddles(target);
      }).on('click.fndtn.clearing', '.clearing-main-next', function (e) {
        self.nav(e, 'next');
      }).on('click.fndtn.clearing', '.clearing-main-prev', function (e) {
        self.nav(e, 'prev');
      }).on('click.fndtn.clearing', this.settings.close_selectors, function (e) {
        Foundation.libs.clearing.close(e, this);
      });
      $(document).on('keydown.fndtn.clearing', function (e) {
        self.keydown(e);
      });
      S(window).off('.clearing').on('resize.fndtn.clearing', function () {
        self.resize();
      });
      this.swipe_events(scope);
    },
    swipe_events: function (scope) {
      var self = this, S = self.S;
      S(this.scope).on('touchstart.fndtn.clearing', '.visible-img', function (e) {
        if (!e.touches) {
          e = e.originalEvent;
        }
        var data = {
            start_page_x: e.touches[0].pageX,
            start_page_y: e.touches[0].pageY,
            start_time: new Date().getTime(),
            delta_x: 0,
            is_scrolling: undefined
          };
        S(this).data('swipe-transition', data);
        e.stopPropagation();
      }).on('touchmove.fndtn.clearing', '.visible-img', function (e) {
        if (!e.touches) {
          e = e.originalEvent;
        }
        if (e.touches.length > 1 || e.scale && e.scale !== 1)
          return;
        var data = S(this).data('swipe-transition');
        if (typeof data === 'undefined') {
          data = {};
        }
        data.delta_x = e.touches[0].pageX - data.start_page_x;
        if (Foundation.rtl) {
          data.delta_x = -data.delta_x;
        }
        if (typeof data.is_scrolling === 'undefined') {
          data.is_scrolling = !!(data.is_scrolling || Math.abs(data.delta_x) < Math.abs(e.touches[0].pageY - data.start_page_y));
        }
        if (!data.is_scrolling && !data.active) {
          e.preventDefault();
          var direction = data.delta_x < 0 ? 'next' : 'prev';
          data.active = true;
          self.nav(e, direction);
        }
      }).on('touchend.fndtn.clearing', '.visible-img', function (e) {
        S(this).data('swipe-transition', {});
        e.stopPropagation();
      });
    },
    assemble: function ($li) {
      var $el = $li.parent();
      if ($el.parent().hasClass('carousel')) {
        return;
      }
      $el.after('<div id="foundationClearingHolder"></div>');
      var grid = $el.detach(), grid_outerHTML = '';
      if (grid[0] == null) {
        return;
      } else {
        grid_outerHTML = grid[0].outerHTML;
      }
      var holder = this.S('#foundationClearingHolder'), settings = $el.data(this.attr_name(true) + '-init'), data = {
          grid: '<div class="carousel">' + grid_outerHTML + '</div>',
          viewing: settings.templates.viewing
        }, wrapper = '<div class="clearing-assembled"><div>' + data.viewing + data.grid + '</div></div>', touch_label = this.settings.touch_label;
      if (Modernizr.touch) {
        wrapper = $(wrapper).find('.clearing-touch-label').html(touch_label).end();
      }
      holder.after(wrapper).remove();
    },
    open: function ($image, current, target) {
      var self = this, body = $(document.body), root = target.closest('.clearing-assembled'), container = self.S('div', root).first(), visible_image = self.S('.visible-img', container), image = self.S('img', visible_image).not($image), label = self.S('.clearing-touch-label', container), error = false;
      $('body').on('touchmove', function (e) {
        e.preventDefault();
      });
      image.error(function () {
        error = true;
      });
      function startLoad() {
        setTimeout(function () {
          this.image_loaded(image, function () {
            if (image.outerWidth() === 1 && !error) {
              startLoad.call(this);
            } else {
              cb.call(this, image);
            }
          }.bind(this));
        }.bind(this), 100);
      }
      function cb(image) {
        var $image = $(image);
        $image.css('visibility', 'visible');
        body.css('overflow', 'hidden');
        root.addClass('clearing-blackout');
        container.addClass('clearing-container');
        visible_image.show();
        this.fix_height(target).caption(self.S('.clearing-caption', visible_image), self.S('img', target)).center_and_label(image, label).shift(current, target, function () {
          target.closest('li').siblings().removeClass('visible');
          target.closest('li').addClass('visible');
        });
        visible_image.trigger('opened.fndtn.clearing');
      }
      if (!this.locked()) {
        visible_image.trigger('open.fndtn.clearing');
        image.attr('src', this.load($image)).css('visibility', 'hidden');
        startLoad.call(this);
      }
    },
    close: function (e, el) {
      e.preventDefault();
      var root = function (target) {
          if (/blackout/.test(target.selector)) {
            return target;
          } else {
            return target.closest('.clearing-blackout');
          }
        }($(el)), body = $(document.body), container, visible_image;
      if (el === e.target && root) {
        body.css('overflow', '');
        container = $('div', root).first();
        visible_image = $('.visible-img', container);
        visible_image.trigger('close.fndtn.clearing');
        this.settings.prev_index = 0;
        $('ul[' + this.attr_name() + ']', root).attr('style', '').closest('.clearing-blackout').removeClass('clearing-blackout');
        container.removeClass('clearing-container');
        visible_image.hide();
        visible_image.trigger('closed.fndtn.clearing');
      }
      $('body').off('touchmove');
      return false;
    },
    is_open: function (current) {
      return current.parent().prop('style').length > 0;
    },
    keydown: function (e) {
      var clearing = $('.clearing-blackout ul[' + this.attr_name() + ']'), NEXT_KEY = this.rtl ? 37 : 39, PREV_KEY = this.rtl ? 39 : 37, ESC_KEY = 27;
      if (e.which === NEXT_KEY)
        this.go(clearing, 'next');
      if (e.which === PREV_KEY)
        this.go(clearing, 'prev');
      if (e.which === ESC_KEY)
        this.S('a.clearing-close').trigger('click').trigger('click.fndtn.clearing');
    },
    nav: function (e, direction) {
      var clearing = $('ul[' + this.attr_name() + ']', '.clearing-blackout');
      e.preventDefault();
      this.go(clearing, direction);
    },
    resize: function () {
      var image = $('img', '.clearing-blackout .visible-img'), label = $('.clearing-touch-label', '.clearing-blackout');
      if (image.length) {
        this.center_and_label(image, label);
        image.trigger('resized.fndtn.clearing');
      }
    },
    fix_height: function (target) {
      var lis = target.parent().children(), self = this;
      lis.each(function () {
        var li = self.S(this), image = li.find('img');
        if (li.height() > image.outerHeight()) {
          li.addClass('fix-height');
        }
      }).closest('ul').width(lis.length * 100 + '%');
      return this;
    },
    update_paddles: function (target) {
      target = target.closest('li');
      var visible_image = target.closest('.carousel').siblings('.visible-img');
      if (target.next().length > 0) {
        this.S('.clearing-main-next', visible_image).removeClass('disabled');
      } else {
        this.S('.clearing-main-next', visible_image).addClass('disabled');
      }
      if (target.prev().length > 0) {
        this.S('.clearing-main-prev', visible_image).removeClass('disabled');
      } else {
        this.S('.clearing-main-prev', visible_image).addClass('disabled');
      }
    },
    center_and_label: function (target, label) {
      if (!this.rtl) {
        target.css({
          marginLeft: -(target.outerWidth() / 2),
          marginTop: -(target.outerHeight() / 2)
        });
        if (label.length > 0) {
          label.css({
            marginLeft: -(label.outerWidth() / 2),
            marginTop: -(target.outerHeight() / 2) - label.outerHeight() - 10
          });
        }
      } else {
        target.css({
          marginRight: -(target.outerWidth() / 2),
          marginTop: -(target.outerHeight() / 2),
          left: 'auto',
          right: '50%'
        });
        if (label.length > 0) {
          label.css({
            marginRight: -(label.outerWidth() / 2),
            marginTop: -(target.outerHeight() / 2) - label.outerHeight() - 10,
            left: 'auto',
            right: '50%'
          });
        }
      }
      return this;
    },
    load: function ($image) {
      var href;
      if ($image[0].nodeName === 'A') {
        href = $image.attr('href');
      } else {
        href = $image.parent().attr('href');
      }
      this.preload($image);
      if (href)
        return href;
      return $image.attr('src');
    },
    preload: function ($image) {
      this.img($image.closest('li').next()).img($image.closest('li').prev());
    },
    img: function (img) {
      if (img.length) {
        var new_img = new Image(), new_a = this.S('a', img);
        if (new_a.length) {
          new_img.src = new_a.attr('href');
        } else {
          new_img.src = this.S('img', img).attr('src');
        }
      }
      return this;
    },
    caption: function (container, $image) {
      var caption = $image.attr('data-caption');
      if (caption) {
        container.html(caption).show();
      } else {
        container.text('').hide();
      }
      return this;
    },
    go: function ($ul, direction) {
      var current = this.S('.visible', $ul), target = current[direction]();
      if (this.settings.skip_selector && target.find(this.settings.skip_selector).length != 0) {
        target = target[direction]();
      }
      if (target.length) {
        this.S('img', target).trigger('click', [
          current,
          target
        ]).trigger('click.fndtn.clearing', [
          current,
          target
        ]).trigger('change.fndtn.clearing');
      }
    },
    shift: function (current, target, callback) {
      var clearing = target.parent(), old_index = this.settings.prev_index || target.index(), direction = this.direction(clearing, current, target), dir = this.rtl ? 'right' : 'left', left = parseInt(clearing.css('left'), 10), width = target.outerWidth(), skip_shift;
      var dir_obj = {};
      if (target.index() !== old_index && !/skip/.test(direction)) {
        if (/left/.test(direction)) {
          this.lock();
          dir_obj[dir] = left + width;
          clearing.animate(dir_obj, 300, this.unlock());
        } else if (/right/.test(direction)) {
          this.lock();
          dir_obj[dir] = left - width;
          clearing.animate(dir_obj, 300, this.unlock());
        }
      } else if (/skip/.test(direction)) {
        skip_shift = target.index() - this.settings.up_count;
        this.lock();
        if (skip_shift > 0) {
          dir_obj[dir] = -(skip_shift * width);
          clearing.animate(dir_obj, 300, this.unlock());
        } else {
          dir_obj[dir] = 0;
          clearing.animate(dir_obj, 300, this.unlock());
        }
      }
      callback();
    },
    direction: function ($el, current, target) {
      var lis = this.S('li', $el), li_width = lis.outerWidth() + lis.outerWidth() / 4, up_count = Math.floor(this.S('.clearing-container').outerWidth() / li_width) - 1, target_index = lis.index(target), response;
      this.settings.up_count = up_count;
      if (this.adjacent(this.settings.prev_index, target_index)) {
        if (target_index > up_count && target_index > this.settings.prev_index) {
          response = 'right';
        } else if (target_index > up_count - 1 && target_index <= this.settings.prev_index) {
          response = 'left';
        } else {
          response = false;
        }
      } else {
        response = 'skip';
      }
      this.settings.prev_index = target_index;
      return response;
    },
    adjacent: function (current_index, target_index) {
      for (var i = target_index + 1; i >= target_index - 1; i--) {
        if (i === current_index)
          return true;
      }
      return false;
    },
    lock: function () {
      this.settings.locked = true;
    },
    unlock: function () {
      this.settings.locked = false;
    },
    locked: function () {
      return this.settings.locked;
    },
    off: function () {
      this.S(this.scope).off('.fndtn.clearing');
      this.S(window).off('.fndtn.clearing');
    },
    reflow: function () {
      this.init();
    }
  };
}(jQuery, window, window.document));;
(function ($, window, document, undefined) {
  'use strict';
  Foundation.libs.dropdown = {
    name: 'dropdown',
    version: '5.4.5',
    settings: {
      active_class: 'open',
      mega_class: 'mega',
      align: 'bottom',
      is_hover: false,
      opened: function () {
      },
      closed: function () {
      }
    },
    init: function (scope, method, options) {
      Foundation.inherit(this, 'throttle');
      this.bindings(method, options);
    },
    events: function (scope) {
      var self = this, S = self.S;
      S(this.scope).off('.dropdown').on('click.fndtn.dropdown', '[' + this.attr_name() + ']', function (e) {
        var settings = S(this).data(self.attr_name(true) + '-init') || self.settings;
        if (!settings.is_hover || Modernizr.touch) {
          e.preventDefault();
          self.toggle($(this));
        }
      }).on('mouseenter.fndtn.dropdown', '[' + this.attr_name() + '], [' + this.attr_name() + '-content]', function (e) {
        var $this = S(this), dropdown, target;
        clearTimeout(self.timeout);
        if ($this.data(self.data_attr())) {
          dropdown = S('#' + $this.data(self.data_attr()));
          target = $this;
        } else {
          dropdown = $this;
          target = S('[' + self.attr_name() + '=\'' + dropdown.attr('id') + '\']');
        }
        var settings = target.data(self.attr_name(true) + '-init') || self.settings;
        if (S(e.target).data(self.data_attr()) && settings.is_hover) {
          self.closeall.call(self);
        }
        if (settings.is_hover)
          self.open.apply(self, [
            dropdown,
            target
          ]);
      }).on('mouseleave.fndtn.dropdown', '[' + this.attr_name() + '], [' + this.attr_name() + '-content]', function (e) {
        var $this = S(this);
        self.timeout = setTimeout(function () {
          if ($this.data(self.data_attr())) {
            var settings = $this.data(self.data_attr(true) + '-init') || self.settings;
            if (settings.is_hover)
              self.close.call(self, S('#' + $this.data(self.data_attr())));
          } else {
            var target = S('[' + self.attr_name() + '="' + S(this).attr('id') + '"]'), settings = target.data(self.attr_name(true) + '-init') || self.settings;
            if (settings.is_hover)
              self.close.call(self, $this);
          }
        }.bind(this), 150);
      }).on('click.fndtn.dropdown', function (e) {
        var parent = S(e.target).closest('[' + self.attr_name() + '-content]');
        if (S(e.target).closest('[' + self.attr_name() + ']').length > 0) {
          return;
        }
        if (!S(e.target).data('revealId') && (parent.length > 0 && (S(e.target).is('[' + self.attr_name() + '-content]') || $.contains(parent.first()[0], e.target)))) {
          e.stopPropagation();
          return;
        }
        self.close.call(self, S('[' + self.attr_name() + '-content]'));
      }).on('opened.fndtn.dropdown', '[' + self.attr_name() + '-content]', function () {
        self.settings.opened.call(this);
      }).on('closed.fndtn.dropdown', '[' + self.attr_name() + '-content]', function () {
        self.settings.closed.call(this);
      });
      S(window).off('.dropdown').on('resize.fndtn.dropdown', self.throttle(function () {
        self.resize.call(self);
      }, 50));
      this.resize();
    },
    close: function (dropdown) {
      var self = this;
      dropdown.each(function () {
        var original_target = $('[' + self.attr_name() + '=' + dropdown[0].id + ']') || $('aria-controls=' + dropdown[0].id + ']');
        original_target.attr('aria-expanded', 'false');
        if (self.S(this).hasClass(self.settings.active_class)) {
          self.S(this).css(Foundation.rtl ? 'right' : 'left', '-99999px').attr('aria-hidden', 'true').removeClass(self.settings.active_class).prev('[' + self.attr_name() + ']').removeClass(self.settings.active_class).removeData('target');
          self.S(this).trigger('closed').trigger('closed.fndtn.dropdown', [dropdown]);
        }
      });
    },
    closeall: function () {
      var self = this;
      $.each(self.S('[' + this.attr_name() + '-content]'), function () {
        self.close.call(self, self.S(this));
      });
    },
    open: function (dropdown, target) {
      this.css(dropdown.addClass(this.settings.active_class), target);
      dropdown.prev('[' + this.attr_name() + ']').addClass(this.settings.active_class);
      dropdown.data('target', target.get(0)).trigger('opened').trigger('opened.fndtn.dropdown', [
        dropdown,
        target
      ]);
      dropdown.attr('aria-hidden', 'false');
      target.attr('aria-expanded', 'true');
      dropdown.focus();
    },
    data_attr: function () {
      if (this.namespace.length > 0) {
        return this.namespace + '-' + this.name;
      }
      return this.name;
    },
    toggle: function (target) {
      var dropdown = this.S('#' + target.data(this.data_attr()));
      if (dropdown.length === 0) {
        return;
      }
      this.close.call(this, this.S('[' + this.attr_name() + '-content]').not(dropdown));
      if (dropdown.hasClass(this.settings.active_class)) {
        this.close.call(this, dropdown);
        if (dropdown.data('target') !== target.get(0))
          this.open.call(this, dropdown, target);
      } else {
        this.open.call(this, dropdown, target);
      }
    },
    resize: function () {
      var dropdown = this.S('[' + this.attr_name() + '-content].open'), target = this.S('[' + this.attr_name() + '=\'' + dropdown.attr('id') + '\']');
      if (dropdown.length && target.length) {
        this.css(dropdown, target);
      }
    },
    css: function (dropdown, target) {
      var left_offset = Math.max((target.width() - dropdown.width()) / 2, 8), settings = target.data(this.attr_name(true) + '-init') || this.settings;
      this.clear_idx();
      if (this.small()) {
        var p = this.dirs.bottom.call(dropdown, target, settings);
        dropdown.attr('style', '').removeClass('drop-left drop-right drop-top').css({
          position: 'absolute',
          width: '95%',
          'max-width': 'none',
          top: p.top
        });
        dropdown.css(Foundation.rtl ? 'right' : 'left', left_offset);
      } else {
        this.style(dropdown, target, settings);
      }
      return dropdown;
    },
    style: function (dropdown, target, settings) {
      var css = $.extend({ position: 'absolute' }, this.dirs[settings.align].call(dropdown, target, settings));
      dropdown.attr('style', '').css(css);
    },
    dirs: {
      _base: function (t) {
        var o_p = this.offsetParent(), o = o_p.offset(), p = t.offset();
        p.top -= o.top;
        p.left -= o.left;
        return p;
      },
      top: function (t, s) {
        var self = Foundation.libs.dropdown, p = self.dirs._base.call(this, t);
        this.addClass('drop-top');
        if (t.outerWidth() < this.outerWidth() || self.small() || this.hasClass(s.mega_menu)) {
          self.adjust_pip(this, t, s, p);
        }
        if (Foundation.rtl) {
          return {
            left: p.left - this.outerWidth() + t.outerWidth(),
            top: p.top - this.outerHeight()
          };
        }
        return {
          left: p.left,
          top: p.top - this.outerHeight()
        };
      },
      bottom: function (t, s) {
        var self = Foundation.libs.dropdown, p = self.dirs._base.call(this, t);
        if (t.outerWidth() < this.outerWidth() || self.small() || this.hasClass(s.mega_menu)) {
          self.adjust_pip(this, t, s, p);
        }
        if (self.rtl) {
          return {
            left: p.left - this.outerWidth() + t.outerWidth(),
            top: p.top + t.outerHeight()
          };
        }
        return {
          left: p.left,
          top: p.top + t.outerHeight()
        };
      },
      left: function (t, s) {
        var p = Foundation.libs.dropdown.dirs._base.call(this, t);
        this.addClass('drop-left');
        return {
          left: p.left - this.outerWidth(),
          top: p.top
        };
      },
      right: function (t, s) {
        var p = Foundation.libs.dropdown.dirs._base.call(this, t);
        this.addClass('drop-right');
        return {
          left: p.left + t.outerWidth(),
          top: p.top
        };
      }
    },
    adjust_pip: function (dropdown, target, settings, position) {
      var sheet = Foundation.stylesheet, pip_offset_base = 8;
      if (dropdown.hasClass(settings.mega_class)) {
        pip_offset_base = position.left + target.outerWidth() / 2 - 8;
      } else if (this.small()) {
        pip_offset_base += position.left - 8;
      }
      this.rule_idx = sheet.cssRules.length;
      var sel_before = '.f-dropdown.open:before', sel_after = '.f-dropdown.open:after', css_before = 'left: ' + pip_offset_base + 'px;', css_after = 'left: ' + (pip_offset_base - 1) + 'px;';
      if (sheet.insertRule) {
        sheet.insertRule([
          sel_before,
          '{',
          css_before,
          '}'
        ].join(' '), this.rule_idx);
        sheet.insertRule([
          sel_after,
          '{',
          css_after,
          '}'
        ].join(' '), this.rule_idx + 1);
      } else {
        sheet.addRule(sel_before, css_before, this.rule_idx);
        sheet.addRule(sel_after, css_after, this.rule_idx + 1);
      }
    },
    clear_idx: function () {
      var sheet = Foundation.stylesheet;
      if (this.rule_idx) {
        sheet.deleteRule(this.rule_idx);
        sheet.deleteRule(this.rule_idx);
        delete this.rule_idx;
      }
    },
    small: function () {
      return matchMedia(Foundation.media_queries.small).matches && !matchMedia(Foundation.media_queries.medium).matches;
    },
    off: function () {
      this.S(this.scope).off('.fndtn.dropdown');
      this.S('html, body').off('.fndtn.dropdown');
      this.S(window).off('.fndtn.dropdown');
      this.S('[data-dropdown-content]').off('.fndtn.dropdown');
    },
    reflow: function () {
    }
  };
}(jQuery, window, window.document));;
(function ($, window, document, undefined) {
  'use strict';
  Foundation.libs.interchange = {
    name: 'interchange',
    version: '5.4.5',
    cache: {},
    images_loaded: false,
    nodes_loaded: false,
    settings: {
      load_attr: 'interchange',
      named_queries: {
        'default': 'only screen',
        small: Foundation.media_queries.small,
        medium: Foundation.media_queries.medium,
        large: Foundation.media_queries.large,
        xlarge: Foundation.media_queries.xlarge,
        xxlarge: Foundation.media_queries.xxlarge,
        landscape: 'only screen and (orientation: landscape)',
        portrait: 'only screen and (orientation: portrait)',
        retina: 'only screen and (-webkit-min-device-pixel-ratio: 2),' + 'only screen and (min--moz-device-pixel-ratio: 2),' + 'only screen and (-o-min-device-pixel-ratio: 2/1),' + 'only screen and (min-device-pixel-ratio: 2),' + 'only screen and (min-resolution: 192dpi),' + 'only screen and (min-resolution: 2dppx)'
      },
      directives: {
        replace: function (el, path, trigger) {
          if (/IMG/.test(el[0].nodeName)) {
            var orig_path = el[0].src;
            if (new RegExp(path, 'i').test(orig_path))
              return;
            el[0].src = path;
            return trigger(el[0].src);
          }
          var last_path = el.data(this.data_attr + '-last-path'), self = this;
          if (last_path == path)
            return;
          if (/\.(gif|jpg|jpeg|tiff|png)([?#].*)?/i.test(path)) {
            $(el).css('background-image', 'url(' + path + ')');
            el.data('interchange-last-path', path);
            return trigger(path);
          }
          return $.get(path, function (response) {
            el.html(response);
            el.data(self.data_attr + '-last-path', path);
            trigger();
          });
        }
      }
    },
    init: function (scope, method, options) {
      Foundation.inherit(this, 'throttle random_str');
      this.data_attr = this.set_data_attr();
      $.extend(true, this.settings, method, options);
      this.bindings(method, options);
      this.load('images');
      this.load('nodes');
    },
    get_media_hash: function () {
      var mediaHash = '';
      for (var queryName in this.settings.named_queries) {
        mediaHash += matchMedia(this.settings.named_queries[queryName]).matches.toString();
      }
      return mediaHash;
    },
    events: function () {
      var self = this, prevMediaHash;
      $(window).off('.interchange').on('resize.fndtn.interchange', self.throttle(function () {
        var currMediaHash = self.get_media_hash();
        if (currMediaHash !== prevMediaHash) {
          self.resize();
        }
        prevMediaHash = currMediaHash;
      }, 50));
      return this;
    },
    resize: function () {
      var cache = this.cache;
      if (!this.images_loaded || !this.nodes_loaded) {
        setTimeout($.proxy(this.resize, this), 50);
        return;
      }
      for (var uuid in cache) {
        if (cache.hasOwnProperty(uuid)) {
          var passed = this.results(uuid, cache[uuid]);
          if (passed) {
            this.settings.directives[passed.scenario[1]].call(this, passed.el, passed.scenario[0], function () {
              if (arguments[0] instanceof Array) {
                var args = arguments[0];
              } else {
                var args = Array.prototype.slice.call(arguments, 0);
              }
              passed.el.trigger(passed.scenario[1], args);
            });
          }
        }
      }
    },
    results: function (uuid, scenarios) {
      var count = scenarios.length;
      if (count > 0) {
        var el = this.S('[' + this.add_namespace('data-uuid') + '="' + uuid + '"]');
        while (count--) {
          var mq, rule = scenarios[count][2];
          if (this.settings.named_queries.hasOwnProperty(rule)) {
            mq = matchMedia(this.settings.named_queries[rule]);
          } else {
            mq = matchMedia(rule);
          }
          if (mq.matches) {
            return {
              el: el,
              scenario: scenarios[count]
            };
          }
        }
      }
      return false;
    },
    load: function (type, force_update) {
      if (typeof this['cached_' + type] === 'undefined' || force_update) {
        this['update_' + type]();
      }
      return this['cached_' + type];
    },
    update_images: function () {
      var images = this.S('img[' + this.data_attr + ']'), count = images.length, i = count, loaded_count = 0, data_attr = this.data_attr;
      this.cache = {};
      this.cached_images = [];
      this.images_loaded = count === 0;
      while (i--) {
        loaded_count++;
        if (images[i]) {
          var str = images[i].getAttribute(data_attr) || '';
          if (str.length > 0) {
            this.cached_images.push(images[i]);
          }
        }
        if (loaded_count === count) {
          this.images_loaded = true;
          this.enhance('images');
        }
      }
      return this;
    },
    update_nodes: function () {
      var nodes = this.S('[' + this.data_attr + ']').not('img'), count = nodes.length, i = count, loaded_count = 0, data_attr = this.data_attr;
      this.cached_nodes = [];
      this.nodes_loaded = count === 0;
      while (i--) {
        loaded_count++;
        var str = nodes[i].getAttribute(data_attr) || '';
        if (str.length > 0) {
          this.cached_nodes.push(nodes[i]);
        }
        if (loaded_count === count) {
          this.nodes_loaded = true;
          this.enhance('nodes');
        }
      }
      return this;
    },
    enhance: function (type) {
      var i = this['cached_' + type].length;
      while (i--) {
        this.object($(this['cached_' + type][i]));
      }
      return $(window).trigger('resize').trigger('resize.fndtn.interchange');
    },
    convert_directive: function (directive) {
      var trimmed = this.trim(directive);
      if (trimmed.length > 0) {
        return trimmed;
      }
      return 'replace';
    },
    parse_scenario: function (scenario) {
      var directive_match = scenario[0].match(/(.+),\s*(\w+)\s*$/), media_query = scenario[1];
      if (directive_match) {
        var path = directive_match[1], directive = directive_match[2];
      } else {
        var cached_split = scenario[0].split(/,\s*$/), path = cached_split[0], directive = '';
      }
      return [
        this.trim(path),
        this.convert_directive(directive),
        this.trim(media_query)
      ];
    },
    object: function (el) {
      var raw_arr = this.parse_data_attr(el), scenarios = [], i = raw_arr.length;
      if (i > 0) {
        while (i--) {
          var split = raw_arr[i].split(/\((.*?)(\))$/);
          if (split.length > 1) {
            var params = this.parse_scenario(split);
            scenarios.push(params);
          }
        }
      }
      return this.store(el, scenarios);
    },
    store: function (el, scenarios) {
      var uuid = this.random_str(), current_uuid = el.data(this.add_namespace('uuid', true));
      if (this.cache[current_uuid])
        return this.cache[current_uuid];
      el.attr(this.add_namespace('data-uuid'), uuid);
      return this.cache[uuid] = scenarios;
    },
    trim: function (str) {
      if (typeof str === 'string') {
        return $.trim(str);
      }
      return str;
    },
    set_data_attr: function (init) {
      if (init) {
        if (this.namespace.length > 0) {
          return this.namespace + '-' + this.settings.load_attr;
        }
        return this.settings.load_attr;
      }
      if (this.namespace.length > 0) {
        return 'data-' + this.namespace + '-' + this.settings.load_attr;
      }
      return 'data-' + this.settings.load_attr;
    },
    parse_data_attr: function (el) {
      var raw = el.attr(this.attr_name()).split(/\[(.*?)\]/), i = raw.length, output = [];
      while (i--) {
        if (raw[i].replace(/[\W\d]+/, '').length > 4) {
          output.push(raw[i]);
        }
      }
      return output;
    },
    reflow: function () {
      this.load('images', true);
      this.load('nodes', true);
    }
  };
}(jQuery, window, window.document));;
(function ($, window, document, undefined) {
  'use strict';
  var Modernizr = Modernizr || false;
  Foundation.libs.joyride = {
    name: 'joyride',
    version: '5.4.5',
    defaults: {
      expose: false,
      modal: true,
      keyboard: true,
      tip_location: 'bottom',
      nub_position: 'auto',
      scroll_speed: 1500,
      scroll_animation: 'linear',
      timer: 0,
      start_timer_on_click: true,
      start_offset: 0,
      next_button: true,
      prev_button: true,
      tip_animation: 'fade',
      pause_after: [],
      exposed: [],
      tip_animation_fade_speed: 300,
      cookie_monster: false,
      cookie_name: 'joyride',
      cookie_domain: false,
      cookie_expires: 365,
      tip_container: 'body',
      abort_on_close: true,
      tip_location_patterns: {
        top: ['bottom'],
        bottom: [],
        left: [
          'right',
          'top',
          'bottom'
        ],
        right: [
          'left',
          'top',
          'bottom'
        ]
      },
      post_ride_callback: function () {
      },
      post_step_callback: function () {
      },
      pre_step_callback: function () {
      },
      pre_ride_callback: function () {
      },
      post_expose_callback: function () {
      },
      template: {
        link: '<a href="#close" class="joyride-close-tip">&times;</a>',
        timer: '<div class="joyride-timer-indicator-wrap"><span class="joyride-timer-indicator"></span></div>',
        tip: '<div class="joyride-tip-guide"><span class="joyride-nub"></span></div>',
        wrapper: '<div class="joyride-content-wrapper"></div>',
        button: '<a href="#" class="small button joyride-next-tip"></a>',
        prev_button: '<a href="#" class="small button joyride-prev-tip"></a>',
        modal: '<div class="joyride-modal-bg"></div>',
        expose: '<div class="joyride-expose-wrapper"></div>',
        expose_cover: '<div class="joyride-expose-cover"></div>'
      },
      expose_add_class: ''
    },
    init: function (scope, method, options) {
      Foundation.inherit(this, 'throttle random_str');
      this.settings = this.settings || $.extend({}, this.defaults, options || method);
      this.bindings(method, options);
    },
    go_next: function () {
      if (this.settings.$li.next().length < 1) {
        this.end();
      } else if (this.settings.timer > 0) {
        clearTimeout(this.settings.automate);
        this.hide();
        this.show();
        this.startTimer();
      } else {
        this.hide();
        this.show();
      }
    },
    go_prev: function () {
      if (this.settings.$li.prev().length < 1) {
      } else if (this.settings.timer > 0) {
        clearTimeout(this.settings.automate);
        this.hide();
        this.show(null, true);
        this.startTimer();
      } else {
        this.hide();
        this.show(null, true);
      }
    },
    events: function () {
      var self = this;
      $(this.scope).off('.joyride').on('click.fndtn.joyride', '.joyride-next-tip, .joyride-modal-bg', function (e) {
        e.preventDefault();
        this.go_next();
      }.bind(this)).on('click.fndtn.joyride', '.joyride-prev-tip', function (e) {
        e.preventDefault();
        this.go_prev();
      }.bind(this)).on('click.fndtn.joyride', '.joyride-close-tip', function (e) {
        e.preventDefault();
        this.end(this.settings.abort_on_close);
      }.bind(this)).on('keyup.joyride', function (e) {
        if (!this.settings.keyboard)
          return;
        switch (e.which) {
        case 39:
          e.preventDefault();
          this.go_next();
          break;
        case 37:
          e.preventDefault();
          this.go_prev();
          break;
        case 27:
          e.preventDefault();
          this.end(this.settings.abort_on_close);
        }
      }.bind(this));
      $(window).off('.joyride').on('resize.fndtn.joyride', self.throttle(function () {
        if ($('[' + self.attr_name() + ']').length > 0 && self.settings.$next_tip && self.settings.riding) {
          if (self.settings.exposed.length > 0) {
            var $els = $(self.settings.exposed);
            $els.each(function () {
              var $this = $(this);
              self.un_expose($this);
              self.expose($this);
            });
          }
          if (self.is_phone()) {
            self.pos_phone();
          } else {
            self.pos_default(false);
          }
        }
      }, 100));
    },
    start: function () {
      var self = this, $this = $('[' + this.attr_name() + ']', this.scope), integer_settings = [
          'timer',
          'scrollSpeed',
          'startOffset',
          'tipAnimationFadeSpeed',
          'cookieExpires'
        ], int_settings_count = integer_settings.length;
      if (!$this.length > 0)
        return;
      if (!this.settings.init)
        this.events();
      this.settings = $this.data(this.attr_name(true) + '-init');
      this.settings.$content_el = $this;
      this.settings.$body = $(this.settings.tip_container);
      this.settings.body_offset = $(this.settings.tip_container).position();
      this.settings.$tip_content = this.settings.$content_el.find('> li');
      this.settings.paused = false;
      this.settings.attempts = 0;
      this.settings.riding = true;
      if (typeof $.cookie !== 'function') {
        this.settings.cookie_monster = false;
      }
      if (!this.settings.cookie_monster || this.settings.cookie_monster && !$.cookie(this.settings.cookie_name)) {
        this.settings.$tip_content.each(function (index) {
          var $this = $(this);
          this.settings = $.extend({}, self.defaults, self.data_options($this));
          var i = int_settings_count;
          while (i--) {
            self.settings[integer_settings[i]] = parseInt(self.settings[integer_settings[i]], 10);
          }
          self.create({
            $li: $this,
            index: index
          });
        });
        if (!this.settings.start_timer_on_click && this.settings.timer > 0) {
          this.show('init');
          this.startTimer();
        } else {
          this.show('init');
        }
      }
    },
    resume: function () {
      this.set_li();
      this.show();
    },
    tip_template: function (opts) {
      var $blank, content;
      opts.tip_class = opts.tip_class || '';
      $blank = $(this.settings.template.tip).addClass(opts.tip_class);
      content = $.trim($(opts.li).html()) + this.prev_button_text(opts.prev_button_text, opts.index) + this.button_text(opts.button_text) + this.settings.template.link + this.timer_instance(opts.index);
      $blank.append($(this.settings.template.wrapper));
      $blank.first().attr(this.add_namespace('data-index'), opts.index);
      $('.joyride-content-wrapper', $blank).append(content);
      return $blank[0];
    },
    timer_instance: function (index) {
      var txt;
      if (index === 0 && this.settings.start_timer_on_click && this.settings.timer > 0 || this.settings.timer === 0) {
        txt = '';
      } else {
        txt = $(this.settings.template.timer)[0].outerHTML;
      }
      return txt;
    },
    button_text: function (txt) {
      if (this.settings.tip_settings.next_button) {
        txt = $.trim(txt) || 'Next';
        txt = $(this.settings.template.button).append(txt)[0].outerHTML;
      } else {
        txt = '';
      }
      return txt;
    },
    prev_button_text: function (txt, idx) {
      if (this.settings.tip_settings.prev_button) {
        txt = $.trim(txt) || 'Previous';
        if (idx == 0)
          txt = $(this.settings.template.prev_button).append(txt).addClass('disabled')[0].outerHTML;
        else
          txt = $(this.settings.template.prev_button).append(txt)[0].outerHTML;
      } else {
        txt = '';
      }
      return txt;
    },
    create: function (opts) {
      this.settings.tip_settings = $.extend({}, this.settings, this.data_options(opts.$li));
      var buttonText = opts.$li.attr(this.add_namespace('data-button')) || opts.$li.attr(this.add_namespace('data-text')), prevButtonText = opts.$li.attr(this.add_namespace('data-button-prev')) || opts.$li.attr(this.add_namespace('data-prev-text')), tipClass = opts.$li.attr('class'), $tip_content = $(this.tip_template({
          tip_class: tipClass,
          index: opts.index,
          button_text: buttonText,
          prev_button_text: prevButtonText,
          li: opts.$li
        }));
      $(this.settings.tip_container).append($tip_content);
    },
    show: function (init, is_prev) {
      var $timer = null;
      if (this.settings.$li === undefined || $.inArray(this.settings.$li.index(), this.settings.pause_after) === -1) {
        if (this.settings.paused) {
          this.settings.paused = false;
        } else {
          this.set_li(init, is_prev);
        }
        this.settings.attempts = 0;
        if (this.settings.$li.length && this.settings.$target.length > 0) {
          if (init) {
            this.settings.pre_ride_callback(this.settings.$li.index(), this.settings.$next_tip);
            if (this.settings.modal) {
              this.show_modal();
            }
          }
          this.settings.pre_step_callback(this.settings.$li.index(), this.settings.$next_tip);
          if (this.settings.modal && this.settings.expose) {
            this.expose();
          }
          this.settings.tip_settings = $.extend({}, this.settings, this.data_options(this.settings.$li));
          this.settings.timer = parseInt(this.settings.timer, 10);
          this.settings.tip_settings.tip_location_pattern = this.settings.tip_location_patterns[this.settings.tip_settings.tip_location];
          if (!/body/i.test(this.settings.$target.selector)) {
            this.scroll_to();
          }
          if (this.is_phone()) {
            this.pos_phone(true);
          } else {
            this.pos_default(true);
          }
          $timer = this.settings.$next_tip.find('.joyride-timer-indicator');
          if (/pop/i.test(this.settings.tip_animation)) {
            $timer.width(0);
            if (this.settings.timer > 0) {
              this.settings.$next_tip.show();
              setTimeout(function () {
                $timer.animate({ width: $timer.parent().width() }, this.settings.timer, 'linear');
              }.bind(this), this.settings.tip_animation_fade_speed);
            } else {
              this.settings.$next_tip.show();
            }
          } else if (/fade/i.test(this.settings.tip_animation)) {
            $timer.width(0);
            if (this.settings.timer > 0) {
              this.settings.$next_tip.fadeIn(this.settings.tip_animation_fade_speed).show();
              setTimeout(function () {
                $timer.animate({ width: $timer.parent().width() }, this.settings.timer, 'linear');
              }.bind(this), this.settings.tip_animation_fade_speed);
            } else {
              this.settings.$next_tip.fadeIn(this.settings.tip_animation_fade_speed);
            }
          }
          this.settings.$current_tip = this.settings.$next_tip;
        } else if (this.settings.$li && this.settings.$target.length < 1) {
          this.show();
        } else {
          this.end();
        }
      } else {
        this.settings.paused = true;
      }
    },
    is_phone: function () {
      return matchMedia(Foundation.media_queries.small).matches && !matchMedia(Foundation.media_queries.medium).matches;
    },
    hide: function () {
      if (this.settings.modal && this.settings.expose) {
        this.un_expose();
      }
      if (!this.settings.modal) {
        $('.joyride-modal-bg').hide();
      }
      this.settings.$current_tip.css('visibility', 'hidden');
      setTimeout($.proxy(function () {
        this.hide();
        this.css('visibility', 'visible');
      }, this.settings.$current_tip), 0);
      this.settings.post_step_callback(this.settings.$li.index(), this.settings.$current_tip);
    },
    set_li: function (init, is_prev) {
      if (init) {
        this.settings.$li = this.settings.$tip_content.eq(this.settings.start_offset);
        this.set_next_tip();
        this.settings.$current_tip = this.settings.$next_tip;
      } else {
        if (is_prev)
          this.settings.$li = this.settings.$li.prev();
        else
          this.settings.$li = this.settings.$li.next();
        this.set_next_tip();
      }
      this.set_target();
    },
    set_next_tip: function () {
      this.settings.$next_tip = $('.joyride-tip-guide').eq(this.settings.$li.index());
      this.settings.$next_tip.data('closed', '');
    },
    set_target: function () {
      var cl = this.settings.$li.attr(this.add_namespace('data-class')), id = this.settings.$li.attr(this.add_namespace('data-id')), $sel = function () {
          if (id) {
            return $(document.getElementById(id));
          } else if (cl) {
            return $('.' + cl).first();
          } else {
            return $('body');
          }
        };
      this.settings.$target = $sel();
    },
    scroll_to: function () {
      var window_half, tipOffset;
      window_half = $(window).height() / 2;
      tipOffset = Math.ceil(this.settings.$target.offset().top - window_half + this.settings.$next_tip.outerHeight());
      if (tipOffset != 0) {
        $('html, body').stop().animate({ scrollTop: tipOffset }, this.settings.scroll_speed, 'swing');
      }
    },
    paused: function () {
      return $.inArray(this.settings.$li.index() + 1, this.settings.pause_after) === -1;
    },
    restart: function () {
      this.hide();
      this.settings.$li = undefined;
      this.show('init');
    },
    pos_default: function (init) {
      var $nub = this.settings.$next_tip.find('.joyride-nub'), nub_width = Math.ceil($nub.outerWidth() / 2), nub_height = Math.ceil($nub.outerHeight() / 2), toggle = init || false;
      if (toggle) {
        this.settings.$next_tip.css('visibility', 'hidden');
        this.settings.$next_tip.show();
      }
      if (!/body/i.test(this.settings.$target.selector)) {
        var topAdjustment = this.settings.tip_settings.tipAdjustmentY ? parseInt(this.settings.tip_settings.tipAdjustmentY) : 0, leftAdjustment = this.settings.tip_settings.tipAdjustmentX ? parseInt(this.settings.tip_settings.tipAdjustmentX) : 0;
        if (this.bottom()) {
          if (this.rtl) {
            this.settings.$next_tip.css({
              top: this.settings.$target.offset().top + nub_height + this.settings.$target.outerHeight() + topAdjustment,
              left: this.settings.$target.offset().left + this.settings.$target.outerWidth() - this.settings.$next_tip.outerWidth() + leftAdjustment
            });
          } else {
            this.settings.$next_tip.css({
              top: this.settings.$target.offset().top + nub_height + this.settings.$target.outerHeight() + topAdjustment,
              left: this.settings.$target.offset().left + leftAdjustment
            });
          }
          this.nub_position($nub, this.settings.tip_settings.nub_position, 'top');
        } else if (this.top()) {
          if (this.rtl) {
            this.settings.$next_tip.css({
              top: this.settings.$target.offset().top - this.settings.$next_tip.outerHeight() - nub_height + topAdjustment,
              left: this.settings.$target.offset().left + this.settings.$target.outerWidth() - this.settings.$next_tip.outerWidth()
            });
          } else {
            this.settings.$next_tip.css({
              top: this.settings.$target.offset().top - this.settings.$next_tip.outerHeight() - nub_height + topAdjustment,
              left: this.settings.$target.offset().left + leftAdjustment
            });
          }
          this.nub_position($nub, this.settings.tip_settings.nub_position, 'bottom');
        } else if (this.right()) {
          this.settings.$next_tip.css({
            top: this.settings.$target.offset().top + topAdjustment,
            left: this.settings.$target.outerWidth() + this.settings.$target.offset().left + nub_width + leftAdjustment
          });
          this.nub_position($nub, this.settings.tip_settings.nub_position, 'left');
        } else if (this.left()) {
          this.settings.$next_tip.css({
            top: this.settings.$target.offset().top + topAdjustment,
            left: this.settings.$target.offset().left - this.settings.$next_tip.outerWidth() - nub_width + leftAdjustment
          });
          this.nub_position($nub, this.settings.tip_settings.nub_position, 'right');
        }
        if (!this.visible(this.corners(this.settings.$next_tip)) && this.settings.attempts < this.settings.tip_settings.tip_location_pattern.length) {
          $nub.removeClass('bottom').removeClass('top').removeClass('right').removeClass('left');
          this.settings.tip_settings.tip_location = this.settings.tip_settings.tip_location_pattern[this.settings.attempts];
          this.settings.attempts++;
          this.pos_default();
        }
      } else if (this.settings.$li.length) {
        this.pos_modal($nub);
      }
      if (toggle) {
        this.settings.$next_tip.hide();
        this.settings.$next_tip.css('visibility', 'visible');
      }
    },
    pos_phone: function (init) {
      var tip_height = this.settings.$next_tip.outerHeight(), tip_offset = this.settings.$next_tip.offset(), target_height = this.settings.$target.outerHeight(), $nub = $('.joyride-nub', this.settings.$next_tip), nub_height = Math.ceil($nub.outerHeight() / 2), toggle = init || false;
      $nub.removeClass('bottom').removeClass('top').removeClass('right').removeClass('left');
      if (toggle) {
        this.settings.$next_tip.css('visibility', 'hidden');
        this.settings.$next_tip.show();
      }
      if (!/body/i.test(this.settings.$target.selector)) {
        if (this.top()) {
          this.settings.$next_tip.offset({ top: this.settings.$target.offset().top - tip_height - nub_height });
          $nub.addClass('bottom');
        } else {
          this.settings.$next_tip.offset({ top: this.settings.$target.offset().top + target_height + nub_height });
          $nub.addClass('top');
        }
      } else if (this.settings.$li.length) {
        this.pos_modal($nub);
      }
      if (toggle) {
        this.settings.$next_tip.hide();
        this.settings.$next_tip.css('visibility', 'visible');
      }
    },
    pos_modal: function ($nub) {
      this.center();
      $nub.hide();
      this.show_modal();
    },
    show_modal: function () {
      if (!this.settings.$next_tip.data('closed')) {
        var joyridemodalbg = $('.joyride-modal-bg');
        if (joyridemodalbg.length < 1) {
          $('body').append(this.settings.template.modal).show();
        }
        if (/pop/i.test(this.settings.tip_animation)) {
          joyridemodalbg.show();
        } else {
          joyridemodalbg.fadeIn(this.settings.tip_animation_fade_speed);
        }
      }
    },
    expose: function () {
      var expose, exposeCover, el, origCSS, origClasses, randId = 'expose-' + this.random_str(6);
      if (arguments.length > 0 && arguments[0] instanceof $) {
        el = arguments[0];
      } else if (this.settings.$target && !/body/i.test(this.settings.$target.selector)) {
        el = this.settings.$target;
      } else {
        return false;
      }
      if (el.length < 1) {
        if (window.console) {
          console.error('element not valid', el);
        }
        return false;
      }
      expose = $(this.settings.template.expose);
      this.settings.$body.append(expose);
      expose.css({
        top: el.offset().top,
        left: el.offset().left,
        width: el.outerWidth(true),
        height: el.outerHeight(true)
      });
      exposeCover = $(this.settings.template.expose_cover);
      origCSS = {
        zIndex: el.css('z-index'),
        position: el.css('position')
      };
      origClasses = el.attr('class') == null ? '' : el.attr('class');
      el.css('z-index', parseInt(expose.css('z-index')) + 1);
      if (origCSS.position == 'static') {
        el.css('position', 'relative');
      }
      el.data('expose-css', origCSS);
      el.data('orig-class', origClasses);
      el.attr('class', origClasses + ' ' + this.settings.expose_add_class);
      exposeCover.css({
        top: el.offset().top,
        left: el.offset().left,
        width: el.outerWidth(true),
        height: el.outerHeight(true)
      });
      if (this.settings.modal)
        this.show_modal();
      this.settings.$body.append(exposeCover);
      expose.addClass(randId);
      exposeCover.addClass(randId);
      el.data('expose', randId);
      this.settings.post_expose_callback(this.settings.$li.index(), this.settings.$next_tip, el);
      this.add_exposed(el);
    },
    un_expose: function () {
      var exposeId, el, expose, origCSS, origClasses, clearAll = false;
      if (arguments.length > 0 && arguments[0] instanceof $) {
        el = arguments[0];
      } else if (this.settings.$target && !/body/i.test(this.settings.$target.selector)) {
        el = this.settings.$target;
      } else {
        return false;
      }
      if (el.length < 1) {
        if (window.console) {
          console.error('element not valid', el);
        }
        return false;
      }
      exposeId = el.data('expose');
      expose = $('.' + exposeId);
      if (arguments.length > 1) {
        clearAll = arguments[1];
      }
      if (clearAll === true) {
        $('.joyride-expose-wrapper,.joyride-expose-cover').remove();
      } else {
        expose.remove();
      }
      origCSS = el.data('expose-css');
      if (origCSS.zIndex == 'auto') {
        el.css('z-index', '');
      } else {
        el.css('z-index', origCSS.zIndex);
      }
      if (origCSS.position != el.css('position')) {
        if (origCSS.position == 'static') {
          el.css('position', '');
        } else {
          el.css('position', origCSS.position);
        }
      }
      origClasses = el.data('orig-class');
      el.attr('class', origClasses);
      el.removeData('orig-classes');
      el.removeData('expose');
      el.removeData('expose-z-index');
      this.remove_exposed(el);
    },
    add_exposed: function (el) {
      this.settings.exposed = this.settings.exposed || [];
      if (el instanceof $ || typeof el === 'object') {
        this.settings.exposed.push(el[0]);
      } else if (typeof el == 'string') {
        this.settings.exposed.push(el);
      }
    },
    remove_exposed: function (el) {
      var search, i;
      if (el instanceof $) {
        search = el[0];
      } else if (typeof el == 'string') {
        search = el;
      }
      this.settings.exposed = this.settings.exposed || [];
      i = this.settings.exposed.length;
      while (i--) {
        if (this.settings.exposed[i] == search) {
          this.settings.exposed.splice(i, 1);
          return;
        }
      }
    },
    center: function () {
      var $w = $(window);
      this.settings.$next_tip.css({
        top: ($w.height() - this.settings.$next_tip.outerHeight()) / 2 + $w.scrollTop(),
        left: ($w.width() - this.settings.$next_tip.outerWidth()) / 2 + $w.scrollLeft()
      });
      return true;
    },
    bottom: function () {
      return /bottom/i.test(this.settings.tip_settings.tip_location);
    },
    top: function () {
      return /top/i.test(this.settings.tip_settings.tip_location);
    },
    right: function () {
      return /right/i.test(this.settings.tip_settings.tip_location);
    },
    left: function () {
      return /left/i.test(this.settings.tip_settings.tip_location);
    },
    corners: function (el) {
      var w = $(window), window_half = w.height() / 2, tipOffset = Math.ceil(this.settings.$target.offset().top - window_half + this.settings.$next_tip.outerHeight()), right = w.width() + w.scrollLeft(), offsetBottom = w.height() + tipOffset, bottom = w.height() + w.scrollTop(), top = w.scrollTop();
      if (tipOffset < top) {
        if (tipOffset < 0) {
          top = 0;
        } else {
          top = tipOffset;
        }
      }
      if (offsetBottom > bottom) {
        bottom = offsetBottom;
      }
      return [
        el.offset().top < top,
        right < el.offset().left + el.outerWidth(),
        bottom < el.offset().top + el.outerHeight(),
        w.scrollLeft() > el.offset().left
      ];
    },
    visible: function (hidden_corners) {
      var i = hidden_corners.length;
      while (i--) {
        if (hidden_corners[i])
          return false;
      }
      return true;
    },
    nub_position: function (nub, pos, def) {
      if (pos === 'auto') {
        nub.addClass(def);
      } else {
        nub.addClass(pos);
      }
    },
    startTimer: function () {
      if (this.settings.$li.length) {
        this.settings.automate = setTimeout(function () {
          this.hide();
          this.show();
          this.startTimer();
        }.bind(this), this.settings.timer);
      } else {
        clearTimeout(this.settings.automate);
      }
    },
    end: function (abort) {
      if (this.settings.cookie_monster) {
        $.cookie(this.settings.cookie_name, 'ridden', {
          expires: this.settings.cookie_expires,
          domain: this.settings.cookie_domain
        });
      }
      if (this.settings.timer > 0) {
        clearTimeout(this.settings.automate);
      }
      if (this.settings.modal && this.settings.expose) {
        this.un_expose();
      }
      $(this.scope).off('keyup.joyride');
      this.settings.$next_tip.data('closed', true);
      this.settings.riding = false;
      $('.joyride-modal-bg').hide();
      this.settings.$current_tip.hide();
      if (typeof abort === 'undefined' || abort === false) {
        this.settings.post_step_callback(this.settings.$li.index(), this.settings.$current_tip);
        this.settings.post_ride_callback(this.settings.$li.index(), this.settings.$current_tip);
      }
      $('.joyride-tip-guide').remove();
    },
    off: function () {
      $(this.scope).off('.joyride');
      $(window).off('.joyride');
      $('.joyride-close-tip, .joyride-next-tip, .joyride-modal-bg').off('.joyride');
      $('.joyride-tip-guide, .joyride-modal-bg').remove();
      clearTimeout(this.settings.automate);
      this.settings = {};
    },
    reflow: function () {
    }
  };
}(jQuery, window, window.document));;
(function ($, window, document, undefined) {
  'use strict';
  Foundation.libs['magellan-expedition'] = {
    name: 'magellan-expedition',
    version: '5.4.5',
    settings: {
      active_class: 'active',
      threshold: 0,
      destination_threshold: 20,
      throttle_delay: 30,
      fixed_top: 0
    },
    init: function (scope, method, options) {
      Foundation.inherit(this, 'throttle');
      this.bindings(method, options);
    },
    events: function () {
      var self = this, S = self.S, settings = self.settings;
      self.set_expedition_position();
      S(self.scope).off('.magellan').on('click.fndtn.magellan', '[' + self.add_namespace('data-magellan-arrival') + '] a[href^="#"]', function (e) {
        e.preventDefault();
        var expedition = $(this).closest('[' + self.attr_name() + ']'), settings = expedition.data('magellan-expedition-init'), hash = this.hash.split('#').join(''), target = $('a[name=\'' + hash + '\']');
        if (target.length === 0) {
          target = $('#' + hash);
        }
        var scroll_top = target.offset().top - settings.destination_threshold + 1;
        scroll_top = scroll_top - expedition.outerHeight();
        $('html, body').stop().animate({ 'scrollTop': scroll_top }, 700, 'swing', function () {
          if (history.pushState) {
            history.pushState(null, null, '#' + hash);
          } else {
            location.hash = '#' + hash;
          }
        });
      }).on('scroll.fndtn.magellan', self.throttle(this.check_for_arrivals.bind(this), settings.throttle_delay));
      $(window).on('resize.fndtn.magellan', self.throttle(this.set_expedition_position.bind(this), settings.throttle_delay));
    },
    check_for_arrivals: function () {
      var self = this;
      self.update_arrivals();
      self.update_expedition_positions();
    },
    set_expedition_position: function () {
      var self = this;
      $('[' + this.attr_name() + '=fixed]', self.scope).each(function (idx, el) {
        var expedition = $(this), settings = expedition.data('magellan-expedition-init'), styles = expedition.attr('styles'), top_offset, fixed_top;
        expedition.attr('style', '');
        top_offset = expedition.offset().top + settings.threshold;
        fixed_top = parseInt(expedition.data('magellan-fixed-top'));
        if (!isNaN(fixed_top))
          self.settings.fixed_top = fixed_top;
        expedition.data(self.data_attr('magellan-top-offset'), top_offset);
        expedition.attr('style', styles);
      });
    },
    update_expedition_positions: function () {
      var self = this, window_top_offset = $(window).scrollTop();
      $('[' + this.attr_name() + '=fixed]', self.scope).each(function () {
        var expedition = $(this), settings = expedition.data('magellan-expedition-init'), styles = expedition.attr('style'), top_offset = expedition.data('magellan-top-offset');
        if (window_top_offset + self.settings.fixed_top >= top_offset) {
          var placeholder = expedition.prev('[' + self.add_namespace('data-magellan-expedition-clone') + ']');
          if (placeholder.length === 0) {
            placeholder = expedition.clone();
            placeholder.removeAttr(self.attr_name());
            placeholder.attr(self.add_namespace('data-magellan-expedition-clone'), '');
            expedition.before(placeholder);
          }
          expedition.css({
            position: 'fixed',
            top: settings.fixed_top
          }).addClass('fixed');
        } else {
          expedition.prev('[' + self.add_namespace('data-magellan-expedition-clone') + ']').remove();
          expedition.attr('style', styles).css('position', '').css('top', '').removeClass('fixed');
        }
      });
    },
    update_arrivals: function () {
      var self = this, window_top_offset = $(window).scrollTop();
      $('[' + this.attr_name() + ']', self.scope).each(function () {
        var expedition = $(this), settings = expedition.data(self.attr_name(true) + '-init'), offsets = self.offsets(expedition, window_top_offset), arrivals = expedition.find('[' + self.add_namespace('data-magellan-arrival') + ']'), active_item = false;
        offsets.each(function (idx, item) {
          if (item.viewport_offset >= item.top_offset) {
            var arrivals = expedition.find('[' + self.add_namespace('data-magellan-arrival') + ']');
            arrivals.not(item.arrival).removeClass(settings.active_class);
            item.arrival.addClass(settings.active_class);
            active_item = true;
            return true;
          }
        });
        if (!active_item)
          arrivals.removeClass(settings.active_class);
      });
    },
    offsets: function (expedition, window_offset) {
      var self = this, settings = expedition.data(self.attr_name(true) + '-init'), viewport_offset = window_offset;
      return expedition.find('[' + self.add_namespace('data-magellan-arrival') + ']').map(function (idx, el) {
        var name = $(this).data(self.data_attr('magellan-arrival')), dest = $('[' + self.add_namespace('data-magellan-destination') + '=' + name + ']');
        if (dest.length > 0) {
          var top_offset = Math.floor(dest.offset().top - settings.destination_threshold - expedition.outerHeight());
          return {
            destination: dest,
            arrival: $(this),
            top_offset: top_offset,
            viewport_offset: viewport_offset
          };
        }
      }).sort(function (a, b) {
        if (a.top_offset < b.top_offset)
          return -1;
        if (a.top_offset > b.top_offset)
          return 1;
        return 0;
      });
    },
    data_attr: function (str) {
      if (this.namespace.length > 0) {
        return this.namespace + '-' + str;
      }
      return str;
    },
    off: function () {
      this.S(this.scope).off('.magellan');
      this.S(window).off('.magellan');
    },
    reflow: function () {
      var self = this;
      $('[' + self.add_namespace('data-magellan-expedition-clone') + ']', self.scope).remove();
    }
  };
}(jQuery, window, window.document));;
(function ($, window, document, undefined) {
  'use strict';
  Foundation.libs.offcanvas = {
    name: 'offcanvas',
    version: '5.4.5',
    settings: {
      open_method: 'move',
      close_on_click: false
    },
    init: function (scope, method, options) {
      this.bindings(method, options);
    },
    events: function () {
      var self = this, S = self.S, move_class = '', right_postfix = '', left_postfix = '';
      if (this.settings.open_method === 'move') {
        move_class = 'move-';
        right_postfix = 'right';
        left_postfix = 'left';
      } else if (this.settings.open_method === 'overlap_single') {
        move_class = 'offcanvas-overlap-';
        right_postfix = 'right';
        left_postfix = 'left';
      } else if (this.settings.open_method === 'overlap') {
        move_class = 'offcanvas-overlap';
      }
      S(this.scope).off('.offcanvas').on('click.fndtn.offcanvas', '.left-off-canvas-toggle', function (e) {
        self.click_toggle_class(e, move_class + right_postfix);
        if (self.settings.open_method !== 'overlap') {
          S('.left-submenu').removeClass(move_class + right_postfix);
        }
        $('.left-off-canvas-toggle').attr('aria-expanded', 'true');
      }).on('click.fndtn.offcanvas', '.left-off-canvas-menu a', function (e) {
        var settings = self.get_settings(e);
        var parent = S(this).parent();
        if (settings.close_on_click && !parent.hasClass('has-submenu') && !parent.hasClass('back')) {
          self.hide.call(self, move_class + right_postfix, self.get_wrapper(e));
          parent.parent().removeClass(move_class + right_postfix);
        } else if (S(this).parent().hasClass('has-submenu')) {
          e.preventDefault();
          S(this).siblings('.left-submenu').toggleClass(move_class + right_postfix);
        } else if (parent.hasClass('back')) {
          e.preventDefault();
          parent.parent().removeClass(move_class + right_postfix);
        }
        $('.left-off-canvas-toggle').attr('aria-expanded', 'true');
      }).on('click.fndtn.offcanvas', '.right-off-canvas-toggle', function (e) {
        self.click_toggle_class(e, move_class + left_postfix);
        if (self.settings.open_method !== 'overlap') {
          S('.right-submenu').removeClass(move_class + left_postfix);
        }
        $('.right-off-canvas-toggle').attr('aria-expanded', 'true');
      }).on('click.fndtn.offcanvas', '.right-off-canvas-menu a', function (e) {
        var settings = self.get_settings(e);
        var parent = S(this).parent();
        if (settings.close_on_click && !parent.hasClass('has-submenu') && !parent.hasClass('back')) {
          self.hide.call(self, move_class + left_postfix, self.get_wrapper(e));
          parent.parent().removeClass(move_class + left_postfix);
        } else if (S(this).parent().hasClass('has-submenu')) {
          e.preventDefault();
          S(this).siblings('.right-submenu').toggleClass(move_class + left_postfix);
        } else if (parent.hasClass('back')) {
          e.preventDefault();
          parent.parent().removeClass(move_class + left_postfix);
        }
        $('.right-off-canvas-toggle').attr('aria-expanded', 'true');
      }).on('click.fndtn.offcanvas', '.exit-off-canvas', function (e) {
        self.click_remove_class(e, move_class + left_postfix);
        S('.right-submenu').removeClass(move_class + left_postfix);
        if (right_postfix) {
          self.click_remove_class(e, move_class + right_postfix);
          S('.left-submenu').removeClass(move_class + left_postfix);
        }
        $('.right-off-canvas-toggle').attr('aria-expanded', 'true');
      }).on('click.fndtn.offcanvas', '.exit-off-canvas', function (e) {
        self.click_remove_class(e, move_class + left_postfix);
        $('.left-off-canvas-toggle').attr('aria-expanded', 'false');
        if (right_postfix) {
          self.click_remove_class(e, move_class + right_postfix);
          $('.right-off-canvas-toggle').attr('aria-expanded', 'false');
        }
      });
    },
    toggle: function (class_name, $off_canvas) {
      $off_canvas = $off_canvas || this.get_wrapper();
      if ($off_canvas.is('.' + class_name)) {
        this.hide(class_name, $off_canvas);
      } else {
        this.show(class_name, $off_canvas);
      }
    },
    show: function (class_name, $off_canvas) {
      $off_canvas = $off_canvas || this.get_wrapper();
      $off_canvas.trigger('open').trigger('open.fndtn.offcanvas');
      $off_canvas.addClass(class_name);
    },
    hide: function (class_name, $off_canvas) {
      $off_canvas = $off_canvas || this.get_wrapper();
      $off_canvas.trigger('close').trigger('close.fndtn.offcanvas');
      $off_canvas.removeClass(class_name);
    },
    click_toggle_class: function (e, class_name) {
      e.preventDefault();
      var $off_canvas = this.get_wrapper(e);
      this.toggle(class_name, $off_canvas);
    },
    click_remove_class: function (e, class_name) {
      e.preventDefault();
      var $off_canvas = this.get_wrapper(e);
      this.hide(class_name, $off_canvas);
    },
    get_settings: function (e) {
      var offcanvas = this.S(e.target).closest('[' + this.attr_name() + ']');
      return offcanvas.data(this.attr_name(true) + '-init') || this.settings;
    },
    get_wrapper: function (e) {
      var $off_canvas = this.S(e ? e.target : this.scope).closest('.off-canvas-wrap');
      if ($off_canvas.length === 0) {
        $off_canvas = this.S('.off-canvas-wrap');
      }
      return $off_canvas;
    },
    reflow: function () {
    }
  };
}(jQuery, window, window.document));;
(function ($, window, document, undefined) {
  'use strict';
  var noop = function () {
  };
  var Orbit = function (el, settings) {
    if (el.hasClass(settings.slides_container_class)) {
      return this;
    }
    var self = this, container, slides_container = el, number_container, bullets_container, timer_container, idx = 0, animate, timer, locked = false, adjust_height_after = false;
    self.slides = function () {
      return slides_container.children(settings.slide_selector);
    };
    self.slides().first().addClass(settings.active_slide_class);
    self.update_slide_number = function (index) {
      if (settings.slide_number) {
        number_container.find('span:first').text(parseInt(index) + 1);
        number_container.find('span:last').text(self.slides().length);
      }
      if (settings.bullets) {
        bullets_container.children().removeClass(settings.bullets_active_class);
        $(bullets_container.children().get(index)).addClass(settings.bullets_active_class);
      }
    };
    self.update_active_link = function (index) {
      var link = $('[data-orbit-link="' + self.slides().eq(index).attr('data-orbit-slide') + '"]');
      link.siblings().removeClass(settings.bullets_active_class);
      link.addClass(settings.bullets_active_class);
    };
    self.build_markup = function () {
      slides_container.wrap('<div class="' + settings.container_class + '"></div>');
      container = slides_container.parent();
      slides_container.addClass(settings.slides_container_class);
      if (settings.stack_on_small) {
        container.addClass(settings.stack_on_small_class);
      }
      if (settings.navigation_arrows) {
        container.append($('<a href="#"><span></span></a>').addClass(settings.prev_class));
        container.append($('<a href="#"><span></span></a>').addClass(settings.next_class));
      }
      if (settings.timer) {
        timer_container = $('<div>').addClass(settings.timer_container_class);
        timer_container.append('<span>');
        timer_container.append($('<div>').addClass(settings.timer_progress_class));
        timer_container.addClass(settings.timer_paused_class);
        container.append(timer_container);
      }
      if (settings.slide_number) {
        number_container = $('<div>').addClass(settings.slide_number_class);
        number_container.append('<span></span> ' + settings.slide_number_text + ' <span></span>');
        container.append(number_container);
      }
      if (settings.bullets) {
        bullets_container = $('<ol>').addClass(settings.bullets_container_class);
        container.append(bullets_container);
        bullets_container.wrap('<div class="orbit-bullets-container"></div>');
        self.slides().each(function (idx, el) {
          var bullet = $('<li>').attr('data-orbit-slide', idx).on('click', self.link_bullet);
          ;
          bullets_container.append(bullet);
        });
      }
    };
    self._goto = function (next_idx, start_timer) {
      if (next_idx === idx) {
        return false;
      }
      if (typeof timer === 'object') {
        timer.restart();
      }
      var slides = self.slides();
      var dir = 'next';
      locked = true;
      if (next_idx < idx) {
        dir = 'prev';
      }
      if (next_idx >= slides.length) {
        if (!settings.circular)
          return false;
        next_idx = 0;
      } else if (next_idx < 0) {
        if (!settings.circular)
          return false;
        next_idx = slides.length - 1;
      }
      var current = $(slides.get(idx));
      var next = $(slides.get(next_idx));
      current.css('zIndex', 2);
      current.removeClass(settings.active_slide_class);
      next.css('zIndex', 4).addClass(settings.active_slide_class);
      slides_container.trigger('before-slide-change.fndtn.orbit');
      settings.before_slide_change();
      self.update_active_link(next_idx);
      var callback = function () {
        var unlock = function () {
          idx = next_idx;
          locked = false;
          if (start_timer === true) {
            timer = self.create_timer();
            timer.start();
          }
          self.update_slide_number(idx);
          slides_container.trigger('after-slide-change.fndtn.orbit', [{
              slide_number: idx,
              total_slides: slides.length
            }]);
          settings.after_slide_change(idx, slides.length);
        };
        if (slides_container.height() != next.height() && settings.variable_height) {
          slides_container.animate({ 'height': next.height() }, 250, 'linear', unlock);
        } else {
          unlock();
        }
      };
      if (slides.length === 1) {
        callback();
        return false;
      }
      var start_animation = function () {
        if (dir === 'next') {
          animate.next(current, next, callback);
        }
        if (dir === 'prev') {
          animate.prev(current, next, callback);
        }
      };
      if (next.height() > slides_container.height() && settings.variable_height) {
        slides_container.animate({ 'height': next.height() }, 250, 'linear', start_animation);
      } else {
        start_animation();
      }
    };
    self.next = function (e) {
      e.stopImmediatePropagation();
      e.preventDefault();
      self._goto(idx + 1);
    };
    self.prev = function (e) {
      e.stopImmediatePropagation();
      e.preventDefault();
      self._goto(idx - 1);
    };
    self.link_custom = function (e) {
      e.preventDefault();
      var link = $(this).attr('data-orbit-link');
      if (typeof link === 'string' && (link = $.trim(link)) != '') {
        var slide = container.find('[data-orbit-slide=' + link + ']');
        if (slide.index() != -1) {
          self._goto(slide.index());
        }
      }
    };
    self.link_bullet = function (e) {
      var index = $(this).attr('data-orbit-slide');
      if (typeof index === 'string' && (index = $.trim(index)) != '') {
        if (isNaN(parseInt(index))) {
          var slide = container.find('[data-orbit-slide=' + index + ']');
          if (slide.index() != -1) {
            self._goto(slide.index() + 1);
          }
        } else {
          self._goto(parseInt(index));
        }
      }
    };
    self.timer_callback = function () {
      self._goto(idx + 1, true);
    };
    self.compute_dimensions = function () {
      var current = $(self.slides().get(idx));
      var h = current.height();
      if (!settings.variable_height) {
        self.slides().each(function () {
          if ($(this).height() > h) {
            h = $(this).height();
          }
        });
      }
      slides_container.height(h);
    };
    self.create_timer = function () {
      var t = new Timer(container.find('.' + settings.timer_container_class), settings, self.timer_callback);
      return t;
    };
    self.stop_timer = function () {
      if (typeof timer === 'object')
        timer.stop();
    };
    self.toggle_timer = function () {
      var t = container.find('.' + settings.timer_container_class);
      if (t.hasClass(settings.timer_paused_class)) {
        if (typeof timer === 'undefined') {
          timer = self.create_timer();
        }
        timer.start();
      } else {
        if (typeof timer === 'object') {
          timer.stop();
        }
      }
    };
    self.init = function () {
      self.build_markup();
      if (settings.timer) {
        timer = self.create_timer();
        Foundation.utils.image_loaded(this.slides().children('img'), timer.start);
      }
      animate = new FadeAnimation(settings, slides_container);
      if (settings.animation === 'slide')
        animate = new SlideAnimation(settings, slides_container);
      container.on('click', '.' + settings.next_class, self.next);
      container.on('click', '.' + settings.prev_class, self.prev);
      if (settings.next_on_click) {
        container.on('click', '.' + settings.slides_container_class + ' [data-orbit-slide]', self.link_bullet);
      }
      container.on('click', self.toggle_timer);
      if (settings.swipe) {
        container.on('touchstart.fndtn.orbit', function (e) {
          if (!e.touches) {
            e = e.originalEvent;
          }
          var data = {
              start_page_x: e.touches[0].pageX,
              start_page_y: e.touches[0].pageY,
              start_time: new Date().getTime(),
              delta_x: 0,
              is_scrolling: undefined
            };
          container.data('swipe-transition', data);
          e.stopPropagation();
        }).on('touchmove.fndtn.orbit', function (e) {
          if (!e.touches) {
            e = e.originalEvent;
          }
          if (e.touches.length > 1 || e.scale && e.scale !== 1)
            return;
          var data = container.data('swipe-transition');
          if (typeof data === 'undefined') {
            data = {};
          }
          data.delta_x = e.touches[0].pageX - data.start_page_x;
          if (typeof data.is_scrolling === 'undefined') {
            data.is_scrolling = !!(data.is_scrolling || Math.abs(data.delta_x) < Math.abs(e.touches[0].pageY - data.start_page_y));
          }
          if (!data.is_scrolling && !data.active) {
            e.preventDefault();
            var direction = data.delta_x < 0 ? idx + 1 : idx - 1;
            data.active = true;
            self._goto(direction);
          }
        }).on('touchend.fndtn.orbit', function (e) {
          container.data('swipe-transition', {});
          e.stopPropagation();
        });
      }
      container.on('mouseenter.fndtn.orbit', function (e) {
        if (settings.timer && settings.pause_on_hover) {
          self.stop_timer();
        }
      }).on('mouseleave.fndtn.orbit', function (e) {
        if (settings.timer && settings.resume_on_mouseout) {
          timer.start();
        }
      });
      $(document).on('click', '[data-orbit-link]', self.link_custom);
      $(window).on('load resize', self.compute_dimensions);
      Foundation.utils.image_loaded(this.slides().children('img'), self.compute_dimensions);
      Foundation.utils.image_loaded(this.slides().children('img'), function () {
        container.prev('.' + settings.preloader_class).css('display', 'none');
        self.update_slide_number(0);
        self.update_active_link(0);
        slides_container.trigger('ready.fndtn.orbit');
      });
    };
    self.init();
  };
  var Timer = function (el, settings, callback) {
    var self = this, duration = settings.timer_speed, progress = el.find('.' + settings.timer_progress_class), start, timeout, left = -1;
    this.update_progress = function (w) {
      var new_progress = progress.clone();
      new_progress.attr('style', '');
      new_progress.css('width', w + '%');
      progress.replaceWith(new_progress);
      progress = new_progress;
    };
    this.restart = function () {
      clearTimeout(timeout);
      el.addClass(settings.timer_paused_class);
      left = -1;
      self.update_progress(0);
    };
    this.start = function () {
      if (!el.hasClass(settings.timer_paused_class)) {
        return true;
      }
      left = left === -1 ? duration : left;
      el.removeClass(settings.timer_paused_class);
      start = new Date().getTime();
      progress.animate({ 'width': '100%' }, left, 'linear');
      timeout = setTimeout(function () {
        self.restart();
        callback();
      }, left);
      el.trigger('timer-started.fndtn.orbit');
    };
    this.stop = function () {
      if (el.hasClass(settings.timer_paused_class)) {
        return true;
      }
      clearTimeout(timeout);
      el.addClass(settings.timer_paused_class);
      var end = new Date().getTime();
      left = left - (end - start);
      var w = 100 - left / duration * 100;
      self.update_progress(w);
      el.trigger('timer-stopped.fndtn.orbit');
    };
  };
  var SlideAnimation = function (settings, container) {
    var duration = settings.animation_speed;
    var is_rtl = $('html[dir=rtl]').length === 1;
    var margin = is_rtl ? 'marginRight' : 'marginLeft';
    var animMargin = {};
    animMargin[margin] = '0%';
    this.next = function (current, next, callback) {
      current.animate({ marginLeft: '-100%' }, duration);
      next.animate(animMargin, duration, function () {
        current.css(margin, '100%');
        callback();
      });
    };
    this.prev = function (current, prev, callback) {
      current.animate({ marginLeft: '100%' }, duration);
      prev.css(margin, '-100%');
      prev.animate(animMargin, duration, function () {
        current.css(margin, '100%');
        callback();
      });
    };
  };
  var FadeAnimation = function (settings, container) {
    var duration = settings.animation_speed;
    var is_rtl = $('html[dir=rtl]').length === 1;
    var margin = is_rtl ? 'marginRight' : 'marginLeft';
    this.next = function (current, next, callback) {
      next.css({
        'margin': '0%',
        'opacity': '0.01'
      });
      next.animate({ 'opacity': '1' }, duration, 'linear', function () {
        current.css('margin', '100%');
        callback();
      });
    };
    this.prev = function (current, prev, callback) {
      prev.css({
        'margin': '0%',
        'opacity': '0.01'
      });
      prev.animate({ 'opacity': '1' }, duration, 'linear', function () {
        current.css('margin', '100%');
        callback();
      });
    };
  };
  Foundation.libs = Foundation.libs || {};
  Foundation.libs.orbit = {
    name: 'orbit',
    version: '5.4.5',
    settings: {
      animation: 'slide',
      timer_speed: 10000,
      pause_on_hover: true,
      resume_on_mouseout: false,
      next_on_click: true,
      animation_speed: 500,
      stack_on_small: false,
      navigation_arrows: true,
      slide_number: true,
      slide_number_text: 'of',
      container_class: 'orbit-container',
      stack_on_small_class: 'orbit-stack-on-small',
      next_class: 'orbit-next',
      prev_class: 'orbit-prev',
      timer_container_class: 'orbit-timer',
      timer_paused_class: 'paused',
      timer_progress_class: 'orbit-progress',
      slides_container_class: 'orbit-slides-container',
      preloader_class: 'preloader',
      slide_selector: '*',
      bullets_container_class: 'orbit-bullets',
      bullets_active_class: 'active',
      slide_number_class: 'orbit-slide-number',
      caption_class: 'orbit-caption',
      active_slide_class: 'active',
      orbit_transition_class: 'orbit-transitioning',
      bullets: true,
      circular: true,
      timer: true,
      variable_height: false,
      swipe: true,
      before_slide_change: noop,
      after_slide_change: noop
    },
    init: function (scope, method, options) {
      var self = this;
      this.bindings(method, options);
    },
    events: function (instance) {
      var orbit_instance = new Orbit(this.S(instance), this.S(instance).data('orbit-init'));
      this.S(instance).data(this.name + '-instance', orbit_instance);
    },
    reflow: function () {
      var self = this;
      if (self.S(self.scope).is('[data-orbit]')) {
        var $el = self.S(self.scope);
        var instance = $el.data(self.name + '-instance');
        instance.compute_dimensions();
      } else {
        self.S('[data-orbit]', self.scope).each(function (idx, el) {
          var $el = self.S(el);
          var opts = self.data_options($el);
          var instance = $el.data(self.name + '-instance');
          instance.compute_dimensions();
        });
      }
    }
  };
}(jQuery, window, window.document));;
(function ($, window, document, undefined) {
  'use strict';
  Foundation.libs.reveal = {
    name: 'reveal',
    version: '5.4.5',
    locked: false,
    settings: {
      animation: 'fadeAndPop',
      animation_speed: 250,
      close_on_background_click: true,
      close_on_esc: true,
      dismiss_modal_class: 'close-reveal-modal',
      bg_class: 'reveal-modal-bg',
      root_element: 'body',
      open: function () {
      },
      opened: function () {
      },
      close: function () {
      },
      closed: function () {
      },
      bg: $('.reveal-modal-bg'),
      css: {
        open: {
          'opacity': 0,
          'visibility': 'visible',
          'display': 'block'
        },
        close: {
          'opacity': 1,
          'visibility': 'hidden',
          'display': 'none'
        }
      }
    },
    init: function (scope, method, options) {
      $.extend(true, this.settings, method, options);
      this.bindings(method, options);
    },
    events: function (scope) {
      var self = this, S = self.S;
      S(this.scope).off('.reveal').on('click.fndtn.reveal', '[' + this.add_namespace('data-reveal-id') + ']:not([disabled])', function (e) {
        e.preventDefault();
        if (!self.locked) {
          var element = S(this), ajax = element.data(self.data_attr('reveal-ajax'));
          self.locked = true;
          if (typeof ajax === 'undefined') {
            self.open.call(self, element);
          } else {
            var url = ajax === true ? element.attr('href') : ajax;
            self.open.call(self, element, { url: url });
          }
        }
      });
      S(document).on('click.fndtn.reveal', this.close_targets(), function (e) {
        e.preventDefault();
        if (!self.locked) {
          var settings = S('[' + self.attr_name() + '].open').data(self.attr_name(true) + '-init'), bg_clicked = S(e.target)[0] === S('.' + settings.bg_class)[0];
          if (bg_clicked) {
            if (settings.close_on_background_click) {
              e.stopPropagation();
            } else {
              return;
            }
          }
          self.locked = true;
          self.close.call(self, bg_clicked ? S('[' + self.attr_name() + '].open') : S(this).closest('[' + self.attr_name() + ']'));
        }
      });
      if (S('[' + self.attr_name() + ']', this.scope).length > 0) {
        S(this.scope).on('open.fndtn.reveal', this.settings.open).on('opened.fndtn.reveal', this.settings.opened).on('opened.fndtn.reveal', this.open_video).on('close.fndtn.reveal', this.settings.close).on('closed.fndtn.reveal', this.settings.closed).on('closed.fndtn.reveal', this.close_video);
      } else {
        S(this.scope).on('open.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.open).on('opened.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.opened).on('opened.fndtn.reveal', '[' + self.attr_name() + ']', this.open_video).on('close.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.close).on('closed.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.closed).on('closed.fndtn.reveal', '[' + self.attr_name() + ']', this.close_video);
      }
      return true;
    },
    key_up_on: function (scope) {
      var self = this;
      self.S('body').off('keyup.fndtn.reveal').on('keyup.fndtn.reveal', function (event) {
        var open_modal = self.S('[' + self.attr_name() + '].open'), settings = open_modal.data(self.attr_name(true) + '-init') || self.settings;
        if (settings && event.which === 27 && settings.close_on_esc && !self.locked) {
          self.close.call(self, open_modal);
        }
      });
      return true;
    },
    key_up_off: function (scope) {
      this.S('body').off('keyup.fndtn.reveal');
      return true;
    },
    open: function (target, ajax_settings) {
      var self = this, modal;
      if (target) {
        if (typeof target.selector !== 'undefined') {
          modal = self.S('#' + target.data(self.data_attr('reveal-id'))).first();
        } else {
          modal = self.S(this.scope);
          ajax_settings = target;
        }
      } else {
        modal = self.S(this.scope);
      }
      var settings = modal.data(self.attr_name(true) + '-init');
      settings = settings || this.settings;
      if (modal.hasClass('open') && target.attr('data-reveal-id') == modal.attr('id')) {
        return self.close(modal);
      }
      if (!modal.hasClass('open')) {
        var open_modal = self.S('[' + self.attr_name() + '].open');
        if (typeof modal.data('css-top') === 'undefined') {
          modal.data('css-top', parseInt(modal.css('top'), 10)).data('offset', this.cache_offset(modal));
        }
        this.key_up_on(modal);
        modal.trigger('open').trigger('open.fndtn.reveal');
        if (open_modal.length < 1) {
          this.toggle_bg(modal, true);
        }
        if (typeof ajax_settings === 'string') {
          ajax_settings = { url: ajax_settings };
        }
        if (typeof ajax_settings === 'undefined' || !ajax_settings.url) {
          if (open_modal.length > 0) {
            this.hide(open_modal, settings.css.close);
          }
          this.show(modal, settings.css.open);
        } else {
          var old_success = typeof ajax_settings.success !== 'undefined' ? ajax_settings.success : null;
          $.extend(ajax_settings, {
            success: function (data, textStatus, jqXHR) {
              if ($.isFunction(old_success)) {
                old_success(data, textStatus, jqXHR);
              }
              modal.html(data);
              self.S(modal).foundation('section', 'reflow');
              self.S(modal).children().foundation();
              if (open_modal.length > 0) {
                self.hide(open_modal, settings.css.close);
              }
              self.show(modal, settings.css.open);
            }
          });
          $.ajax(ajax_settings);
        }
      }
      self.S(window).trigger('resize');
    },
    close: function (modal) {
      var modal = modal && modal.length ? modal : this.S(this.scope), open_modals = this.S('[' + this.attr_name() + '].open'), settings = modal.data(this.attr_name(true) + '-init') || this.settings;
      if (open_modals.length > 0) {
        this.locked = true;
        this.key_up_off(modal);
        modal.trigger('close').trigger('close.fndtn.reveal');
        this.toggle_bg(modal, false);
        this.hide(open_modals, settings.css.close, settings);
      }
    },
    close_targets: function () {
      var base = '.' + this.settings.dismiss_modal_class;
      if (this.settings.close_on_background_click) {
        return base + ', .' + this.settings.bg_class;
      }
      return base;
    },
    toggle_bg: function (modal, state) {
      if (this.S('.' + this.settings.bg_class).length === 0) {
        this.settings.bg = $('<div />', { 'class': this.settings.bg_class }).appendTo('body').hide();
      }
      var visible = this.settings.bg.filter(':visible').length > 0;
      if (state != visible) {
        if (state == undefined ? visible : !state) {
          this.hide(this.settings.bg);
        } else {
          this.show(this.settings.bg);
        }
      }
    },
    show: function (el, css) {
      if (css) {
        var settings = el.data(this.attr_name(true) + '-init') || this.settings, root_element = settings.root_element;
        if (el.parent(root_element).length === 0) {
          var placeholder = el.wrap('<div style="display: none;" />').parent();
          el.on('closed.fndtn.reveal.wrapped', function () {
            el.detach().appendTo(placeholder);
            el.unwrap().unbind('closed.fndtn.reveal.wrapped');
          });
          el.detach().appendTo(root_element);
        }
        var animData = getAnimationData(settings.animation);
        if (!animData.animate) {
          this.locked = false;
        }
        if (animData.pop) {
          css.top = $(window).scrollTop() - el.data('offset') + 'px';
          var end_css = {
              top: $(window).scrollTop() + el.data('css-top') + 'px',
              opacity: 1
            };
          return setTimeout(function () {
            return el.css(css).animate(end_css, settings.animation_speed, 'linear', function () {
              this.locked = false;
              el.trigger('opened').trigger('opened.fndtn.reveal');
            }.bind(this)).addClass('open');
          }.bind(this), settings.animation_speed / 2);
        }
        if (animData.fade) {
          css.top = $(window).scrollTop() + el.data('css-top') + 'px';
          var end_css = { opacity: 1 };
          return setTimeout(function () {
            return el.css(css).animate(end_css, settings.animation_speed, 'linear', function () {
              this.locked = false;
              el.trigger('opened').trigger('opened.fndtn.reveal');
            }.bind(this)).addClass('open');
          }.bind(this), settings.animation_speed / 2);
        }
        return el.css(css).show().css({ opacity: 1 }).addClass('open').trigger('opened').trigger('opened.fndtn.reveal');
      }
      var settings = this.settings;
      if (getAnimationData(settings.animation).fade) {
        return el.fadeIn(settings.animation_speed / 2);
      }
      this.locked = false;
      return el.show();
    },
    hide: function (el, css) {
      if (css) {
        var settings = el.data(this.attr_name(true) + '-init');
        settings = settings || this.settings;
        var animData = getAnimationData(settings.animation);
        if (!animData.animate) {
          this.locked = false;
        }
        if (animData.pop) {
          var end_css = {
              top: -$(window).scrollTop() - el.data('offset') + 'px',
              opacity: 0
            };
          return setTimeout(function () {
            return el.animate(end_css, settings.animation_speed, 'linear', function () {
              this.locked = false;
              el.css(css).trigger('closed').trigger('closed.fndtn.reveal');
            }.bind(this)).removeClass('open');
          }.bind(this), settings.animation_speed / 2);
        }
        if (animData.fade) {
          var end_css = { opacity: 0 };
          return setTimeout(function () {
            return el.animate(end_css, settings.animation_speed, 'linear', function () {
              this.locked = false;
              el.css(css).trigger('closed').trigger('closed.fndtn.reveal');
            }.bind(this)).removeClass('open');
          }.bind(this), settings.animation_speed / 2);
        }
        return el.hide().css(css).removeClass('open').trigger('closed').trigger('closed.fndtn.reveal');
      }
      var settings = this.settings;
      if (getAnimationData(settings.animation).fade) {
        return el.fadeOut(settings.animation_speed / 2);
      }
      return el.hide();
    },
    close_video: function (e) {
      var video = $('.flex-video', e.target), iframe = $('iframe', video);
      if (iframe.length > 0) {
        iframe.attr('data-src', iframe[0].src);
        iframe.attr('src', iframe.attr('src'));
        video.hide();
      }
    },
    open_video: function (e) {
      var video = $('.flex-video', e.target), iframe = video.find('iframe');
      if (iframe.length > 0) {
        var data_src = iframe.attr('data-src');
        if (typeof data_src === 'string') {
          iframe[0].src = iframe.attr('data-src');
        } else {
          var src = iframe[0].src;
          iframe[0].src = undefined;
          iframe[0].src = src;
        }
        video.show();
      }
    },
    data_attr: function (str) {
      if (this.namespace.length > 0) {
        return this.namespace + '-' + str;
      }
      return str;
    },
    cache_offset: function (modal) {
      var offset = modal.show().height() + parseInt(modal.css('top'), 10);
      modal.hide();
      return offset;
    },
    off: function () {
      $(this.scope).off('.fndtn.reveal');
    },
    reflow: function () {
    }
  };
  function getAnimationData(str) {
    var fade = /fade/i.test(str);
    var pop = /pop/i.test(str);
    return {
      animate: fade || pop,
      pop: pop,
      fade: fade
    };
  }
}(jQuery, window, window.document));;
(function ($, window, document, undefined) {
  'use strict';
  Foundation.libs.slider = {
    name: 'slider',
    version: '5.4.5',
    settings: {
      start: 0,
      end: 100,
      step: 1,
      initial: null,
      display_selector: '',
      vertical: false,
      on_change: function () {
      }
    },
    cache: {},
    init: function (scope, method, options) {
      Foundation.inherit(this, 'throttle');
      this.bindings(method, options);
      this.reflow();
    },
    events: function () {
      var self = this;
      $(this.scope).off('.slider').on('mousedown.fndtn.slider touchstart.fndtn.slider pointerdown.fndtn.slider', '[' + self.attr_name() + ']:not(.disabled, [disabled]) .range-slider-handle', function (e) {
        if (!self.cache.active) {
          e.preventDefault();
          self.set_active_slider($(e.target));
        }
      }).on('mousemove.fndtn.slider touchmove.fndtn.slider pointermove.fndtn.slider', function (e) {
        if (!!self.cache.active) {
          e.preventDefault();
          if ($.data(self.cache.active[0], 'settings').vertical) {
            var scroll_offset = 0;
            if (!e.pageY) {
              scroll_offset = window.scrollY;
            }
            self.calculate_position(self.cache.active, (e.pageY || e.originalEvent.clientY || e.originalEvent.touches[0].clientY || e.currentPoint.y) + scroll_offset);
          } else {
            self.calculate_position(self.cache.active, e.pageX || e.originalEvent.clientX || e.originalEvent.touches[0].clientX || e.currentPoint.x);
          }
        }
      }).on('mouseup.fndtn.slider touchend.fndtn.slider pointerup.fndtn.slider', function (e) {
        self.remove_active_slider();
      }).on('change.fndtn.slider', function (e) {
        self.settings.on_change();
      });
      self.S(window).on('resize.fndtn.slider', self.throttle(function (e) {
        self.reflow();
      }, 300));
    },
    set_active_slider: function ($handle) {
      this.cache.active = $handle;
    },
    remove_active_slider: function () {
      this.cache.active = null;
    },
    calculate_position: function ($handle, cursor_x) {
      var self = this, settings = $.data($handle[0], 'settings'), handle_l = $.data($handle[0], 'handle_l'), handle_o = $.data($handle[0], 'handle_o'), bar_l = $.data($handle[0], 'bar_l'), bar_o = $.data($handle[0], 'bar_o');
      requestAnimationFrame(function () {
        var pct;
        if (Foundation.rtl && !settings.vertical) {
          pct = self.limit_to((bar_o + bar_l - cursor_x) / bar_l, 0, 1);
        } else {
          pct = self.limit_to((cursor_x - bar_o) / bar_l, 0, 1);
        }
        pct = settings.vertical ? 1 - pct : pct;
        var norm = self.normalized_value(pct, settings.start, settings.end, settings.step);
        self.set_ui($handle, norm);
      });
    },
    set_ui: function ($handle, value) {
      var settings = $.data($handle[0], 'settings'), handle_l = $.data($handle[0], 'handle_l'), bar_l = $.data($handle[0], 'bar_l'), norm_pct = this.normalized_percentage(value, settings.start, settings.end), handle_offset = norm_pct * (bar_l - handle_l) - 1, progress_bar_length = norm_pct * 100;
      if (Foundation.rtl && !settings.vertical) {
        handle_offset = -handle_offset;
      }
      handle_offset = settings.vertical ? -handle_offset + bar_l - handle_l + 1 : handle_offset;
      this.set_translate($handle, handle_offset, settings.vertical);
      if (settings.vertical) {
        $handle.siblings('.range-slider-active-segment').css('height', progress_bar_length + '%');
      } else {
        $handle.siblings('.range-slider-active-segment').css('width', progress_bar_length + '%');
      }
      $handle.parent().attr(this.attr_name(), value).trigger('change').trigger('change.fndtn.slider');
      $handle.parent().children('input[type=hidden]').val(value);
      if (!$handle[0].hasAttribute('aria-valuemin')) {
        $handle.attr({
          'aria-valuemin': settings.start,
          'aria-valuemax': settings.end
        });
      }
      $handle.attr('aria-valuenow', value);
    },
    normalized_percentage: function (val, start, end) {
      return Math.min(1, (val - start) / (end - start));
    },
    normalized_value: function (val, start, end, step) {
      var range = end - start, point = val * range, mod = (point - point % step) / step, rem = point % step, round = rem >= step * 0.5 ? step : 0;
      return mod * step + round + start;
    },
    set_translate: function (ele, offset, vertical) {
      if (vertical) {
        $(ele).css('-webkit-transform', 'translateY(' + offset + 'px)').css('-moz-transform', 'translateY(' + offset + 'px)').css('-ms-transform', 'translateY(' + offset + 'px)').css('-o-transform', 'translateY(' + offset + 'px)').css('transform', 'translateY(' + offset + 'px)');
      } else {
        $(ele).css('-webkit-transform', 'translateX(' + offset + 'px)').css('-moz-transform', 'translateX(' + offset + 'px)').css('-ms-transform', 'translateX(' + offset + 'px)').css('-o-transform', 'translateX(' + offset + 'px)').css('transform', 'translateX(' + offset + 'px)');
      }
    },
    limit_to: function (val, min, max) {
      return Math.min(Math.max(val, min), max);
    },
    initialize_settings: function (handle) {
      var settings = $.extend({}, this.settings, this.data_options($(handle).parent()));
      if (settings.vertical) {
        $.data(handle, 'bar_o', $(handle).parent().offset().top);
        $.data(handle, 'bar_l', $(handle).parent().outerHeight());
        $.data(handle, 'handle_o', $(handle).offset().top);
        $.data(handle, 'handle_l', $(handle).outerHeight());
      } else {
        $.data(handle, 'bar_o', $(handle).parent().offset().left);
        $.data(handle, 'bar_l', $(handle).parent().outerWidth());
        $.data(handle, 'handle_o', $(handle).offset().left);
        $.data(handle, 'handle_l', $(handle).outerWidth());
      }
      $.data(handle, 'bar', $(handle).parent());
      $.data(handle, 'settings', settings);
    },
    set_initial_position: function ($ele) {
      var settings = $.data($ele.children('.range-slider-handle')[0], 'settings'), initial = !!settings.initial ? settings.initial : Math.floor((settings.end - settings.start) * 0.5 / settings.step) * settings.step + settings.start, $handle = $ele.children('.range-slider-handle');
      this.set_ui($handle, initial);
    },
    set_value: function (value) {
      var self = this;
      $('[' + self.attr_name() + ']', this.scope).each(function () {
        $(this).attr(self.attr_name(), value);
      });
      if (!!$(this.scope).attr(self.attr_name())) {
        $(this.scope).attr(self.attr_name(), value);
      }
      self.reflow();
    },
    reflow: function () {
      var self = this;
      self.S('[' + this.attr_name() + ']').each(function () {
        var handle = $(this).children('.range-slider-handle')[0], val = $(this).attr(self.attr_name());
        self.initialize_settings(handle);
        if (val) {
          self.set_ui($(handle), parseFloat(val));
        } else {
          self.set_initial_position($(this));
        }
      });
    }
  };
}(jQuery, window, window.document));;
(function ($, window, document, undefined) {
  'use strict';
  Foundation.libs.tab = {
    name: 'tab',
    version: '5.4.5',
    settings: {
      active_class: 'active',
      callback: function () {
      },
      deep_linking: false,
      scroll_to_content: true,
      is_hover: false
    },
    default_tab_hashes: [],
    init: function (scope, method, options) {
      var self = this, S = this.S;
      this.bindings(method, options);
      this.handle_location_hash_change();
      S('[' + this.attr_name() + '] > .active > a', this.scope).each(function () {
        self.default_tab_hashes.push(this.hash);
      });
    },
    events: function () {
      var self = this, S = this.S;
      var usual_tab_behavior = function (e) {
        var settings = S(this).closest('[' + self.attr_name() + ']').data(self.attr_name(true) + '-init');
        if (!settings.is_hover || Modernizr.touch) {
          e.preventDefault();
          e.stopPropagation();
          self.toggle_active_tab(S(this).parent());
        }
      };
      S(this.scope).off('.tab').on('focus.fndtn.tab', '[' + this.attr_name() + '] > * > a', usual_tab_behavior).on('click.fndtn.tab', '[' + this.attr_name() + '] > * > a', usual_tab_behavior).on('mouseenter.fndtn.tab', '[' + this.attr_name() + '] > * > a', function (e) {
        var settings = S(this).closest('[' + self.attr_name() + ']').data(self.attr_name(true) + '-init');
        if (settings.is_hover)
          self.toggle_active_tab(S(this).parent());
      });
      S(window).on('hashchange.fndtn.tab', function (e) {
        e.preventDefault();
        self.handle_location_hash_change();
      });
    },
    handle_location_hash_change: function () {
      var self = this, S = this.S;
      S('[' + this.attr_name() + ']', this.scope).each(function () {
        var settings = S(this).data(self.attr_name(true) + '-init');
        if (settings.deep_linking) {
          var hash;
          if (settings.scroll_to_content) {
            hash = self.scope.location.hash;
          } else {
            hash = self.scope.location.hash.replace('fndtn-', '');
          }
          if (hash != '') {
            var hash_element = S(hash);
            if (hash_element.hasClass('content') && hash_element.parent().hasClass('tab-content')) {
              self.toggle_active_tab($('[' + self.attr_name() + '] > * > a[href=' + hash + ']').parent());
            } else {
              var hash_tab_container_id = hash_element.closest('.content').attr('id');
              if (hash_tab_container_id != undefined) {
                self.toggle_active_tab($('[' + self.attr_name() + '] > * > a[href=#' + hash_tab_container_id + ']').parent(), hash);
              }
            }
          } else {
            for (var ind in self.default_tab_hashes) {
              self.toggle_active_tab($('[' + self.attr_name() + '] > * > a[href=' + self.default_tab_hashes[ind] + ']').parent());
            }
          }
        }
      });
    },
    toggle_active_tab: function (tab, location_hash) {
      var S = this.S, tabs = tab.closest('[' + this.attr_name() + ']'), tab_link = tab.find('a'), anchor = tab.children('a').first(), target_hash = '#' + anchor.attr('href').split('#')[1], target = S(target_hash), siblings = tab.siblings(), settings = tabs.data(this.attr_name(true) + '-init'), interpret_keyup_action = function (e) {
          var $original = $(this);
          var $prev = $(this).parents('li').prev().children('[role="tab"]');
          var $next = $(this).parents('li').next().children('[role="tab"]');
          var $target;
          switch (e.keyCode) {
          case 37:
            $target = $prev;
            break;
          case 39:
            $target = $next;
            break;
          default:
            $target = false;
            break;
          }
          if ($target.length) {
            $original.attr({
              'tabindex': '-1',
              'aria-selected': null
            });
            $target.attr({
              'tabindex': '0',
              'aria-selected': true
            }).focus();
          }
          $('[role="tabpanel"]').attr('aria-hidden', 'true');
          $('#' + $(document.activeElement).attr('href').substring(1)).attr('aria-hidden', null);
        };
      if (S(this).data(this.data_attr('tab-content'))) {
        target_hash = '#' + S(this).data(this.data_attr('tab-content')).split('#')[1];
        target = S(target_hash);
      }
      if (settings.deep_linking) {
        if (settings.scroll_to_content) {
          window.location.hash = location_hash || target_hash;
          if (location_hash == undefined || location_hash == target_hash) {
            tab.parent()[0].scrollIntoView();
          } else {
            S(target_hash)[0].scrollIntoView();
          }
        } else {
          if (location_hash != undefined) {
            window.location.hash = 'fndtn-' + location_hash.replace('#', '');
          } else {
            window.location.hash = 'fndtn-' + target_hash.replace('#', '');
          }
        }
      }
      tab.addClass(settings.active_class).triggerHandler('opened');
      tab_link.attr({
        'aria-selected': 'true',
        tabindex: 0
      });
      siblings.removeClass(settings.active_class);
      siblings.find('a').attr({
        'aria-selected': 'false',
        tabindex: -1
      });
      target.siblings().removeClass(settings.active_class).attr({
        'aria-hidden': 'true',
        tabindex: -1
      }).end().addClass(settings.active_class).attr('aria-hidden', 'false').find(':first-child').attr('tabindex', 0);
      settings.callback(tab);
      target.children().attr('tab-index', 0);
      target.triggerHandler('toggled', [tab]);
      tabs.triggerHandler('toggled', [target]);
      tab_link.on('keydown', interpret_keyup_action);
    },
    data_attr: function (str) {
      if (this.namespace.length > 0) {
        return this.namespace + '-' + str;
      }
      return str;
    },
    off: function () {
    },
    reflow: function () {
    }
  };
}(jQuery, window, window.document));;
(function ($, window, document, undefined) {
  'use strict';
  Foundation.libs.tooltip = {
    name: 'tooltip',
    version: '5.4.5',
    settings: {
      additional_inheritable_classes: [],
      tooltip_class: '.tooltip',
      append_to: 'body',
      touch_close_text: 'Tap To Close',
      disable_for_touch: false,
      hover_delay: 200,
      show_on: 'all',
      tip_template: function (selector, content) {
        return '<span data-selector="' + selector + '" id="' + selector + '" class="' + Foundation.libs.tooltip.settings.tooltip_class.substring(1) + '" role="tooltip">' + content + '<span class="nub"></span></span>';
      }
    },
    cache: {},
    init: function (scope, method, options) {
      Foundation.inherit(this, 'random_str');
      this.bindings(method, options);
    },
    should_show: function (target, tip) {
      var settings = $.extend({}, this.settings, this.data_options(target));
      if (settings.show_on === 'all') {
        return true;
      } else if (this.small() && settings.show_on === 'small') {
        return true;
      } else if (this.medium() && settings.show_on === 'medium') {
        return true;
      } else if (this.large() && settings.show_on === 'large') {
        return true;
      }
      return false;
    },
    medium: function () {
      return matchMedia(Foundation.media_queries['medium']).matches;
    },
    large: function () {
      return matchMedia(Foundation.media_queries['large']).matches;
    },
    events: function (instance) {
      var self = this, S = self.S;
      self.create(this.S(instance));
      $(this.scope).off('.tooltip').on('mouseenter.fndtn.tooltip mouseleave.fndtn.tooltip touchstart.fndtn.tooltip MSPointerDown.fndtn.tooltip', '[' + this.attr_name() + ']', function (e) {
        var $this = S(this), settings = $.extend({}, self.settings, self.data_options($this)), is_touch = false;
        if (Modernizr.touch && /touchstart|MSPointerDown/i.test(e.type) && S(e.target).is('a')) {
          return false;
        }
        if (/mouse/i.test(e.type) && self.ie_touch(e))
          return false;
        if ($this.hasClass('open')) {
          if (Modernizr.touch && /touchstart|MSPointerDown/i.test(e.type))
            e.preventDefault();
          self.hide($this);
        } else {
          if (settings.disable_for_touch && Modernizr.touch && /touchstart|MSPointerDown/i.test(e.type)) {
            return;
          } else if (!settings.disable_for_touch && Modernizr.touch && /touchstart|MSPointerDown/i.test(e.type)) {
            e.preventDefault();
            S(settings.tooltip_class + '.open').hide();
            is_touch = true;
          }
          if (/enter|over/i.test(e.type)) {
            this.timer = setTimeout(function () {
              var tip = self.showTip($this);
            }.bind(this), self.settings.hover_delay);
          } else if (e.type === 'mouseout' || e.type === 'mouseleave') {
            clearTimeout(this.timer);
            self.hide($this);
          } else {
            self.showTip($this);
          }
        }
      }).on('mouseleave.fndtn.tooltip touchstart.fndtn.tooltip MSPointerDown.fndtn.tooltip', '[' + this.attr_name() + '].open', function (e) {
        if (/mouse/i.test(e.type) && self.ie_touch(e))
          return false;
        if ($(this).data('tooltip-open-event-type') == 'touch' && e.type == 'mouseleave') {
          return;
        } else if ($(this).data('tooltip-open-event-type') == 'mouse' && /MSPointerDown|touchstart/i.test(e.type)) {
          self.convert_to_touch($(this));
        } else {
          self.hide($(this));
        }
      }).on('DOMNodeRemoved DOMAttrModified', '[' + this.attr_name() + ']:not(a)', function (e) {
        self.hide(S(this));
      });
    },
    ie_touch: function (e) {
      return false;
    },
    showTip: function ($target) {
      var $tip = this.getTip($target);
      if (this.should_show($target, $tip)) {
        return this.show($target);
      }
      return;
    },
    getTip: function ($target) {
      var selector = this.selector($target), settings = $.extend({}, this.settings, this.data_options($target)), tip = null;
      if (selector) {
        tip = this.S('span[data-selector="' + selector + '"]' + settings.tooltip_class);
      }
      return typeof tip === 'object' ? tip : false;
    },
    selector: function ($target) {
      var id = $target.attr('id'), dataSelector = $target.attr(this.attr_name()) || $target.attr('data-selector');
      if ((id && id.length < 1 || !id) && typeof dataSelector != 'string') {
        dataSelector = this.random_str(6);
        $target.attr('data-selector', dataSelector).attr('aria-describedby', dataSelector);
      }
      return id && id.length > 0 ? id : dataSelector;
    },
    create: function ($target) {
      var self = this, settings = $.extend({}, this.settings, this.data_options($target)), tip_template = this.settings.tip_template;
      if (typeof settings.tip_template === 'string' && window.hasOwnProperty(settings.tip_template)) {
        tip_template = window[settings.tip_template];
      }
      var $tip = $(tip_template(this.selector($target), $('<div></div>').html($target.attr('title')).html())), classes = this.inheritable_classes($target);
      $tip.addClass(classes).appendTo(settings.append_to);
      if (Modernizr.touch) {
        $tip.append('<span class="tap-to-close">' + settings.touch_close_text + '</span>');
        $tip.on('touchstart.fndtn.tooltip MSPointerDown.fndtn.tooltip', function (e) {
          self.hide($target);
        });
      }
      $target.removeAttr('title').attr('title', '');
    },
    reposition: function (target, tip, classes) {
      var width, nub, nubHeight, nubWidth, column, objPos;
      tip.css('visibility', 'hidden').show();
      width = target.data('width');
      nub = tip.children('.nub');
      nubHeight = nub.outerHeight();
      nubWidth = nub.outerHeight();
      if (this.small()) {
        tip.css({ 'width': '100%' });
      } else {
        tip.css({ 'width': width ? width : 'auto' });
      }
      objPos = function (obj, top, right, bottom, left, width) {
        return obj.css({
          'top': top ? top : 'auto',
          'bottom': bottom ? bottom : 'auto',
          'left': left ? left : 'auto',
          'right': right ? right : 'auto'
        }).end();
      };
      objPos(tip, target.offset().top + target.outerHeight() + 10, 'auto', 'auto', target.offset().left);
      if (this.small()) {
        objPos(tip, target.offset().top + target.outerHeight() + 10, 'auto', 'auto', 12.5, $(this.scope).width());
        tip.addClass('tip-override');
        objPos(nub, -nubHeight, 'auto', 'auto', target.offset().left);
      } else {
        var left = target.offset().left;
        if (Foundation.rtl) {
          nub.addClass('rtl');
          left = target.offset().left + target.outerWidth() - tip.outerWidth();
        }
        objPos(tip, target.offset().top + target.outerHeight() + 10, 'auto', 'auto', left);
        tip.removeClass('tip-override');
        if (classes && classes.indexOf('tip-top') > -1) {
          if (Foundation.rtl)
            nub.addClass('rtl');
          objPos(tip, target.offset().top - tip.outerHeight(), 'auto', 'auto', left).removeClass('tip-override');
        } else if (classes && classes.indexOf('tip-left') > -1) {
          objPos(tip, target.offset().top + target.outerHeight() / 2 - tip.outerHeight() / 2, 'auto', 'auto', target.offset().left - tip.outerWidth() - nubHeight).removeClass('tip-override');
          nub.removeClass('rtl');
        } else if (classes && classes.indexOf('tip-right') > -1) {
          objPos(tip, target.offset().top + target.outerHeight() / 2 - tip.outerHeight() / 2, 'auto', 'auto', target.offset().left + target.outerWidth() + nubHeight).removeClass('tip-override');
          nub.removeClass('rtl');
        }
      }
      tip.css('visibility', 'visible').hide();
    },
    small: function () {
      return matchMedia(Foundation.media_queries.small).matches && !matchMedia(Foundation.media_queries.medium).matches;
    },
    inheritable_classes: function ($target) {
      var settings = $.extend({}, this.settings, this.data_options($target)), inheritables = [
          'tip-top',
          'tip-left',
          'tip-bottom',
          'tip-right',
          'radius',
          'round'
        ].concat(settings.additional_inheritable_classes), classes = $target.attr('class'), filtered = classes ? $.map(classes.split(' '), function (el, i) {
          if ($.inArray(el, inheritables) !== -1) {
            return el;
          }
        }).join(' ') : '';
      return $.trim(filtered);
    },
    convert_to_touch: function ($target) {
      var self = this, $tip = self.getTip($target), settings = $.extend({}, self.settings, self.data_options($target));
      if ($tip.find('.tap-to-close').length === 0) {
        $tip.append('<span class="tap-to-close">' + settings.touch_close_text + '</span>');
        $tip.on('click.fndtn.tooltip.tapclose touchstart.fndtn.tooltip.tapclose MSPointerDown.fndtn.tooltip.tapclose', function (e) {
          self.hide($target);
        });
      }
      $target.data('tooltip-open-event-type', 'touch');
    },
    show: function ($target) {
      var $tip = this.getTip($target);
      if ($target.data('tooltip-open-event-type') == 'touch') {
        this.convert_to_touch($target);
      }
      this.reposition($target, $tip, $target.attr('class'));
      $target.addClass('open');
      $tip.fadeIn(150);
    },
    hide: function ($target) {
      var $tip = this.getTip($target);
      $tip.fadeOut(150, function () {
        $tip.find('.tap-to-close').remove();
        $tip.off('click.fndtn.tooltip.tapclose MSPointerDown.fndtn.tapclose');
        $target.removeClass('open');
      });
    },
    off: function () {
      var self = this;
      this.S(this.scope).off('.fndtn.tooltip');
      this.S(this.settings.tooltip_class).each(function (i) {
        $('[' + self.attr_name() + ']').eq(i).attr('title', $(this).text());
      }).remove();
    },
    reflow: function () {
    }
  };
}(jQuery, window, window.document));;
(function ($, window, document, undefined) {
  'use strict';
  Foundation.libs.topbar = {
    name: 'topbar',
    version: '5.4.5',
    settings: {
      index: 0,
      sticky_class: 'sticky',
      custom_back_text: true,
      back_text: 'Back',
      mobile_show_parent_link: true,
      is_hover: true,
      scrolltop: true,
      sticky_on: 'all'
    },
    init: function (section, method, options) {
      Foundation.inherit(this, 'add_custom_rule register_media throttle');
      var self = this;
      self.register_media('topbar', 'foundation-mq-topbar');
      this.bindings(method, options);
      self.S('[' + this.attr_name() + ']', this.scope).each(function () {
        var topbar = $(this), settings = topbar.data(self.attr_name(true) + '-init'), section = self.S('section, .top-bar-section', this);
        topbar.data('index', 0);
        var topbarContainer = topbar.parent();
        if (topbarContainer.hasClass('fixed') || self.is_sticky(topbar, topbarContainer, settings)) {
          self.settings.sticky_class = settings.sticky_class;
          self.settings.sticky_topbar = topbar;
          topbar.data('height', topbarContainer.outerHeight());
          topbar.data('stickyoffset', topbarContainer.offset().top);
        } else {
          topbar.data('height', topbar.outerHeight());
        }
        if (!settings.assembled) {
          self.assemble(topbar);
        }
        if (settings.is_hover) {
          self.S('.has-dropdown', topbar).addClass('not-click');
        } else {
          self.S('.has-dropdown', topbar).removeClass('not-click');
        }
        self.add_custom_rule('.f-topbar-fixed { padding-top: ' + topbar.data('height') + 'px }');
        if (topbarContainer.hasClass('fixed')) {
          self.S('body').addClass('f-topbar-fixed');
        }
      });
    },
    is_sticky: function (topbar, topbarContainer, settings) {
      var sticky = topbarContainer.hasClass(settings.sticky_class);
      if (sticky && settings.sticky_on === 'all') {
        return true;
      } else if (sticky && this.small() && settings.sticky_on === 'small') {
        return matchMedia(Foundation.media_queries.small).matches && !matchMedia(Foundation.media_queries.medium).matches && !matchMedia(Foundation.media_queries.large).matches;
      } else if (sticky && this.medium() && settings.sticky_on === 'medium') {
        return matchMedia(Foundation.media_queries.small).matches && matchMedia(Foundation.media_queries.medium).matches && !matchMedia(Foundation.media_queries.large).matches;
      } else if (sticky && this.large() && settings.sticky_on === 'large') {
        return matchMedia(Foundation.media_queries.small).matches && matchMedia(Foundation.media_queries.medium).matches && matchMedia(Foundation.media_queries.large).matches;
      }
      return false;
    },
    toggle: function (toggleEl) {
      var self = this, topbar;
      if (toggleEl) {
        topbar = self.S(toggleEl).closest('[' + this.attr_name() + ']');
      } else {
        topbar = self.S('[' + this.attr_name() + ']');
      }
      var settings = topbar.data(this.attr_name(true) + '-init');
      var section = self.S('section, .top-bar-section', topbar);
      if (self.breakpoint()) {
        if (!self.rtl) {
          section.css({ left: '0%' });
          $('>.name', section).css({ left: '100%' });
        } else {
          section.css({ right: '0%' });
          $('>.name', section).css({ right: '100%' });
        }
        self.S('li.moved', section).removeClass('moved');
        topbar.data('index', 0);
        topbar.toggleClass('expanded').css('height', '');
      }
      if (settings.scrolltop) {
        if (!topbar.hasClass('expanded')) {
          if (topbar.hasClass('fixed')) {
            topbar.parent().addClass('fixed');
            topbar.removeClass('fixed');
            self.S('body').addClass('f-topbar-fixed');
          }
        } else if (topbar.parent().hasClass('fixed')) {
          if (settings.scrolltop) {
            topbar.parent().removeClass('fixed');
            topbar.addClass('fixed');
            self.S('body').removeClass('f-topbar-fixed');
            window.scrollTo(0, 0);
          } else {
            topbar.parent().removeClass('expanded');
          }
        }
      } else {
        if (self.is_sticky(topbar, topbar.parent(), settings)) {
          topbar.parent().addClass('fixed');
        }
        if (topbar.parent().hasClass('fixed')) {
          if (!topbar.hasClass('expanded')) {
            topbar.removeClass('fixed');
            topbar.parent().removeClass('expanded');
            self.update_sticky_positioning();
          } else {
            topbar.addClass('fixed');
            topbar.parent().addClass('expanded');
            self.S('body').addClass('f-topbar-fixed');
          }
        }
      }
    },
    timer: null,
    events: function (bar) {
      var self = this, S = this.S;
      S(this.scope).off('.topbar').on('click.fndtn.topbar', '[' + this.attr_name() + '] .toggle-topbar', function (e) {
        e.preventDefault();
        self.toggle(this);
      }).on('click.fndtn.topbar', '.top-bar .top-bar-section li a[href^="#"],[' + this.attr_name() + '] .top-bar-section li a[href^="#"]', function (e) {
        var li = $(this).closest('li');
        if (self.breakpoint() && !li.hasClass('back') && !li.hasClass('has-dropdown')) {
          self.toggle();
        }
      }).on('click.fndtn.topbar', '[' + this.attr_name() + '] li.has-dropdown', function (e) {
        var li = S(this), target = S(e.target), topbar = li.closest('[' + self.attr_name() + ']'), settings = topbar.data(self.attr_name(true) + '-init');
        if (target.data('revealId')) {
          self.toggle();
          return;
        }
        if (self.breakpoint())
          return;
        if (settings.is_hover && !Modernizr.touch)
          return;
        e.stopImmediatePropagation();
        if (li.hasClass('hover')) {
          li.removeClass('hover').find('li').removeClass('hover');
          li.parents('li.hover').removeClass('hover');
        } else {
          li.addClass('hover');
          $(li).siblings().removeClass('hover');
          if (target[0].nodeName === 'A' && target.parent().hasClass('has-dropdown')) {
            e.preventDefault();
          }
        }
      }).on('click.fndtn.topbar', '[' + this.attr_name() + '] .has-dropdown>a', function (e) {
        if (self.breakpoint()) {
          e.preventDefault();
          var $this = S(this), topbar = $this.closest('[' + self.attr_name() + ']'), section = topbar.find('section, .top-bar-section'), dropdownHeight = $this.next('.dropdown').outerHeight(), $selectedLi = $this.closest('li');
          topbar.data('index', topbar.data('index') + 1);
          $selectedLi.addClass('moved');
          if (!self.rtl) {
            section.css({ left: -(100 * topbar.data('index')) + '%' });
            section.find('>.name').css({ left: 100 * topbar.data('index') + '%' });
          } else {
            section.css({ right: -(100 * topbar.data('index')) + '%' });
            section.find('>.name').css({ right: 100 * topbar.data('index') + '%' });
          }
          topbar.css('height', $this.siblings('ul').outerHeight(true) + topbar.data('height'));
        }
      });
      S(window).off('.topbar').on('resize.fndtn.topbar', self.throttle(function () {
        self.resize.call(self);
      }, 50)).trigger('resize').trigger('resize.fndtn.topbar').load(function () {
        S(this).trigger('resize.fndtn.topbar');
      });
      S('body').off('.topbar').on('click.fndtn.topbar', function (e) {
        var parent = S(e.target).closest('li').closest('li.hover');
        if (parent.length > 0) {
          return;
        }
        S('[' + self.attr_name() + '] li.hover').removeClass('hover');
      });
      S(this.scope).on('click.fndtn.topbar', '[' + this.attr_name() + '] .has-dropdown .back', function (e) {
        e.preventDefault();
        var $this = S(this), topbar = $this.closest('[' + self.attr_name() + ']'), section = topbar.find('section, .top-bar-section'), settings = topbar.data(self.attr_name(true) + '-init'), $movedLi = $this.closest('li.moved'), $previousLevelUl = $movedLi.parent();
        topbar.data('index', topbar.data('index') - 1);
        if (!self.rtl) {
          section.css({ left: -(100 * topbar.data('index')) + '%' });
          section.find('>.name').css({ left: 100 * topbar.data('index') + '%' });
        } else {
          section.css({ right: -(100 * topbar.data('index')) + '%' });
          section.find('>.name').css({ right: 100 * topbar.data('index') + '%' });
        }
        if (topbar.data('index') === 0) {
          topbar.css('height', '');
        } else {
          topbar.css('height', $previousLevelUl.outerHeight(true) + topbar.data('height'));
        }
        setTimeout(function () {
          $movedLi.removeClass('moved');
        }, 300);
      });
      S(this.scope).find('.dropdown a').focus(function () {
        $(this).parents('.has-dropdown').addClass('hover');
      }).blur(function () {
        $(this).parents('.has-dropdown').removeClass('hover');
      });
    },
    resize: function () {
      var self = this;
      self.S('[' + this.attr_name() + ']').each(function () {
        var topbar = self.S(this), settings = topbar.data(self.attr_name(true) + '-init');
        var stickyContainer = topbar.parent('.' + self.settings.sticky_class);
        var stickyOffset;
        if (!self.breakpoint()) {
          var doToggle = topbar.hasClass('expanded');
          topbar.css('height', '').removeClass('expanded').find('li').removeClass('hover');
          if (doToggle) {
            self.toggle(topbar);
          }
        }
        if (self.is_sticky(topbar, stickyContainer, settings)) {
          if (stickyContainer.hasClass('fixed')) {
            stickyContainer.removeClass('fixed');
            stickyOffset = stickyContainer.offset().top;
            if (self.S(document.body).hasClass('f-topbar-fixed')) {
              stickyOffset -= topbar.data('height');
            }
            topbar.data('stickyoffset', stickyOffset);
            stickyContainer.addClass('fixed');
          } else {
            stickyOffset = stickyContainer.offset().top;
            topbar.data('stickyoffset', stickyOffset);
          }
        }
      });
    },
    breakpoint: function () {
      return !matchMedia(Foundation.media_queries['topbar']).matches;
    },
    small: function () {
      return matchMedia(Foundation.media_queries['small']).matches;
    },
    medium: function () {
      return matchMedia(Foundation.media_queries['medium']).matches;
    },
    large: function () {
      return matchMedia(Foundation.media_queries['large']).matches;
    },
    assemble: function (topbar) {
      var self = this, settings = topbar.data(this.attr_name(true) + '-init'), section = self.S('section, .top-bar-section', topbar);
      section.detach();
      self.S('.has-dropdown>a', section).each(function () {
        var $link = self.S(this), $dropdown = $link.siblings('.dropdown'), url = $link.attr('href'), $titleLi;
        if (!$dropdown.find('.title.back').length) {
          if (settings.mobile_show_parent_link == true && url) {
            $titleLi = $('<li class="title back js-generated"><h5><a href="javascript:void(0)"></a></h5></li><li class="parent-link show-for-small"><a class="parent-link js-generated" href="' + url + '">' + $link.html() + '</a></li>');
          } else {
            $titleLi = $('<li class="title back js-generated"><h5><a href="javascript:void(0)"></a></h5>');
          }
          if (settings.custom_back_text == true) {
            $('h5>a', $titleLi).html(settings.back_text);
          } else {
            $('h5>a', $titleLi).html('&laquo; ' + $link.html());
          }
          $dropdown.prepend($titleLi);
        }
      });
      section.appendTo(topbar);
      this.sticky();
      this.assembled(topbar);
    },
    assembled: function (topbar) {
      topbar.data(this.attr_name(true), $.extend({}, topbar.data(this.attr_name(true)), { assembled: true }));
    },
    height: function (ul) {
      var total = 0, self = this;
      $('> li', ul).each(function () {
        total += self.S(this).outerHeight(true);
      });
      return total;
    },
    sticky: function () {
      var self = this;
      this.S(window).on('scroll', function () {
        self.update_sticky_positioning();
      });
    },
    update_sticky_positioning: function () {
      var klass = '.' + this.settings.sticky_class, $window = this.S(window), self = this;
      if (self.settings.sticky_topbar && self.is_sticky(this.settings.sticky_topbar, this.settings.sticky_topbar.parent(), this.settings)) {
        var distance = this.settings.sticky_topbar.data('stickyoffset');
        if (!self.S(klass).hasClass('expanded')) {
          if ($window.scrollTop() > distance) {
            if (!self.S(klass).hasClass('fixed')) {
              self.S(klass).addClass('fixed');
              self.S('body').addClass('f-topbar-fixed');
            }
          } else if ($window.scrollTop() <= distance) {
            if (self.S(klass).hasClass('fixed')) {
              self.S(klass).removeClass('fixed');
              self.S('body').removeClass('f-topbar-fixed');
            }
          }
        }
      }
    },
    off: function () {
      this.S(this.scope).off('.fndtn.topbar');
      this.S(window).off('.fndtn.topbar');
    },
    reflow: function () {
    }
  };
}(jQuery, window, window.document));;
(function ($, window, document, undefined) {
  'use strict';
  Foundation.libs.equalizer = {
    name: 'equalizer',
    version: '5.4.5',
    settings: {
      use_tallest: true,
      before_height_change: $.noop,
      after_height_change: $.noop,
      equalize_on_stack: false
    },
    init: function (scope, method, options) {
      Foundation.inherit(this, 'image_loaded');
      this.bindings(method, options);
      this.reflow();
    },
    events: function () {
      this.S(window).off('.equalizer').on('resize.fndtn.equalizer', function (e) {
        this.reflow();
      }.bind(this));
    },
    equalize: function (equalizer) {
      var isStacked = false, vals = equalizer.find('[' + this.attr_name() + '-watch]:visible'), settings = equalizer.data(this.attr_name(true) + '-init');
      if (vals.length === 0)
        return;
      var firstTopOffset = vals.first().offset().top;
      settings.before_height_change();
      equalizer.trigger('before-height-change').trigger('before-height-change.fndth.equalizer');
      vals.height('inherit');
      vals.each(function () {
        var el = $(this);
        if (el.offset().top !== firstTopOffset) {
          isStacked = true;
        }
      });
      if (settings.equalize_on_stack === false) {
        if (isStacked)
          return;
      }
      ;
      var heights = vals.map(function () {
          return $(this).outerHeight(false);
        }).get();
      if (settings.use_tallest) {
        var max = Math.max.apply(null, heights);
        vals.css('height', max);
      } else {
        var min = Math.min.apply(null, heights);
        vals.css('height', min);
      }
      settings.after_height_change();
      equalizer.trigger('after-height-change').trigger('after-height-change.fndtn.equalizer');
    },
    reflow: function () {
      var self = this;
      this.S('[' + this.attr_name() + ']', this.scope).each(function () {
        var $eq_target = $(this);
        self.image_loaded(self.S('img', this), function () {
          self.equalize($eq_target);
        });
      });
    }
  };
}(jQuery, window, window.document));angular.module('ng-rails-csrf', []).config([
  '$httpProvider',
  function ($httpProvider) {
    var getToken = function () {
      var el = document.querySelector('meta[name="csrf-token"]');
      if (el) {
        el = el.getAttribute('content');
      } else {
        el = document.querySelector('input[name="authenticity_token"]');
        if (el) {
          el = el.value;
        }
      }
      return el;
    };
    var updateToken = function () {
      var headers = $httpProvider.defaults.headers.common, token = getToken();
      if (token) {
        headers['X-CSRF-TOKEN'] = getToken();
        headers['X-Requested-With'] = 'XMLHttpRequest';
      }
    };
    updateToken();
    if (window['Turbolinks']) {
      $(document).bind('page:change', updateToken);
    }
  }
]);(function (window, angular, undefined) {
  'use strict';
  var ngRouteModule = angular.module('ngRoute', ['ng']).provider('$route', $RouteProvider), $routeMinErr = angular.$$minErr('ngRoute');
  function $RouteProvider() {
    function inherit(parent, extra) {
      return angular.extend(Object.create(parent), extra);
    }
    var routes = {};
    this.when = function (path, route) {
      var routeCopy = angular.copy(route);
      if (angular.isUndefined(routeCopy.reloadOnSearch)) {
        routeCopy.reloadOnSearch = true;
      }
      if (angular.isUndefined(routeCopy.caseInsensitiveMatch)) {
        routeCopy.caseInsensitiveMatch = this.caseInsensitiveMatch;
      }
      routes[path] = angular.extend(routeCopy, path && pathRegExp(path, routeCopy));
      if (path) {
        var redirectPath = path[path.length - 1] == '/' ? path.substr(0, path.length - 1) : path + '/';
        routes[redirectPath] = angular.extend({ redirectTo: path }, pathRegExp(redirectPath, routeCopy));
      }
      return this;
    };
    this.caseInsensitiveMatch = false;
    function pathRegExp(path, opts) {
      var insensitive = opts.caseInsensitiveMatch, ret = {
          originalPath: path,
          regexp: path
        }, keys = ret.keys = [];
      path = path.replace(/([().])/g, '\\$1').replace(/(\/)?:(\w+)([\?\*])?/g, function (_, slash, key, option) {
        var optional = option === '?' ? option : null;
        var star = option === '*' ? option : null;
        keys.push({
          name: key,
          optional: !!optional
        });
        slash = slash || '';
        return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (star && '(.+?)' || '([^/]+)') + (optional || '') + ')' + (optional || '');
      }).replace(/([\/$\*])/g, '\\$1');
      ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
      return ret;
    }
    this.otherwise = function (params) {
      if (typeof params === 'string') {
        params = { redirectTo: params };
      }
      this.when(null, params);
      return this;
    };
    this.$get = [
      '$rootScope',
      '$location',
      '$routeParams',
      '$q',
      '$injector',
      '$templateRequest',
      '$sce',
      function ($rootScope, $location, $routeParams, $q, $injector, $templateRequest, $sce) {
        var forceReload = false, preparedRoute, preparedRouteIsUpdateOnly, $route = {
            routes: routes,
            reload: function () {
              forceReload = true;
              $rootScope.$evalAsync(function () {
                prepareRoute();
                commitRoute();
              });
            },
            updateParams: function (newParams) {
              if (this.current && this.current.$$route) {
                newParams = angular.extend({}, this.current.params, newParams);
                $location.path(interpolate(this.current.$$route.originalPath, newParams));
                $location.search(newParams);
              } else {
                throw $routeMinErr('norout', 'Tried updating route when with no current route');
              }
            }
          };
        $rootScope.$on('$locationChangeStart', prepareRoute);
        $rootScope.$on('$locationChangeSuccess', commitRoute);
        return $route;
        function switchRouteMatcher(on, route) {
          var keys = route.keys, params = {};
          if (!route.regexp)
            return null;
          var m = route.regexp.exec(on);
          if (!m)
            return null;
          for (var i = 1, len = m.length; i < len; ++i) {
            var key = keys[i - 1];
            var val = m[i];
            if (key && val) {
              params[key.name] = val;
            }
          }
          return params;
        }
        function prepareRoute($locationEvent) {
          var lastRoute = $route.current;
          preparedRoute = parseRoute();
          preparedRouteIsUpdateOnly = preparedRoute && lastRoute && preparedRoute.$$route === lastRoute.$$route && angular.equals(preparedRoute.pathParams, lastRoute.pathParams) && !preparedRoute.reloadOnSearch && !forceReload;
          if (!preparedRouteIsUpdateOnly && (lastRoute || preparedRoute)) {
            if ($rootScope.$broadcast('$routeChangeStart', preparedRoute, lastRoute).defaultPrevented) {
              if ($locationEvent) {
                $locationEvent.preventDefault();
              }
            }
          }
        }
        function commitRoute() {
          var lastRoute = $route.current;
          var nextRoute = preparedRoute;
          if (preparedRouteIsUpdateOnly) {
            lastRoute.params = nextRoute.params;
            angular.copy(lastRoute.params, $routeParams);
            $rootScope.$broadcast('$routeUpdate', lastRoute);
          } else if (nextRoute || lastRoute) {
            forceReload = false;
            $route.current = nextRoute;
            if (nextRoute) {
              if (nextRoute.redirectTo) {
                if (angular.isString(nextRoute.redirectTo)) {
                  $location.path(interpolate(nextRoute.redirectTo, nextRoute.params)).search(nextRoute.params).replace();
                } else {
                  $location.url(nextRoute.redirectTo(nextRoute.pathParams, $location.path(), $location.search())).replace();
                }
              }
            }
            $q.when(nextRoute).then(function () {
              if (nextRoute) {
                var locals = angular.extend({}, nextRoute.resolve), template, templateUrl;
                angular.forEach(locals, function (value, key) {
                  locals[key] = angular.isString(value) ? $injector.get(value) : $injector.invoke(value, null, null, key);
                });
                if (angular.isDefined(template = nextRoute.template)) {
                  if (angular.isFunction(template)) {
                    template = template(nextRoute.params);
                  }
                } else if (angular.isDefined(templateUrl = nextRoute.templateUrl)) {
                  if (angular.isFunction(templateUrl)) {
                    templateUrl = templateUrl(nextRoute.params);
                  }
                  templateUrl = $sce.getTrustedResourceUrl(templateUrl);
                  if (angular.isDefined(templateUrl)) {
                    nextRoute.loadedTemplateUrl = templateUrl;
                    template = $templateRequest(templateUrl);
                  }
                }
                if (angular.isDefined(template)) {
                  locals['$template'] = template;
                }
                return $q.all(locals);
              }
            }).then(function (locals) {
              if (nextRoute == $route.current) {
                if (nextRoute) {
                  nextRoute.locals = locals;
                  angular.copy(nextRoute.params, $routeParams);
                }
                $rootScope.$broadcast('$routeChangeSuccess', nextRoute, lastRoute);
              }
            }, function (error) {
              if (nextRoute == $route.current) {
                $rootScope.$broadcast('$routeChangeError', nextRoute, lastRoute, error);
              }
            });
          }
        }
        function parseRoute() {
          var params, match;
          angular.forEach(routes, function (route, path) {
            if (!match && (params = switchRouteMatcher($location.path(), route))) {
              match = inherit(route, {
                params: angular.extend({}, $location.search(), params),
                pathParams: params
              });
              match.$$route = route;
            }
          });
          return match || routes[null] && inherit(routes[null], {
            params: {},
            pathParams: {}
          });
        }
        function interpolate(string, params) {
          var result = [];
          angular.forEach((string || '').split(':'), function (segment, i) {
            if (i === 0) {
              result.push(segment);
            } else {
              var segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/);
              var key = segmentMatch[1];
              result.push(params[key]);
              result.push(segmentMatch[2] || '');
              delete params[key];
            }
          });
          return result.join('');
        }
      }
    ];
  }
  ngRouteModule.provider('$routeParams', $RouteParamsProvider);
  function $RouteParamsProvider() {
    this.$get = function () {
      return {};
    };
  }
  ngRouteModule.directive('ngView', ngViewFactory);
  ngRouteModule.directive('ngView', ngViewFillContentFactory);
  ngViewFactory.$inject = [
    '$route',
    '$anchorScroll',
    '$animate'
  ];
  function ngViewFactory($route, $anchorScroll, $animate) {
    return {
      restrict: 'ECA',
      terminal: true,
      priority: 400,
      transclude: 'element',
      link: function (scope, $element, attr, ctrl, $transclude) {
        var currentScope, currentElement, previousLeaveAnimation, autoScrollExp = attr.autoscroll, onloadExp = attr.onload || '';
        scope.$on('$routeChangeSuccess', update);
        update();
        function cleanupLastView() {
          if (previousLeaveAnimation) {
            $animate.cancel(previousLeaveAnimation);
            previousLeaveAnimation = null;
          }
          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if (currentElement) {
            previousLeaveAnimation = $animate.leave(currentElement);
            previousLeaveAnimation.then(function () {
              previousLeaveAnimation = null;
            });
            currentElement = null;
          }
        }
        function update() {
          var locals = $route.current && $route.current.locals, template = locals && locals.$template;
          if (angular.isDefined(template)) {
            var newScope = scope.$new();
            var current = $route.current;
            var clone = $transclude(newScope, function (clone) {
                $animate.enter(clone, null, currentElement || $element).then(function onNgViewEnter() {
                  if (angular.isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                    $anchorScroll();
                  }
                });
                cleanupLastView();
              });
            currentElement = clone;
            currentScope = current.scope = newScope;
            currentScope.$emit('$viewContentLoaded');
            currentScope.$eval(onloadExp);
          } else {
            cleanupLastView();
          }
        }
      }
    };
  }
  ngViewFillContentFactory.$inject = [
    '$compile',
    '$controller',
    '$route'
  ];
  function ngViewFillContentFactory($compile, $controller, $route) {
    return {
      restrict: 'ECA',
      priority: -400,
      link: function (scope, $element) {
        var current = $route.current, locals = current.locals;
        $element.html(locals.$template);
        var link = $compile($element.contents());
        if (current.controller) {
          locals.$scope = scope;
          var controller = $controller(current.controller, locals);
          if (current.controllerAs) {
            scope[current.controllerAs] = controller;
          }
          $element.data('$ngControllerController', controller);
          $element.children().data('$ngControllerController', controller);
        }
        link(scope);
      }
    };
  }
}(window, window.angular));(function (window, angular, undefined) {
  'use strict';
  var $resourceMinErr = angular.$$minErr('$resource');
  var MEMBER_NAME_REGEX = /^(\.[a-zA-Z_$@][0-9a-zA-Z_$@]*)+$/;
  function isValidDottedPath(path) {
    return path != null && path !== '' && path !== 'hasOwnProperty' && MEMBER_NAME_REGEX.test('.' + path);
  }
  function lookupDottedPath(obj, path) {
    if (!isValidDottedPath(path)) {
      throw $resourceMinErr('badmember', 'Dotted member path "@{0}" is invalid.', path);
    }
    var keys = path.split('.');
    for (var i = 0, ii = keys.length; i < ii && obj !== undefined; i++) {
      var key = keys[i];
      obj = obj !== null ? obj[key] : undefined;
    }
    return obj;
  }
  function shallowClearAndCopy(src, dst) {
    dst = dst || {};
    angular.forEach(dst, function (value, key) {
      delete dst[key];
    });
    for (var key in src) {
      if (src.hasOwnProperty(key) && !(key.charAt(0) === '$' && key.charAt(1) === '$')) {
        dst[key] = src[key];
      }
    }
    return dst;
  }
  angular.module('ngResource', ['ng']).provider('$resource', function () {
    var provider = this;
    this.defaults = {
      stripTrailingSlashes: true,
      actions: {
        'get': { method: 'GET' },
        'save': { method: 'POST' },
        'query': {
          method: 'GET',
          isArray: true
        },
        'remove': { method: 'DELETE' },
        'delete': { method: 'DELETE' }
      }
    };
    this.$get = [
      '$http',
      '$q',
      function ($http, $q) {
        var noop = angular.noop, forEach = angular.forEach, extend = angular.extend, copy = angular.copy, isFunction = angular.isFunction;
        function encodeUriSegment(val) {
          return encodeUriQuery(val, true).replace(/%26/gi, '&').replace(/%3D/gi, '=').replace(/%2B/gi, '+');
        }
        function encodeUriQuery(val, pctEncodeSpaces) {
          return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, pctEncodeSpaces ? '%20' : '+');
        }
        function Route(template, defaults) {
          this.template = template;
          this.defaults = extend({}, provider.defaults, defaults);
          this.urlParams = {};
        }
        Route.prototype = {
          setUrlParams: function (config, params, actionUrl) {
            var self = this, url = actionUrl || self.template, val, encodedVal;
            var urlParams = self.urlParams = {};
            forEach(url.split(/\W/), function (param) {
              if (param === 'hasOwnProperty') {
                throw $resourceMinErr('badname', 'hasOwnProperty is not a valid parameter name.');
              }
              if (!new RegExp('^\\d+$').test(param) && param && new RegExp('(^|[^\\\\]):' + param + '(\\W|$)').test(url)) {
                urlParams[param] = true;
              }
            });
            url = url.replace(/\\:/g, ':');
            params = params || {};
            forEach(self.urlParams, function (_, urlParam) {
              val = params.hasOwnProperty(urlParam) ? params[urlParam] : self.defaults[urlParam];
              if (angular.isDefined(val) && val !== null) {
                encodedVal = encodeUriSegment(val);
                url = url.replace(new RegExp(':' + urlParam + '(\\W|$)', 'g'), function (match, p1) {
                  return encodedVal + p1;
                });
              } else {
                url = url.replace(new RegExp('(/?):' + urlParam + '(\\W|$)', 'g'), function (match, leadingSlashes, tail) {
                  if (tail.charAt(0) == '/') {
                    return tail;
                  } else {
                    return leadingSlashes + tail;
                  }
                });
              }
            });
            if (self.defaults.stripTrailingSlashes) {
              url = url.replace(/\/+$/, '') || '/';
            }
            url = url.replace(/\/\.(?=\w+($|\?))/, '.');
            config.url = url.replace(/\/\\\./, '/.');
            forEach(params, function (value, key) {
              if (!self.urlParams[key]) {
                config.params = config.params || {};
                config.params[key] = value;
              }
            });
          }
        };
        function resourceFactory(url, paramDefaults, actions, options) {
          var route = new Route(url, options);
          actions = extend({}, provider.defaults.actions, actions);
          function extractParams(data, actionParams) {
            var ids = {};
            actionParams = extend({}, paramDefaults, actionParams);
            forEach(actionParams, function (value, key) {
              if (isFunction(value)) {
                value = value();
              }
              ids[key] = value && value.charAt && value.charAt(0) == '@' ? lookupDottedPath(data, value.substr(1)) : value;
            });
            return ids;
          }
          function defaultResponseInterceptor(response) {
            return response.resource;
          }
          function Resource(value) {
            shallowClearAndCopy(value || {}, this);
          }
          Resource.prototype.toJSON = function () {
            var data = extend({}, this);
            delete data.$promise;
            delete data.$resolved;
            return data;
          };
          forEach(actions, function (action, name) {
            var hasBody = /^(POST|PUT|PATCH)$/i.test(action.method);
            Resource[name] = function (a1, a2, a3, a4) {
              var params = {}, data, success, error;
              switch (arguments.length) {
              case 4:
                error = a4;
                success = a3;
              case 3:
              case 2:
                if (isFunction(a2)) {
                  if (isFunction(a1)) {
                    success = a1;
                    error = a2;
                    break;
                  }
                  success = a2;
                  error = a3;
                } else {
                  params = a1;
                  data = a2;
                  success = a3;
                  break;
                }
              case 1:
                if (isFunction(a1))
                  success = a1;
                else if (hasBody)
                  data = a1;
                else
                  params = a1;
                break;
              case 0:
                break;
              default:
                throw $resourceMinErr('badargs', 'Expected up to 4 arguments [params, data, success, error], got {0} arguments', arguments.length);
              }
              var isInstanceCall = this instanceof Resource;
              var value = isInstanceCall ? data : action.isArray ? [] : new Resource(data);
              var httpConfig = {};
              var responseInterceptor = action.interceptor && action.interceptor.response || defaultResponseInterceptor;
              var responseErrorInterceptor = action.interceptor && action.interceptor.responseError || undefined;
              forEach(action, function (value, key) {
                if (key != 'params' && key != 'isArray' && key != 'interceptor') {
                  httpConfig[key] = copy(value);
                }
              });
              if (hasBody)
                httpConfig.data = data;
              route.setUrlParams(httpConfig, extend({}, extractParams(data, action.params || {}), params), action.url);
              var promise = $http(httpConfig).then(function (response) {
                  var data = response.data, promise = value.$promise;
                  if (data) {
                    if (angular.isArray(data) !== !!action.isArray) {
                      throw $resourceMinErr('badcfg', 'Error in resource configuration for action `{0}`. Expected response to ' + 'contain an {1} but got an {2} (Request: {3} {4})', name, action.isArray ? 'array' : 'object', angular.isArray(data) ? 'array' : 'object', httpConfig.method, httpConfig.url);
                    }
                    if (action.isArray) {
                      value.length = 0;
                      forEach(data, function (item) {
                        if (typeof item === 'object') {
                          value.push(new Resource(item));
                        } else {
                          value.push(item);
                        }
                      });
                    } else {
                      shallowClearAndCopy(data, value);
                      value.$promise = promise;
                    }
                  }
                  value.$resolved = true;
                  response.resource = value;
                  return response;
                }, function (response) {
                  value.$resolved = true;
                  (error || noop)(response);
                  return $q.reject(response);
                });
              promise = promise.then(function (response) {
                var value = responseInterceptor(response);
                (success || noop)(value, response.headers);
                return value;
              }, responseErrorInterceptor);
              if (!isInstanceCall) {
                value.$promise = promise;
                value.$resolved = false;
                return value;
              }
              return promise;
            };
            Resource.prototype['$' + name] = function (params, success, error) {
              if (isFunction(params)) {
                error = success;
                success = params;
                params = {};
              }
              var result = Resource[name].call(this, params, this, success, error);
              return result.$promise || result;
            };
          });
          Resource.bind = function (additionalParamDefaults) {
            return resourceFactory(url, extend({}, paramDefaults, additionalParamDefaults), actions);
          };
          return Resource;
        }
        return resourceFactory;
      }
    ];
  });
}(window, window.angular));angular.module('pageslide-directive', []).directive('pageslide', [function () {
    return {
      restrict: 'EAC',
      transclude: !1,
      scope: {
        psOpen: '=?',
        psAutoClose: '=?',
        psSide: '@',
        psSpeed: '@',
        psClass: '@',
        psSize: '@',
        psSqueeze: '@',
        psCloak: '@',
        psPush: '@'
      },
      link: function (a, b, c) {
        function d(b, c) {
          if (b && 0 !== b.style.width && 0 !== b.style.width)
            switch (c.cloak && g.css('display', 'none'), c.side) {
            case 'right':
              b.style.width = '0px', c.squeeze && (i.style.right = '0px'), c.push && (i.style.right = '0px', i.style.left = '0px');
              break;
            case 'left':
              b.style.width = '0px', c.squeeze && (i.style.left = '0px'), c.push && (i.style.left = '0px', i.style.right = '0px');
              break;
            case 'top':
              b.style.height = '0px', c.squeeze && (i.style.top = '0px'), c.push && (i.style.top = '0px', i.style.bottom = '0px');
              break;
            case 'bottom':
              b.style.height = '0px', c.squeeze && (i.style.bottom = '0px'), c.push && (i.style.bottom = '0px', i.style.top = '0px');
            }
          a.psOpen = !1;
        }
        function e(a, b) {
          if (0 !== a.style.width && 0 !== a.style.width) {
            switch (b.side) {
            case 'right':
              a.style.width = b.size, b.squeeze && (i.style.right = b.size), b.push && (i.style.right = b.size, i.style.left = '-' + b.size);
              break;
            case 'left':
              a.style.width = b.size, b.squeeze && (i.style.left = b.size), b.push && (i.style.left = b.size, i.style.right = '-' + b.size);
              break;
            case 'top':
              a.style.height = b.size, b.squeeze && (i.style.top = b.size), b.push && (i.style.top = b.size, i.style.bottom = '-' + b.size);
              break;
            case 'bottom':
              a.style.height = b.size, b.squeeze && (i.style.bottom = b.size), b.push && (i.style.bottom = b.size, i.style.top = '-' + b.size);
            }
            setTimeout(function () {
              b.cloak && g.css('display', 'block');
            }, 1000 * b.speed);
          }
        }
        var f = {};
        f.side = a.psSide || 'right', f.speed = a.psSpeed || '0.5', f.size = a.psSize || '300px', f.zindex = 1, f.className = a.psClass || 'ng-pageslide', f.cloak = a.psCloak && 'false' == a.psCloak.toLowerCase() ? !1 : !0, f.squeeze = Boolean(a.psSqueeze) || !1, f.push = Boolean(a.psPush) || !1, b.addClass(f.className);
        var g = null, h = null, i = document.body;
        if (h = b[0], 'div' !== h.tagName.toLowerCase() && 'pageslide' !== h.tagName.toLowerCase())
          throw new Error('Pageslide can only be applied to <div> or <pageslide> elements');
        if (0 === h.children.length)
          throw new Error('You have to content inside the <pageslide>');
        switch (g = angular.element(h.children), i.appendChild(h), h.style.zIndex = f.zindex, h.style.position = 'fixed', h.style.width = 0, h.style.height = 0, h.style.overflow = 'hidden', h.style.transitionDuration = f.speed + 's', h.style.webkitTransitionDuration = f.speed + 's', h.style.transitionProperty = 'width, height', f.squeeze && (i.style.position = 'absolute', i.style.transitionDuration = f.speed + 's', i.style.webkitTransitionDuration = f.speed + 's', i.style.transitionProperty = 'top, bottom, left, right'), f.side) {
        case 'right':
          h.style.height = c.psCustomHeight || '100%', h.style.top = c.psCustomTop || '0px', h.style.bottom = c.psCustomBottom || '0px', h.style.right = c.psCustomRight || '0px';
          break;
        case 'left':
          h.style.height = c.psCustomHeight || '100%', h.style.top = c.psCustomTop || '0px', h.style.bottom = c.psCustomBottom || '0px', h.style.left = c.psCustomLeft || '0px';
          break;
        case 'top':
          h.style.width = c.psCustomWidth || '100%', h.style.left = c.psCustomLeft || '0px', h.style.top = c.psCustomTop || '0px', h.style.right = c.psCustomRight || '0px';
          break;
        case 'bottom':
          h.style.width = c.psCustomWidth || '100%', h.style.bottom = c.psCustomBottom || '0px', h.style.left = c.psCustomLeft || '0px', h.style.right = c.psCustomRight || '0px';
        }
        a.$watch('psOpen', function (a) {
          a ? e(h, f) : d(h, f);
        }), a.$on('$destroy', function () {
          document.body.removeChild(h);
        }), a.psAutoClose && (a.$on('$locationChangeStart', function () {
          d(h, f);
        }), a.$on('$stateChangeStart', function () {
          d(h, f);
        }));
      }
    };
  }]);$(function () {
  $(document).on('submit', '.form-ajax', function (e) {
    e.preventDefault();
    $this = $(e.target);
    $url = $this.data('url');
    var $method = $this.attr('method') || 'POST';
    $params = $(this).serialize();
    $.ajax({
      type: $method,
      url: $url,
      data: $params,
      dataType: 'json',
      beforeSend: function () {
        $this.find(':input').prop('disabled', true);
      },
      complete: function () {
        $this.find(':input').prop('disabled', false);
      },
      success: function (response) {
        toastr.success(response.data);
        $this.trigger('reset');
      },
      error: function (response, status, error) {
        toastr.error(error.message, 'Error!');
      }
    });
  });
  $(document).on('click', '.accordion-navigation', function (e) {
    $item = $(e.target).parent();
    $plusMinus = $item.find('.plusminus');
    if ($item.hasClass('active')) {
      $plusMinus.text('-');
    } else {
      $plusMinus.text('+');
    }
  });
  $('.eq-height').matchHeight({
    byRow: true,
    property: 'height'
  });
  $('.rotate').textrotator({
    animation: 'flipCube',
    separator: '|',
    speed: 5000
  });
  toastr.options = {
    'closeButton': true,
    'debug': false,
    'newestOnTop': false,
    'progressBar': false,
    'positionClass': 'toast-top-right',
    'preventDuplicates': false,
    'onclick': null,
    'showDuration': '300',
    'hideDuration': '1000',
    'timeOut': '5000',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut'
  };
});angular.module('myApp', [
  'ngRoute',
  'ngResource',
  'myApp.controllers',
  'myApp.services',
  'myApp.filters',
  'pageslide-directive',
  'ng-rails-csrf'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: '/templates/dashboard.html',
      controller: 'ClassRoomController',
      resolve: {
        session: function (SessionService) {
          return SessionService.getCurrentUser();
        }
      }
    }).when('/students', {
      templateUrl: '/templates/admin/student.html',
      controller: 'StudentsController'
    }).otherwise({ redirectTo: '/' });
  }
]);angular.module('myApp.controllers', []).controller('pageslideCtrl', [
  '$scope',
  'SessionService',
  function ($scope, SessionService) {
    $scope.checked = false;
    $scope.toggle = function () {
      $scope.checked = !$scope.checked;
    };
    $scope.user = null;
    SessionService.getCurrentUser().then(function (resp) {
      $scope.user = resp.user;
      $scope.user.role = resp.role;
      $scope.isAdmin = function () {
        return $scope.user.role == 'Admin';
      };
    });
  }
]).controller('ClassRoomController', [
  '$scope',
  'SessionService',
  function ($scope, SessionService) {
    $scope.user = SessionService.currentUser.user;
  }
]).controller('NotificationController', [
  '$scope',
  function ($scope) {
    $scope.notifications = [
      {
        type: 'Annoucement',
        message: 'Welcome to VCoder DashBoard'
      },
      {
        type: 'General',
        message: 'You have one message from Louis Hoang'
      }
    ];
  }
]).controller('StudentsController', [
  '$scope',
  'Student',
  function ($scope, Student) {
    $scope.sortType = 'email';
    $scope.sortReverse = false;
    $scope.searchTerm = '';
    $scope.itemsPerPage = 5;
    $scope.currentPage = 0;
    $scope.prevPage = function () {
      if ($scope.currentPage > 0) {
        $scope.currentPage--;
      }
    };
    $scope.nextPage = function () {
      if ($scope.currentPage < $scope.pageCount - 1) {
        $scope.currentPage++;
      }
    };
    $scope.getPageCount = function () {
      var array = new Array();
      for (i = 1; i <= $scope.pageCount; i++) {
        array.push(i);
      }
      return array;
    };
    $scope.startFrom = function () {
      return $scope.itemsPerPage * $scope.currentPage;
    };
    $scope.setPage = function (n) {
      $scope.currentPage = n - 1;
    };
    $scope.$watch('currentPage', function () {
      $scope.startFrom = $scope.itemsPerPage * $scope.currentPage;
    });
    Student.index(function (resp) {
      $scope.students = resp.students;
      $scope.pageCount = Math.ceil($scope.students.length / $scope.itemsPerPage);
    });
    $scope.student = {
      name: '',
      email: '',
      password: 'changeme',
      cohort: '',
      is_active: ''
    };
    $scope.newStudent = function () {
      Student.create($scope.student, function (resp) {
        if (resp.success) {
          toastr.success(resp.success);
          $scope.students.push(resp.student);
        } else {
          toastr.error(resp.error);
        }
      });
    };
    $scope.changeStatus = function (stud) {
      Student.update(stud);
    };
  }
]);angular.module('myApp.filters', []);angular.module('myApp.services', ['ngResource']).factory('SessionService', [
  '$http',
  '$q',
  function ($http, $q) {
    var service = {
        currentUser: null,
        isAuthenticated: function () {
          return !!service.currentUser;
        },
        getCurrentUser: function () {
          if (service.isAuthenticated()) {
            return $q.when(service.currentUser);
          } else {
            return $http.get('/api/current_user').then(function (resp) {
              return service.currentUser = resp.data;
            });
          }
        }
      };
    return service;
  }
]).factory('Student', [
  '$resource',
  function ($resource) {
    return $resource('/students/:id', { id: '@id' }, {
      'create': { method: 'POST' },
      'index': { method: 'GET' },
      'show': {
        method: 'GET',
        isArray: false
      },
      'update': { method: 'PUT' },
      'destroy': { method: 'DELETE' }
    });
  }
]);(function () {
}.call(this));;
(function ($) {
  var _previousResizeWidth = -1, _updateTimeout = -1;
  var _parse = function (value) {
    return parseFloat(value) || 0;
  };
  var _rows = function (elements) {
    var tolerance = 1, $elements = $(elements), lastTop = null, rows = [];
    $elements.each(function () {
      var $that = $(this), top = $that.offset().top - _parse($that.css('margin-top')), lastRow = rows.length > 0 ? rows[rows.length - 1] : null;
      if (lastRow === null) {
        rows.push($that);
      } else {
        if (Math.floor(Math.abs(lastTop - top)) <= tolerance) {
          rows[rows.length - 1] = lastRow.add($that);
        } else {
          rows.push($that);
        }
      }
      lastTop = top;
    });
    return rows;
  };
  var _parseOptions = function (options) {
    var opts = {
        byRow: true,
        property: 'height',
        target: null,
        remove: false
      };
    if (typeof options === 'object') {
      return $.extend(opts, options);
    }
    if (typeof options === 'boolean') {
      opts.byRow = options;
    } else if (options === 'remove') {
      opts.remove = true;
    }
    return opts;
  };
  var matchHeight = $.fn.matchHeight = function (options) {
      var opts = _parseOptions(options);
      if (opts.remove) {
        var that = this;
        this.css(opts.property, '');
        $.each(matchHeight._groups, function (key, group) {
          group.elements = group.elements.not(that);
        });
        return this;
      }
      if (this.length <= 1 && !opts.target) {
        return this;
      }
      matchHeight._groups.push({
        elements: this,
        options: opts
      });
      matchHeight._apply(this, opts);
      return this;
    };
  matchHeight._groups = [];
  matchHeight._throttle = 80;
  matchHeight._maintainScroll = false;
  matchHeight._beforeUpdate = null;
  matchHeight._afterUpdate = null;
  matchHeight._apply = function (elements, options) {
    var opts = _parseOptions(options), $elements = $(elements), rows = [$elements];
    var scrollTop = $(window).scrollTop(), htmlHeight = $('html').outerHeight(true);
    var $hiddenParents = $elements.parents().filter(':hidden');
    $hiddenParents.each(function () {
      var $that = $(this);
      $that.data('style-cache', $that.attr('style'));
    });
    $hiddenParents.css('display', 'block');
    if (opts.byRow && !opts.target) {
      $elements.each(function () {
        var $that = $(this), display = $that.css('display');
        if (display !== 'inline-block' && display !== 'inline-flex') {
          display = 'block';
        }
        $that.data('style-cache', $that.attr('style'));
        $that.css({
          'display': display,
          'padding-top': '0',
          'padding-bottom': '0',
          'margin-top': '0',
          'margin-bottom': '0',
          'border-top-width': '0',
          'border-bottom-width': '0',
          'height': '100px'
        });
      });
      rows = _rows($elements);
      $elements.each(function () {
        var $that = $(this);
        $that.attr('style', $that.data('style-cache') || '');
      });
    }
    $.each(rows, function (key, row) {
      var $row = $(row), targetHeight = 0;
      if (!opts.target) {
        if (opts.byRow && $row.length <= 1) {
          $row.css(opts.property, '');
          return;
        }
        $row.each(function () {
          var $that = $(this), display = $that.css('display');
          if (display !== 'inline-block' && display !== 'inline-flex') {
            display = 'block';
          }
          var css = { 'display': display };
          css[opts.property] = '';
          $that.css(css);
          if ($that.outerHeight(false) > targetHeight) {
            targetHeight = $that.outerHeight(false);
          }
          $that.css('display', '');
        });
      } else {
        targetHeight = opts.target.outerHeight(false);
      }
      $row.each(function () {
        var $that = $(this), verticalPadding = 0;
        if (opts.target && $that.is(opts.target)) {
          return;
        }
        if ($that.css('box-sizing') !== 'border-box') {
          verticalPadding += _parse($that.css('border-top-width')) + _parse($that.css('border-bottom-width'));
          verticalPadding += _parse($that.css('padding-top')) + _parse($that.css('padding-bottom'));
        }
        $that.css(opts.property, targetHeight - verticalPadding + 'px');
      });
    });
    $hiddenParents.each(function () {
      var $that = $(this);
      $that.attr('style', $that.data('style-cache') || null);
    });
    if (matchHeight._maintainScroll) {
      $(window).scrollTop(scrollTop / htmlHeight * $('html').outerHeight(true));
    }
    return this;
  };
  matchHeight._applyDataApi = function () {
    var groups = {};
    $('[data-match-height], [data-mh]').each(function () {
      var $this = $(this), groupId = $this.attr('data-mh') || $this.attr('data-match-height');
      if (groupId in groups) {
        groups[groupId] = groups[groupId].add($this);
      } else {
        groups[groupId] = $this;
      }
    });
    $.each(groups, function () {
      this.matchHeight(true);
    });
  };
  var _update = function (event) {
    if (matchHeight._beforeUpdate) {
      matchHeight._beforeUpdate(event, matchHeight._groups);
    }
    $.each(matchHeight._groups, function () {
      matchHeight._apply(this.elements, this.options);
    });
    if (matchHeight._afterUpdate) {
      matchHeight._afterUpdate(event, matchHeight._groups);
    }
  };
  matchHeight._update = function (throttle, event) {
    if (event && event.type === 'resize') {
      var windowWidth = $(window).width();
      if (windowWidth === _previousResizeWidth) {
        return;
      }
      _previousResizeWidth = windowWidth;
    }
    if (!throttle) {
      _update(event);
    } else if (_updateTimeout === -1) {
      _updateTimeout = setTimeout(function () {
        _update(event);
        _updateTimeout = -1;
      }, matchHeight._throttle);
    }
  };
  $(matchHeight._applyDataApi);
  $(window).bind('load', function (event) {
    matchHeight._update(false, event);
  });
  $(window).bind('resize orientationchange', function (event) {
    matchHeight._update(true, event);
  });
}(jQuery));!function ($) {
  var defaults = {
      animation: 'dissolve',
      separator: ',',
      speed: 2000
    };
  $.fx.step.textShadowBlur = function (fx) {
    $(fx.elem).prop('textShadowBlur', fx.now).css({ textShadow: '0 0 ' + Math.floor(fx.now) + 'px black' });
  };
  $.fn.textrotator = function (options) {
    var settings = $.extend({}, defaults, options);
    return this.each(function () {
      var el = $(this);
      var array = [];
      $.each(el.text().split(settings.separator), function (key, value) {
        array.push(value);
      });
      el.text(array[0]);
      var rotate = function () {
        switch (settings.animation) {
        case 'dissolve':
          el.animate({
            textShadowBlur: 20,
            opacity: 0
          }, 500, function () {
            index = $.inArray(el.text(), array);
            if (index + 1 == array.length)
              index = -1;
            el.text(array[index + 1]).animate({
              textShadowBlur: 0,
              opacity: 1
            }, 500);
          });
          break;
        case 'flip':
          if (el.find('.back').length > 0) {
            el.html(el.find('.back').html());
          }
          var initial = el.text();
          var index = $.inArray(initial, array);
          if (index + 1 == array.length)
            index = -1;
          el.html('');
          $('<span class=\'front\'>' + initial + '</span>').appendTo(el);
          $('<span class=\'back\'>' + array[index + 1] + '</span>').appendTo(el);
          el.wrapInner('<span class=\'rotating\' />').find('.rotating').hide().addClass('flip').show().css({
            '-webkit-transform': ' rotateY(-180deg)',
            '-moz-transform': ' rotateY(-180deg)',
            '-o-transform': ' rotateY(-180deg)',
            'transform': ' rotateY(-180deg)'
          });
          break;
        case 'flipUp':
          if (el.find('.back').length > 0) {
            el.html(el.find('.back').html());
          }
          var initial = el.text();
          var index = $.inArray(initial, array);
          if (index + 1 == array.length)
            index = -1;
          el.html('');
          $('<span class=\'front\'>' + initial + '</span>').appendTo(el);
          $('<span class=\'back\'>' + array[index + 1] + '</span>').appendTo(el);
          el.wrapInner('<span class=\'rotating\' />').find('.rotating').hide().addClass('flip up').show().css({
            '-webkit-transform': ' rotateX(-180deg)',
            '-moz-transform': ' rotateX(-180deg)',
            '-o-transform': ' rotateX(-180deg)',
            'transform': ' rotateX(-180deg)'
          });
          break;
        case 'flipCube':
          if (el.find('.back').length > 0) {
            el.html(el.find('.back').html());
          }
          var initial = el.text();
          var index = $.inArray(initial, array);
          if (index + 1 == array.length)
            index = -1;
          el.html('');
          $('<span class=\'front\'>' + initial + '</span>').appendTo(el);
          $('<span class=\'back\'>' + array[index + 1] + '</span>').appendTo(el);
          el.wrapInner('<span class=\'rotating\' />').find('.rotating').hide().addClass('flip cube').show().css({
            '-webkit-transform': ' rotateY(180deg)',
            '-moz-transform': ' rotateY(180deg)',
            '-o-transform': ' rotateY(180deg)',
            'transform': ' rotateY(180deg)'
          });
          break;
        case 'flipCubeUp':
          if (el.find('.back').length > 0) {
            el.html(el.find('.back').html());
          }
          var initial = el.text();
          var index = $.inArray(initial, array);
          if (index + 1 == array.length)
            index = -1;
          el.html('');
          $('<span class=\'front\'>' + initial + '</span>').appendTo(el);
          $('<span class=\'back\'>' + array[index + 1] + '</span>').appendTo(el);
          el.wrapInner('<span class=\'rotating\' />').find('.rotating').hide().addClass('flip cube up').show().css({
            '-webkit-transform': ' rotateX(180deg)',
            '-moz-transform': ' rotateX(180deg)',
            '-o-transform': ' rotateX(180deg)',
            'transform': ' rotateX(180deg)'
          });
          break;
        case 'spin':
          if (el.find('.rotating').length > 0) {
            el.html(el.find('.rotating').html());
          }
          index = $.inArray(el.text(), array);
          if (index + 1 == array.length)
            index = -1;
          el.wrapInner('<span class=\'rotating spin\' />').find('.rotating').hide().text(array[index + 1]).show().css({
            '-webkit-transform': ' rotate(0) scale(1)',
            '-moz-transform': 'rotate(0) scale(1)',
            '-o-transform': 'rotate(0) scale(1)',
            'transform': 'rotate(0) scale(1)'
          });
          break;
        case 'fade':
          el.fadeOut(settings.speed, function () {
            index = $.inArray(el.text(), array);
            if (index + 1 == array.length)
              index = -1;
            el.text(array[index + 1]).fadeIn(settings.speed);
          });
          break;
        }
      };
      setInterval(rotate, settings.speed);
    });
  };
}(window.jQuery);(function () {
  var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X = [].slice, Y = {}.hasOwnProperty, Z = function (a, b) {
      function c() {
        this.constructor = a;
      }
      for (var d in b)
        Y.call(b, d) && (a[d] = b[d]);
      return c.prototype = b.prototype, a.prototype = new c(), a.__super__ = b.prototype, a;
    }, $ = [].indexOf || function (a) {
      for (var b = 0, c = this.length; c > b; b++)
        if (b in this && this[b] === a)
          return b;
      return -1;
    };
  for (u = {
      catchupTime: 100,
      initialRate: 0.03,
      minTime: 250,
      ghostTime: 100,
      maxProgressPerFrame: 20,
      easeFactor: 1.25,
      startOnPageLoad: !0,
      restartOnPushState: !0,
      restartOnRequestAfter: 500,
      target: 'body',
      elements: {
        checkInterval: 100,
        selectors: ['body']
      },
      eventLag: {
        minSamples: 10,
        sampleCount: 3,
        lagThreshold: 3
      },
      ajax: {
        trackMethods: ['GET'],
        trackWebSockets: !0,
        ignoreURLs: []
      }
    }, C = function () {
      var a;
      return null != (a = 'undefined' != typeof performance && null !== performance && 'function' == typeof performance.now ? performance.now() : void 0) ? a : +new Date();
    }, E = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame, t = window.cancelAnimationFrame || window.mozCancelAnimationFrame, null == E && (E = function (a) {
      return setTimeout(a, 50);
    }, t = function (a) {
      return clearTimeout(a);
    }), G = function (a) {
      var b, c;
      return b = C(), (c = function () {
        var d;
        return d = C() - b, d >= 33 ? (b = C(), a(d, function () {
          return E(c);
        })) : setTimeout(c, 33 - d);
      })();
    }, F = function () {
      var a, b, c;
      return c = arguments[0], b = arguments[1], a = 3 <= arguments.length ? X.call(arguments, 2) : [], 'function' == typeof c[b] ? c[b].apply(c, a) : c[b];
    }, v = function () {
      var a, b, c, d, e, f, g;
      for (b = arguments[0], d = 2 <= arguments.length ? X.call(arguments, 1) : [], f = 0, g = d.length; g > f; f++)
        if (c = d[f])
          for (a in c)
            Y.call(c, a) && (e = c[a], null != b[a] && 'object' == typeof b[a] && null != e && 'object' == typeof e ? v(b[a], e) : b[a] = e);
      return b;
    }, q = function (a) {
      var b, c, d, e, f;
      for (c = b = 0, e = 0, f = a.length; f > e; e++)
        d = a[e], c += Math.abs(d), b++;
      return c / b;
    }, x = function (a, b) {
      var c, d, e;
      if (null == a && (a = 'options'), null == b && (b = !0), e = document.querySelector('[data-pace-' + a + ']')) {
        if (c = e.getAttribute('data-pace-' + a), !b)
          return c;
        try {
          return JSON.parse(c);
        } catch (f) {
          return d = f, 'undefined' != typeof console && null !== console ? console.error('Error parsing inline pace options', d) : void 0;
        }
      }
    }, g = function () {
      function a() {
      }
      return a.prototype.on = function (a, b, c, d) {
        var e;
        return null == d && (d = !1), null == this.bindings && (this.bindings = {}), null == (e = this.bindings)[a] && (e[a] = []), this.bindings[a].push({
          handler: b,
          ctx: c,
          once: d
        });
      }, a.prototype.once = function (a, b, c) {
        return this.on(a, b, c, !0);
      }, a.prototype.off = function (a, b) {
        var c, d, e;
        if (null != (null != (d = this.bindings) ? d[a] : void 0)) {
          if (null == b)
            return delete this.bindings[a];
          for (c = 0, e = []; c < this.bindings[a].length;)
            e.push(this.bindings[a][c].handler === b ? this.bindings[a].splice(c, 1) : c++);
          return e;
        }
      }, a.prototype.trigger = function () {
        var a, b, c, d, e, f, g, h, i;
        if (c = arguments[0], a = 2 <= arguments.length ? X.call(arguments, 1) : [], null != (g = this.bindings) ? g[c] : void 0) {
          for (e = 0, i = []; e < this.bindings[c].length;)
            h = this.bindings[c][e], d = h.handler, b = h.ctx, f = h.once, d.apply(null != b ? b : this, a), i.push(f ? this.bindings[c].splice(e, 1) : e++);
          return i;
        }
      }, a;
    }(), j = window.Pace || {}, window.Pace = j, v(j, g.prototype), D = j.options = v({}, u, window.paceOptions, x()), U = [
      'ajax',
      'document',
      'eventLag',
      'elements'
    ], Q = 0, S = U.length; S > Q; Q++)
    K = U[Q], D[K] === !0 && (D[K] = u[K]);
  i = function (a) {
    function b() {
      return V = b.__super__.constructor.apply(this, arguments);
    }
    return Z(b, a), b;
  }(Error), b = function () {
    function a() {
      this.progress = 0;
    }
    return a.prototype.getElement = function () {
      var a;
      if (null == this.el) {
        if (a = document.querySelector(D.target), !a)
          throw new i();
        this.el = document.createElement('div'), this.el.className = 'pace pace-active', document.body.className = document.body.className.replace(/pace-done/g, ''), document.body.className += ' pace-running', this.el.innerHTML = '<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>', null != a.firstChild ? a.insertBefore(this.el, a.firstChild) : a.appendChild(this.el);
      }
      return this.el;
    }, a.prototype.finish = function () {
      var a;
      return a = this.getElement(), a.className = a.className.replace('pace-active', ''), a.className += ' pace-inactive', document.body.className = document.body.className.replace('pace-running', ''), document.body.className += ' pace-done';
    }, a.prototype.update = function (a) {
      return this.progress = a, this.render();
    }, a.prototype.destroy = function () {
      try {
        this.getElement().parentNode.removeChild(this.getElement());
      } catch (a) {
        i = a;
      }
      return this.el = void 0;
    }, a.prototype.render = function () {
      var a, b, c, d, e, f, g;
      if (null == document.querySelector(D.target))
        return !1;
      for (a = this.getElement(), d = 'translate3d(' + this.progress + '%, 0, 0)', g = [
          'webkitTransform',
          'msTransform',
          'transform'
        ], e = 0, f = g.length; f > e; e++)
        b = g[e], a.children[0].style[b] = d;
      return (!this.lastRenderedProgress || this.lastRenderedProgress | 0 !== this.progress | 0) && (a.children[0].setAttribute('data-progress-text', '' + (0 | this.progress) + '%'), this.progress >= 100 ? c = '99' : (c = this.progress < 10 ? '0' : '', c += 0 | this.progress), a.children[0].setAttribute('data-progress', '' + c)), this.lastRenderedProgress = this.progress;
    }, a.prototype.done = function () {
      return this.progress >= 100;
    }, a;
  }(), h = function () {
    function a() {
      this.bindings = {};
    }
    return a.prototype.trigger = function (a, b) {
      var c, d, e, f, g;
      if (null != this.bindings[a]) {
        for (f = this.bindings[a], g = [], d = 0, e = f.length; e > d; d++)
          c = f[d], g.push(c.call(this, b));
        return g;
      }
    }, a.prototype.on = function (a, b) {
      var c;
      return null == (c = this.bindings)[a] && (c[a] = []), this.bindings[a].push(b);
    }, a;
  }(), P = window.XMLHttpRequest, O = window.XDomainRequest, N = window.WebSocket, w = function (a, b) {
    var c, d, e, f;
    f = [];
    for (d in b.prototype)
      try {
        e = b.prototype[d], f.push(null == a[d] && 'function' != typeof e ? a[d] = e : void 0);
      } catch (g) {
        c = g;
      }
    return f;
  }, A = [], j.ignore = function () {
    var a, b, c;
    return b = arguments[0], a = 2 <= arguments.length ? X.call(arguments, 1) : [], A.unshift('ignore'), c = b.apply(null, a), A.shift(), c;
  }, j.track = function () {
    var a, b, c;
    return b = arguments[0], a = 2 <= arguments.length ? X.call(arguments, 1) : [], A.unshift('track'), c = b.apply(null, a), A.shift(), c;
  }, J = function (a) {
    var b;
    if (null == a && (a = 'GET'), 'track' === A[0])
      return 'force';
    if (!A.length && D.ajax) {
      if ('socket' === a && D.ajax.trackWebSockets)
        return !0;
      if (b = a.toUpperCase(), $.call(D.ajax.trackMethods, b) >= 0)
        return !0;
    }
    return !1;
  }, k = function (a) {
    function b() {
      var a, c = this;
      b.__super__.constructor.apply(this, arguments), a = function (a) {
        var b;
        return b = a.open, a.open = function (d, e) {
          return J(d) && c.trigger('request', {
            type: d,
            url: e,
            request: a
          }), b.apply(a, arguments);
        };
      }, window.XMLHttpRequest = function (b) {
        var c;
        return c = new P(b), a(c), c;
      };
      try {
        w(window.XMLHttpRequest, P);
      } catch (d) {
      }
      if (null != O) {
        window.XDomainRequest = function () {
          var b;
          return b = new O(), a(b), b;
        };
        try {
          w(window.XDomainRequest, O);
        } catch (d) {
        }
      }
      if (null != N && D.ajax.trackWebSockets) {
        window.WebSocket = function (a, b) {
          var d;
          return d = null != b ? new N(a, b) : new N(a), J('socket') && c.trigger('request', {
            type: 'socket',
            url: a,
            protocols: b,
            request: d
          }), d;
        };
        try {
          w(window.WebSocket, N);
        } catch (d) {
        }
      }
    }
    return Z(b, a), b;
  }(h), R = null, y = function () {
    return null == R && (R = new k()), R;
  }, I = function (a) {
    var b, c, d, e;
    for (e = D.ajax.ignoreURLs, c = 0, d = e.length; d > c; c++)
      if (b = e[c], 'string' == typeof b) {
        if (-1 !== a.indexOf(b))
          return !0;
      } else if (b.test(a))
        return !0;
    return !1;
  }, y().on('request', function (b) {
    var c, d, e, f, g;
    return f = b.type, e = b.request, g = b.url, I(g) ? void 0 : j.running || D.restartOnRequestAfter === !1 && 'force' !== J(f) ? void 0 : (d = arguments, c = D.restartOnRequestAfter || 0, 'boolean' == typeof c && (c = 0), setTimeout(function () {
      var b, c, g, h, i, k;
      if (b = 'socket' === f ? e.readyState < 2 : 0 < (h = e.readyState) && 4 > h) {
        for (j.restart(), i = j.sources, k = [], c = 0, g = i.length; g > c; c++) {
          if (K = i[c], K instanceof a) {
            K.watch.apply(K, d);
            break;
          }
          k.push(void 0);
        }
        return k;
      }
    }, c));
  }), a = function () {
    function a() {
      var a = this;
      this.elements = [], y().on('request', function () {
        return a.watch.apply(a, arguments);
      });
    }
    return a.prototype.watch = function (a) {
      var b, c, d, e;
      return d = a.type, b = a.request, e = a.url, I(e) ? void 0 : (c = 'socket' === d ? new n(b) : new o(b), this.elements.push(c));
    }, a;
  }(), o = function () {
    function a(a) {
      var b, c, d, e, f, g, h = this;
      if (this.progress = 0, null != window.ProgressEvent)
        for (c = null, a.addEventListener('progress', function (a) {
            return h.progress = a.lengthComputable ? 100 * a.loaded / a.total : h.progress + (100 - h.progress) / 2;
          }, !1), g = [
            'load',
            'abort',
            'timeout',
            'error'
          ], d = 0, e = g.length; e > d; d++)
          b = g[d], a.addEventListener(b, function () {
            return h.progress = 100;
          }, !1);
      else
        f = a.onreadystatechange, a.onreadystatechange = function () {
          var b;
          return 0 === (b = a.readyState) || 4 === b ? h.progress = 100 : 3 === a.readyState && (h.progress = 50), 'function' == typeof f ? f.apply(null, arguments) : void 0;
        };
    }
    return a;
  }(), n = function () {
    function a(a) {
      var b, c, d, e, f = this;
      for (this.progress = 0, e = [
          'error',
          'open'
        ], c = 0, d = e.length; d > c; c++)
        b = e[c], a.addEventListener(b, function () {
          return f.progress = 100;
        }, !1);
    }
    return a;
  }(), d = function () {
    function a(a) {
      var b, c, d, f;
      for (null == a && (a = {}), this.elements = [], null == a.selectors && (a.selectors = []), f = a.selectors, c = 0, d = f.length; d > c; c++)
        b = f[c], this.elements.push(new e(b));
    }
    return a;
  }(), e = function () {
    function a(a) {
      this.selector = a, this.progress = 0, this.check();
    }
    return a.prototype.check = function () {
      var a = this;
      return document.querySelector(this.selector) ? this.done() : setTimeout(function () {
        return a.check();
      }, D.elements.checkInterval);
    }, a.prototype.done = function () {
      return this.progress = 100;
    }, a;
  }(), c = function () {
    function a() {
      var a, b, c = this;
      this.progress = null != (b = this.states[document.readyState]) ? b : 100, a = document.onreadystatechange, document.onreadystatechange = function () {
        return null != c.states[document.readyState] && (c.progress = c.states[document.readyState]), 'function' == typeof a ? a.apply(null, arguments) : void 0;
      };
    }
    return a.prototype.states = {
      loading: 0,
      interactive: 50,
      complete: 100
    }, a;
  }(), f = function () {
    function a() {
      var a, b, c, d, e, f = this;
      this.progress = 0, a = 0, e = [], d = 0, c = C(), b = setInterval(function () {
        var g;
        return g = C() - c - 50, c = C(), e.push(g), e.length > D.eventLag.sampleCount && e.shift(), a = q(e), ++d >= D.eventLag.minSamples && a < D.eventLag.lagThreshold ? (f.progress = 100, clearInterval(b)) : f.progress = 100 * (3 / (a + 3));
      }, 50);
    }
    return a;
  }(), m = function () {
    function a(a) {
      this.source = a, this.last = this.sinceLastUpdate = 0, this.rate = D.initialRate, this.catchup = 0, this.progress = this.lastProgress = 0, null != this.source && (this.progress = F(this.source, 'progress'));
    }
    return a.prototype.tick = function (a, b) {
      var c;
      return null == b && (b = F(this.source, 'progress')), b >= 100 && (this.done = !0), b === this.last ? this.sinceLastUpdate += a : (this.sinceLastUpdate && (this.rate = (b - this.last) / this.sinceLastUpdate), this.catchup = (b - this.progress) / D.catchupTime, this.sinceLastUpdate = 0, this.last = b), b > this.progress && (this.progress += this.catchup * a), c = 1 - Math.pow(this.progress / 100, D.easeFactor), this.progress += c * this.rate * a, this.progress = Math.min(this.lastProgress + D.maxProgressPerFrame, this.progress), this.progress = Math.max(0, this.progress), this.progress = Math.min(100, this.progress), this.lastProgress = this.progress, this.progress;
    }, a;
  }(), L = null, H = null, r = null, M = null, p = null, s = null, j.running = !1, z = function () {
    return D.restartOnPushState ? j.restart() : void 0;
  }, null != window.history.pushState && (T = window.history.pushState, window.history.pushState = function () {
    return z(), T.apply(window.history, arguments);
  }), null != window.history.replaceState && (W = window.history.replaceState, window.history.replaceState = function () {
    return z(), W.apply(window.history, arguments);
  }), l = {
    ajax: a,
    elements: d,
    document: c,
    eventLag: f
  }, (B = function () {
    var a, c, d, e, f, g, h, i;
    for (j.sources = L = [], g = [
        'ajax',
        'elements',
        'document',
        'eventLag'
      ], c = 0, e = g.length; e > c; c++)
      a = g[c], D[a] !== !1 && L.push(new l[a](D[a]));
    for (i = null != (h = D.extraSources) ? h : [], d = 0, f = i.length; f > d; d++)
      K = i[d], L.push(new K(D));
    return j.bar = r = new b(), H = [], M = new m();
  })(), j.stop = function () {
    return j.trigger('stop'), j.running = !1, r.destroy(), s = !0, null != p && ('function' == typeof t && t(p), p = null), B();
  }, j.restart = function () {
    return j.trigger('restart'), j.stop(), j.start();
  }, j.go = function () {
    var a;
    return j.running = !0, r.render(), a = C(), s = !1, p = G(function (b, c) {
      var d, e, f, g, h, i, k, l, n, o, p, q, t, u, v, w;
      for (l = 100 - r.progress, e = p = 0, f = !0, i = q = 0, u = L.length; u > q; i = ++q)
        for (K = L[i], o = null != H[i] ? H[i] : H[i] = [], h = null != (w = K.elements) ? w : [K], k = t = 0, v = h.length; v > t; k = ++t)
          g = h[k], n = null != o[k] ? o[k] : o[k] = new m(g), f &= n.done, n.done || (e++, p += n.tick(b));
      return d = p / e, r.update(M.tick(b, d)), r.done() || f || s ? (r.update(100), j.trigger('done'), setTimeout(function () {
        return r.finish(), j.running = !1, j.trigger('hide');
      }, Math.max(D.ghostTime, Math.max(D.minTime - (C() - a), 0)))) : c();
    });
  }, j.start = function (a) {
    v(D, a), j.running = !0;
    try {
      r.render();
    } catch (b) {
      i = b;
    }
    return document.querySelector('.pace') ? (j.trigger('start'), j.go()) : setTimeout(j.start, 50);
  }, 'function' == typeof define && define.amd ? define(function () {
    return j;
  }) : 'object' == typeof exports ? module.exports = j : D.startOnPageLoad && j.start();
}.call(this));!function (e) {
  e(['jquery'], function (e) {
    return function () {
      function t(e, t, n) {
        return f({
          type: O.error,
          iconClass: g().iconClasses.error,
          message: e,
          optionsOverride: n,
          title: t
        });
      }
      function n(t, n) {
        return t || (t = g()), v = e('#' + t.containerId), v.length ? v : (n && (v = c(t)), v);
      }
      function i(e, t, n) {
        return f({
          type: O.info,
          iconClass: g().iconClasses.info,
          message: e,
          optionsOverride: n,
          title: t
        });
      }
      function o(e) {
        w = e;
      }
      function s(e, t, n) {
        return f({
          type: O.success,
          iconClass: g().iconClasses.success,
          message: e,
          optionsOverride: n,
          title: t
        });
      }
      function a(e, t, n) {
        return f({
          type: O.warning,
          iconClass: g().iconClasses.warning,
          message: e,
          optionsOverride: n,
          title: t
        });
      }
      function r(e) {
        var t = g();
        v || n(t), l(e, t) || u(t);
      }
      function d(t) {
        var i = g();
        return v || n(i), t && 0 === e(':focus', t).length ? void h(t) : void (v.children().length && v.remove());
      }
      function u(t) {
        for (var n = v.children(), i = n.length - 1; i >= 0; i--)
          l(e(n[i]), t);
      }
      function l(t, n) {
        return t && 0 === e(':focus', t).length ? (t[n.hideMethod]({
          duration: n.hideDuration,
          easing: n.hideEasing,
          complete: function () {
            h(t);
          }
        }), !0) : !1;
      }
      function c(t) {
        return v = e('<div/>').attr('id', t.containerId).addClass(t.positionClass).attr('aria-live', 'polite').attr('role', 'alert'), v.appendTo(e(t.target)), v;
      }
      function p() {
        return {
          tapToDismiss: !0,
          toastClass: 'toast',
          containerId: 'toast-container',
          debug: !1,
          showMethod: 'fadeIn',
          showDuration: 300,
          showEasing: 'swing',
          onShown: void 0,
          hideMethod: 'fadeOut',
          hideDuration: 1000,
          hideEasing: 'swing',
          onHidden: void 0,
          extendedTimeOut: 1000,
          iconClasses: {
            error: 'toast-error',
            info: 'toast-info',
            success: 'toast-success',
            warning: 'toast-warning'
          },
          iconClass: 'toast-info',
          positionClass: 'toast-top-right',
          timeOut: 5000,
          titleClass: 'toast-title',
          messageClass: 'toast-message',
          target: 'body',
          closeHtml: '<button>&times;</button>',
          newestOnTop: !0,
          preventDuplicates: !1,
          progressBar: !1
        };
      }
      function m(e) {
        w && w(e);
      }
      function f(t) {
        function i(t) {
          return !e(':focus', l).length || t ? (clearTimeout(O.intervalId), l[r.hideMethod]({
            duration: r.hideDuration,
            easing: r.hideEasing,
            complete: function () {
              h(l), r.onHidden && 'hidden' !== b.state && r.onHidden(), b.state = 'hidden', b.endTime = new Date(), m(b);
            }
          })) : void 0;
        }
        function o() {
          (r.timeOut > 0 || r.extendedTimeOut > 0) && (u = setTimeout(i, r.extendedTimeOut), O.maxHideTime = parseFloat(r.extendedTimeOut), O.hideEta = new Date().getTime() + O.maxHideTime);
        }
        function s() {
          clearTimeout(u), O.hideEta = 0, l.stop(!0, !0)[r.showMethod]({
            duration: r.showDuration,
            easing: r.showEasing
          });
        }
        function a() {
          var e = (O.hideEta - new Date().getTime()) / O.maxHideTime * 100;
          f.width(e + '%');
        }
        var r = g(), d = t.iconClass || r.iconClass;
        if (r.preventDuplicates) {
          if (t.message === C)
            return;
          C = t.message;
        }
        'undefined' != typeof t.optionsOverride && (r = e.extend(r, t.optionsOverride), d = t.optionsOverride.iconClass || d), T++, v = n(r, !0);
        var u = null, l = e('<div/>'), c = e('<div/>'), p = e('<div/>'), f = e('<div/>'), w = e(r.closeHtml), O = {
            intervalId: null,
            hideEta: null,
            maxHideTime: null
          }, b = {
            toastId: T,
            state: 'visible',
            startTime: new Date(),
            options: r,
            map: t
          };
        return t.iconClass && l.addClass(r.toastClass).addClass(d), t.title && (c.append(t.title).addClass(r.titleClass), l.append(c)), t.message && (p.append(t.message).addClass(r.messageClass), l.append(p)), r.closeButton && (w.addClass('toast-close-button').attr('role', 'button'), l.prepend(w)), r.progressBar && (f.addClass('toast-progress'), l.prepend(f)), l.hide(), r.newestOnTop ? v.prepend(l) : v.append(l), l[r.showMethod]({
          duration: r.showDuration,
          easing: r.showEasing,
          complete: r.onShown
        }), r.timeOut > 0 && (u = setTimeout(i, r.timeOut), O.maxHideTime = parseFloat(r.timeOut), O.hideEta = new Date().getTime() + O.maxHideTime, r.progressBar && (O.intervalId = setInterval(a, 10))), l.hover(s, o), !r.onclick && r.tapToDismiss && l.click(i), r.closeButton && w && w.click(function (e) {
          e.stopPropagation ? e.stopPropagation() : void 0 !== e.cancelBubble && e.cancelBubble !== !0 && (e.cancelBubble = !0), i(!0);
        }), r.onclick && l.click(function () {
          r.onclick(), i();
        }), m(b), r.debug && console && console.log(b), l;
      }
      function g() {
        return e.extend({}, p(), b.options);
      }
      function h(e) {
        v || (v = n()), e.is(':visible') || (e.remove(), e = null, 0 === v.children().length && v.remove());
      }
      var v, w, C, T = 0, O = {
          error: 'error',
          info: 'info',
          success: 'success',
          warning: 'warning'
        }, b = {
          clear: r,
          remove: d,
          error: t,
          getContainer: n,
          info: i,
          options: {},
          subscribe: o,
          success: s,
          version: '2.1.0',
          warning: a
        };
      return b;
    }();
  });
}('function' == typeof define && define.amd ? define : function (e, t) {
  'undefined' != typeof module && module.exports ? module.exports = t(require('jquery')) : window.toastr = t(window.jQuery);
});$(function () {
  $(document).foundation();
});