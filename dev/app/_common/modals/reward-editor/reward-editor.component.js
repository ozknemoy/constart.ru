/**
 * Created by ozknemoy on 20.01.2017.
 * принимает и возвращает отсортированным весь список наград
 */

export const rewardEditorComponent = {
    bindings: {
        projectId: '@',
        rewards: '<',
        ind: '@',
        editable: '@',
        callback: '&'
    },
    controller: function ($element,$uibModal) {
        'ngInject';

        this._click = () => {
            var config = {
                animation: true,
                templateUrl: 'app/_common/modals/reward-editor/reward-editor.html',
                size: 'lg',
                resolve: {// пробрасываю в контроллер данные
                    values:  ()=> {
                        return [this.projectId,this.ind,this.editable,this.rewards];
                    }
                },
                controller: rewardEditorModalController,
                controllerAs: 'pe'
            };
            var instanceRewardModal = $uibModal.open(config);
            // обещание вернуть данные после $uibModalInstance.close
            instanceRewardModal.result.then( rewards=> {
                this.callback({rewards});
            });
        };

        $element.on('click', this._click);

        this.$onDestroy = ()=> {
            $element.off('click', this._click);
        }
    }
};

function rewardEditorModalController($uibModalInstance, $filter, $timeout, values, httpFactory,
                                     Upload,baseUrl,dictFactory, handleDataFactory,$localStorage) {
    'ngInject';
    
    var [project_id,ind,editable,rewards] = values;
    var r = rewards[ind];
    this.baseImgUrl = httpFactory.baseImgUrl;
    this.httpFactory = httpFactory;
    this.$localStorage = $localStorage;
    this.handleDataFactory = handleDataFactory;
    this.temp = {};
    this.temp.editableReward = editable;
    this.tempReward = Object.assign({},r);
    this.tempReward.send_date_temp_from = this.tempReward.send_date_from? new Date(this.tempReward.send_date_from):null;
    this.tempReward.send_date_temp_to = this.tempReward.send_date_to? new Date(this.tempReward.send_date_to):null;
    this.tempReward_id = ind;
    this.terms = dictFactory.termsDelivery;
    this.dateOptions = Object.assign({},dictFactory.dateOptions,{
        //minMode:'month',
        minDate: new Date(),
        initDate: new Date()
    });
    this.dateOptionsTwo = Object.assign({},dictFactory.dateOptions,this.dateOptions);

    this.checkTerms = ()=> {
        if(this.tempReward.delivery_rules==4) this.tempReward.has_pickup = true;
    };

    this.changeMinDate = ()=> {
        if(!this.tempReward.send_date_temp_from) return;
        this.dateOptionsTwo.minDate = new Date(this.tempReward.send_date_temp_from);
    };

    this.$onInit = ()=> {
        //для новой награды выставляю второй тип или делаю строкой
        this.tempReward.delivery_rules = this.tempReward.delivery_rules?
             '' + this.tempReward.delivery_rules : '2';
        // выставляю для новой награды количество
        if(!editable) {
            this.tempReward.sell_count = 1;
        }
        this.getPhoneAndAdressDelivery();
    };

    // вытаскиваю телефон владельца проекта
    this.getOwnerData = function() {
        this.httpFactory.get('user/' + this.$localStorage.user_id + '/view').then( d=> {
            this.tempReward.phone = d.data.phone_num
        })
    };

    // вытаскиваю телефон и адрес доставки из других наград
    this.getPhoneAndAdressDelivery = function() {
        for (var i = 0; i < rewards.length; i++) {
            if(rewards[i].pickup_address) {
                this.tempReward.pickup_address = rewards[i].pickup_address
            }
            if(rewards[i].phone) {
                this.tempReward.phone = rewards[i].phone
            }
        }
        //если не нахожу телефона то запрашиваю
        if(!this.tempReward.phone) this.getOwnerData()
    };

    this.prepareDataForSave = (r)=> {
        // если не требует доставки то удаляю дату
        if(r.delivery_rules==2) {
            r.send_date_from = null;
            r.send_date_to = null;
        } else {
            r.send_date_from = r.send_date_temp_from? this.handleDataFactory.dateYYYYMMDD(this.tempReward.send_date_temp_from):null;
            r.send_date_to = r.send_date_temp_to? this.handleDataFactory.dateYYYYMMDD(this.tempReward.send_date_temp_to):null;
        }
        //если чекбокс самовывоза снят то чищу поля доставки
        if(!this.tempReward.has_pickup) {
            r.phone = null;
            r.pickup_address = null;
        }
        return r
    };

    // сравнивает меньше ли одна дата другой
    this.isDatesInvalid = (r)=> {
        if($filter('diffDates')(r.send_date_from,r.send_date_to)<1) {
            this.dateError = 1;
            $timeout(()=> {
                this.dateError = 0
            },5e3);
            return true
        }
        return false
    };

    this.createReward = (r) => {
        r = this.prepareDataForSave(r);
        if(this.isDatesInvalid(r)) return;
        this.pend = 1;
        r.project_id = project_id;
        //r.delivery_rules = +r.delivery_rules;
        httpFactory.post('reward/create',r).then(d => {
            rewards.push(d.data);
            this.pend = 0;
            $uibModalInstance.close(rewards);
        })
    };

    this.updateRewards = (r)=> {
        r = this.prepareDataForSave(r);
        if(this.isDatesInvalid(r)) return;
        this.pend = 1;
        httpFactory.put('reward/' + r.id + '/update',r).then(d => {
            var rews = rewards.map((item)=>{
                if(item.id== d.data.id) {
                    return d.data
                }
                return item
            }).sort((a,b) => {
                return a.price -b.price
            });
            this.temp.editableReward = 0;
            this.pend = 0;
            $uibModalInstance.close(rews);
        })
    };

    this.delReward = (r) => {
        httpFactory.delete('reward/' + r.id + '/delete').then(d => {
            rewards.splice(this.tempReward_id,1);
            this.tempReward_id = null;
            $uibModalInstance.close(rewards);
        })
    };

    this.uploadRewards = (file,id,url='/file/upload') => {
        if(!file || this.rewardForm[id + '_temp'].$error.maxSize) return;

        this.pend = 1;
        Upload.upload({
                url: baseUrl+url,
                data: {file: file, 'username': 'file'}})
            .then(resp => {
                this.tempReward[id] = resp.data.filename;
                this.pend = 0;
            });
    };
    this.countRewardUp = ()=> {
        if (this.tempReward.sell_count<999999) {
            this.tempReward.sell_count++
        }
    };
    this.countRewardDown = ()=> {
        if (this.tempReward.sell_count>1) {
            this.tempReward.sell_count--
        }
    };


}