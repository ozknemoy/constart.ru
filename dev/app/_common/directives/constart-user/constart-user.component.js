/**
 * Created by ozknemoy on 09.11.2016.
 * console.time('users') всегда 1ms
 * console.time('geo') 50-90ms даже из кеша
 */

export var constartUserComponent = {

    bindings : {
        users : '<?'
    },

    controller: function ($state,handleDataFactory,httpFactory,dictFactory,angularGridInstance,scrollTo) {//$auth,
        'ngInject';
        

        this.$onChanges = (changes)=> {
            if(changes.users.currentValue) {
                this.userHandler()
            }
        };

        this.baseImgUrl = httpFactory.baseImgUrl;
        let masonryIsCalled;
        httpFactory.getGeo().then(d=> {
            this.geo = d.data;
            this.userHandler()
        });

        this.userHandler = function () {
            if(!this.users) return;
            this.users.forEach(u=> {
                u._status = dictFactory.dataToSelect2(dictFactory.getObj('user_statuses',0),u.userStatus);
                u._place = handleDataFactory.getCountryAndRegion(u.country_id,u.region_id,this.geo);
            });
            
        };

        this.userStatuses = function (status) {
            return dictFactory.objToNgRepeat(status,'user_statuses');
        };

        this.getCountryAndRegion = function (cID,regID) {
            return handleDataFactory.getCountryAndRegion(cID,regID,this.geo);
        };
        
        this.reloadGrid =  () => {
            setTimeout(()=>{
                angularGridInstance.gallery.refresh();
            },150);
            if (angular.element('window').width()<1180) {
                scrollTo('#anchor')
            }
        };

    },
    controllerAs: 'cu',
    templateUrl: 'app/_common/directives/constart-user/constart-user.html'

};