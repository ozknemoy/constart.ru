/**
 * Created by ozknemoy on 05.12.2016.
 */
export let constartRewardsComponent = {
    bindings: {
        value: '<',
        innerClass: '@',
        limit: '@?'
    },
    templateUrl: 'app/_common/directives/constart-rewards/constart-rewards.html',

    controller: function (httpFactory) {
        'ngInject';
        this.baseImgUrl = httpFactory.baseImgUrl;
        /*this.$onChanges = ()=> {
            console.log('$onInit',this.limit);
        }*/
    }
};