/**
 * Created by ozknemoy on 25.11.2016.
 * кнопка для вызова модалки оплаты инвестиций и займов. с возможностью пополнения если денег недостаточно
 */
export let payButtonComponent = {
    bindings: {
        type: '@',
        amount: '@?',// количество долей для инв, количество бабла для займа
        price: '@?',
        reward: '<?'
    },
    controller: payButtonCtrl
};

function payButtonCtrl ($element,$uibModal) {
    'ngInject';
    $element.bind('click',()=> {

        const config = {
            templateUrl: 'app/_common/modals/pay-button/pay-button.html',
            controller: payButtonModalCtrl,
            controllerAs: 'pay',
            resolve: {
                data: ()=>  [this.type,this.amount,this.price,this.reward]
            }
        };
        const instanceRequestModal = $uibModal.open(config);
        //instanceRequestModal.result.then(d=> d)
    })
}

function payButtonModalCtrl ($uibModalInstance,$state, $localStorage, httpFactory, userFactory,
                             roboTax,$filter,data,PROJECT_TAX) {
    'ngInject';
    var pay = this;

    var user_id = $localStorage.user_id;
    var project_id = +$state.params.id;//if (/project/i.test($state.current.templateUrl))
    pay.isAuth = !!user_id;
    //pay.tax = roboTax;
    pay.taxProj = PROJECT_TAX;

    let [type, v, o, reward] = data;
    
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
        pay.sharePriceR = reward.price;
        //pay.priceR = o.price;
        pay.idR = reward.id;
    }
    // оплата вложений в проект
    // записываю в pay.tempPrice количество денег чтобы если не хватит пробросить в поле Пополнить счет
    pay.doPayProject = function (type, value, obj) {
        if (type == 'invest') {
            pay.tempPrice = Math.ceil(pay.sharePriceI / 10);
            httpFactory.post('payment/request-invest-payment', {
                "part_count": parseFloat(pay.amountI),
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
        // отправляю без учета комиссии
        if (type == 'reward') {
            pay.tempPrice = pay.sharePriceR;
            httpFactory.post('payment/request-reward-payment', {
                //Количество вознаграждений
                "part_count": parseFloat(pay.amountR),
                "reward_id": pay.idR,
                "project_id": project_id,
                //Количество вознаграждений * на цену
                "amount": pay.sharePriceR*parseFloat(pay.amountR)
            }).then(d=> {
                pay.successCallback(d)
            }, e => {
                userFactory.reLogin(e);
                pay.errorCallback(e);
            });
        }
    };
    pay.successCallback = (d) => {
        if (d.data && typeof d.data === 'string') window.location = d.data;
        else if (d.data && typeof d.data.url === 'string') window.location = d.data.url;
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

    show('payProject_' + type);
    function show(id) {
        pay.error = 0;
        pay.m = {};
        pay.m[id] = 1;
        // если есть pay.tempPrice то выставляю его в поле к оплате
        pay.amountMoney = pay.tempPrice || 0;

    }
    function hide() {
        pay.m = {};
        pay.succesTransaq = 1;
        setTimeout(()=> {
            $uibModalInstance.close();
            pay.succesTransaq = 0;
            //$scope.$digest();
            //$state.reload()
        }, 3000)
    }
}