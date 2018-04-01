
export let NavbarDirective = {
    templateUrl: 'app/_common/directives/navbar/nav-bar.html',//'nav-bar.html',
    bindings: {},
    controller: navbarController,
    controllerAs: 'nb'
};

function navbarController($auth, TYPE, localStorageFactory, httpFactory, userFactory,userAgentF) {
    'ngInject';

    this.$onInit = () => {
        localStorageFactory.set();
        this.isAuthenticated = $auth.isAuthenticated();
        this.lS = localStorageFactory;
        this.baseImgUrl = httpFactory.baseImgUrl;
        this.isOdvf = TYPE === 'air';
        this.isCS = TYPE === 'all';
        this.ozk = localStorageFactory.data.user_id == 2 ? 1 : 0;

        setTimeout(()=> {
            init()
        }, 100);
    };


    this.logout = () => {
        userFactory._reLogin(true)
    };

    function init() {
        var jQ = angular.element;
        if (userAgentF.isMobile.any()) {
            jQ('.nav_profile .btn_menu').click(function(){
                if( jQ('body').is('.menu-open') ) {
                    jQ('body').removeClass('menu-open');
                    jQ('.hamburger').removeClass('is-active');
                }
            })
        }
        //


        // реклама

        /*jQ.fn.sliderFade = function(options) {
            return this.each(function() {
                var $this = $(this),
                    $slides = $this.find(".nav_bnr--item"),
                    current = 0,
                    totalSlider = $slides.size(),
                    interval = 5000;
                $this.find(".nav_bnr--item").first().css({'opacity': 1, "z-index": 100});
                $this.find(".nav_bnr--item").first().addClass("show");

                function init() {
                    clearTimeout(slideshow);
                    var slideshow = setTimeout(function() {
                        var current = jQ(".show").index();
                        if (current >= totalSlider - 1) {
                            changeSlide(current, 0);
                        } else {
                            changeSlide(current, current + 1);
                        }
                        init();
                    }, interval);
                }
                function changeSlide(old_slide, new_slide) {
                    $slides.eq(old_slide).removeClass("show");
                    $slides.eq(old_slide).css({'opacity': 0, "z-index": 0});
                    $slides.eq(new_slide).css({'opacity': 1, "z-index": 100});
                    $slides.eq(new_slide).addClass("show");
                }

                init();

            });
        };
        jQ('.nav_bnr').sliderFade();*/
    }
}