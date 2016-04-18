function serialize(mixed_value) {
    var _getType = function (inp) {
        var type = typeof inp, match;
        var key;

        if (type == 'object' && !inp) {
            return 'null';
        }

        if (type == "object") {
            if (!inp.constructor) {
                return 'object';
            }

            var cons = inp.constructor.toString();

            if (match = cons.match(/(\w+)\(/)) {
                cons = match[1].toLowerCase();
            }

            var types = ["boolean", "number", "string", "array"];

            for (key in types) {
                if (cons == types[key]) {
                    type = types[key];
                    break;
                }
            }
        }
        return type;
    };

    var type = _getType(mixed_value);
    var val,
        ktype = '';

    switch (type) {
        case "function":
            val = "";
            break;
        case "undefined":
            val = "N";
            break;
        case "boolean":
            val = "b:" + (mixed_value ? "1" : "0");
            break;
        case "number":
            val = (Math.round(mixed_value) == mixed_value ? "i" : "d") + ":" + mixed_value;
            break;
        case "string":
            val = "s:" + mixed_value.length + ":\"" + mixed_value + "\"";
            break;
        case "array":
        case "object":
            val = "a";
            var count = 0;
            var vals = "";
            var okey;
            var key;

            for (key in mixed_value) {
                ktype = _getType(mixed_value[key]);
                if (ktype == "function") {
                    continue;
                }

                okey = (key.match(/^[0-9]+$/) ? parseInt(key) : key);
                vals += serialize(okey) +
                    serialize(mixed_value[key]);
                count++;
            }

            val += ":" + count + ":{" + vals + "}";
            break;
    }

    if (type != "object" && type != "array") {
        val += ";";
    }

    return val;
}

function implode(glue, pieces) {
    return ((pieces instanceof Array) ? pieces.join(glue) : pieces);
}

function trim(str, chars) {
    return ltrim(rtrim(str, chars), chars);
}

function ltrim(str, chars) {
    chars = chars || "\\s";

    return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}

function rtrim(str, chars) {
    chars = chars || "\\s";

    return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

function lpad(ContentToSize, PadLength, PadChar) {
    var PaddedString = ContentToSize.toString();

    for (var i = ContentToSize.length + 1; i <= PadLength; i++) {
        PaddedString = PadChar + PaddedString;
    }

    return PaddedString;
}

function rpad(ContentToSize, PadLength, PadChar) {
    var PaddedString = ContentToSize.toString();

    for (var i = ContentToSize.length + 1; i <= PadLength; i++) {
        PaddedString = PaddedString + PadChar;
    }

    return PaddedString;
}

function str_ireplace(f_needle, f_replace, f_haystack) {
    var result = '';
    var index = 0;

    var haystack = f_haystack.toLowerCase();
    var needle = f_needle.toLowerCase();

    while ((index = haystack.indexOf(needle)) > -1) {
        result += f_haystack.substring(0, index);
        result += f_replace;

        haystack = haystack.substring(index + f_needle.length);
        f_haystack = f_haystack.substring(index + f_needle.length);
    }

    return result + f_haystack;
}

function explode(delimiter, string) {
    var emptyArray = { 0: '' };

    if (arguments.length != 2
        || typeof arguments[0] == 'undefined'
        || typeof arguments[1] == 'undefined') {
        return null;
    }

    if (delimiter === ''
        || delimiter === false
        || delimiter === null) {
        return false;
    }

    if (typeof delimiter == 'function'
        || typeof delimiter == 'object'
        || typeof string == 'function'
        || typeof string == 'object') {
        return emptyArray;
    }

    if (delimiter === true) {
        delimiter = '1';
    }

    return string.toString().split(delimiter.toString());
}


function isset() {
    var a = arguments,
        l = a.length,
        i = 0,
        undef;

    if (l === 0) {
        throw new Error('Empty isset');
    }

    while (i !== l) {
        if (a[i] === undef || a[i] === null) {
            return false;
        }

        i++;
    }

    return true;
}

function explode(delimiter, string) {	// Split a string by string
    var emptyArray = { 0: '' };

    if (arguments.length != 2
        || typeof arguments[0] == 'undefined'
        || typeof arguments[1] == 'undefined') {
        return null;
    }

    if (delimiter === ''
        || delimiter === false
        || delimiter === null) {
        return false;
    }

    if (typeof delimiter == 'function'
        || typeof delimiter == 'object'
        || typeof string == 'function'
        || typeof string == 'object') {
        return emptyArray;
    }

    if (delimiter === true) {
        delimiter = '1';
    }

    return string.toString().split(delimiter.toString());
}

function in_array(needle, haystack, strict) {
    var found = false, key, strict = !!strict;

    for (key in haystack) {
        if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
            found = true;
            break;
        }
    }

    return found;
}

function getWindowHeight() {
    if (self.innerHeight) {
        return self.innerHeight;
    }

    if (document.documentElement && document.documentElement.clientHeight) {
        return document.documentElement.clientHeight;
    }

    if (document.body) {
        return document.body.clientHeight;
    }

    return 0;
}

function getWindowWidth() {
    if (self.innerWidth) {
        return self.innerWidth;
    }

    if (document.documentElement && document.documentElement.clientWidth) {
        return document.documentElement.clientWidth;
    }

    if (document.body) {
        return document.body.clientWidth;
    }

    return 0;
}

function dump(arr, level) {
    var dumped_text = "";

    if (!level) {
        level = 0;
    }

    //The padding given at the beginning of the line.
    var level_padding = "";

    for (var j = 0; j < level + 1; j++) {
        level_padding += "    ";
    }

    if (typeof (arr) == 'object') { //Array/Hashes/Object
        for (var item in arr) {
            var value = arr[item];

            if (typeof (value) == 'object') { //If it is an array,
                dumped_text += level_padding + "'" + item + "' ...\n";
            } else {
                dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
            }
        }
    } else { //Stings/Chars/Numbers etc.
        dumped_text = "===>" + arr + "<===(" + typeof (arr) + ")";
    }
    return dumped_text;
}
