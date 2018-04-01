/**
 * Created by ozknemoy on 05.12.2016.
 */
export const addVideoComponent = {
    bindings: {
        callback: '&?',
        value: '@'
    },
    controller: addVideoCtrl
};

function addVideoCtrl ($element,$uibModal) {
    'ngInject';
    this._click = () => {
        const config = {
            animation: false,
            templateUrl: 'app/_common/modals/pe-desc-add-video/pe-desc-add-video.html',
            controller: addVideoModalCtrl,
            controllerAs: 'av',
            resolve: {
                value: ()=> this.value
            }
        };
        const instanceRequestModal = $uibModal.open(config);
        instanceRequestModal.result.then(d=> this.callback({video:d}))
    };

    $element.on('click', this._click);

    this.$onDestroy = ()=> {
        $element.off('click', this._click);
    }
}

function addVideoModalCtrl ($uibModalInstance,value) {
    'ngInject';

    //this.youtubeRegexp = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;

    this.value = value;
    this.ok = () => {
        $uibModalInstance.close(this.value)
    };
}