/**
 * Created by ozknemoy on 20.01.2017.
 * скрол по клику
 * либо в пикселях через атрибут px
 * либо если нет атрибута px  до ID элемента
 *
 */

export function scrollToDirective() {
    return {
        controller: function ($element,$attrs,scrollTo) {
            'ngInject';
            this._click = () => {
                // либо в пикселях либо ID
                scrollTo(parseInt($attrs.px) || $attrs.scrollTo)
            };

            $element.on('click', this._click);

            this.$onDestroy = ()=> {
                $element.off('click', this._click);
            }
        }
    }
}