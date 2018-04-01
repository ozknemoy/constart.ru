
export class UsersController {
    constructor (dictFactory,httpFactory,usersModel,scrollTo) {
        'ngInject';

        angular.extend(this,usersModel);

        httpFactory.getUsersActivity().then(d=> {
            this.fData.main_activity = d.data
        });
        httpFactory.getGeo().then(d=> {
            this.geo = dictFactory.transitObj(d.data,'regions');
        });

        httpFactory.getInterest().then(d=> {
            this.i = dictFactory.transitObj(d.data);
        });

        this.changeCountry = ()=> {
            this.regionsOfContry = _.where(this.geo,'id',this.f.country_id).regions;
            this.f.region_id=null
        };


        this.clearFilter = () => {
            this.f = this.getClearFilter();
        };

        this.filterHandler =  ()=> {
            this.pendSearch = 1;
            this.getUsersFiltered(this.f).then(d=>{
                this.u = d;
                if(d.length) scrollTo('#anchor');
                this.pendSearch = 0;
            })
        };

        /*this.getUsers().then(d=> {
         this.u = d;
         });*/
        this.filterHandler();
    }
}
