/**
 * Created by ozknemoy on 19.12.2016.
 */

export const phoneVerifyComponent = {
    bindings: {
        user: '<',
        reVerify: '@?'// смена телефона
    },
    controller: phoneVerifyCtrl
};

function phoneVerifyCtrl ($element,$uibModal) {
    'ngInject';
    this._click = () => {
        var config;
        // две вьюшки для вериф и смены телефона
        const url = this.reVerify? 're-':'';
        config = {
            animation: false,
            templateUrl: `app/_common/modals/phone-verify/${url}phone-verify.html`,
            controller: phoneVerifyModalCtrl,
            controllerAs: 'ue',
            resolve: {
                user: () => this.user,
                reVerify: () => this.reVerify
             }
        };

        const instanceRequestModal = $uibModal.open(config);
        //instanceRequestModal.result.then(d=> this.callback({phone:d}))
    };

    $element.on('click', this._click);

    this.$onDestroy = ()=> {
        $element.off('click', this._click);
    }
}

function phoneVerifyModalCtrl ($state,$uibModalInstance,httpFactory,userEditorModel,user,ngToast,reVerify) {
    'ngInject';
    // пересохранение
    this.savePhone = (resave) => {
        user.phone_num = this.phone_num;
        userEditorModel.saveModel(user).then(d => this.getCodeSMS());
    };

    this.getCodeSMS = () => {
        httpFactory.get('user/get-code?codeType=phoneVerify')
            // актуально только для смены тлф
            .then( d => this.phoneVerifySmsIsSend = 1)
    };

    this.sentCodeSMS = (type,code) => {
        httpFactory.get('user/' + type + '?code=' + code)
            .then( d => {
                ngToast.success({dismissButton: true,content: 'Номер телефона успешно подтвержден',timeout: 6e3});
                $uibModalInstance.close();
                $state.reload()
        })
    };

    // если не пересохранение то сразу запрос смс
    if(!reVerify) {
        userEditorModel.saveModel(user).then(d => this.getCodeSMS());
    }
}