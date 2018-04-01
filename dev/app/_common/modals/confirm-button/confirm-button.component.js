/**
 * Created by ozknemoy on 25.11.2016.
 * кнопка для вызова модалки для подверждения какоого либо действия
 */
export let confirmButtonComponent = {
    bindings: {
        callback: '&',
        textBody: '@?',// текст
        textHeader: '@?'// текст
    },
    controller: confirmButtonCtrl
};

function confirmButtonCtrl ($element,$uibModal) {
    'ngInject';
    this._click = ()=> {
        const textBody = this.textBody || 'Вы уверены?';
        const config = {
            animation: true,
            templateUrl: 'app/_common/modals/confirm-button/confirm-button.html',
            controller: confirmButtonModalCtrl,
            controllerAs: 'cb',
            resolve: {
                textHeader: () => this.textHeader,
                textBody: () => textBody
            }
        };
        const instanceRequestModal = $uibModal.open(config);
        instanceRequestModal.result.then(d=> this.callback())
    };

    $element.on('click', this._click);

    this.$onDestroy = ()=> {
        $element.off('click', this._click);
    }
}

function confirmButtonModalCtrl ($uibModalInstance,textHeader,textBody) {
    'ngInject';

    this.textHeader = textHeader;
    this.textBody = textBody;
    
    this.ok = () => {
       $uibModalInstance.close('ok')
    };
}