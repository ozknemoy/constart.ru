/**
 * Created by дима on 21.07.2016.
 * только числа. проверок для строк нету
 * 1231231231 вернет 1 231 231 231
 * null -> 0
 * var re = /(\w+)\s(\w+)/;
 var str = 'John Smith';
 str.replace(re, '$2, $1'); // "Smith, John"
 RegExp.$1; // "John"
 RegExp.$2; // "Smith"
 */
module.exports = function() {

    return function (nStr) {
        if (nStr==0 || nStr===null) return 0;
        if (!nStr) return undefined;
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ' ' + '$2');
        }
        return x1 + x2;
    }
};