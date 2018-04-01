/**
 * Created by ozknemoy on 11.11.2016.
 * оплата запуска проекта
 */

export var payOwnProject = {
    bindings: {
        type: '@'
    },
    controller: function ($element,$uibModal,$state) {
        'ngInject';

        this._click = () => {
            var config = {
                animation: true,
                templateUrl: 'app/_common/modals/pay-own-project/pay-own-project.html',
                controller: payOwnProjectController,
                resolve: {
                    type: () => this.type
                },
                controllerAs: 'pay'
            };
            var instance = $uibModal.open(config);
            /*instance.result.then( ok=> {
                setTimeout(()=>location.reload(),2000);
                // не обязательная проверка
                // сработает только если вызвать $uibModalInstance.close()
                // простое закрытие модалки сюда не проскакивает
                if(ok==='ok') $state.reload()
            });*/
        };

        $element.on('click', this._click);

        this.$onDestroy = ()=> {
            $element.off('click', this._click);
        }
    }
};


function payOwnProjectController ($state,$uibModalInstance,type,httpFactory,userFactory,ngToast,PROJECT_TAX) {
    'ngInject';
    this.taxProj = PROJECT_TAX;

    this.type =type;
    this.doPayExpenses =  () => {
        this.pend =1;
        httpFactory.post('payment/request-project-operation-payment', {
            "operation_type": type,
            "project_id": $state.params.id,
            "amount": this.taxProj
        }).then(d=> {
            this.errorNoMoney = 0;
            ngToast.success({dismissButton: true,content:'Вы успешно оплатили процедуру сбора средств'});
            setTimeout(()=>location.reload(),5000);
            /*setTimeout(()=> {
                $uibModalInstance.close('ok');

            }, 4000)*/
        }, e => {
            userFactory.reLogin(e);
            if (e.data.message == 'Недостаточно средств на вашем счете') {
                this.errorNoMoney = 1;
            }
        });
    };

}