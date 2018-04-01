/**
 * Created by дима on 09.07.2016.
 */

export function httpFactory($http,$cacheFactory, $q, baseUrl,userAgentF,ngToast,TYPE,dictFactory) {
    'ngInject';
    var httpFactory = {},
        cache = $cacheFactory.get('$http');

    // добавляю в урлы признак партнера
    function getPartner (url) {
        if(!httpFactory.isPartner) return url;
        else if(TYPE =='air'){
            var chunk = url.includes('?')? '&' :'?';
            return url + chunk + 'partner_id=' + httpFactory.isPartner
        }
    }
    // добавляю везде ключ партнера
    function postPutForPartner (obj) {

        if(!httpFactory.isPartner || !obj) return obj;
        else {
            obj.partner_id = httpFactory.isPartner;
            return obj
        }
    }
    // определяю номер партнера
    switch (TYPE) {
        case 'air':
            httpFactory.isPartner = 1;
            break
    }
    httpFactory.baseImgUrl= baseUrl+ 'file/download?filename=';
    httpFactory.baseDocUrl= '/upload-static/';
    httpFactory.httpDocUrl= baseUrl+ 'upload-static/';

    httpFactory.setNumOfUsers = function (v) {
        httpFactory.numOfUsers = v;
    };

    httpFactory.get = function (url) {
        return $http.get(baseUrl+getPartner(url))
    };
    httpFactory.getLocal = function (url) {
        return $http.get(url)
    };

    httpFactory.post = function (url,d) {
        return $http.post(baseUrl+url,postPutForPartner(d))
    };
    httpFactory.postLocal = function (url,d) {
        return $http.post(url,d)
    };

    httpFactory.put = function (url, d) {
        return $http.put(baseUrl+url, postPutForPartner(d))
    };
    httpFactory.putLocal = function (url, content) {
        return $http.put(url, content)
    };

    function insertAfter(elem, refElem) {
        return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
    }
    function blobToFile(theBlob, fileName){
        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        theBlob.lastModifiedDate = new Date();
        theBlob.name = fileName;
        return theBlob;
    }

    httpFactory.downloadPdf = function (url,event) {
        var browser = userAgentF.getBrowser(),ObjectURL;
        ngToast.info({dismissButton: true,content:'Загрузка началась'});

        $http.get(baseUrl+getPartner(url), {responseType: 'arraybuffer'}).then(d=> {
            var file;
            try {
                file = new Blob([d.data], {type: 'application/pdf'})
                //application/octet-stream is defined as "arbitrary binary data"
            }
            catch (e) {
                ngToast.info({dismissButton: true,content:'Если загрузка не началась автоматически, вероятно Ваш браузер не поддерживает загрузку файлов по защищенному протоколу. Попробуйте нажмите появившуюся ссылку "Cкачать". Если ничего не происходит, то используйте современные настольные браузеры или мобильные хром, мозилла, сафари',timeout: 10000});
                window.BlobBuilder = window.BlobBuilder ||
                    window.WebKitBlobBuilder ||
                    window.MozBlobBuilder ||
                    window.MSBlobBuilder;
                if ( browser=='IE' && window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveOrOpenBlob(ObjectURL, 'contract.pdf');
                    return
                } else if (e.name == 'TypeError' && window.BlobBuilder) {
                    //Mobile Chrome is giving you a TypeError because the blob constructor
                    // is not supported. Instead you must use the old BlobBuilder API.
                    // The BlobBuilder API has browser specific BlobBuilder constructors.
                    // This is the case for FF6 - 12, Chrome 8-19, Mobile Chrome, IE10 and
                    // Android 3.0-4.2.

                    var bb = new BlobBuilder();
                    bb.append(d.data);
                    file = bb.getBlob('application/pdf');
                    //alert("case 2");
                }
                else if (e.name == "InvalidStateError") {
                    // InvalidStateError (tested on FF13 WinXP)
                    file = new Blob([d.data], {type: 'application/pdf'});
                    //alert("case 3");
                }
                else {
                    // blob constructor unsupported entirely
                    ngToast.danger({dismissButton: true,content:'Ваш браузер не поддерживает загрузку файлов по этому протоколу'})
                }
            }
            /* не пробовал но должно работать
             var fileURL = URL.createObjectURL(file);
             window.open($sce.trustAsResourceUrl(fileURL));
             */
            let a = document.createElement('a');
            ObjectURL = window.URL.createObjectURL(file);
            a.href = ObjectURL;
            a.download = 'contract.pdf';
            a.target = '_blank';
            a.innerHTML = '&thinsp;&thinsp;&thinsp;&thinsp; Cкачать';
            //document.body.appendChild(a);
            insertAfter(a,event.currentTarget);
            setTimeout(function () {
                a.click();
            }, 400);
        });
    };

    httpFactory._getGeo = function () {
        var url = 'ref/geo-country?withRegion=1';
        return  getWithCache(url)
    };

    // только для страниц где несколько директив с этим методом
    httpFactory.getGeo = function () {
        var url = 'ref/geo-country?withRegion=1';
        return  _getWithCache(url,'geo')
    };

    httpFactory.getInterest = function () {
        var url = 'ref/user-interest';
        return getWithCache(url)
    };

    httpFactory.getUsersActivity = function () {
        var url = 'ref/user-activity';
        return getWithCache(url)
    };
    httpFactory.getProjCategory = ()=> {
        var url = 'ref/project-field-of-activity-3?projectTypeId=1';

        // изза преобразований 3 уровнего массива тут отдельный кеш
        this.projCategory = {};
        if(this.projCategory.data) {
            return new Promise(resolve=> resolve(this.projCategory))
        } else {
            return new Promise(resolve=> {
                $http.get(baseUrl + url).then(d=> {
                    this.projCategory.data = dictFactory.transitObj(d.data, 'items');
                    if(TYPE =='air') {
                        this.projCategory.data = [_.where(this.projCategory.data,'id',146)]//.items
                    }
                    resolve(this.projCategory)
                })
            })
        }
    };

    httpFactory.getOnProjCategory = function () {
        var url = 'ref/project-field-of-activity?projectTypeId=1';
        return getWithCache(url)
    };

    // на будущее/ рабочая фишка/ посылает кучу запросов детей родителей
    httpFactory._getProjCategory = ()=> {
        var url = 'ref/project-field-of-activity?projectTypeId=1';//
        this.projCategory = {};
        console.time("1");console.time("2");

        if(this.projCategory.data) {
            return new Promise(resolve=> resolve(this.projCategory))
        } else {
            var parent_id = TYPE =='air'? 146 : 0;
            return new Promise(resolve=> {
                httpFactory.get(url + '&parent_id=' + 0).then(d=> {
                    this.projCategory.data = d.data;console.timeEnd("1");
                }).then(d=> {
                    Promise.all([
                        this.projCategory.data.forEach((parent,i)=> {
                            httpFactory.get(url + '&parent_id=' + parent.id)
                                .then(d=> {
                                    this.projCategory.data[i].items = d.data[0].items
                                })
                        })
                    ]).then(()=> {
                        console.log("all",this.projCategory);console.timeEnd("2");
                        /*this.r = d.data.sort((a, b) => a.price - b.price);*/
                        resolve(this.projCategory)
                    })
                })
            })
        }



        //
    };

    httpFactory.getCache = function (url) {
        return cache.get(url)
    };

    // могу одновременно запрашивать (сделано для директив требующих данные как и контроллер)
    // есть проблемы. резолв отдает кеш вместе с манипулиремыми приложением данными {name: 'Все'},{name: 'Все'}
    function _getWithCache (url,id) {
        var mycache = httpFactory.getCache(baseUrl+getPartner(url));

        if(!httpFactory[id]) httpFactory[id] = $q.defer();
        if(!mycache) {// first query
            $http.get(baseUrl+getPartner(url), {cache: true}).then(d=> {
                httpFactory[id].resolve(d);
            });
            return httpFactory[id].promise
        } else {// second query
            if(mycache[1]) { // cache is resoleved
                //const _mycache =  angular.copy(mycache);
                setTimeout(()=> {
                    httpFactory[id].resolve({data:JSON.parse(mycache[1])});
                },5)
            }
            // cache is not resoleved
            return httpFactory[id].promise
        }

    }

    function getWithCache (url) {
        var mycache = httpFactory.getCache(baseUrl+getPartner(url));
        if(mycache) {
            const _mycache =  angular.copy(mycache);
            var deferred = $q.defer();
            deferred.resolve({data:JSON.parse(_mycache[1])});
            return deferred.promise
        }
        else return $http.get(baseUrl+getPartner(url), {cache: true})
    }

    // проверка логина на сервере
    httpFactory.getAuth = function () {
        return httpFactory.get('user/is-logged-in')
    };

    // покупка награды с внутреннего счета
    httpFactory.buyRewardFromInner = function (amount,sharePrice,rewardId,projectId,free) {
        const url = free? 'payment/request-donation-payment' : 'payment/request-reward-payment';
        var d = {
            "part_count": parseFloat(amount),
            "reward_id": parseFloat(rewardId),
            "project_id": parseFloat(projectId),
            "amount": sharePrice*parseFloat(amount)
        };
        return httpFactory.post(url, postPutForPartner(d))
    };

    // покупка награды с внешнего счета. для логинов и не логинов
    httpFactory.buyRewardFromOuter = function (amount,sharePrice,rewardId,projectId,email,free) {
        const url = free? 'outer-payment/request-donation-payment' : 'outer-payment/request-reward-payment';
        var d = {
            "part_count": parseFloat(amount),
            "reward_id": parseFloat(rewardId),
            "project_id": parseFloat(projectId),
            "amount": sharePrice*parseFloat(amount),
            "email": email
        };
        return httpFactory.post(url, postPutForPartner(d)).then(d => {
            window.location = d.data.url;
        })
    };


    httpFactory.delete = function (url) {
          return $http.delete(baseUrl+url)
    };

    httpFactory.deleteLocal = function (url) {
       return $http.delete(url)
    };

    httpFactory.restorePassword = function (email) {
        var body = email? {"email": email.toLowerCase()} : undefined;
        return $http.post(baseUrl+'user/request-password-reset',body)
    };

    function isJson(item) {
        item = typeof item !== "string" ? JSON.stringify(item) : item;
        try {
            item = JSON.parse(item);
        } catch (e) {
            return false;
        }
        if (typeof item === "object" && item !== null) {
            return true;
        }
        return false;
    }

    return httpFactory

}
/*
 ref/geo-region вернет все регионы
 /ref/geo-region?countryId=1 вернет регионы страны
 /ref/geo-country список стран
 /ref/geo-country?withRegion=1 вернет список стран сразу с регионами

 /ref/user-interest     интересы пользователя
 ref/project-field-of-activity?projectTypeId=1 направления



 file/upload64
 file/upload-gallery  для файлов с тумбами
 /file/upload-doc для пдф

 user/get-code?codeType=phoneVerify  потом user/phone-verify?code= гет
 user/get-code?codeType=passportSave потом user/passport-save?code= гет
 user/bank-save пут
 user/passport-save пут
 запрос на удаление user/get-code?codeType=passportClear   password-clear?code=XXXX гет
 user/passport-clear гет

 запрос кода с codeType=passportClear

 user/get-payments вернет список всех платежей пользователя
 /project/send-message-to-owner?projectId=XX,  POST, в теле {"message":"Привет"} от 32 до 1000 символов

 user-legal/create
 user-legal/list

 // 'reward/index', 'reward/create', 'reward/:id/delete', 'reward/:id/update', 'reward/:id/view'



/project-team-invite/find-user-by-email    параметры email и project_id вернет либо пользователя либо ошибку
/project-team-invite/create в заголовке project_id в теле если в предыдущем запросе вернулся пользователь то user_id
 нужен, и все поля, если не нашли такого то user_id пустой
user_id
project_id
email
role
message
name
surname
/project-team-invite/update в заголовке id в теле поля см выше
/project-team-invite/delete в заголовке id.  удаляет как приглашения, так и участников команды
/project-team-invite/accept-invite в заголовке token
/project-team-invite/Refuse-Invite в заголовке токен
/project-team-invite/resend-invite в заголловке id работает только для приглашений в статусе
      истек срок действия или на нашем  языке satus = 4
*/
