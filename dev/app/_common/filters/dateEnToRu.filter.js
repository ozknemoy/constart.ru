/**
 * Created by ozknemoy on 27.09.2016.
 * принимает объект даты
 */

module.exports = function dateEnToRu() {
        return function (date) {
            if (!date) return undefined;
            date += '';
            return date.slice(8,10) + "-" + date.slice(5,7) + "-" + date.slice(0,4);
    }
};