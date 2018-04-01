/**
 * Created by дима on 30.07.2016.
 * фильтрЫ даты
 * осталось дней до конца относительно сегодня /end в днях /start строка
 * если showHours то когда разница дат от 0 до 1 то показываю часы
 */
//
exports.diffDateFilter = function () {
    return function (start,end,showHours=false) {
        if (!start||!end) return undefined;
        var endProj;
        var now = +new Date();
        var startProj = +new Date(start);
        var _endProj = (end * 24 * 60 * 60000 + startProj - now) / (24 * 60 * 60000);
        if(showHours && _endProj<1) {
            //если часы то возвращаю строку а не число
            // отнимаю 4 часа для перевода времени
            endProj = ''+ Math.floor(_endProj*24-4)
        } else {
            endProj = Math.ceil(_endProj);
        }
        return (endProj > 0) ? endProj : 0;
    }
};

// разница дат. при start=='now' считает от сегодня
// при end==='now' считает до сегодня с округлением в большую сторону
exports.diffDatesFilter = function() {
    return function (start,end,showHours=false,isProj=false) {//,showNegative=true
        if (!start||!end) return undefined;
        var endProj;
        end = end==='now'? +new Date() : +new Date(end);
        start = start==='now'? +new Date() : +new Date(start);
        var _endProj = (end - start) / (24 * 60 * 60000);
        _endProj = isProj? _endProj + 1 : _endProj;
        if(showHours && _endProj<1) {
            //если часы то возвращаю строку а не число
            // отнимаю 4 часа для перевода времени
            endProj = ''+ Math.floor(_endProj*24-4)
        } else {
            endProj = Math.ceil(_endProj);
        }
        return (endProj > 0) ? endProj : 0;
    }
};

//  от даты до сегодня    в будущее и в прошлое
exports.diffDateFromNowFilter = function() {
    return function (start,future=false) {
        if (!start) return undefined;
        var now = +new Date();
        var startProj = +new Date(start);
        var f = Math.floor((now - startProj) / (24 * 60 * 60000));
        return future? Math.abs(f) : f
    }
};

// прибавляю n дней к дате
exports.datePlusNDaysFilter = function() {
    return function (dateString,n, returnString = true) {
        let d = JSON.stringify(new Date(+new Date(dateString) + n * (24 * 60 * 60000))).slice(1, 11);
        return returnString ? d : new Date(d)
    }
};