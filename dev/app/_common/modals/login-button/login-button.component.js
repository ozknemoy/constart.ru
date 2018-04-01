/**
 * Created by ozknemoy on 15.11.2016.
 */
export const loginButtonComponent = {
    controller: function ($element,$uibModal) {
        'ngInject';
        function _click() {
            const config = {
                animation: true,
                templateUrl: 'app/_common/modals/login-button/login-button.html',
                controller: modalController,
                controllerAs: 'lg'
            };
            $uibModal.open(config);
        }

        $element.on('click', _click);

        this.$onDestroy = ()=> {
            $element.off('click', _click);
        }
    }
};

function modalController($auth, localStorageFactory, httpFactory) {
    'ngInject';

    // авторизация . возвращаемые значения сохраняются в локал стораж
    // редирект с жестkой перезагрузкой
    this.log = () => {
        this.pending = 1;
        $auth.login({
            "email": this.login_email.toLowerCase(),
            "password": this.login_password
        }).then(d => {
            var v = d.data;
            localStorageFactory.set(v);
            //localStorageFactory.setDomenLocalStorageData(true,v.id,v.token,v.foto,v.name,v.surname,v.sex,null);
            // перезагруза приложения
            if (/mailVerify/g.test(location.href)) window.location = '/userEditor/' + d.data.id + '/about';
            else location.reload();

        }, err => {
            this.pending = 0;
        });
    };

    // восстановление пароля
    this.restore = () => {
        this.pending = 1;
        httpFactory.restorePassword(this.lost_email).then(
            d => {
                this.restoreResponse = 1;
                this.pending = 0;
                this.restoreErrorResp = 0;
            }, err => {
                this.pending = 0;
            }
        );
    };
}