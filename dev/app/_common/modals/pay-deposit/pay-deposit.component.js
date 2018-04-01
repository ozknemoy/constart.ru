/**
 * Created by ozknemoy on 11.11.2016.
 */

export var payDeposit = {
        bindings: {},
        controller: function ($element,$uibModal) {
            'ngInject';
            this._click = () => {
                var config = {
                    animation: true,
                    templateUrl: 'app/_common/modals/pay-deposit/pay-deposit.html',
                    controller: ['httpFactory','userFactory','roboTax',function (httpFactory,userFactory,roboTax) {
                        // пока отказались от комиссии this.tax = roboTax;

                        // отправляю без учета комиссии
                        this.doDeposit = function (value) {
                            httpFactory.post('outer-payment/request-balance-payment', {
                                "amount": value
                            }).then(d => {
                                window.location = d.data.url;
                            }, e => {
                                userFactory.reLogin(e);
                            });
                        };
                    }],
                    controllerAs: 'pay'
                };
                $uibModal.open(config);
            };

            $element.on('click', this._click);

            this.$onDestroy = ()=> {
                $element.off('click', this._click);
            }
        }

};