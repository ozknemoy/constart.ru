/**
 * Created by ozknemoy on 07.11.2016.
 * фильтр для чекбоксов по определенному ключу
 * filter это объект {1:true,2:true,3:false}
 * если noOne то показывает все когда нет ни одного чекбокса
 */


module.exports = function checkboxFilter() {
    return function (arr,filter,key,noOne=false) {
        if (!arr || !arr.length || !filter) return arr;

        function noOneCheck(filter) {
            return Object.keys(filter).every((key) => {
                return !filter[key]
            })
        }
        return arr.filter((i) => {
            return filter[i[key]] || (noOne && noOneCheck(filter))
        })
    }
};