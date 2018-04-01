/**
 * Created by ozknemoy on 24.11.2016.
 * кнопка вызова модалки для подтверждения какого либо действия смской
 *  <sms-request ng-if="ue.u.is_phone_verified && !ue.u.is_verified"
     request-sms-url="user/get-code?codeType=passportSave"
     response-toast="Данные отправлены"
     request-url=""
 reload="true"
     class="btn btn-info">
     Отправить данные на верификацию
     </sms-request>
 */

export let smsRequestComponent = {
    bindings: {
        requestSmsUrl: '@',// урл для запроса смс
        requestUrl: '@',// урл отправки кода из смс
        responseToast: '@?',// текст всплывайки    по умолчанию 'Операция подтверждена'
        value: '<?',// передаваемый объект
        reload: '@?'// перегружать ли контроллер
    },
    controller: smsRequestCtrl
};

function smsRequestCtrl ($element,$uibModal,$state,ngToast) {
    'ngInject';
    this._click = () => {
        const content = this.responseToast || 'Операция подтверждена';
        const config = {
            animation: true,
            templateUrl: 'app/_common/modals/sms-request/sms-request.html',
            controller: smsRequestModalCtrl,
            controllerAs: 'sms',
            resolve: {
                value: ()=> {
                    return this.value
                },
                requestSmsUrl: ()=> this.requestSmsUrl,
                requestUrl: ()=> this.requestUrl
            }
        };
        const instanceRequestModal = $uibModal.open(config);
        instanceRequestModal.result.then(d=> {
            ngToast.success({
                dismissButton: true,
                content,
                timeout: 6e3
            });
            if(this.reload=='true') $state.reload()

        });
    };

    $element.on('click', this._click);

    this.$onDestroy = ()=> {
        $element.off('click', this._click);
    }
}

function smsRequestModalCtrl ($uibModalInstance,httpFactory,value,requestUrl,requestSmsUrl) {
    'ngInject';
    console.log(value);
    
    this.header = 'Введите код смс';
    httpFactory.post(requestSmsUrl);
    this.send = (code) => {
        this.pend = 1;console.log(value);
        httpFactory.post(requestUrl+code,value).then(d=> {
            this.pend = 0;
            $uibModalInstance.close(d.data)
        },e=> {
            this.pend = 0;
        })
    };
}