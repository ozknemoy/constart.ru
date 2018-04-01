export function userFactory($auth, $localStorage, ngToast,localStorageFactory/*,xdLocalStorage*/) {
  'ngInject';
    var userFactory = {};

    userFactory.reLogin = function (e,reloadWithOpeningModal) {
        if(e.status==401  || e.status==-1) {
            userFactory._reLogin(false,reloadWithOpeningModal)
        }
    };

    userFactory._reLogin = function (reloadWithoutModal,reloadWithOpeningModal,reloadRemoteLS=true) {

        $auth.logout().then(() => {
            localStorageFactory.deleteCookiesAuth();
            $localStorage.$reset();
            //if(reloadRemoteLS) xdLocalStorage.clear().then(()=> {});// на ведущем сайте удаляю все


            // ставлю задержку на рестарт. иногда не успевает удалить куки
            setTimeout(()=>{
                // перегружаю или на главную
                if(reloadWithoutModal) {
                    location.reload();
                }
                // пишу в локалстораж что нужно открыть модалку авторизации
                else if(reloadWithOpeningModal) {
                    $localStorage.reloadAtHome = 1;
                    location.reload();
                } else {
                    $localStorage.reloadAtHome = 1;
                    window.location = '/';
                }
            },100)

        })
    };

    //проверяю надо ли открывать окно авторизации после разлогина
    userFactory.checkDataRelogin = function () {
        if ($localStorage.reloadAtHome == 1) {
            ngToast.danger({dismissButton: true,content:'Авторизация устарела'});
            setTimeout(()=> {
                $localStorage.reloadAtHome = 0;
                angular.element('login-button').click();
            },500)
        }
    };

    // при редректах кликает элемент
    userFactory.clickElement = function (id,timeout=2e3) {
        setTimeout(()=> {
            angular.element(id).click();
        },timeout)
    };



    return userFactory
}