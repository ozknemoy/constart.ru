/**
 * Created by дима on 13.09.2016.
 */
export function rangeSliderFilter() {
    return function (amount, symbol) {
        if (!amount||!symbol) return undefined;
        return amount + symbol
    }
}