/**
 * Created by ozknemoy on 03.10.2016.
 * зависимость от адреса страницы $stateParams.id
 * если надо можно бросать параметр id в теле директивы progID='{{id}}'
 */

export function inviteUserDirective () {
    return  {
        link: function(scope, element, attrs) {
            scope.pushUserIn = function (u) {
                scope.addedUser = u;// передаю как аргумент в invite-user="project.pushUser(addedUser)"
                setTimeout(()=>{
                    scope.$apply(attrs.inviteUser); // или явно project.pushUser(u) но тут привязкак к project.
                },100)
            }
        },
        controller: function($scope,$timeout,$stateParams,handleDataFactory,httpFactory,dictFactory) {
            'ngInject';

            this.id = $stateParams.id;
            this.temp = {};
            this.pend = {};
            this.baseImgUrl = httpFactory.baseImgUrl;
            var geo;
            // чтобы не грузить параллельно с родительским контроллером:
            setTimeout(()=>{
                httpFactory.getGeo().then(d=> {
                    geo = d.data;
                })
            },8000);


            this.userStatuses = function (status) {
                return dictFactory.objToNgRepeat(status,'user_statuses');
            };
            this.getCountryAndRegion = function (cID,regID) {
                return handleDataFactory.getCountryAndRegion(cID,regID,geo);
            };
            // 2 метода приглашения юзеров в команду
            this.checkUserOnServer = function() {
                this.pend.addUser = 1;
                httpFactory.post('project-team-invite/find-user-by-email?email=' + this.addUser.email
                    +'&project_id=' + this.id)
                    .then(d=> {
                        this.u = d.data;
                        if(this.u.id) {
                            this.addUser.isOnServer = 'y';
                        } else {
                            this.addUser.isOnServer = 'n';
                        }
                        this.addUser.message = "Привет! Приглашаю тебя присоединиться к проекту на платформе Сonstart";

                        this.pend.addUser = 0;
                        this.temp.errorAddUser = 0;
                    },e => {
                        this.temp.successAddUser = 0;
                        this.pend.addUser = 0;
                        this.temp.errorAddUser = e.data.message
                    });
            };

            this.inviteOursUser = function() {
                this.pend.addUser = 1;
                httpFactory.post('project-team-invite/create?project_id=' + this.id,{
                    "user_id": this.u.id || null,// если нет в системе то  undefined
                    "project_id": this.id,
                    "email": this.addUser.email,
                    "role": this.addUser.position,
                    "message": this.addUser.message,
                    "name": this.u.name || this.addUser.name,
                    "surname": this.u.surname || this.addUser.surname
                }).then(d=> {
                    this.temp.errorAddUser = 0;
                    this.temp.successAddUser = 1;
                    //this.team.push(d.data);
                    $scope.pushUserIn(d.data);
                    $timeout(() => {
                        this.pend.addUser = 0;
                        this.addUser = {};
                        this.addUser.isOnServer = undefined;
                        angular.element('#modalAddUser').modal('hide');
                        this.temp.successAddUser = 0;
                        this.setUntouchedAddForms();
                    },3000)
                },e => {
                    this.temp.successAddUser = 0;
                    this.pend.addUser = 0;
                    this.temp.errorAddUser = e.data.message
                });

            };

            // чистка форм отправки приглашений юзерам
            this.setUntouchedAddForms = function() {
                if(this.preAddForm) this.preAddForm.$setUntouched();
                if(this.addForm) this.addForm.$setUntouched();
            }
        },
        controllerAs: 'iu',
        templateUrl: 'app/_common/directives/invite-user/invite-user.html'
    }
}