/**
 * Created by ozknemoy on 18.11.2016.
 */

Number.isInteger = Number.isInteger || function(value) {return typeof value === "number" &&  isFinite(value) &&  Math.floor(value) === value;};
Number.isNumeric = function (n) {
    return !isNaN(n) && n!='' && n!=true && n!=Infinity
};
//поиск объекта в массиве по имени ключа
var _ = {};
_.where = function(arr,attr,value) {
    if (!arr.length || !attr || !value) return null;
    return arr.find(function(obj) {
        if (obj[attr]==value) return true;
    });
};