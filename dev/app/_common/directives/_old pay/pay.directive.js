export var PayDirective = {
    templateUrl: 'app/_common/directives/pay/pay.html',
    bindings: {
        payProject: '=?',
        payExpenses: '=?',
        withdrawal: '=?',
        deposit: '=?'
    },

    controller: function ($scope, $state, $localStorage, httpFactory, userFactory,roboTax,$filter) {
        'ngInject';
        var pay = this;

        var user_id = $localStorage.user_id;
        if (/project/i.test($state.current.templateUrl)) var project_id = +$state.params.id;
        pay.isAuth = user_id? 1:0;
        pay.tax = roboTax;
        pay.taxProj = 5000;
// 58 a.leo@newwallet.ru  1sptZ0edHQ
        // beta.constart.ru constart 123QweQwe
        // 39 info@museumofemotions.ru  1sptZ0edHQ
        // пред оплата вложений
        pay.payProject = function (type, v, o) {
            console.log(type, v, o);
            if (type == 'invest') {
                pay.amountI = v;
                pay.sharePriceI = +o;//это же округлено в создании проекта,   $filter('myround')(o,2,'math');
                pay.sum = v*o;
                pay.sum10percent = $filter('myround')(pay.sum/10,0,'math')
            }
            if (type == 'loan') {
                pay.amountL = v;
            }
            if (type == 'reward') {
                pay.amountR = v;
                pay.sharePriceR = o.price;
                pay.priceR = o.price;
                pay.idR = o.id;
            }
            show('payProject_' + type);
        };
        // оплата вложений в проект
        // записываю в pay.tempPrice количество денег чтобы если не хватит пробросить в поле Пополнить счет
        pay.doPayProject = function (type, value, obj) {
            if (type == 'invest') {
                pay.tempPrice = Math.ceil(pay.sharePriceI / 10);
                httpFactory.post('payment/request-invest-payment', {
                    "part_count": pay.amountI,
                    "project_id": project_id,
                    "amount": pay.sum10percent
                }).then(d=> {
                    pay.successCallback(d)
                }, e => {
                    userFactory.reLogin(e);//
                    pay.errorCallback(e);
                });
            }

            if (type == 'loan') {
                pay.tempPrice = Math.ceil(pay.amountL / 10);
                    httpFactory.post('payment/request-loan-payment', {
                    "project_id": project_id,
                    "amount": pay.tempPrice
                }).then(d=> {
                        pay.successCallback(d)
                    //window.location = d.data
                }, e => {
                    userFactory.reLogin(e);
                        pay.errorCallback(e);
                });
            }
            if (type == 'reward') {
                pay.tempPrice = pay.priceR;
                httpFactory.post('payment/request-reward-payment', {
                    "part_count": pay.amountR,
                    "reward_id": pay.idR,
                    "project_id": project_id,
                    "amount": pay.priceR*pay.amountR
                }).then(d=> {
                        pay.successCallback(d)
                }, e => {
                    userFactory.reLogin(e);
                        pay.errorCallback(e);
                });
            }
        };
        // оплата публикации проекта
        pay.payExpenses = function (type) {
            pay.expenseType = type;
            show('payExpenses');
        };

        pay.doPayExpenses = function () {
            httpFactory.post('payment/request-project-operation-payment', {
                "operation_type": pay.expenseType,
                "project_id": project_id,
                "amount": pay.taxProj
            }).then(d=> {
                pay.successCallback(d)
            }, e => {
                userFactory.reLogin(e);
                pay.error = e.data.message||0;
            });
        };

        // вывод со счета
        pay.withdrawal = function (type, value, obj) {
            console.log(type, value, obj);
            show('withdrawal');
        };

        // пополнение счета
        pay.deposit = function () {
            show('deposit');
        };
        pay.doDeposit = function (value) {
            httpFactory.post('outer-payment/request-balance-payment', {
                "amount": value
            }).then(d => {
                pay.successCallback(d)
            }, e => {
                userFactory.reLogin(e);
                pay.error = e.data.message||0;
            });
        };


        pay.successCallback = (d) => {
            if (d.data && typeof d.data == 'string') window.location = d.data;
            else hide()
        };
        pay.errorCallback = (e) => {
            if (e.data.message == 'Недостаточно средств на вашем счете') {
                pay.errorNoMoney = 1;
            } else {
                pay.errorNoMoney = 0;
            }
            pay.error = e.data.message||'У нас что то поломалось';
        };

        function show(id) {
            pay.error = 0;
            pay.m = {};
            pay.m[id] = 1;
            // если есть pay.tempPrice то выставляю его в поле к оплате
            pay.amountMoney = pay.tempPrice || 0;
            setTimeout(()=> {
                pay.tempPrice = 0;
                angular.element('#pay').modal();
            }, 100)
        }

        function hide() {
            pay.m = {};
            pay.succesTransaq = 1;
            setTimeout(()=> {
                angular.element('#pay').modal('hide');
                pay.succesTransaq = 0;
                $scope.$digest();
                //$state.reload()
            }, 3000)
        }
    },
    controllerAs: 'pay'

};




