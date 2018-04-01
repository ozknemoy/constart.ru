/**
 * Created by дима on 10.07.2016.
 */


module.exports = function() {
    'ngInject';
    var countFactory = {};

    countFactory.notN = function (...rest) {
        var sum =0;
        if(rest && rest!=[]) {
            rest.forEach(item=> {
                var n = parseFloat(item);
                sum+= isNaN(n) || item == Infinity ? 0 : n
            })
        }
        return sum
    };

    countFactory.notNWithPoint = function (num) {
        num = num.replace(',','.');
        return isNaN(num) ? 0 : num
    };

    countFactory.zeroAmount = function (i) {
        return i.amount !== 0
    };

    countFactory.diffYear = function (c, b) {
        
          //если b не указывать расчитает возраст кол-во полных лет на текущую дату
        if (!c) return undefined;
        var a = new Date;
        a.setTime(Date.parse(c));
        var d = a.getFullYear(),
        e = a.getMonth(),
        f = a.getDate();
        b ? a.setTime(Date.parse(b)) : a = new Date;
        return a.getFullYear() - d - (0 > (a.getMonth() - e || a.getDate() - f))
    };
    countFactory.diffDays = function (c, b) {
        if (!c) return undefined;
        var a = new Date(c);
        b = b ? new Date(b) : new Date;
        return Math.floor((b.getTime() - a.getTime()) / (60*60*24000))
    };


    return countFactory

};
