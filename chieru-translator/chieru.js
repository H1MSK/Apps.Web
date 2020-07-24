var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
$(document).ready(function () {
    "use strict";
    var Encoder = /** @class */ (function () {
        function Encoder() {
        }
        Encoder.prototype.encode = function (str) {
            throw new Error("Not implemented");
        };
        Encoder.prototype.decode = function (arr) {
            throw new Error("Not implemented");
        };
        return Encoder;
    }());
    ;
    var UTF8Encoder = /** @class */ (function (_super) {
        __extends(UTF8Encoder, _super);
        function UTF8Encoder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UTF8Encoder.prototype.encode = function (str) {
            var utf8 = [];
            for (var i = 0; i < str.length; i++) {
                // Code from https://stackoverflow.com/a/18729931
                // Thanks
                var charcode = str.charCodeAt(i);
                if (charcode < 0x80)
                    utf8.push(charcode);
                else if (charcode < 0x800) {
                    utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
                }
                else if (charcode < 0xd800 || charcode >= 0xe000) {
                    utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
                }
                // surrogate pair
                else {
                    i++;
                    // UTF-16 encodes 0x10000-0x10FFFF by
                    // subtracting 0x10000 and splitting the
                    // 20 bits of 0x0-0xFFFFF into two halves
                    charcode = 0x10000 + (((charcode & 0x3ff) << 10)
                        | (str.charCodeAt(i) & 0x3ff));
                    utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
                }
            }
            return utf8;
        };
        // Optimize needed
        UTF8Encoder.prototype.decode = function (arr) {
            var tempStr = "";
            for (var i = 0; i < arr.length; ++i) {
                var s = arr[i].toString(16);
                if (s.length == 1)
                    s = "0" + s;
                tempStr += "%" + s;
            }
            return decodeURIComponent(tempStr);
        };
        return UTF8Encoder;
    }(Encoder));
    var GBKEncoder = /** @class */ (function (_super) {
        __extends(GBKEncoder, _super);
        function GBKEncoder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GBKEncoder.prototype.encode = function (str) {
            return GBK.encode(str);
        };
        GBKEncoder.prototype.decode = function (arr) {
            return GBK.decode(arr);
        };
        return GBKEncoder;
    }(Encoder));
    var chieru_charactors = "切卟叮咧哔唎啪啰啵嘭噜噼巴拉蹦铃".split('');
    var symbols = "\n\t\r\b 　~`!@#$%^&*()_+-=[]\\{}|;':\",./<>?！￥…（）—【】、；：‘’“”《》，。？～｀＃＄％＾＆＊－＿＝＋［］｛｝＼｜＇＂＜＞／";
    var default_error_message = "啥？ 你突然说什么啊……不敢相信，太差劲了……";
    var default_error_word = [123, 69, 82, 82, 79, 82, 125];
    function numArray2chieru(arr) {
        var word = "切";
        for (var i = 0, len = arr.length; i < len; ++i) {
            word += chieru_charactors[arr[i] & 15];
            word += chieru_charactors[(arr[i] >> 4) & 15];
        }
        return word;
    }
    function chieru2NumArray(chieru) {
        var arr = [];
        // if (typeof chieru !== 'string') return;
        if (chieru.length < 3 || !(chieru.length & 1) || chieru[0] != "切")
            return default_error_word;
        for (var i = 1; i < chieru.length; i += 2) {
            var code = [chieru_charactors.indexOf(chieru[i]), chieru_charactors.indexOf(chieru[i + 1])];
            if (code[0] == -1 || code[1] == -1)
                return default_error_word;
            arr.push(code[0] | (code[1] << 4));
        }
        return arr;
    }
    $("#button-to-chieru").click(function () {
        var original = String($("#text-original").val()).toString();
        var encoding = $("#select-encode").text();
        var encoder;
        var translated = "";
        if (encoding == "UTF8")
            encoder = new UTF8Encoder();
        else if (encoding == "GBK")
            encoder = new GBKEncoder();
        var start_pos = 0;
        for (var i = 0; i < original.length; ++i) {
            if (symbols.indexOf(original[i]) != -1) {
                if (start_pos != i) {
                    translated += numArray2chieru(encoder.encode(original.slice(start_pos, i)));
                    start_pos = i;
                }
                ++start_pos;
                translated += original[i];
            }
        }
        if (start_pos != original.length)
            translated += numArray2chieru(encoder.encode(original.slice(start_pos)));
        $("#text-translated").val("切噜～♪" + translated);
    });
    $("#button-from-chieru").click(function () {
        var translated = String($("#text-translated").val()).toString();
        var encoding = $("#select-encode").text();
        var encoder;
        var original = "";
        if (encoding == "UTF8")
            encoder = new UTF8Encoder();
        else if (encoding == "GBK")
            encoder = new GBKEncoder();
        do {
            if (translated.slice(0, 4) != "切噜～♪") {
                original = default_error_message;
                break;
            }
            var i = 4, s = 4, num_array = [];
            for (; i < translated.length; ++i) {
                if (symbols.indexOf(translated[i]) != -1) {
                    if (s != i) {
                        var result = chieru2NumArray(translated.slice(s, i));
                        if (typeof result == 'undefined') {
                            original = default_error_message;
                            break;
                        }
                        num_array.push.apply(num_array, result);
                        s = i;
                    }
                    ++s;
                    num_array.push.apply(num_array, encoder.encode(translated[i]));
                }
            }
            if (original.length != 0)
                break;
            if (s != translated.length) {
                var result = chieru2NumArray(translated.slice(s, i));
                if (typeof result == 'undefined') {
                    original = default_error_message;
                    break;
                }
                num_array.push.apply(num_array, result);
            }
            try {
                original = encoder.decode(num_array);
            }
            catch (URIError) {
                original = default_error_message + "(可能是编码错了切噜？)";
            }
        } while (0);
        $("#text-original").val(original);
    });
});
