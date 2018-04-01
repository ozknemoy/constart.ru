/**
 * Created by дима on 12.08.2016.
 */

module.exports = function() {
    'ngInject';
    var dictFactory = {};

    dictFactory.pdf = ['doc1.pdf','doc2.pdf','doc3.pdf'];

    dictFactory.english_level = ['Не владею', 'Разговорный', 'Свободный', 'Чтение', 'Чтение технической документации'];

    dictFactory.edu_level = ["Не выбрано", 'Высшее', 'Два высших и более', 'Неоконченное высшее', 'Среднее', 'Средне-специальное'];

    dictFactory.main_lang = ['Английский', 'Русский'];
    //Ключевые навыки
    /*dictFactory.main_activity = ['Разработка и проведение рекламных кампаний','Технический перевод на иностранные языки',
        'Ведение переговоров','Продажи','Проектирование информационных систем'];*/

    dictFactory.user_statuses = ['инвестор', 'инициатор'];

    dictFactory.work_sphere = ['Бытовые услуги', 'Дом и дача', 'Жилищно-коммунальное хозяйство', 'Культура и спорт',
        'Мебель', 'Медицина, здоровье и красота', 'Металлопрокат, металлоизделия, металлообработка', 'Образование, работа, отдых',
        'Общественные организации', 'Одежда, обувь, ткани', 'Органы власти', 'Офис, канцтовары', 'Предприятия торговли и питания',
        'Природопользование', 'Продукты питания', 'Производственные услуги', 'Промышленные изделия, инструменты, приборы',
        'Реклама, полиграфия, СМИ', 'Связь, телекоммуникации, Интернет', 'Строительство и недвижимость', 'Сырье и материалы',
        'Технологическое оборудование', 'Транспорт', 'Финансы и юриспруденция','IT'];


    dictFactory.marital_statuses = [
        {id: undefined, name: 'Не выбрано'},
        {id: '0', name: 'В браке'},
        {id: '1', name: 'Холост(не замужем)'}];

    dictFactory.children = [
        {id: undefined, name: 'Не выбрано'},
        {id: 0, name: 'Да'},
        {id: 1, name: 'Нет'}
    ];

    dictFactory.sexes = [
        {id: undefined, name: 'Любой'},
        {id: 1, name: 'Женский'},
        {id: 0, name: 'Мужской'}
    ];

    dictFactory.legals = [
        {id: undefined, name: 'Не выбрано'},
        {id: '5', name: 'Иная организационно-правовая форма согласно ГК РФ'},
        {id: '1', name: 'Индивидуальный предприниматель'},
        {id: '4', name: 'Непубличное акционерное общество'},
        {id: '2', name: 'Общество с ограниченной ответственностью'},
        {id: '3', name: 'Публичное акционерное общество'}
        ];

    dictFactory.operationStatuses = [
        {id:undefined,name:'Все'},
        {id:3,name:'Заморозка'},
        {id:1,name:'Приход'},
        {id:4,name:'Разморозка'},
        {id:2,name:'Расход'}];

    // проекты
    dictFactory.incubators = [
        {name: 'Не выбрано'},//id: '',
        {id: 3, name: 'iDealMachine',foto:'resident-iDealMachine.png'},
        {id: 1, name: 'Бизнес-инкубатор Казанского «ИТ-Парка»',foto:'resident-it-park.png'},
        {id: 4, name: 'Ингрия',foto:'resident-ingria.png'},
        {id: 0, name: 'ИТМО',foto:'resident-ifmo.png'},
        {id: 2, name: 'ФРИИ',foto:'resident-frii.png'}
    ];

    dictFactory.stages = [
        {id: 5, name: 'Готовый бизнес (выкуп, продажа готового бизнеса, франшиза)', shortname: 'Готовый бизнес'},
        {id: 2, name: 'Запуск (мелкосерийное производство, первые продажи)', shortname: 'Запуск'},
        {id: 0, name: 'Идея', shortname: 'Идея'},
        {id: 1, name: 'Прототип (макет, опытный образец, тестовый период)', shortname: 'Прототип'},
        {id: 4, name: 'Развитие (стабильное производство, расширение) ', shortname: 'Развитие'},
        {id: 3, name: 'Рост (серийное производство, прибыль, рост продаж)', shortname: 'Рост'}];

    dictFactory.projLeveOne = [
        {id: 1, project_type_id: 1, name: "IT", parent_id: 0},
        {id: 146, project_type_id: 1, name: "Авиация", parent_id: 0},
        {id: 24, project_type_id: 1, name: "Инновации", parent_id: 0},
        {id: 46, project_type_id: 1, name: "Продукты и услуги", parent_id: 0},
        {id: 130, project_type_id: 1, name: "Промышленность", parent_id: 0},
        {id: 114, project_type_id: 1, name: "Социальные проекты", parent_id: 0},
        {id: 126, project_type_id: 1, name: "Сельское хозяйство", parent_id: 0},
        {id: 102, project_type_id: 1, name: "Услуги для бизнеса", parent_id: 0},
        {id: 137, project_type_id: 1, name: "Другое", parent_id: 0}
    ];

    /*dictFactory.projStatuses = ['Новый', 'Изменен', 'Не прошел модерацию', 'На модерации',
        'Опубликован', 'Сбор средств', 'Сбор средств удачен', 'Сбор средств не удачен'];*/
    dictFactory.projStatuses = [
        {id:'', name: 'Все проекты'},
        //{id: 0, name: 'Новый'},
        {id: 1, name: 'Черновик'},
        {id: 2, name: 'Не прошел модерацию'},
        {id: 3, name: 'На модерации'},
        //{id: 4, name: 'Опубликован'},
        {id: 5, name: 'Опубликован'},
        {id: 8, name: 'Проект завершен успешно'},
        {id: 9, name: 'Проект завершен неудачно'},
        {id: 6, name: 'Подписание договоров'}
    ];

    dictFactory.typePE = [
        {id:1,name:'Краудфандинг'},
        {id:2,name:'Краудлендинг и краудинвестинг'}
    ];

    dictFactory.termsDelivery = [
        {id:'2',name:'вознаграждение не требует доставки'},
        {id:'3',name:'доставляется в электронном виде'},
        {id:'0',name:'доставка производится за счет инициатора и входит в стоимость вознаграждения'},
        {id:'1',name:'доставка производится за счет инвестора и оплачивается отдельно'},
        {id:'4',name:'самовывоз (доставка не производится)'}
    ];

    dictFactory.payment_order = [
        {'id':3,'name':'В конце срока займа'},
        {'id':2,'name':'Ежеквартальный'},
        {'id':1,'name':'Ежемесячный'}
    ];
    dictFactory.payment_order_body = dictFactory.payment_order;

    // принисаю ключ-строку массива сверху словаря
    // ['Идея', 'Стартап']->[{id: 1, name: 'Идея'}, {id: 2, name: 'Стартап'}]
    dictFactory.getObj = function (key,withAll='Все') {
        var finalObj = [];
        dictFactory[key].forEach((item,i)=> {
            finalObj[i] = {name:item,id:i}
        });
        if (withAll) finalObj.push({name:withAll});
        return finalObj
    };
    // добавляет пункт "всё"
    // levels это двухуровневость
    dictFactory.transitObj = function (obj,levels,keyName='Все') {
        var finalObj = obj.slice();
        let t = {};
        if(!levels) {
            finalObj.push({name:keyName})
        } else {
            finalObj.forEach((item)=>{
                if (item[levels]) {
                    if (Array.isArray(item[levels])) {// 2х уровневый список
                        item[levels].splice(0,0,{name:keyName});
                    }
                    else {// 3х уровневый список
                        var arrTwo = [];
                        for(var key in item[levels]) {
                            var itemTwo = item[levels][key];
                            // тк не все имеют 3 уровень то проверка
                            if(itemTwo[levels]) {
                                var arrThree = [];
                                for(var keyThree in itemTwo[levels]) {
                                    arrThree.push(itemTwo[levels][keyThree])
                                }
                                // перезаписываю объект массивом
                                itemTwo[levels] = arrThree;
                                itemTwo[levels].splice(0,0,{name:keyName})
                            }
                            arrTwo.push(itemTwo)
                        }
                        // перезаписываю объект массивом
                        item[levels] = arrTwo;
                        item[levels].splice(0,0,{name:keyName})
                    }
                }
            });
            finalObj.splice(0,0,{name:keyName})
        }
        return finalObj
    };

    //[{id: 1, name: "IT"}],[{... value:1}]->{id:1,name:"IT"}
    dictFactory.dataToSelect2 = function (allData,data) {
        var finalObj = [];
        if(!data||data==[]) return [];
        data.forEach(item=> {
            for (var j = 0; j < allData.length; j++) {
                if(allData[j].id==item.value) {
                    finalObj.push({id:item.value,name:allData[j].name});
                    break
                }
            }
        });
        return finalObj
    };

    
    // обработчик для мульти селекта iSteven в зависимости от того какие данные скармливаю isObj или isArr
    // первая переменная объект фильтрации,второй это массив выбраных значений, третий вид данных
    //-> [{name:' ' , id:1  ,ticked = true}]
    dictFactory.iSteven = function (obj,arr,isObj) {
        var finalObj = [];
        if(isObj) {
            finalObj = obj;
        } else {
            obj.forEach((item,i)=> {
                finalObj[i] = {name:item,id:i}
            });
        }
        if (Array.isArray(arr))
        arr.forEach((item,i)=> {
            for (var j = 0; j < finalObj.length; j++) {
                if (item.value==finalObj[j].id) {
                    finalObj[j].ticked = true;
                    break
                }
            }
        });
        return finalObj
    };

    // {... id:2,... id:4}-> [2,4]
    dictFactory.objToArrayIds = function (arr) {
        var finalObj = [];
        if (arr.length) {
            arr.forEach((item)=> {
                finalObj.push(item.id);
            });
        }
        return finalObj
    };

    dictFactory.istevenLang = {
        selectAll       : "выбрать всё",
        selectNone      : "снять выбор",
        reset           : "сбросить",
        search          : "поиск...",
        nothingSelected : "ничего не выбрано"
    };

    dictFactory.dateOptions = {
        datepickerMode: 'year',
        //formatYear: 'yy',
        showWeeks: 0,
        initDate: new Date(1990, 1, 1),
        maxDate: new Date(2027, 5, 22),
        minDate: new Date(1940, 5, 22),
        startingDay: 1
    };

    // первый аргумент массив объектов выбраных значений, второй - ключ из справочника
    // парсер [{id:12,value:1}]+ user_statuses ->['инвестор']
    // если данные с сервера:
    // obj,keyOrArray меняются местами!!!!
    // первое - справочник с  сервера плюс массив объектов выбраных значений с сервера
    //  fromServer [{id:12,name:"инвестор"}]+{id:1,value:12}->['инвестор']
    dictFactory.objToNgRepeat = function (objOrDict,keyOrArray,fromServer) {
        if(!keyOrArray || !keyOrArray.length || !objOrDict || !objOrDict.length) return;

        var finalObj = [];
        objOrDict.forEach(item => {
            if (fromServer){
                keyOrArray.forEach((_item)=> {
                    if(item.id == _item.value) {
                        finalObj.push(item.name);
                    }
                });
            } else finalObj.push(dictFactory[keyOrArray][item.value]);

        });
        return finalObj

    };

    //  {id:12}->[id] or {0:12}->[0]   отсеивает undefined
    dictFactory.ObjToArr = function (obj) {
        var finalObj = [];
        if (obj!=={} && obj) {
            for (let key in obj) {
                if (obj[key] && key!='undefined')  {
                    finalObj.push(key);
                }
            }
        } else return null
        if (!finalObj.length) return null
        else return finalObj
    };

    //  {... id:12, ticked:true ...}->[12]
    dictFactory.ObjWithTickToArr = function (arrObj) {
        var finalObj = [];
        if (arrObj!==[]&&arrObj.length) {
            arrObj.forEach((obj)=> {
               if (obj.ticked)  finalObj.push(obj.id);
            })
        } else return [];
        return finalObj
    };


    return dictFactory
}