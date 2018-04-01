/**
 * Created by ozknemoy on 15.11.2016.
 */
export const regLightButtonComponent = {
    bindings: {
        text: '@'
    },
    controller: function ($element, $uibModal) {
        'ngInject';

        this._click = () => {
            const config = {
                animation: true,
                templateUrl: 'app/_common/modals/reg-light-button/reg-light-button.html',
                controller: regButtonController,
                controllerAs: 'lg',
                resolve: {
                    text: ()=> this.text
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

function regButtonController(httpFactory,text) {
    'ngInject';

    this.text = text;
    this.signup = () => {
        this.pending = 1;
        httpFactory.post('user/fast-register', {
            "email": this.register_email.toLowerCase()
        }).then(d => {
                this.regSuccess = 1;
                this.responseErr = null;
            }, err => {
                this.pending = 0;
                this.responseErr = err.data.message;
            }
        )
    };
}