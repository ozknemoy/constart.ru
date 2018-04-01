// принимает количество знаков после запятой
// округляю вверх, вниз и математически
// по умолчанию округление до десятых

module.exports = function MyRoundFilter() {
    return function (input, n = 1, floor = false) {
        if(input === null || input ==0) return 0;
        if (!input) return undefined;

        /*var decimalLength = (''+input%1).length-2;//считаю количество знаков после запятой
        if(decimalLength<=n) {
            return input
        }*/
        var res, v = Math.pow(10, n);
        // в потолок
        if (!floor) res = Math.ceil(input * v) / v;
        // мат округление
        else if(floor=='math') {
            res = (Math.round(input * v) / v);//.toFixed(n)// конечно же косячит десятичные (1111.225,2,'math')
        }
        // в пол
        else  res = Math.floor(input * v) / v;
        return isNaN(res) ? 0 : res
    }
};