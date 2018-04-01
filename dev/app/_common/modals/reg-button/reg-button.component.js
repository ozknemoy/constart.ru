/**
 * Created by ozknemoy on 15.11.2016.
 */
export const regButtonComponent = {
    bindings: {
        admin: '@?',
        header: '@?'
    },
    controller: function ($element,$uibModal) {
        'ngInject';

        this._click = () => {
            const config = {
                animation: true,
                templateUrl: 'app/_common/modals/reg-button/reg-button.html',
                controller: regButtonController,
                controllerAs: 'lg',
                resolve: {
                    data: () => [this.admin,this.header]
                }
            };
            $uibModal.open(config);
        };

        $element.on('click', this._click);

        this.$onDestroy = ()=> {
            $element.off('click', this._click);
        }
    }
};

function regButtonController($auth, data, httpFactory, vcRecaptchaService) {//
    'ngInject';
    [this.isAdminm,this.header]= data;

    this.baseDocUrl = httpFactory.baseDocUrl;
    this.isAuthenticated = $auth.isAuthenticated();
    // для капчи:
    this.key = '6Ld1QCcTAAAAAPSYo_gXrFf0BxJZ3XFz9wym-CNt';// на мою почту
    this.response = null;
    this.widgetId = null;


    // 2 колбека капчи
    this.setResponse = response => {
        // response == ng-model="lg.recaptchaResponse"
        // можно использовать любое из них
        this.response = response;
    };
    this.cbExpiration = () => {
        vcRecaptchaService.reload(this.widgetId);
        this.response = null;
    };
    // регистрация
    this.signup = () => {
        this.pending = 1;
        httpFactory.post('user/create', {
            "new_email": this.register_email.toLowerCase(),
            "password": this.register_password,
            "surname": this.register_surname,
            "name": this.register_name,
            "phone_num": this.register_phone,
            "recaptchaResponse": this.response
        }).then(d => {
            /*ngToast.info({dismissButton: true,
                content: '<i class="fa fa-info"></i> Для завершения регистрации подтвердите свой email. Если письмо не пришло, проверьте папку со спамом или отправите письмо еще раз.',
                timeout: 10e3
            });*/
            //$uibModalInstance.close();
            this.regSuccess = 1;
            //this.pending = 0;
        }, err => {
            this.pending = 0;
            this.registerForm.$error.recaptcha = [null];
            this.response = null;
            vcRecaptchaService.reload(this.widgetId);
        }
        )
    };
}