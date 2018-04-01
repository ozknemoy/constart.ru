/**
 * Created by ozknemoy on 12.12.2016.
 *
 * програмный клик триггерит открытие type="file" только если действие исходит от юзера
 * а не через цепочку действий в конце которых elem.click()
 *
 *
 * <photo-editor callback="n.setFotoUrl(id,url)"
         foto-w='200'
         foto-h='200'>
         <div class="btn btn-info btn-block btn-file">
         Загрузить обложку
         </div>
   </photo-editor>
 */
export let photoEditorComponent = {
    bindings: {
        fotoW: '@',
        fotoH: '@',
        fotoId: '@?',// нужно только когда несколько фоток на одной странице
        areaType: '@?',//  по умолчание прямоугольник
        callback: '&'
    },
    controller: photoEditorCtrl
};

function photoEditorCtrl ($element,$uibModal) {
    'ngInject';
    this._click = () => {
        
        const config = {
            templateUrl: 'app/_common/modals/photo-editor/photo-editor.html',
            controller: photoEditorModalCtrl,
            size: 'lg',
            controllerAs: 'fe',
            resolve: {
                data: ()=>  [this.fotoW,this.fotoH,this.areaType,this.fotoId]
            }
        };
        const instanceRequestModal = $uibModal.open(config);
        instanceRequestModal.result.then(d=> {
            this.callback(d)
        })
    };

    $element.on('click', this._click);

    this.$onDestroy = ()=> {
        $element.off('click', this._click);
    }
}

function photoEditorModalCtrl ($timeout,$uibModalInstance, httpFactory, data) {
    'ngInject';

    console.log("click");
    //в зависимости от ширины документа выставляю размер редактора
    const w = angular.element(window).width(),
        styleH = w>900? '550px' : '350px';


    this.uploadImg =  (base64) => {
        this.pendUpload = 1;
        httpFactory.post("file/upload64", {image:base64})
            .then( d => {
                $uibModalInstance.close({id: this.fotoId, url:d.data.filename})
            }, err =>  {
                this.pendUpload = 0;
            })
    };

    this.$onInit =  () => {
        this.myCroppedImage = '';
        this.myImage = '';
        this.styleH = {'height':styleH};

        [this.fotoW,this.fotoH,this.areaType,this.fotoId] = data;

        /*$timeout(()=> {
            var b = angular.element('.modal-body').find('#imgInput');
            l = angular.element('.modal-body .btn-file');
            _l = angular.element('.modal-body .btn-file');
            console.log(l);
            console.timeEnd("ini");

            b.click();
            l.click();
            l.triggerHandler('click');
            b.triggerHandler('click');
            b.trigger('click');
            l.trigger('click');
        },500)*/
        setTimeout(()=> {
            var target = document.getElementById('imgInput');
            target.addEventListener("change", handleFileSelect, false);

        },500)
    };



    var handleFileSelect = (evt) => {
        this.modalFotoIsOpen = 1;
        var file = evt.currentTarget.files[0];
        if(!file) return;// при отмене второй загрузки фотки
        var reader = new FileReader();
        reader.onload = (evt) => {
            $timeout(()=> {
                this.myImage = evt.target.result;
            })

            //$scope.$digest();
        };
        reader.readAsDataURL(file);
    };
}