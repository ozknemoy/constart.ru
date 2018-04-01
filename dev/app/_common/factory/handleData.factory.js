/**
 * Created by дима on 16.08.2016.
 */
module.exports = function() {
    'ngInject';
    var handleDataFactory = {};

    handleDataFactory.months = ['','январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'];
    handleDataFactory.monthsFrom = ['','января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];

    handleDataFactory.addZeroToDate = (d)=> {
        return d<10? '0' + d : d
    };

    // берет отдельно все числа из объекта не взирая на часовой пояс,  obj -> 2011-02-03
    handleDataFactory.dateYYYYMMDD =  (date) => {
        if (!date) return null;
        return date.getFullYear()
            + "-" + handleDataFactory.addZeroToDate(date.getMonth() + 1)
            + "-" + handleDataFactory.addZeroToDate(date.getDate());
    };
    // берет отдельно все числа из объекта не взирая на часовой пояс,  obj -> 03-02-2011
    handleDataFactory.dateDDMMYYYY = function (date) {
        if (!date) return;
        return handleDataFactory.addZeroToDate(date.getDate())
            + "-" + handleDataFactory.addZeroToDate(date.getMonth() + 1)
            + "-" + date.getFullYear();
    };

    // 2016-3-24 -> март(а) 2016 можно задавать ключ массива месяцев
    handleDataFactory.dateMMMMYYYY =  (date,sklonenie=false) => {
        if (!date) return null;
        const key = sklonenie?'monthsFrom':'months';
        const d = date.split('-');
        return  handleDataFactory[key][parseFloat(d[1])] + " " + d[0];
    };

    // 2016-3-24 -> 24 март(а) 2016 можно задавать ключ массива месяцев
    handleDataFactory.dateDDMMMMYYYY = (date,sklonenie=false) => {
        if (!date) return null;
        const key = sklonenie?'monthsFrom':'months';
        const d = date.split('-');
        return   d[2] + " " + handleDataFactory[key][parseFloat(d[1])] + " " + d[0];
    };

    // 2016-3-24 -> 24 март(а) можно задавать ключ массива месяцев
    handleDataFactory.dateDDMMMM = (date,sklonenie=false) => {
        if (!date) return null;
        const key = sklonenie?'monthsFrom':'months';
        const d = date.split('-');
        return   d[2] + " " + handleDataFactory[key][parseFloat(d[1])];
    };

    // сравнивает сопадают ли года у двух дат типа строка -> год или false
    handleDataFactory.sameYear =  (date,dateTwo) => {
        const d = date.split('-');
        const dTwo = dateTwo.split('-');
        return d[0] == dTwo[0]? d[0]: false
    };

    // 2 даты -> с 1 марта по 12 апреля 2016  или если одного года с 1 марта 2016 по 12 апреля 2020
    handleDataFactory.getIntervalDate =  (date,dateTwo) => {
        if(!date || !dateTwo) return undefined;
        let year = handleDataFactory.sameYear(date,dateTwo);
        if(year) {
            return `с ${handleDataFactory.dateDDMMMM(date,true)} по ${handleDataFactory.dateDDMMMM(dateTwo,true)} ${year}`
        } else {
            return `с ${handleDataFactory.dateDDMMMMYYYY(date,true)} по ${handleDataFactory.dateDDMMMMYYYY(dateTwo,true)}`
        }
    };

    // строки '2020-02-01' -> '01-02-2020'
    handleDataFactory.dateISOfromRU = function (date) {
        if (!date) return;
        return date.slice(-4) + "-" + date.slice(3, 5) + "-" + date.slice(0, 2);
    };
    // строки '01-02-2020' -> '2020-02-01'
    handleDataFactory.dateRUfromISO = function (date) {
        if (!date) return;
        return date.slice(-2) + "-" + date.slice(3, 5) + "-" + date.slice(0, 4);
    };

    // удаляет только null значения {key: null,ret: 0} -> {ret: 0}
    handleDataFactory.removeNullKeys = function (obj) {
        for (var key in obj) {
            if (obj[key] == null) {
                delete obj[key]
            }
        }
        return obj
    };
    handleDataFactory.undifinedKeysToNull = function (obj) {
        for (var key in obj) {
            if (obj[key] === undefined) {
                obj[key] = null
            }
        }
        return obj
    };
    handleDataFactory.nullKeysToUndifined = function (obj) {
        for (var key in obj) {
            if (obj[key] === null) {
                obj[key] = undefined
            }
        }
        return obj
    };

    handleDataFactory.getObjById = function (obj,id) {
        for (var i = 0; i < obj.length; i++) {
            if(obj[i].id == id) {
                obj = obj[i];
                break
            }
        }
        return obj
    };

    //  отдаю страну и регион через запятую. регион может быть не определен
    handleDataFactory.getCountryAndRegion = function (cID,regID,geo) {
        var country='',region='';
        if (geo) {
            for (let j = 0; j < geo.length; j++) {
                if (geo[j].id == cID) {
                    country = geo[j].name;
                    if(regID) {
                        for (let i = 0; i < geo[j].regions.length; i++) {
                            if (geo[j].regions[i].id == regID) {
                                region = ', ' + geo[j].regions[i].name;
                                break
                            }
                        }
                    }
                    return country +  region
                }
            }
        } else return ''
    };

    // removes MS Office generated guff
    handleDataFactory.cleanHTML = function(input) {
        if(!input) return null;

        // 0 обработка фото,  style="height: 114px; width:122px ->  height="114px" width="122px"

        const img = new RegExp('<img(.*?)style=(.*?)>','g');
        //const imgCheck = img.test(input);
        if(img.test(input)) {
            do {
                const imgElem = input.match(img)[0];
                const one = imgElem.split('style')[0] + ' ';
                const styleStr = imgElem.match(new RegExp('style=(.*?)>','g'))[0];
                let style = styleStr.split('"')[1]; // height: 114px; width: 122px;
                //все вхождения(с помощью/g) ': ' или ':'->'="',
                style = style.replace(/:( )?/g, '="').replace(/;/g, '"');//style.replace(';','"');style = style.replace(';','"');
                //style = style.replace(': ','="');style = style.replace(': ','="');
                const two = style +'>';
                input=input.replace(img,one+two);
            } while (img.test(input));
        }
        
        // 1. remove line breaks / Mso classes
        var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g;
        var output = input.replace(stringStripper, ' ');

        // 2. strip Word generated HTML comments
        var commentSripper = new RegExp('<!--(.*?)-->','g');
        output = output.replace(commentSripper, '');
        // или форматированные коменты
        var _commentSripper = new RegExp('&lt;!--(.*?)--&gt;');
        // они чистятся почему то только по одному вхождению за проход. поэтому:
        do(output = output.replace(_commentSripper, ''));
        while (_commentSripper.test(output));

        // 3. remove tags leave content if any
        var tagStripper = new RegExp('<(/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>','gi');
        output = output.replace(tagStripper, '');

        // 4. Remove everything in between and including tags '<style(.)style(.)>'
        var badTags = ['xml','style', 'script','applet','embed','noframes','noscript'];
        for (var i=0; i< badTags.length; i++) {
            tagStripper = new RegExp('<'+badTags[i]+'.*?'+badTags[i]+'(.*?)>', 'gi');
            output = output.replace(tagStripper, '');
        }

        // 5. remove attributes ' style="color:red"' color=red
        var badAttributes = ['style', 'start'];
        for (i=0; i< badAttributes.length; i++) {
            var attributeStripper = new RegExp(' ' + badAttributes[i] + '="(.*?)"','gi');
            output = output.replace(attributeStripper, '');
        }
        // 6. удаляю только теги, начинку оставляю
        var delOnlyTags = ['a','div'];
        for (i=0; i< delOnlyTags.length; i++) {
            var delOnlyTagsStripper = new RegExp('</?' + delOnlyTags[i] + '(.*?)>', 'gi');
            output = output.replace(delOnlyTagsStripper, '');
        }

        return output;
    };

    // делает з ссылки тег a
    handleDataFactory.hrefToA = function(_str) {
        //просто ссылка
        var _href = /(http|ftp|https)?(:\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;

        // ссылка с пробелом в начале
        var href = /\s(http|ftp|https)?(:\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;

        while (href.test(_str)) {
            //console.log("exec",href.exec(_str));
            var r = href.exec(_str)[0];
            // убираю пробел в начале если есть
            r = r.trim();
            //r = r[0]=== ' '? r.slice(1): r;
            _str = _str.replace(r,'<a href="' + r + '">' + r + '</a>');
        }
        return _str
    };

    // делаю ссылки глобальными
    handleDataFactory.hrefHandle = function(_str) {
        if(!_str || _str==='') return;
        return '//' + _str.replace(/(http|https)(:\/\/)/g,'')
    };

    function contains(str, substr) {
        return (str.indexOf(substr) > -1);
    }
    handleDataFactory.getIdFromYoutubeURL = function (url) {
        if (!url) return;
        const youtubeRegexp = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;

        const test = youtubeRegexp.test(url);
        if(!test) return undefined;

        var id = url.replace(youtubeRegexp, '$1');
        if (contains(id, ';')) {
            var pieces = id.split(';');
            if (contains(pieces[1], '%')) {
                var uriComponent = decodeURIComponent(pieces[1]);
                id = ('http://youtube.com' + uriComponent).replace(youtubeRegexp, '$1');
            } else {
                id = pieces[0];
            }
        } else if (contains(id, '#')) {
            id = id.split('#')[0];
        }
        return id;
    };

    /*  'https://www.youtube.com/watch?v=N7TkK2joi4I' ->
    { 'type': 'video',
        'url': 'https://www.youtube.com/watch?v=N7TkK2joi4I',
        'thumbUrl': 'https://i.ytimg.com/vi/N7TkK2joi4I/1.jpg'}*/
    handleDataFactory.getYoutubeVideoObj = function (url) {
        if (!url) return;
        var id = handleDataFactory.getIdFromYoutubeURL(url);
        return {
            url:'https://www.youtube.com/watch?v=' + id,
            type:'video',
            thumbUrl:'https://i.ytimg.com/vi/' + id + '/1.jpg'
        };

    };

    return handleDataFactory
};
