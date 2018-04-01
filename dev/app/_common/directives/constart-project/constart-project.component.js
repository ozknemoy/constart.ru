/**
 * Created by ozknemoy on 06.10.2016.
 */

export var constartProjectComponent = {

    bindings : {
        value : '<?',
        url: '@',
        isProjects: '@',//показывает данные фильтра как на поиске проектов
        empty: '@',   // показывает только плитки без статусов как на главной
                     // если empty=2 то скрываю стату

        view: '@?' // отображение, компактное или нет
    },

    controller: function ($auth,$localStorage,$filter,$state,countFactory,handleDataFactory,httpFactory,dictFactory,scrollTo) {
        'ngInject';


        const getNounFilter = $filter('getNoun'),
            thousandFilter = $filter('thousand'),
            myroundFilter = $filter('myround'),
            diffDateFilter = $filter('diffDate'),
            diffDatesFilter = $filter('diffDates'),
            id = $state.params.id,
            isUserState = $state.$current.includes.user ||
                $state.$current.includes.userEditor;

        this.$onInit = ()=> {
            this.stages = dictFactory.stages;
            // беру лимит либо из вьюшки либо стандартный
            var _url = (this.url && this.url.includes('limit'))? '' : '?limit=30';
            this.baseImgUrl = httpFactory.baseImgUrl;
            this.isNotAuth = !$auth.isAuthenticated();
            this.projView = this.view? 1:0;
            // если юзер стейт и это свой вью
            if(isUserState && id==$localStorage.user_id) this.ownUser = 1;

            // если нет урла то данные берутся снаружи компонента
            // если есть то:  'project/index' : 'project/list'
            if(this.url) {
                if(this.url=='project/list') {// если не свой юзер
                    httpFactory.post(this.url + _url,{userId:(+id)})
                        .then(d => {
                            this.value = d.data;
                            this.handleData()
                        })
                } else httpFactory.get(this.url + _url)
                    .then(d => {
                        this.value = d.data;
                        this.handleData()
                    })
            }
            httpFactory.getGeo().then( d => this.geo = d.data);

            this.projStatuses = dictFactory.projStatuses;
        };
        
        this.$onChanges = (changes) => {
            // в принципе это только для списка проектов с фильтром
            if (changes.value && changes.value.currentValue) {
                this.handleData()
            }
        };

        this.handleData = ()=> {
            if (this.value && this.value.length) {
                this.value.forEach(proj => {
                    // название кнопки лайк зависит от публикации и от типа проекта(без сбора средств)
                    proj.nextOnButton = this.empty==2  ? 'Подробнее' :
                        (proj.type_id==3 ? 'Подробнее' : 'Поддержать');
                    if(proj.category_id) {
                        proj._cat = _.where(dictFactory.projLeveOne,'id',proj.category_id);//.name
                        // todo удалить эту строку 1 января 2018 и вернуть в строку выше свйство name переименоваав _cat в cat
                        proj.cat = proj._cat?proj._cat.name:null
                    }
                    // добавляю сумму 
                    proj.collectedSum = this.getCollectedSum(proj);
                    // процент собраного от суммы
                    proj.percent = myroundFilter(100*proj.collectedSum/proj.founding_sum,1,true);
                    // и тут же фильтрую эту сумму
                    proj.collectedSum = thousandFilter(proj.collectedSum);
                    // процент  собраного от суммы но не более 100
                    proj.percent100 = Math.min(proj.percent,100);
                    // пока не реализованно изза промиса получения гео todo
                    //proj.countryAndRegion = this.getCountryAndRegion(proj.country_id,proj.region_id);
                    // осталось
                    /*if(proj.id == 3) {
                        proj.posted_date = '2017-03-01';proj.found_period = 3
                    }*/
                    // по старому proj.remain = diffDateFilter(proj.posted_date,proj.found_period,true);
                    proj.remain = diffDatesFilter('now',proj.found_finish_date,true,true);
                    // существительное для remain
                    // когда разница дат >0 и <1 то показываю часы и вернется тип string
                    proj._remain = typeof proj.remain === 'number'?
                        getNounFilter(proj.remain,'день','дня','дней'):
                        getNounFilter(proj.remain,'час','часа','часов');
                    // прошло
                    //proj.pass = proj.found_period - diffDateFilter(proj.posted_date,proj.found_period);
                    proj.pass = diffDatesFilter(proj.posted_date,'now');
                    // существительное
                    proj._pass = getNounFilter(proj.pass,'день прошел','дня прошло','дней прошло');
                    // существительное поддержало участников
                    proj._inProjectCount = getNounFilter(proj.inProjectCount,'участник поддержал','участника поддержали','участников поддержали');

                })
            }

        };

        this.getCollectedSum = function (that) {
            return countFactory.notN(that.own_money,that.reward_collected_sum,that.investments_collected_sum,that.loan_collected_sum)
        };

        this.getCountryAndRegion = function (cID,regID) {
            return handleDataFactory.getCountryAndRegion(cID,regID,this.geo);
        };

    },
    controllerAs: 'cpd',
    templateUrl: 'app/_common/directives/constart-project/constart-project.html'

};