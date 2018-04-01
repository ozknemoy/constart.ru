/**
 * Created by ozknemoy on 07.11.2016.
 */
export function userModel($q,$stateParams,userFactory, httpFactory, handleDataFactory, metadataService, countFactory, dictFactory,TYPE) {
    'ngInject';


    this.baseImgUrl = httpFactory.baseImgUrl;
    //this.projStatuses = dictFactory.getObj('projStatuses');
    this.work_sphere = dictFactory.work_sphere;
    this.isCS = TYPE === 'all';
    let resolv;
    let returnInitModel;
    let _this = this;
    this.getUser = () => {
        returnInitModel = initModel();
        return $q( (resolve, reject) => {
            resolv = resolve;console.time("getUser");
            httpFactory.get('user/' + $stateParams.id + '/view').then(d => {
                this.u = d.data;console.timeEnd("getUser");
                metadataService.setMetaTags(
                    `${this.u.surname} ${this.u.name} на платформе CONSTART.RU`,
                    'Профиль на CONSTART – это ваше «живое» резюме. С помощью профиля вы можете заявить о себе инвестору, работодателю, потенциальному партнеру или клиенту.',
                    this.u.foto);
                this.u.age = countFactory.diffYear(this.u.birthday);

                //this.u.sex = 1;this.u.foto = null;
                this.u.daysOnSite = countFactory.diffDays(1000 * this.u.created_at);
                this.u.work = (this.u.work == null || !this.u.work) ? [] : this.u.work;
                this.u.education_level = dictFactory.edu_level[this.u.education_level_id];
                this.u.education_level = this.u.education_level>0? this.u.education_level:null;
                    this.u.user_statuses = dictFactory.objToNgRepeat(this.u.user_status, 'user_statuses');
                //this.u.user_activities = dictFactory.objToNgRepeat(this.u.user_main_activity, 'main_activity');
                this.u.main_language = dictFactory.main_lang[this.u.main_language];
                this.u.english_language_level = dictFactory.english_level[this.u.english_language_level_id];
                returnInitModel.next();

            }, e => {
                // редирект если логин устарел на этой машине
                userFactory.reLogin(e);
                reject()
            });
            console.time("getGeo");
            httpFactory.getGeo().then(d => {
                this.geo = d.data;console.timeEnd("getGeo");
                returnInitModel.next()
            });
            httpFactory.getInterest().then(d=> {
                this.i = d.data;
                returnInitModel.next()
            });

            httpFactory.getUsersActivity().then(d=> {
                this.uActivity = d.data;
                returnInitModel.next()
            });
        })
    };

    function* initModel () {
        yield 1;
        yield 2;
        yield 3;
        return preresolve ()
    }
    function preresolve () {

        _this.u.user_activities = dictFactory.objToNgRepeat(_this.uActivity,_this.u.user_main_activity, 1);
        _this.interests = dictFactory.objToNgRepeat(_this.i, _this.u.user_interest, 1);
        //поиск места проживания
        _this.u.CountryAndRegion = handleDataFactory.getCountryAndRegion(_this.u.country_id, _this.u.region_id, _this.geo);

        //обработка урла и поиск мест работы/ добавляю в массив название региона и страны
        if (_this.u.work.length) {
            _this.u.work.forEach((w)=> {
                w._site = handleDataFactory.hrefHandle(w.site);
                if (w.country_id_work) {
                    _this.geo.forEach((g)=> {
                        if (g.id == w.country_id_work) {
                            w.country_work = g.name;
                            for (let i = 0; i < g.regions.length; i++) {
                                if (g.regions[i].id == w.region_id_work) {
                                    w.region_work = g.regions[i].name;
                                    break
                                }
                            }
                        }
                    })
                }
            });
        }
        console.timeEnd("initModel");
        return resolv()
    }

}