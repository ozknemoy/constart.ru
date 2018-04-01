/**
 * Created by ozknemoy on 09.12.2016.
 * отображение одной награды и его продажа для логинов и нелогинов
 */
export let projectRewardPageComponent = {
    bindings: {
        value: '<',
        isEnded: '<'
    },
    templateUrl: 'app/project/rewards/project.reward.page.component.html',
    controller: projectRewardPageCtrl,
    controllerAs: 'rv'
};

function projectRewardPageCtrl($auth, $state, $location, httpFactory, userFactory,checkBuyingFactory,
                               handleDataFactory,dictFactory,TYPE) {
    'ngInject';
    this.isCS = TYPE==='all';
    const authFront = $auth.isAuthenticated(),
          idReward = $state.params.id_reward,
          idProject = $state.params.id,
          success_buy = $location.search()['success_buy'];

    this.$onInit = function () {

        this.baseImgUrl = httpFactory.baseImgUrl;
        this.baseDocUrl = httpFactory.baseDocUrl;
        this.countin = 1;//число покупаемых наград
        this.checkboxReward = 0;//Принимаю условия
        this.terms = dictFactory.termsDelivery;

        this.init()

    };

    this.init = () => {
        Promise.all([
            httpFactory.get(`reward/${idReward}/view`)
                .then(d=> {
                    this.reward = d.data;
                    this.term = dictFactory.termsDelivery[this.reward.delivery_rules].name;
                    this.reward.date = handleDataFactory.getIntervalDate(this.reward.send_date_from,this.reward.send_date_to);
                    // осталось наград
                    // sell_count == 0 это бесконечность наград
                    this.amountRewD=this.reward.sell_count-(this.reward.collected_count || 0)
                }),
            httpFactory.getAuth()
                .then(d=> {
                    // возвращает 'no' если нет регистрации или она устарела
                    //  под логином возвращает число денег на счету начиная от 0
                    this.isAuth = d.data;//===false? false:d.data;
                    // если фронт под логинон а сервер нет, то
                    if (this.isAuth == 'no' && authFront) userFactory._reLogin(true);
                })
        ]).then(d=> {
            this.getAmountRewD()
        });

        checkBuyingFactory.check('project');
    };

    // сравниваю деньги на счете и деньги необходимые для покупки наград
    // в зависимости от этого открываю куски html
    this.getAmountRewD = ()=> {
        this.enoughMoney = this.isAuth !== 'no' && this.isAuth >= this.reward.price*this.countin;
        this.fromCanstartAccount = this.enoughMoney;
    };

    // изменение числа покупаемых наград
    this.count = (sign) => {
        if (sign == 'minus') {
            this.countin--;
            this.getAmountRewD()
        } else {
            this.countin++;
            this.getAmountRewD()
        }
    };

    // покупка идет не через старую кнопку pay-button
    // колбек прямо в httpFactory
    this.buyByAuth = () => {
        this.pend = 1;
        httpFactory.buyRewardFromInner(this.countin, this.reward.price, idReward, idProject)
            .then(d => {
                checkBuyingFactory.successToast(
                    checkBuyingFactory._getMsg(true).project_INF002
                );
                //ngToast.success({dismissButton: true,content: `Спасибо, ${name}! Команда нашего проекта благодарит Вас за интерес, проявленный к нашей работе. Ваша поддержка очень важна для нас!`,timeout:25e3});
                $state.reload()
            })
    };

    // покапка неавторизованным. с регистрацией по мылу
    this.buyByNotAuth = () => {
        this.pend = 1;
        httpFactory.buyRewardFromOuter(this.countin, this.reward.price, idReward, idProject, this.email)
            .then(d => {
            }, e => {
                this.pend = 0
            })
    }
}