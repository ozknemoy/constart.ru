/**
 * Created by дима on 14.09.2016.
 * возвращает массив между двумя датами
 * метод для repeat
 * по умолчанию берет из массива свойство date
 * можно удалять обе или одну дату
 */

module.exports = function () {
    return function (array,st,en,key='date') {
        if (!array) return undefined;
        if(!st&&!en) return array;
        var start = st? +new Date(st):0;
        var end = en? +new Date(en):+new Date('2222-11-11');
        return array.filter(item => {
            let med = +new Date(item[key]);
            return med>=start && med<=end
        })

    }
};