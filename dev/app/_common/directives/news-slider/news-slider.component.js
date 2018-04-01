/**
 * Created by ozknemoy on 13.03.2017.
 */

export let newsSliderComponent = {
    bindings: {
        value: '<',
        title: '@'
    },
    templateUrl: 'app/_common/directives/news-slider/news-slider.html',
    controller: function ($state,httpFactory) {
        'ngInject';

        this.$onInit = ()=> {
            this.projState = $state.$current.includes.proj;
            this.homeState = $state.$current.includes.home;
            this.projId = $state.params.id;
            this.baseImgUrl = httpFactory.baseImgUrl;
            this.owlOptions =  {
                loop: false,
                nav: true,
                margin: 30,
                responsive: {
                    0: {items: 1 },
                    600: {items: 2},
                    900: {items: 3},
                    1200:{items: 4}
                },
                slideBy: 'page',
                lazyLoad: true,
                autoplayHoverPause: true, rewindNav : true
            };


        }
    }
};