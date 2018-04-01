/**
 * Created by ozknemoy on 11.11.2016.
 * для редактирования создания и удаления
 */

export var legalsEdit = {
    bindings: {
        create: '@?',// true
        edit: '<?',// [obj,ind]
        delete: '<?',//[indexArrForDelete,idForDelete]
        callback: '&'// callback(ind,type,obj})
    },
    controller: function ($element, $uibModal) {
        'ngInject';
        this._click = () => {
            let config;
            if (this.delete) {// модалка для удаления
                config = {
                    animation: true,
                    resolve: {
                        del:  () => {
                            return this.delete
                        }
                    },
                    templateUrl: 'app/_common/modals/ue-legals-edit/ue-legals-delete.html',
                    controller: forDeleteController,
                    controllerAs: 'le'
                }
            } else {
                config = {// модалка для редактирования и создания
                    animation: true,
                    resolve: {
                        create:  () => {
                            return this.create
                        },
                        edit:  () => {
                            return this.edit
                        }
                    },
                    templateUrl: 'app/_common/modals/ue-legals-edit/ue-legals-edit.html',
                    controller: forCreateController,
                    controllerAs: 'le'
                };
            }
            var instanceRewardModal = $uibModal.open(config);
            instanceRewardModal.result.then(d=> {
                //при создании возвращаю объект со свойством new
                if (d.new) {
                    this.callback({type:'create',obj:d});
                    return
                }
                //при редактировании возвращаю объект с id
                if (d.data && d.data.id) {
                    this.callback({ind:this.edit[1],type:'edit',obj:d.data});
                    return
                }
                // при удалении возвращаю просто номер
                if (typeof d != 'object') {
                    this.callback({ind:d,type:'delete'})
                }
            });
        };

        $element.on('click', this._click);

        this.$onDestroy = ()=> {
            $element.off('click', this._click);
        }
    }
};

const forDeleteController = ['$uibModalInstance', 'del','httpFactory', 'baseUrl', 'ngToast',
    function($uibModalInstance, del,httpFactory, baseUrl, ngToast) {
        const [indexArrForDelete,idForDelete] = del;

        this.deleteLegals = () => {
            this.pend = 1;
            httpFactory.delete('user-legal/' + idForDelete + '/delete').then(()=> {
                this.pend = 0;
                ngToast.success({dismissButton: true,content:'Успешно удалено'});
                $uibModalInstance.close(indexArrForDelete)
            });
        };
    }];

//const forCreateController = ['$uibModalInstance', 'create', 'edit', 'Upload', 'httpFactory', 'dictFactory', 'baseUrl', 'ngToast', 'handleDataFactory',
    function forCreateController ($uibModalInstance, create, edit, Upload, httpFactory, dictFactory, baseUrl, ngToast, handleDataFactory) {
        'ngInject';

        this.$onInit = ()=> {
            this.dateOptions = dictFactory.dateOptions;
            this.temp = {l: {}, t: {}};
            this.temp.legals = dictFactory.legals;

            if(edit) {
                [edit,this.temp.indLegalsForEdit] = edit;

                this.temp.editableLegals = 1;
                this.temp.t.legal_type = '' + edit.legal_type;
                this.temp.l = angular.copy(edit.data);
                this.temp.l.ii_reg_date = this.temp.l.ii_reg_date ?
                    new Date(edit.data.ii_reg_date) : null;
                this.temp.l.ur_date_warrant = this.temp.l.ur_date_warrant ?
                    new Date(edit.data.ur_date_warrant) : null;
                this.temp.l.ii_num_date = new Date(edit.data.ii_num_date);// это общая поэтому всегда есть

            } else {
                this.temp.l.site='http://'
            }
        };


        this.uploadDocs =  (file, id, url = 'file/upload') => {
            if (!file || this.legalForm[id + '_temp'].$error.maxSize) return;
            this.temp.pend = 1;

            Upload.upload({
                    url: baseUrl + url,
                    data: {file: file, 'username': 'file'}
                })
                .then(resp => {
                    this.temp.l[id] = resp.data.filename;
                    this.temp.pend = 0;
                    this.temp.saveScan = 1;
                    ngToast.success({dismissButton: true,content: 'Скан успешно загружен'})
                }, err => {
                    this.temp.pend = 0;
                }, evt => {
                });
        };

        this.createLegals =  (l, t) => {
            if (!t) return;
            this.temp.pend = 1;
            httpFactory.post('user-legal/create', {
                "legal_type": parseInt(t),
                "data": handleData(l)
            }).then(d=> {
                d.data.new = 1;
                this.temp.pend = 0;
                $uibModalInstance.close(d.data);
            }, e=> {
                this.temp.pend = 0;
            })
        };

        this.saveEditedLegals =  (l, t) => {
            if (!t) return;
            this.temp.pend = 1;
            httpFactory.put('user-legal/' + edit.id + '/update',{
                "legal_type": parseInt(t),
                "data": handleData(l)
            }).then(d => {
                this.temp.pend = 0;
                $uibModalInstance.close({legal_type:t,data:d.data});
            })
        };

        function handleData(_l) {
            var l = Object.assign({},_l);
            l.ii_reg_date = l.ii_reg_date? handleDataFactory.dateYYYYMMDD(l.ii_reg_date): undefined;
            l.ur_date_warrant = l.ur_date_warrant? handleDataFactory.dateYYYYMMDD(l.ur_date_warrant): undefined;
            l.ii_num_date = l.ii_num_date? handleDataFactory.dateYYYYMMDD(l.ii_num_date): undefined;
            return l
        }
    }
//];