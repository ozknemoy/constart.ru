/**
* Created by дима on 23.06.2016.
* <foto-editor
 foto-emit="ue.setFotoUrl(id,url)"
 modal-parent-id="{{ue.idCroppedImg}}"
 area-type='circle'
 foto-w='160'
 foto-h='160'></foto-editor>

 openModalFoto (id) {
        var b = angular.element('body').find('#_' + id);
        setTimeout(() => {
            b.click();
        },200);
    }


*/
export let fotoeditorComponent = {
    bindings: {
        fotoEmit: '&',
        modalParentId: '@',
        fotoW: '@',
        fotoH: '@',
        areaType: '@?'
    },
    controller: function ($element,$scope,httpFactory) {
        'ngInject';
        this.myCroppedImage = '';
        this.myImage = '';
        const w = angular.element(window).width(),
              styleH = w>900? '550px' : '350px';
        var target;
        this.styleH = {'height':styleH};
        this.uploadImg =  (base64) => {
            this.pendUpload = 1;
            httpFactory.post("file/upload64", {image:base64})
                .then( d => {
                    this.fotoEmit({id: this.modalParentId, url:d.data.filename});
                    this.myCroppedImage = '';
                    this.myImage = '';
                    this.modalFotoIsOpen = 0;
                    this.pendUpload = 0;
                    angular.element('#_'+this.modalParentId).off('change');
                    target.removeEventListener("change", handleFileSelect, false);
                    angular.element('#' + this.modalParentId).modal('hide');
                }, err =>  {
                this.pendUpload = 0;
            })
        };

        this.addListener =  (e) => {

            target = e.target;
            target.addEventListener("change", handleFileSelect, false);
            // ангулар не цепляет инпут поэтому:
            angular.element('#_'+this.modalParentId).on('change',(e)=>{

                if(e.currentTarget.files.length) {
                    const modal = angular.element('#' + this.modalParentId);
                    console.log("modal",modal);


                    setTimeout(()=>{
                        modal.modal('show')
                    },300);

                    this.modalFotoIsOpen = 1;
                }
            });
        };

        var handleFileSelect = (evt) => {
            var file = evt.currentTarget.files[0];
            if(!file) return;// при отмене второй загрузки фотки
            var reader = new FileReader();
            reader.onload = (evt) => {
                this.myImage = evt.target.result;
                $scope.$digest();
            };
            reader.readAsDataURL(file);
        };

    },
    templateUrl: '/app/_common/directives/fotoeditor/_fotoeditor.directive.html',
    controllerAs: 'fe'
};

