
export var LoginDirective = {
    templateUrl: 'app/_common/directives/login/login.html',
    bindings: {},
    controllerAs: 'lg',
    controller: loginController
};


function loginController($auth, localStorageFactory, httpFactory, vcRecaptchaService) {
    'ngInject';

    this.baseDocUrl = httpFactory.baseDocUrl;
    this.isAuthenticated = $auth.isAuthenticated();
    // для капчи:
    this.key = '6Ld1QCcTAAAAAPSYo_gXrFf0BxJZ3XFz9wym-CNt';// на мою почту
    this.response = null;
    this.widgetId = null;

    // авторизация . возвращаемые значения сохраняются в локал стораж
    // редирект с жествой перезагрузкой для подхвата нав баром фотки и имени
    this.log = () => {
        this.pending = 1;
        $auth.login({
            "email": this.login_email.toLowerCase(),
            "password": this.login_password
        }).then(d => {
            localStorageFactory.set(d.data);
            /*$localStorage.user_id = d.data.id;
            $localStorage.token = d.data.token;
            $localStorage.foto = d.data.foto;
            $localStorage.name = d.data.name;
            $localStorage.surname = d.data.surname;*/
            this.isAuthenticated = true;
            this.pending = 0;
            //$state.go('user',{"id":$localStorage.user_id});
            // перезагруза приложения чтобы грузилась фотография навбара
            if(/mailVerify/g.test(location.href)) window.location = '/user/' + d.data.id + '/about';
            else location.reload();


        }, (err) => {
            this.pending = 0;
            this.login_error = [];
            for (var i in err.data) {
                this.login_error.push(err.data[i].message)
            }
        });
    };

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
                this.regSuccess = 1;
                this.pending = 0;
            }, err => {
                this.pending = 0;
                this.registerForm.$error.recaptcha = [null];
                this.response = null;
                vcRecaptchaService.reload(this.widgetId);
                this.signup_error = [];
                for (var i in err.data) {
                    this.signup_error.push(err.data[i].message)
                }

            }
        )
    };

    // password restore
    this.restore = () => {
        this.pending = 1;
        httpFactory.restorePassword(this.lost_email).then(
            d => {
                this.restoreResponse = 1;
                this.pending = 0;
                this.restoreErrorResp = 0;
            }, err => {
                this.pending = 0;
                this.restoreErrorResp = [];
                for (var i in err.data) {
                    this.restoreErrorResp.push(err.data[i].message)
                }
            }
        );
    };
}