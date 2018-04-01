export class UserEditorController {
    constructor (userEditorModel,handleDataFactory) {
        'ngInject';

        this.handleDataFactory = handleDataFactory;
        console.time("get user");
        console.time("getGeo");
        console.time("extendModel");
        angular.extend(this,userEditorModel);// забираю инициализированные данные для директив

        this.get().then(d=> {
            angular.extend(this,userEditorModel);// добавил модель после запроса

        });

    }

    getCountryAndRegion(cID,regID) {
        return this.handleDataFactory.getCountryAndRegion(cID,regID,this.geo);
    };

    /*getNewCountryAndRegion() {
        this.countryAndRegion = this.handleDataFactory.getCountryAndRegion(this.u.country_id,this.u.region_id,this.geo);
        this.regionsOfContry = _.where(this.geo,'id',this.u.country_id).regions;
    }*/

    getRegionWorkByCountryId(id) {
        if(!id || !this.geo) return;
        var ret;
        this.geo.forEach(country=> {
            if(country.id == id) {
                ret = country.regions
            }
        });
        return ret
    };

    addWork () {
        this.u.work.push({site:'http://'});//
    }

    deleteWork (id) {
        this.u.work.splice(id,1)
    }

    isBankFieldsNotEmpty () {
        // возвращает true если хотя бы одно поле не пусто
        return this.bankForm.bank_name.$modelValue || this.bankForm.bank_bik.$modelValue ||
        this.bankForm.bank_corr.$modelValue || this.bankForm.bank_account.$modelValue
    }

    trySave () {
        // так как фото находится вне форм то доп условие
        // mainForm только для проверки ее изменения или чистоты перед сохранением
        if (this.pasportData.$pristine && this.mainForm.$pristine &&
            this.phoneForm.$pristine && this.bankForm.$pristine &&
            this.u.foto == this.temp[this.idCroppedImg]) {
            this.ngToast.info({dismissButton: true,content:'Нечего сохранять'});
            return
        }

        // пропускать если банк валиден или его поля не заполнены
        if (this.bankForm.$invalid && this.isBankFieldsNotEmpty()) {
            this.ngToast.danger({dismissButton: true,content:'Банковские реквизиты заполнены не правильно'});
            return
        }

        this.save(this.u);
        if(!this.bankForm.$pristine && this.bankForm.$valid) this.saveBankData(this.u.bank);
    }

    save(u,type) {
        this.saveModel(u,type).then( type => {
            this.setPristine();
        })
    }

    setPristine() {
        if(this.mainForm) this.mainForm.$setPristine();
        if(this.pasportData) this.pasportData.$setPristine();
        if(this.phoneForm) this.phoneForm.$setPristine();
    }

    // удаляю все ошибки отправок смс
    clearAllErrorSms () {
        this.passportClearErrorSMS = null;
        this.bankErrorSMS = null;
        this.phoneErrorSMS = null;
        this.passportErrorSMS = null;
        this.bankClearErrorSMS = null;
    }

    saveBankData (code) {
        var bank = {
            "user_id": this.id,
            "name": this.u.bank.name,
            "bik": this.u.bank.bik,
            "corr": this.u.bank.corr,
            "account": this.u.bank.account
        };
        this.httpFactory.put('user/bank-save?code=' + code,bank).then(()=> {
            /*this.bankCodeSuccesSMS=1;
            this.u.bank.is_verified = 1;
            this.bankSuccessSMS= "Банковские реквизиты успешно отправлены на проверку"*/
        },e => {
            //this.bankErrorSMS=e.data.message||e.data[0].message;
        })
    }
    // на лету обновляю модель паспорта из временной переменной
    evalPassport() {
        this.u.passport.user_id = this.id;
        this.u.passport.when_give = this.handleDataFactory.dateYYYYMMDD(this.temp.passport_when_give);
    }

    setFotoUrl(id,value) {
        this.temp[id] = value;
    }

    upload (file,id) {
        if(!file || this.pasportData['passport_' + id + '_temp'].$error.maxSize) return;
        this.pend.upload = 1;
        this.Upload.upload({
                url: this.baseUrl+'file/upload',
                data: {file: file}})
            .then( (resp) => {
                this.u.passport[id] = resp.data.filename;
                this.pend.upload = 0;
            }, err => {

            }, evt => {
                //console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% ' + evt.config.data.file.name);
            });
    };

    openModalFoto (id) {
        var b = angular.element('body').find('#_' + id);
        setTimeout(() => {
            b.click();
        },200);
    }

    restorePassword() {
        this.pend.restorePassword = 1;
        this.httpFactory.restorePassword(this.u.email).then(
            d => {
                this.ngToast.info({dismissButton: true,content:'На ваш адрес электронной почты отправлено письмо с инструкцией по смене пароля'});
                this.pend.restorePassword = 0;
            });
    };

    init () {
        //angular.element('#legalEntity').modal();
        //angular.element('.carousel-indicators.list div:nth-child(2)').click();
    }
}