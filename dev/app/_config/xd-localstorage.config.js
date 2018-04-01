/**
 * Created by ozknemoy on 06.04.2017.
 */
export function xdLocalstorage(xdLocalStorage,localStorageFactory,userFactory) {
    'ngInject';

    console.log("location.host",location.host);
    // iframe должен браться с единственного  ведущего домена
    var iframeUrl = 'http://localhost:8001/untitled/ls-iframe.html';
    xdLocalStorage.init({iframeUrl:iframeUrl}).then(function () {
        var token = localStorage.getItem('token');

        var isNotMainSite = !iframeUrl.includes(location.host);
        // если  не ведущий сайт
        if(isNotMainSite)  {
            console.log("не ведущий сайт");
            /*var id = localStorage.getItem('ngStorage-user_id'),
                foto = localStorage.getItem('ngStorage-foto'),
                name = localStorage.getItem('ngStorage-name'),
                surname = localStorage.getItem('ngStorage-surname'),
                sex = localStorage.getItem('ngStorage-sex'),
                foto64 = localStorage.getItem('ngStorage-foto64');*/
            // отдаю ведущему сайту данные
            //localStorageFactory.setDomenLocalStorageData(false,id,token,foto,name,surname,sex,foto64);
        }else {
            console.log("ведущий сайт");
        }

        // если токена нет то проверяю данные на ведущем домене
        if (!token) {
            localStorageFactory.getDomenLocalStorageData()
        } else if(token && isNotMainSite) {// если токен есть и это не ведущий сайт
            console.log("have token && isNotMainSite");
            
            xdLocalStorage.getItem('token').then(function (t) {
                // и он не равен удаленному то разлогин
                console.log('__promise___',t.value!=token,'t.value',t.value,token);
                if(t.value!=token) {
                    userFactory._reLogin(true,false,false)
                }
            },e=>console.log('__e',e));
        }
    });
    /*setTimeout(()=> {
        xdLocalStorage.getItem('token').then(function (response) {
            console.log('token__ ',response.value);
        });
        console.log("xdLocalstorage end");
    },2000)*/

}