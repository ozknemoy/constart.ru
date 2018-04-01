/**
 * Created by ozknemoy on 12.11.2016.
 */
export function userEditorModel
  ($q,$auth,$stateParams,$timeout,$state,$localStorage,userFactory,ngToast,Upload,metadataService,
   countFactory, httpFactory,baseUrl,dictFactory,handleDataFactory,localStorageFactory,TYPE) {
    'ngInject';

    this.$auth = $auth;
    this.$timeout = $timeout;
    this.$localStorage = $localStorage;
    this.baseUrl = baseUrl;
    this.httpFactory = httpFactory;
    this.baseImgUrl = httpFactory.baseImgUrl;
    this.localStorageFactory = localStorageFactory;
    this.countFactory = countFactory;
    this.dictFactory = dictFactory;
    this.Upload = Upload;
    this.handleDataFactory = handleDataFactory;
    this.istevenLang = dictFactory.istevenLang;
    this.$state = $state;
    this.dateOptions = dictFactory.dateOptions;
    this.ngToast = ngToast;

    this.isCS = TYPE === 'all';
    this.isOwnUserState = 1;// для совместимости вьюшки с user state
    this.idCurrentUser = +$localStorage.user_id;
    this.id = +$stateParams.id;
    // урл для списка проектов в зависимости от того кто смотрит
    this.urlForUsersProject = this.idCurrentUser==this.id? 'project/index' : 'project/list';
    this.idCroppedImg = 'imgCrop';

    const that = this;
    this.u = {};
    this.pend = {};
    this.temp = {l:{},t:{}};
    this.temp.work_sphere = dictFactory.getObj('work_sphere','Не выбрано');
    this.u.english_levell = dictFactory.getObj('english_level','Не выбрано');
    this.u.main_lang = dictFactory.getObj('main_lang','Не выбрано');
    this.u.edu_level = dictFactory.getObj('edu_level',null);
    this.temp.marital_statuses = dictFactory.marital_statuses;
    this.temp.children = dictFactory.children;
    let returnInitModel;
    console.timeEnd("extendModel");

    this.get = () => {
        returnInitModel = returnModel();
        return $q((resolve,reject)=> {
            this.initResolve = resolve;
            if(!$auth.isAuthenticated()||this.idCurrentUser!=this.id) {
                $state.go('home');
                reject()

            } else if(this.id&&typeof(this.id) == 'number') {
                httpFactory.get('user/' + this.id + '/view').then( (d)=> {
                    console.timeEnd("get user");
                    angular.extend(this.u,d.data);
                    this.u = handleDataFactory.nullKeysToUndifined(this.u);
                    this.u.name = this.u.name || '';
                    this.u.surname = this.u.surname || '';
                    metadataService.setMetaTags(
                        `${this.u.surname} ${this.u.name} на платформе CONSTART.RU`,
                        'Профиль пользователя на платформе CONSTART',
                        this.u.foto);
                    this.initModel(resolve,dictFactory);
                    console.time("initModel");
                    httpFactory._getGeo().then(d=> {
                        this.geo = d.data;console.timeEnd("getGeo");
                        this.getNewCountryAndRegion();//this.countryAndRegion = handleDataFactory.getCountryAndRegion(this.u.country_id,this.u.region_id,this.geo);
                        returnInitModel.next(resolve)
                    });
                    httpFactory.getInterest().then(d=> {
                        this.i = d.data;
                        this.temp.user_interest = dictFactory.dataToSelect2(this.i,this.u.user_interest,1);
                        returnInitModel.next(resolve)
                    });

                    httpFactory.getUsersActivity().then(d=> {
                        this.temp.main_activityArr = d.data;
                        this.temp.main_activity = dictFactory.dataToSelect2(this.temp.main_activityArr,this.u.user_main_activity);
                        returnInitModel.next(resolve)
                     });

                },  e=> {
                    // редирект если логин устарел на этой машине
                    userFactory.reLogin(e);
                });

            } else {
                $state.go('home');
                reject()
            }
        })

    };

    this.getNewCountryAndRegion = ()=> {
        this.countryAndRegion = this.handleDataFactory.getCountryAndRegion(this.u.country_id,this.u.region_id,this.geo);
        this.regionsOfContry = _.where(this.geo,'id',this.u.country_id).regions;
    };

    this.initModel = (resolve,dictFactory) => {
        //this.temp.phone_num = this.u.phone_num;
        this.temp[this.idCroppedImg] = this.u.foto? this.u.foto :0;
        this.u.passport = this.u.passport? this.u.passport : {};
        this.u.bank = this.u.bank? this.u.bank : {};

        this.u.work = (this.u.work == null||!this.u.work)?[]:this.u.work;
        this.u.age = this.countFactory.diffYear(this.u.birthday);
        this.u.daysOnSite = this.countFactory.diffDays(1000*this.u.created_at);
        this.temp.birthday = this.u.birthday ? new Date(this.u.birthday): null;
        this.temp.passport_when_give = this.u.passport.when_give? new Date(this.u.passport.when_give): null;
        this.temp.user_statuses = dictFactory.iSteven(dictFactory.user_statuses,this.u.user_status);
        this.temp.user_status = angular.copy(this.temp.user_statuses);
        this.u.english_language_level_id =  + this.u.english_language_level_id;
        this.u.main_language =  + this.u.main_language;
        this.u.education_level_id =  this.u.education_level_id? +this.u.education_level_id:null;
        this.u.country_id = +this.u.country_id;
        this.u.region_id = +this.u.region_id;

        //if (this.mainForm) this.setPristine();// телефонная форма грязная вначале  изза mask
        console.timeEnd("initModel");
        returnInitModel.next(resolve)
    };

    function* returnModel () {
        yield 1;
        yield 2;
        yield 3;
        return that.initResolve()
    }

    this.saveModel = (u,type) => {

        // обращаюсь к методу из модалок верификации телефона
        this.u.birthday = this.temp.birthday? this.handleDataFactory.dateYYYYMMDD(this.temp.birthday): undefined;
        this.u.foto = this.temp[this.idCroppedImg];
        this.u.foto = this.u.foto == 0? null : this.u.foto;
        this.u.user_status = this.dictFactory.ObjWithTickToArr(this.temp.user_status);
        this.u.user_main_activity = this.dictFactory.objToArrayIds(this.temp.main_activity);
        this.u.user_interest = this.dictFactory.objToArrayIds(this.temp.user_interest);
        u = this.handleDataFactory.undifinedKeysToNull(u);
        // проверяю на незаполненость работу
        if(u.work) {
            u.work.forEach((w,i)=> {
                if(
                    !w.country_id_work &&
                    !w.position &&
                    !w.region_id_work &&
                    (!w.site || w.site == "http://") &&
                    !w.user_work &&
                    !w.work_sphere

                ) u.work.splice(i,1)
            })

        }

        return new Promise ((resolve,reject) => {
            httpFactory.put('user/' + this.id + '/update',u).then( (d) => {

                ngToast.success({dismissButton: true,content:'<i class="fa fa-exclamation-triangle"></i> Сохранено'});

                // перезаписываю фото // и имя в навбаре
                localStorageFactory.setFoto(d.data.foto);
                localStorageFactory.setName(d.data.name);
                resolve(type);
            },e => {});
        })
    };

    /*this.savePassport = (code,user,passport_when_give) => {
        var passport = {
            "user_id": this.id,
            "place_birth": user.passport.place_birth,
            "number": user.passport.number,
            "who_give": user.passport.who_give,
            "when_give": JSON.stringify(passport_when_give).slice(1,11),
            "code": user.passport.code,
            "place_reg": user.passport.place_reg,
            "photo_1": user.passport.photo_1,
            "photo_2": user.passport.photo_2
        };
        return new Promise ((resolve) => {
            this.httpFactory.put('user/passport-save?code=' + code,passport).then(()=> {
                ngToast.success({dismissButton: true,content:'Паспортные данные успешно отправлены на проверку'});
                closeModal('passportVerification',10);
                resolve()
            })
        })
    };*/

    this.saveBankData = (bank) => {

        var bankDate = {
            "user_id": this.id,
            "name": bank.name,
            "bik": bank.bik,
            "corr": bank.corr,
            "account": bank.account
        };
        httpFactory.put('user/bank-save',bankDate).then(()=> {
            ngToast.success({dismissButton: true,content:'Банковские реквизиты сохранены'})
        })
    };

    function closeModal(id,time=3000) {
        setTimeout(()=> {
            angular.element('#'+id).modal('hide')
        },time)
    }


}