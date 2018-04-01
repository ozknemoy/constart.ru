/**
 * Created by ozknemoy on 18.10.2016.
 */

export let constartAgreementComponent = {
    bindings: {
        value: '@'
    },
    controller: function ($http,httpFactory,$stateParams,$state,$localStorage,baseUrl,userFactory,ngToast,$filter) {
        'ngInject';

        this.$onInit = ()=> {
            const getNounFilter = $filter('getNoun'),
                datePlusNDays = $filter('datePlusNDays'),
                diffDatesFilter = $filter('diffDates');
            this.baseImgUrl = httpFactory.baseImgUrl;
            this.baseUrl = baseUrl;
            this.id = +$stateParams.id;
            this.idUser = $localStorage.user_id;
            this.hideStatusProj = 1;

            var url = '',
                isUserState = this.value=='user',
                isProjState = this.value=='project';
            if(isUserState) {
                url = 'register-arrangements/for-user';
            }
            if(isProjState) {
                url = 'register-arrangements/for-project?project_id=' +this.id;
            }
            this.invest_type = [{id:0,name:'Инвестиция'},{id:1,name:'Займ'},{name:'Все'}];
            this._status = [{id:0,name:'Активные'},{id:1,name:'Архивные'},{name:'Все'}];
            this._statusProj = [{id:0,name:'Успешные'},{id:1,name:'Неуспешные'},{name:'Все'}];

            httpFactory.get(url).then(d=> {
                //d.data[0].project.status = 6;
                //d.data[1].project.status = 9;
                //d.data[0].project.found_finish_date = '2017-03-24';
                // ставлю признаки статусов Активные/Архивные Успешные/Неуспешные
                d.data.map((agr)=> {
                    // прибавляю 5 дней на подписание
                    var plusFive = datePlusNDays(agr.project.found_finish_date/*'2017-05-07'*/,5);
                    var remain = diffDatesFilter('now',plusFive,true,true);
                    // существительные перед и после remain
                    var _remain = getNounFilter(remain,'Остался ','Осталось ','Осталось ');
                    // когда разница дат >0 и <1 то вернется тип string и показываю часы
                    var remain_ = typeof remain === 'number'?
                        getNounFilter(remain,' день ',' дня ',' дней ') :
                        getNounFilter(remain,' час ',' часа ',' часов ');
                    agr.remain = _remain + remain + remain_;

                    if(agr.project.status>7) {
                        agr._status = 1;
                        agr._statusProj = agr.project.status==8? 0 : 1;
                    } else {
                        agr._status = 0;
                    }
                });

                if(d.data.length) {
                    if(isUserState) {
                        // инициатор смотрит UserState
                        this.isInvestor = this.idUser == d.data[0].investor_id;
                    }
                    if(isProjState) {
                        // инициатор смотрит ProjState
                        this.isInitiator = this.idUser == d.data[0].project_owner_id;
                    }
                }
                this.agreements = d.data;
            },e => {
                userFactory.reLogin(e);
            });
        };



        // разруливаю взаимозависимые селекты
        this.checkStatus = () => {
            // если выбрано "Активные" и 'Все'
            if(this.filter._status!=1) {
                this.hideStatusProj = 1;
                this.filter._statusProj = undefined
            } else {//выбрано 'Архивные'
                this.hideStatusProj = 0
            }
        };

        this.getFile = (url,event,is_verified) => {
            //если чел не verif и это инвестор то всплывайка
            if (!is_verified && this.isInvestor) {
                ngToast.info({
                    dismissButton: true,
                    content:'Чтобы посмотреть договор вам надо верифицироваться',//<a ui-sref="userEditor.about('id':${this.idUser})" class="btn btn-info"></a>
                    timeout: 10e3
                    //dismissOnClick: false
                });
                return
            }
            httpFactory.downloadPdf('register-arrangements/get-pdf-contract?id='+url,event)
        };
        //изза перемещения таба на первое место пока не пригодится
        /*this.toSecondPage = ()=> {
            userFactory.clickElement('.carousel-indicators.list div:nth-child(1)',3e3)
        }*/
    },
    controllerAs: 'ca',
    templateUrl: 'app/_common/directives/constart-agreement/constart-agreement.html'
};