/**
 * Created by ozknemoy on 05.12.2016.
 */

export const inviteUserAddComponent = {
    bindings: {
        callback: '&'
    },
    controller: function ($element,$uibModal) {
        'ngInject';
        this._click = () => {
            const config = {
                animation: false,
                templateUrl: 'app/_common/modals/invite-user-add/invite-user-add.html',
                controller: modalController,
                controllerAs: 'iu'
            };
            const modal = $uibModal.open(config);
            modal.result.then(d=> this.callback({u:d}))
        };

        $element.on('click', this._click);

        this.$onDestroy = ()=> {
            $element.off('click', this._click);
        }
    }
};

function modalController($state,handleDataFactory,dictFactory, httpFactory,$uibModalInstance,ngToast,userFactory) {
    'ngInject';

    this.id = $state.params.id;
    // текст сообщения в зависимости от адреса страницы
    const msg = /projectEdit/g.test($state.$current.url.prefix)?
        'Приглашение сохранено и будет отправлено при публикации проекта':'Приглашение в команду успешно отправлено';
    
    this.baseImgUrl = httpFactory.baseImgUrl;

    var geo;

    httpFactory.getGeo().then(d=> {
        geo = d.data;
    });

    this.userStatuses = function (status) {
        return dictFactory.objToNgRepeat(status,'user_statuses');
    };
    this.getCountryAndRegion = function (cID,regID) {
        return handleDataFactory.getCountryAndRegion(cID,regID,geo);
    };

    this.checkUserOnServer = function() {
        this.pend = 1;
        httpFactory.post('project-team-invite/find-user-by-email?email=' + this.addUser.email.toLowerCase()
                +'&project_id=' + this.id)
            .then(d=> {
                this.u = d.data;
                if(this.u.id) {
                    this.addUser.isOnServer = 'y';
                } else {
                    this.addUser.isOnServer = 'n';
                }
                this.addUser.message = "Привет! Приглашаю тебя присоединиться к проекту на платформе Сonstart";
                this.pend = 0;
            },e => {
                userFactory.reLogin(e);
                this.pend = 0;
            });
    };

    this.inviteOursUser = function() {
        this.pend = 1;
        httpFactory.post('project-team-invite/create?project_id=' + this.id,{
            "user_id": this.u.id || null,// если нет в системе то  undefined
            "project_id": this.id,
            "email": this.addUser.email,
            "role": this.addUser.position,
            "message": this.addUser.message,
            "name": this.u.name || this.addUser.name,
            "surname": this.u.surname || this.addUser.surname
        }).then(d=> {
            ngToast.success({dismissButton: true,timeout:6e3,content:msg});
            $uibModalInstance.close(d.data);

        },e => {
            this.pend = 0;
        });
    };
}