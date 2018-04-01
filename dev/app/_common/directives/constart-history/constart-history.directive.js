/**
 * Created by ozknemoy on 17.10.2016.
 */

export let constartHistoryDirective = {
    controller: function ($state, $timeout, handleDataFactory, httpFactory, dictFactory) {
        'ngInject';

        this.id = $state.params.id;
        this.baseImgUrl = httpFactory.baseImgUrl;
        this.dateOptHist = dictFactory.dateOptions;
        this.dateOptHist.datepickerMode = 'day';
        this.dateOptHist.initDate = new Date();
        this.operStatuses = dictFactory.operationStatuses;
        // начальный интервал истории
        this.tempH = {
            a: new Date(+new Date() - 30000 * 60 * 60 * 24),
            b: new Date()
        };
        this.tempH.aSliced = handleDataFactory.dateDDMMYYYY(this.tempH.a);
        this.tempH.bSliced = handleDataFactory.dateDDMMYYYY(this.tempH.b);
        
        this.isUserView = /user/i.test($state.current.name) ? 1 : 0;
        httpFactory
            .get(['project/get-payments?project_id=' + this.id, 'user/get-payments'][this.isUserView])
            .then(d=> {
                this.operations = d.data.sort((a,b)=>b.id-a.id);
                // для истории в проектах надо менять PAYMENT_TYPE на противоположный  1->2 и 2->1
                if(this.isUserView===0 && this.operations.length) {
                    this.operations.forEach(oper => {
                        if(oper.payment_type==1) oper.payment_type=2;
                        else if(oper.payment_type==2) {oper.payment_type=1}
                    })
                }
                this.getOperationsSums();
            });

        this.sliceIt = function (d, key) {
            this.tempH[key] = handleDataFactory.dateDDMMYYYY(d);
            this.getOperationsSums()
        };
        /*participation_type:
         const TYPE_INVEST = 0;
         const TYPE_LOAN = 1;
         const TYPE_REWARD = 2;
         const TYPE_ADD_BALANCE = 3;
         const TYPE_OPERATION = 4;
         const TYPE_OUT_OPERATION = 5;
         payment_type:
         const PAYMENT_TYPE_INC = 1;
         const PAYMENT_TYPE_DEC = 2;
         const PAYMENT_TYPE_FREEZE = 3;
         const PAYMENT_TYPE_UNFREEZE = 4;*/
        this.getOperationsSums = function (time = 300) {
            $timeout(()=> {
                this.tempH.incr = this.tempH.decr = this.tempH.diff = 0;
                if (this.operFiltered && this.operFiltered.length) {
                    this.operFiltered.forEach(oper=> {
                        if (oper.payment_type == 1) {
                            this.tempH.incr += parseFloat(oper.amount)
                        } else if (oper.payment_type == 2) {
                            this.tempH.decr += parseFloat(oper.amount)
                        }
                    });
                    this.tempH.diff = this.tempH.incr - this.tempH.decr;
                }
            }, time)

        }
    },
    controllerAs: 'u',
    templateUrl: 'app/_common/directives/constart-history/constart-history.html'

};