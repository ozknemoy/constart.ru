/**
 * Created by ozknemoy on 11.11.2016.
 */
export var legalsView = {
    templateUrl: 'app/_common/directives/legals-view/legals-view.html',
    controller: function (dictFactory,userFactory,httpFactory,$timeout) {
        'ngInject';

        this.$onInit = ()=> {

            this.legals = dictFactory.legals;
            this.baseImgUrl = httpFactory.baseImgUrl;
            this.getLegals()
        };

        this.getLegals = ()=> {
            httpFactory.get('user-legal/list').then(d=> {
                this.l = d.data;
            },e => {
                userFactory.reLogin(e);
            });
        };


        this.legalsChanges = (ind,type,obj) => {
            //console.log(ind,type,obj);
            
                if(type=='delete') {
                    this.l.splice(ind,1)
                } else if(type=='edit') {
                    // чтобы пробить bind once меняю весь объект
                    this.getLegals()
                } else if(type=='create') {
                    this.l.push(obj)
                }
        }
    },
    controllerAs: 'lv'
};