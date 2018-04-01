/**
 * Created by ozknemoy on 25.11.2016.
 */
// перезагружает масонри
export let masonryReloadComponent = {
    controller: function ($element) {
        'ngInject';
        this._click = () => {
            angular.element('.masonry').masonry('destroy');
            setTimeout(()=>{
                angular.element('.masonry').masonry({
                    itemSelector: '.masonry--item'
                });
            },400);
        };

        $element.on('click', this._click);

        this.$onDestroy = ()=> {
            $element.off('click', this._click);
        }
    }
};
export let gridReloadComponent = {
    controller: function ($element,angularGridInstance) {
        'ngInject';
        this._click = () => {
            if (angularGridInstance.gallery) {
                setTimeout(()=>{
                    angularGridInstance.gallery.refresh();
                },350);
            }
        };

        $element.on('click', this._click);

        this.$onDestroy = ()=> {
            $element.off('click', this._click);
        }
    }
};
// кнопка меню
export let menuToggleComponent = {
    bindings: {
        close: '@?'// только на закрытие
    },
    controller: function ($element,angularGridInstance) {
        'ngInject';
        var jQ = angular.element;

        if(this.close) {// вешаю слушателя на закрытие
            this._click = () => {

                var w = jQ(window).width();
                // если большой экран и меню открыто или полуоткрыто(последнее не убрать)
                if(!$element.hasClass('sidebar--hidden')  && w>991) {
                    jQ('.hamburger').addClass('is-active');// иконка гамбургера НЕ крестом
                    jQ('body').addClass('sidebar--hidden');// полузакрытое
                }
                if(!$element.hasClass('menu-open') && w<992) {
                    jQ('.hamburger').removeClass('is-active');// иконка гамбургера НЕ крестом
                    jQ('body').removeClass('menu-open');
                }

            }
        } else {// на тумблер
            this._click = () => {
                if (angularGridInstance.gallery) {
                    setTimeout(()=>{
                        angularGridInstance.gallery.refresh();
                    },350);
                }

                var w = jQ(window).width();
                if(w>991){
                    $element.toggleClass('is-active');
                    jQ('body').toggleClass('sidebar--hidden');
                } else {
                    $element.toggleClass('is-active');
                    jQ('body').toggleClass('menu-open');
                }
            }
        }

        $element.on('click', this._click);

        this.$onDestroy = ()=> {
            $element.off('click', this._click);
        }

    }
};