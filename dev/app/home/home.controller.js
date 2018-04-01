
export class HomeController {
    constructor(httpFactory, $auth, $localStorage, $timeout,$sce,metadataService,userFactory,TYPE) {
        'ngInject';

        this.$auth = $auth;
        this.$localStorage = $localStorage;
        this.isAuthenticated = this.$auth.isAuthenticated();
        this.baseImgUrl = httpFactory.baseImgUrl;
        metadataService._setMetaTags('home');
        // для перелогина
        userFactory.checkDataRelogin();

        httpFactory.getProjCategory().then((d)=> {
            this.directions = isAir? d.data[0].items:d.data;
            // добрасываю имена в кладку
            if(isConstart) {
                masonry.forEach(mas=> {
                    this.directions.forEach((dir)=> {
                        if (dir.id == mas.direction) {
                            mas.name = dir.name
                        }
                    })
                })
            }

        });
        httpFactory.get('project-news/get-main-page').then(d=> {
            this.news = d.data
        });

        var isConstart = TYPE=='all';
        var isAir = TYPE=='air';
        if(isAir) {
            if(httpFactory.numOfUsers) {
                this.numOfUsers = httpFactory.numOfUsers
            } else {
                httpFactory.get('user/count').then(d=> {
                    httpFactory.setNumOfUsers(d.data);
                    this.numOfUsers = d.data
                })
            }

        } else if(isConstart) {
            this.owl = {
                items: [
                    {url: '/businessCalendar', image: 'assets/img/calendar-banner.jpg'},
                    {url: 'http://radio.mediametrics.ru/spb', image: 'assets/img/bnr_mediametrics.jpg',target:'_blank'},
                    {url: 'http://www.metronews.ru/', image: 'assets/img/bnr_metro.png',target:'_blank'}
                ],
                options: {
                    loop: false,
                    //nav: true,
                    margin: 30,
                    responsive: {
                        /*0: {items: 1 },
                        800: {items: 2}*/

                        0: {items: 1 },
                         600: {items: 2},
                         1200:{items: 3}
                    },
                    slideBy: 'page',
                    lazyLoad: true,
                    autoplay: true,
                    autoplayTimeout: 1800,
                    autoplayHoverPause: true, rewindNav : true
                }
            };
            if(angular.element(window).width()>=740) {
                this.video=$sce.trustAsHtml(`<video width="500" height="500" autoplay loop poster="assets/img/poster.png">
            <source src="assets/video/up_table_03.ogv" type='video/ogg; codecs="theora, vorbis"'>
            <source src="assets/video/up_table_03.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'>
            <source src="assets/video/up_table_03.webm" type='video/webm; codecs="vp8, vorbis"'></video>`);

                $timeout(()=>{this.showVideoDefer=1},100) ;
            }

            // нельзя делать первую картинку широкой
            var masonry = [
                {
                    class: 'vh3 col-sm-3',
                    url: 'assets/img/directions_img--tech.png',
                    direction: 130,// промыш
                    cty: 0//2
                }, {
                    class: 'vh3 col-sm-3',
                    url: 'assets/img/directions_img--shop.png',
                    direction: 46,// продукты
                    cty: 0//15
                },{
                    class: 'vh3 col-sm-3',
                    url: 'assets/img/directions_img--serv.png',
                    direction: 1,// it
                    cty: 0//12
                },{
                    class: 'vh6 col-sm-3',
                    url: 'assets/img/directions_img--tour.png',
                    direction: 137,// другое
                    cty: 0//0
                },{
                    class: 'vh3 col-sm-3',
                    url: 'assets/img/directions_img--help.png',
                    direction: 114,// соц проекты
                    cty: 0//2
                },{
                    class: 'vh3 col-sm-3',
                    url: 'assets/img/directions_img--production.png',
                    direction: 24,// инновации
                    cty: 0//0
                },
                {
                    class: 'vh3 col-sm-3',
                    url: 'assets/img/directions-img8.png',
                    direction: 102,// услуги для бизнеса
                    cty: 0//6
                }
            ];
            httpFactory.get('project/get-category-count').then(d=> {
                d.data.forEach(item=> {
                    for (var i = 0; i < 7; i++) {
                        if(item.category_id == masonry[i].direction) {
                            masonry[i].cty = item.count;break
                        }
                    }
                });
                this.masonry = masonry;
            });
        }






    }

}