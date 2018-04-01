/**
 * Created by дима on 27.07.2016.
 * фильтр возвращает существительное в зависимости от числа перед ним
 * {{project.found_finish_date | diffDateFromNow:true | getNoun:' день ':' дня ':' дней '}}для подписания
 * 1 — яблоко
 * 2 — яблока
 * 5 — яблок
 */
module.exports =  function getNounFilter() {
    return function(number, one, two, five) {
        if ((!parseInt(number) && number!=0) || number==='') return undefined;
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
    }
};