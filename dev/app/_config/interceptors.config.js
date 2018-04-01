/**
 * Created by ozknemoy on 09.11.2016.
 */

export function interceptorsConfig ($httpProvider) {
    'ngInject';
    $httpProvider.interceptors.push(function($q,ngToast) {
        'ngInject';
        function failToast(content) {
            ngToast.danger({
                content,
                dismissButton: true,
                timeout: 10e3
            })
        }
        return {
            request: function(config){
                const local = /localhost/i.test(location.href);
                if(!local && config.url.includes('app/')){
                    Object.assign(config.headers,{"Cache-Control": "no-cache, must-revalidate"})
                }

                return config;
            },
            /*'request': function(config) {
                // same as above
                console.log("config",config);

                if(config.method=='GET') {

                }
                //console.log($http.pendingRequests.length);

                return config
            },*/
            /*'response': function(resp) {

                return resp
            },*/
            'responseError': function(reject) {
                if(/(localhost|beta)/i.test(location.href)) {// только для теста
                    failToast(reject.config.method + ' запрос на адрес: ' + reject.config.url)
                }

                if (!reject.data && reject.status==401) {
                    failToast('<i class="fa fa-exclamation-triangle"></i> Ваш логин устарел')
                } else if(!reject.data && /localhost/i.test(location.href)) {// только для localhost
                    failToast('<i class="fa fa-exclamation-triangle"></i> У нас что-то поломалось')
                } else if(reject.data) {
                    // обрабатываю ошибки тостами как строку или как массив
                    var errors = reject.data.length? reject.data : [reject.data];
                    errors.forEach(err => {
                        failToast('<i class="fa fa-exclamation-triangle"></i> ' + err.message)
                    })
                }
                return $q.reject(reject)
            }
        };
    });
}