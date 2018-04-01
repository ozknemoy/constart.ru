export class UserController {
    constructor($state,$auth,$stateParams, $localStorage, userModel,checkBuyingFactory) {
        'ngInject';
        console.time("initModel");

        this.isAuthenticated = $auth.isAuthenticated();
        if (!this.isAuthenticated || !$localStorage.user_id) {
            $state.go('home');
            return
        }

        this.isNotEditor = 1;
        this.id = +$localStorage.user_id;
        this.isOwnUserState = $stateParams.id == $localStorage.user_id;
        if(this.isOwnUserState) checkBuyingFactory.check('deposit');
        // урл для компонента списка проектов в зависимости от того кто смотрит
        this.urlForUsersProject = this.isOwnUserState ? 'project/index' : 'project/list';

        userModel.getUser().then(d => {
            angular.extend(this,userModel);
        }).catch(e=> console.log(e));

    }
}