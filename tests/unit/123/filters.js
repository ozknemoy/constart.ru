/**
 * Created by ozknemoy on 23.10.2016.
 */

exports.getNounFilter = function (number, one, two, five) {
    if (!number && number!=0) return;
    number = Math.abs(number);
    number %= 100;
    if (number >= 5 && number <= 20) {
        return five;
    }
    number %= 10;
    if (number == 1) {
        return one;
    }
    if (number >= 2 && number <= 4) {
        return two;
    }
    return five;

};
exports.diffDateFilter = function (start,end) {
        if (!start||!end) return;
        var now = +new Date();
        var startProj = +new Date(start);
        var endProj = 1 + Math.floor((end * 24 * 60 * 60000 + startProj - now) / (24 * 60 * 60000));
    return (endProj > 0) ? endProj : 0;

};
exports.dateEnToRuFilter = function (date) {
    if (!date) return;
    date += '';
    return date.slice(8,10) + "-" + date.slice(5,7) + "-" + date.slice(0,4);
};
exports.thousandFilter = function (nStr) {
    if (!nStr) return 0;
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ' ' + '$2');
    }
    return x1 + x2;
};
exports.MyRoundFilter = function (input,n=1,floor=false) {
    if (!input) return 0;
    var res,v=Math.pow(10,n);
    if(!floor) res = Math.ceil( input * v )/v;
    else  res = Math.floor( input * v )/v;
    return isNaN(res) ? 0 : res
};






