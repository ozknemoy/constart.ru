/**
 * Created by ozknemoy on 08.11.2016.
 */
export function usersModel ($q,dictFactory,httpFactory,metadataService,TYPE) {
    'ngInject';

    var лимит_юзеров = 2000;
    this.isCS = TYPE === 'all';
    metadataService._setMetaTags('user');
    this.getUsers =  () => {
        return $q((resolve,reject) => {
            httpFactory.get('user/list?limit=' + лимит_юзеров).then(d=> {
                httpFactory.setNumOfUsers(d.data.length);
                this.u = d.data;
                resolve(d.data)
            });
        })
    };

    this.fData = {
        user_status: dictFactory.getObj('user_statuses',false),
        education_level_id: dictFactory.getObj('edu_level'),
        main_language: dictFactory.getObj('main_lang'),
        english_levell: dictFactory.getObj('english_level'),
        sexes: dictFactory.sexes
    };

    this.getUsersFiltered =  (f)=> {
        this.fEnd = angular.copy(f);
        if (this.fEnd.age_min==18) delete this.fEnd.age_min;
        if (this.fEnd.age_max==78) delete this.fEnd.age_max;
        if (this.fEnd.is_verified==false) delete this.fEnd.is_verified;
        this.fEnd.user_status = dictFactory.ObjToArr(f.user_status);
        if (!this.fEnd.user_status) delete this.fEnd.user_status;

        return this.search(this.fEnd);
        /*if (Object.keys(this.fEnd).length) return this.search(this.fEnd);
        else return this.getUsers()*/
    };

    this.search = function (f) {
        return $q(resolve=>{
            httpFactory.post('user/list?limit=' + лимит_юзеров,f).then(d=> {
                resolve(d.data)
            });
        })
    };

    this.getClearFilter = () => {
        return {
            age_min:18,
            age_max:78
        }
    };
    this.f = this.getClearFilter();// init Filter

}