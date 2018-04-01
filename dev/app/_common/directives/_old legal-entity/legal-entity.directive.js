/**
 * Created by ozknemoy on 13.10.2016.
 */

export function legalEntityDirective() {
    return {
        scope: {
            change: '&',// возвращает данные в контроллер
            edit: '=?',
            preDelete: '=?'
        },

        controller: function ($scope,Upload,httpFactory,dictFactory,baseUrl,$timeout) {
            'ngInject';
            this.dateOptions = dictFactory.dateOptions;
            this.temp = {l:{},t:{}};
            this.temp.legals = dictFactory.legals;


            this.uploadDocs = function (file,id,url='/file/upload') {
                if(!file || this.legalForm[id + '_temp'].$error.maxSize) return;
                this.temp.pend = 1;

                Upload.upload({
                    url: baseUrl+url,
                    data: {file: file, 'username': 'file'}})
                    .then(resp => {
                        this.temp.l[id] = resp.data.filename;
                        this.temp.pend = 0;
                        this.temp.saveScan = 1;
                        $timeout(()=> {
                            this.temp.saveScan = 0;
                        },5000)
                    }, err => {
                        this.temp.pend = 0;
                        this.temp.saveScanError = err.data.length? err.data[0].message: err.data.message;
                        $timeout(()=> {
                            this.temp.saveScanError = 0;
                        },8000)
                    }, evt => {});
            };

            this.createLegals = function(l,t) {
                if(!t) return;
                this.temp.pend = 1;
                httpFactory.post('user-legal/create',{
                    "legal_type":parseInt(t),
                    "data":l
                }).then(d=> {
                    $scope.change({type:'create',obj:d.data});
                    this.afterSaveLegals();
                },e=> {
                    console.log(e.data)
                })
            };




            this.afterSaveLegals = function() {
                this.temp.pend = 0;
                angular.element('#legalEntity').modal('hide');
                this.temp.l={};
                this.temp.t.l=0;
                this.legalForm.$setUntouched();
                this.temp.editableLegals = 0;
            };

            this.saveEditedLegals = function(l,t) {
                if(!t) return;
                this.temp.pend = 1;

                $scope.change({ind:this.temp.indLegalsForEdit,type:'edit',obj:d.data});
                this.afterSaveLegals();

            };

            $scope.edit = (l,ind) => {
                this.temp.indLegalsForEdit = ind;
                this.temp.editableLegals = 1;
                this.temp.t.legal_type = '' + l.legal_type;
                this.temp.l=angular.copy(l.data);
                this.temp.l.ii_reg_date= this.temp.l.ii_reg_date?
                    new Date(l.data.ii_reg_date.slice(0,10)) : 0;
                this.temp.l.ii_num_date= new Date(l.data.ii_num_date.slice(0,10));// это общая поэтому всегда есть

                angular.element('#legalEntity').modal();

            };

            $scope.preDelete = (ind,id) => {
                // предзапрос удаления при открытии модалки
                this.temp.indLegalsForDelete = ind;
                this.temp.idLegalsForDelete = id;
                angular.element('#deleteLegals').modal();
            };

            this.deleteLegals = () =>{
                // если подтвердил удаление
                this.temp.pend = 1;

                httpFactory.delete('user-legal/' + this.temp.idLegalsForDelete + '/delete').then(()=> {
                    this.temp.pend = 0;
                    $scope.change({ind:this.temp.indLegalsForDelete,type:'delete'});
                });
                //
                angular.element('#deleteLegals').modal('hide');
            };


        },
        controllerAs: 'le',
        templateUrl: 'app/_common/directives/legal-entity/legal-entity.html'
    }
}
