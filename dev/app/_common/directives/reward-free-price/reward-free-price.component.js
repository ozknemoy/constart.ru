/**
 * Created by ozknemoy on 03.02.2017.
 */
export const rewardFreePriceComponent = {
    bindings: {

    },
    controller: rewardFreePriceController,
    templateUrl: 'app/_common/directives/reward-free-price/reward-free-price.html'
};

function rewardFreePriceController($auth,$location,$state,httpFactory,userFactory,checkBuyingFactory) {
    'ngInject';
    const authFront = $auth.isAuthenticated(),
        idProject = $state.params.id,
        success_buy = $location.search()['success_buy'];

    this.$onInit = ()=> {
        this.price = 200;
        checkBuyingFactory.check('project');
        httpFactory.getAuth()
            .then(d=> {
                // возвращает 'no' если нет регистрации или она устарела
                //  под логином возвращает число денег на счету начиная от 0
                this.isAuth = d.data;//===false? false:d.data;
                // если фронт под логинон а сервер нет, то
                if (this.isAuth == 'no' && authFront) userFactory._reLogin(false,true);
                this.getAmountRewD()
            })
    };

    // сравниваю деньги на счете и деньги необходимые для покупки
    // в зависимости от этого открываю куски html
    this.getAmountRewD = ()=> {
        this.enoughMoney = this.isAuth !== 'no' && this.isAuth >= this.price;
        this.fromCanstartAccount = this.enoughMoney;
    };

    // колбек прямо в httpFactory
    this.buyByAuth = () => {
        this.pend = 1;
        httpFactory.buyRewardFromInner(1, this.price, undefined, idProject,true)
            .then(d => {
                checkBuyingFactory.successToast(
                    checkBuyingFactory._getMsg(true).project_INF002
                );
                $state.reload()
            })
    };

    // покапка неавторизованным. с регистрацией по мылу
    this.buyByNotAuth = () => {
        this.pend = 1;
        httpFactory.buyRewardFromOuter(1, this.price, undefined, idProject, this.email,true)
            .then(d => {
            }, e => {
                this.pend = 0
            })
    }

}