/**
 * Created by дима on 29.08.2016.
 */
export class MainController {
    constructor($localStorage,TYPE) {
        'ngInject';

        this.user_id = $localStorage.user_id || undefined;
        this.openSidebar = 1;
        this.isOdvf = TYPE === 'air';
        this.isCS = TYPE === 'all';
        var refs = {
            all: {//constart
                vk: 'https://vk.com/constartru',
                instagram: 'https://www.instagram.com/constart.ru/',
                youtube: 'https://www.youtube.com/channel/UCOxuxxrAhiKB1U0RYQPB5FA'
            },
            air: {//odvf
                vk: 'https://vk.com/odvf_russia',
                facebook: 'https://www.facebook.com/groups/1642587279390524/'
            }
        };
        this.refs = refs[TYPE];
        /*this.banner = [
            {url: 'http://start.constart.ru', image: 'assets/img/bnr_constart.png'},
            {url: 'http://radio.mediametrics.ru/spb', image: 'assets/img/bnr_media.png'},
            {url: 'http://www.cfe.ru/events/schools/type/77', image: 'assets/img/bnr_pred.jpg'}
        ][Math.floor(3 * Math.random())];*/

        /*баннер конкурса - http://start.constart.ru
         баннер медиаметрикс - http://radio.mediametrics.ru/spb/
         баннер недели предпринимательства - http://www.cfe.ru/events/schools/type/77/*/
        setTimeout(()=> {
            this.init()
        }, 200)

    }

    /*up() {
     angular.element.scrollTo(0, 800);
     }*/

    init() {

        if ('addEventListener' in document) {
            document.addEventListener('DOMContentLoaded', function () {
                FastClick.attach(document.body);
            }, false);
        }

        var jQ = angular.element;
        jQ(window).scroll(function () {
            if (jQ(window).scrollTop() > 100)
                jQ('body').addClass('scr');
            else
                jQ('body').removeClass('scr');
        })


    }
}