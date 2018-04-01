/**
 * Created by ozknemoy on 07.11.2016.
 */
export function localStorageFactory ($localStorage,canvasF,httpFactory/*,xdLocalStorage*/) {
    'ngInject';
    localStorageFactory = {data:{}};
    localStorageFactory.set = function (d) {
        if (d){// после логина
            $localStorage.user_id = d.id;
            $localStorage.token = d.token;
            $localStorage.foto = d.foto;
            $localStorage.name = d.name;
            $localStorage.surname = d.surname;
            $localStorage.sex = d.sex;
            localStorageFactory.writeLSToCookie();
        } else {// в остальных случаях
            localStorageFactory.data.user_id = $localStorage.user_id;
            localStorageFactory.data.token = $localStorage.token;
            localStorageFactory.data.foto = $localStorage.foto;
            localStorageFactory.data.name = $localStorage.name;
            localStorageFactory.data.surname = $localStorage.surname;
            localStorageFactory.data.sex = $localStorage.sex;
            if ($localStorage.foto64) {
                localStorageFactory.data.foto64 = $localStorage.foto64
            } else {// сохраняю base 64
                canvasF.createImgFromCanvas(httpFactory.baseImgUrl + $localStorage.foto,40).then(d=>{
                    $localStorage.foto64 = d;
                    localStorageFactory.data.foto64 = d
                });
            }
        }
    };

    localStorageFactory.getDomenLocalStorageData = function () {
        console.log("getDomenLocalStorageData");
        
        var reload;
        Promise.all([
            xdLocalStorage.getItem('ngStorage-user_id').then(function (r) {
                if (r.value) localStorage.setItem('ngStorage-user_id', r.value)
            }),
            xdLocalStorage.getItem('token').then(function (r) {
                if (r.value) {
                    console.log("getDomenLocalStorageData ok");
                    localStorage.setItem('token', r.value);
                    // если токен есть на удаленке то релоад для залогивания
                    reload = true;
                }
            }),
            xdLocalStorage.getItem('ngStorage-foto').then(function (r) {
                if (r.value) localStorage.setItem('ngStorage-foto', r.value)
            }),
            xdLocalStorage.getItem('ngStorage-name').then(function (r) {
                if (r.value) localStorage.setItem('ngStorage-name', r.value)
            }),
            xdLocalStorage.getItem('ngStorage-surname').then(function (r) {
                if (r.value) localStorage.setItem('ngStorage-surname', r.value)
            }),
            xdLocalStorage.getItem('ngStorage-sex').then(function (r) {
                if (r.value) localStorage.setItem('ngStorage-sex', r.value)
            }),
            xdLocalStorage.getItem('ngStorage-foto64').then(function (r) {
                if (r.value) localStorage.setItem('ngStorage-foto64', r.value)
            })
        ]).then(function (r) {
            console.log("getDomenLocalStorageData Promise.all",r);
            if (reload) location.reload()
        });
    };

    // после логина и инициализации приложения
    localStorageFactory.setDomenLocalStorageData = function (afterLogin,id,token,foto,name,surname,sex,foto64) {
        // есле после логина то надо окружить данные с префиксом ngStorage- кавычками
        var guotes = afterLogin? '"' : '';
        function setQuotes(v) {
            return guotes + v + guotes
        }
        if (token) {
            xdLocalStorage.setItem('ngStorage-user_id', setQuotes(id));
            xdLocalStorage.setItem('token', token)
        }
        if (foto) {
            xdLocalStorage.setItem('ngStorage-foto', setQuotes(foto))
        }
        if (name) {
            xdLocalStorage.setItem('ngStorage-name', setQuotes(name))
        }
        if (surname) {
            xdLocalStorage.setItem('ngStorage-surname', setQuotes(surname))
        }
        if (sex) {
            xdLocalStorage.setItem('ngStorage-sex', setQuotes(sex))
        }
        if (foto64) {
            xdLocalStorage.setItem('ngStorage-foto64', setQuotes(foto64))
        }
    };

    // выставляет фото после обновления в редакторе
    localStorageFactory.setFoto = function (foto) {
        // сохраняю base 64
        canvasF.createImgFromCanvas(httpFactory.baseImgUrl + foto,40).then(d=>{
            $localStorage.foto64 = d;
            localStorageFactory.data.foto64 = d;
        });
        $localStorage.foto = foto;
        localStorageFactory.data.foto = foto;
    };

    localStorageFactory.setName = function (name) {
        $localStorage.name = name;
        localStorageFactory.data.name = name;
        localStorageFactory.writeLSToCookie()
    };

    localStorageFactory.get = function () {
        console.log("localStorageFactory.get",$localStorage);

        localStorageFactory.data = $localStorage;
    };


    const tokenPrefixLS = 'ngStorage-';
    const tokenPrefixCookie = 'cs_';
    const tokenCookieName = tokenPrefixCookie + 'token';
    const TOKENS = ['token','user_id','foto','name','surname','sex'/*,'foto64'*/];

    localStorageFactory.checkCookieAuth = function() {
        var token = localStorage.getItem('token');
        if (!token) {
            localStorageFactory.getCookiesAuth()
        } else {
            var cookieToken = localStorageFactory.getCookie(tokenCookieName);
            // сравниваю токен в куках и в локалстораже
            if(cookieToken && token!==cookieToken) {// при наличии cookieToken
                // обновляю локалстораж
                localStorageFactory.writeCookieToLS(cookieToken);
            } else if(!cookieToken) {// кука нет значит был разлогин на другом домене
                localStorage.clear();
                location.reload();
            } else {
                // авторизация актуальна
            }
        }
    };
    localStorageFactory.getCookiesAuth = function() {
        var cookieToken = localStorageFactory.getCookie(tokenCookieName);
        if(cookieToken) {
            // пишу куки в локал стораж и перегружаю приложение
            localStorageFactory.writeCookieToLS(cookieToken)
        }
    };
    localStorageFactory.writeCookieToLS = function(cookieToken) {
        console.log("writeCookieToLS");

        TOKENS.forEach(token=> {
            $localStorage[token] = localStorageFactory.getCookie(tokenPrefixCookie + token)
        });
        localStorage.setItem('token',localStorageFactory.getCookie(tokenPrefixCookie + 'token'));
    };
    localStorageFactory.writeLSToCookie = function() {
        console.log("writeLSToCookie");
        TOKENS.forEach(token=> {
            localStorageFactory.setCookie(tokenPrefixCookie + token,$localStorage[token])
        })
    };
    /*localStorageFactory.setCookiesAuth = function() {
        if(!localStorage.token) return;
        localStorageFactory.setCookie(tokenCookieName,localStorage.token);
    };*/
    localStorageFactory.deleteCookiesAuth = function() {
        TOKENS.forEach(token=> {
            localStorageFactory.deleteCookie(tokenPrefixCookie + token);
        })
    };

    // возвращает cookie с именем name, если есть, если нет, то undefined
    localStorageFactory.getCookie = function (name, cookie=document.cookie) {
        if(!cookie) return;
        const c = new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)");
        var m = document.cookie.match(c);
        return m ? decodeURIComponent(m[1]) : undefined;
    };


    var domain;
    var host = location.host;
    if(host.includes('localhost')) {
        domain = 'localhost'
    } else if(host.includes('constart.ru')) {
        domain = 'constart.ru'
    }
    localStorageFactory.setCookie = function (name, value, options) {
        options=Object.assign({expires:100000000,domain,path:'/'},options);
        var expires = options.expires;

        if (typeof expires == "number" && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);

        var updatedCookie = name + "=" + value;

        for (var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }

        document.cookie = updatedCookie;
    };

    localStorageFactory.deleteCookie = function (name) {
        localStorageFactory.setCookie(name, "", {
            domain,// обязаловка
            path: '/',// обязаловка
            expires: -1
        });
    };

    return localStorageFactory
}