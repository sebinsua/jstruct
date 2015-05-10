var noop = function () {};
var identity = function (value) { return value; };

var isArray = function (value) { return '[object Array]' === Object.prototype.toString.call(value); };
var isObject = function (value) { return '[object Object]' === Object.prototype.toString.call(value); };
var isIterable = function (value) { return isArray(value) || isObject(value); };
var isNonIterable = function (value) { return !isIterable(value); };

var Eyeball = function () {};
var BasicJsonPath = function (jsonPointerPath) {
    this._validate(jsonPointerPath);

    this.SEPARATOR = '.';
    this.jsonPointerPath = jsonPointerPath;
};
BasicJsonPath.prototype = new Eyeball();
BasicJsonPath.prototype._validate = function (path) {
    var errorMessage = "Invalid path specified";

    if (!path || !path.length) {
        throw new Error(errorMessage);
    }
};
BasicJsonPath.prototype.perceive = function (data) {
    var percept = this._find(data, this.jsonPointerPath);
    return percept;
};
BasicJsonPath.prototype._find = function (context, path) {
    var value = undefined;

    var SEPARATOR = this.SEPARATOR,
        matchTrailingQuotesAndSpaces = /(^[' "]+|[" ']+$)/g,
        matchLastWordAndDollarGroup = /(^[\w\$\[\]]+(\.[\w\$\[\]]+)*)/,
        matchBeforeAndInsideSquareBrackets = /(?:^[\w\$]*)(\[[\d\w\$]*\])/g;

    var _tempValue,
        _value = path.replace(matchTrailingQuotesAndSpaces, ''),
        _match = _value.match(matchLastWordAndDollarGroup);

    if (_match) {
        // Swap square brackets for the default separator.
        _match = _match[1].replace(/\[(\w*)\]/g, SEPARATOR + '$1' + SEPARATOR).split(SEPARATOR).filter(identity);

        _tempValue = context[_match.shift()];
        _value = _tempValue || undefined;
        while (_value && _match.length) {
            _tempValue = _value[_match.shift()];
            _value = _tempValue || undefined;
        }
        value = _value;
    }

    return value;
};

var Jstruct = function (format, data) {
    this._validate(format, data);

    this._format = {};
    this._wrappedData = [];

    if (format) {
        this.reform(format);
    }
    if (data) {
        this.in(data);
    }
};
Jstruct.prototype._validate = function (format, data) {
    if (format && isNonIterable(format)) {
        throw new Error("Invalid format specified");
    }
    if (data && isNonIterable(data)) {
        throw new Error("Invalid data specified");
    }
};
Jstruct.prototype.reform = function (format) {
    this._reform(format);
    return this;
};

/**
 * Format gets recursively converted into format with jsonPointers object.
 */
Jstruct.prototype._reform = function (format) {
    var _format, fi, fk, fv, jsonPointerPath, jsonPointer;

    if (isNonIterable(format)) {
        // @todo: Decide what to do if format is:
        //        a non-json pointer value *OR* a function *OR* a null *OR* an undefined *OR* an object/array.
        jsonPointerPath = format;
        return this._getEyeball(jsonPointerPath);
    } else if (isArray(format)) {
        _format = [];
        for (fi = 0; fi < format.length; fi++) {
            fv = format[fi];
            _format.push(this._reform(fv));
        }
    } else if (isObject(format)) {
        _format = {};
        for (fk in format) {
            fv = format[fk];
            _format[fk] = this._reform(fv);
        }
    }

    this._format = _format;
    return this._format;
};

Jstruct.prototype.in = function (data) {
    this._wrappedData = data;
    return this;
};
Jstruct.prototype.value = function () {
    return this._generateOutput(this._format);
};
Jstruct.prototype._getEyeball = function (jsonPointerPath) {
    return new BasicJsonPath(jsonPointerPath);
};
Jstruct.prototype._generateOutput = function (format) {
    var perceiver, output;
    if (format instanceof Eyeball) {
        perceiver = format;
        output = perceiver.perceive(this._wrappedData);
        return output;
    } else if (isNonIterable(format)) {
        // @todo: Decide what to do if format is:
        //        a non-json pointer value *OR* a function *OR* a null *OR* an undefined *OR* an object/array.
        output = format;
        return output;
    } else if (isArray(format)) {
        output = [];
        for (fi = 0; fi < format.length; fi++) {
            fv = format[fi];
            output.push(this._generateOutput(fv));
        }
    } else if (isObject(format)) {
        output = {};
        for (fk in format) {
            fv = format[fk];
            output[fk] = this._generateOutput(fv);
        }
    }

    return output;
};

var jstruct = function (data, format) {
    var formatter = new Jstruct(format);
    return formatter.in(data).value();
};

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.b);
    }
}(this, function () {
    return Jstruct;
}));
