/**
 * Created by ozknemoy on 07.11.2016.
 * для repeat
 * отбрасывает нулевые значения предопределенного поля
 */
// isNumeric только для тестов
Number.isNumeric = function (n) {
    return !isNaN(n) && n!='' && n!=true && n!=Infinity
};
module.exports = function deleteEmptyValue() {
    return function (arr,key='amount') {
        if (!arr.length) return undefined;
        return arr.filter((i) => {
            return Number.isNumeric(i[key])
        })
    }
};