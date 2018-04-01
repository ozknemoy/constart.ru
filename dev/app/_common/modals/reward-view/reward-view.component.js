/**
 * старая версия
 * модалка просмотра одного вознаграждения
 * Created by ozknemoy on 30.11.2016.
 * биндится к родителю
 */

export let rewardViewComponent = {
    bindings: {
        value: '<',
    },
    controller: rewardViewCtrl
};

function rewardViewCtrl ($element,$uibModal) {
    'ngInject';

    this._click = () => {
        const config = {
            animation: false,
            templateUrl: 'app/_common/modals/reward-view/reward-view.html',
            controller: rewardViewModalCtrl,
            size: 'lg',
            controllerAs: 'rv',
            resolve: {
                value: ()=>  this.value
            }
        };
        const instanceRequestModal = $uibModal.open(config);
        /*instanceRequestModal.result.then(d=> {
            ngToast.success({dismissButton: true,
                content,
                timeout: 6e3
            });
            // todo reload?
        });*/
    };

    $element.parent().on('click', this._click);

    this.$onDestroy = ()=> {
        $element.parent().off('click', this._click);
    }
}

function rewardViewModalCtrl ($uibModalInstance,value,httpFactory) {
    'ngInject';

    this.baseImgUrl = httpFactory.baseImgUrl;
    this.baseDocUrl = httpFactory.baseDocUrl;
    this.rewardInModal  = value;
    this.countin=1;
    this.checkboxReward=0;

    this.count = (sign) => {
        if (sign == 'minus') {
            this.countin--
        } else {
            this.countin++
        }
    }
}