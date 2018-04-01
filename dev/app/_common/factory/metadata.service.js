/**
 * Created by дима on 31.07.2016.
 */

export function metadataService(httpFactory,TYPE) {
    'ngInject';

    if(TYPE==='air') {
        document.querySelector('title').innerHTML = 'Общество Друзей Воздушного Флота (ОДВФ) на краудсорсинговой платформе Constart';
        document.querySelector('meta[name=description]').content = 'Сила России - воздушный флот! Проекты связанные с авиацией России на краудсорсинг-платформе Constart';
    }
    this._setMetaTags = (title)=> {
        switch(title){
            case 'home':
                this.setMetaTags('Первая глобальная краудсорсинг-платформа CONSTART.RU',
                    'CONSTART – это первая глобальная краудсорсинг-платформа, в которой идеи, инвесторы и профессионалы находят друг друга.');
                break;
            case 'user':
                this.setMetaTags('Поиск пользователей на глобальной краудcорсинг-платформе CONSTART.RU',
                    'Узнайте больше о потенциальных инвесторах, консультантах, инициаторах, специалистах, экспертах на CONSTART, прежде чем приступать к совместной работе над проектом.');
                break;
            case 'help':
                this.setMetaTags(
                    'Все о краудсорсинге на платформе CONSTART.RU',
                    'Платформа объединяет краудфандинг (привлечение инвестиций за вознаграждения), краудинвестинг (инвестирование за долю в Проекте), краудлендинг (инвестирование за проценты по займу) и краудхантинг (инвестирование знаний и опыта за вознаграждение или долю).');
                break;
            case 'projects':
                this.setMetaTags('Найти проекты на глобальной круйдсорсинг-платформе CONSTART.RU',
                    'Двухуровневый поиск проектов: по глобальным направлениям и по категориям внутри направлений. Самый широкий выбор по интересам в инвестировании и другой поддержке разнообразных бизнес-идей.');
                break;
        }

    };

    this.setMetaTags = function (title='CONSTART',description= 'CONSTART',foto){
        var bImgUrl = httpFactory.baseImgUrl;
        var photo = foto? bImgUrl+foto :'assets/ico/favicon-32x32.png';
        document.querySelector('meta[itemprop=name]').content = title;
        document.querySelector('meta[itemprop=description]').content = description;
        document.querySelector('meta[itemprop=image]').content = photo;
        document.querySelector('meta[property="og:see_also"]').content = location.host;

        if(TYPE==='all') {
            document.querySelector('meta[property="og:title"]').content = title;
            document.querySelector('meta[property="og:image"]').content = photo;
            document.querySelector('meta[property="og:description"]').content = description;
            document.querySelector('meta[property="og:url"]').content = location.href;
            document.querySelector('meta[property="og:site_name"]').content = title+ ' главная';

            document.querySelector('meta[name="twitter:description"]').content = description;
            document.querySelector('meta[name="twitter:title"]').content = title;
            document.querySelector('meta[name="twitter:image:src"]').content = photo;

            document.querySelector('meta[name="twitter:site"]').content = '@con_start';
            document.querySelector('meta[name="twitter:creator"]').content = '@con_start';
        }

    };
}
