/**
 * Created by ozknemoy on 04.11.2016.
 * открывает простенькие модалки
 * параметры: модалки и размер/ через пробел можно добавть классы к modal-dialog
 * modal-open="app/_common/modals/home.html;lg"
 * разделять точкой с запятой
 *  контроллер и короткое имя
 *  modal-ctrl="HomeController;home"
 *  windowTopClass
 *
 *  с помощью value можно пробрасывать объект в модалку и именно объект с ключами!!!!!!!!!!!!!!!!!!!!!!!!!
 *  в объекте надо указывать controllerAs
 *
 */
export function modalOpenDirective($uibModal) {
    'ngInject';
    return {
        scope: {
            value: '<?'// какие то данные в объекте
        },
        link: function (scope, el, attrs) {

            // обязательное поле
            var [tmpl,size] = attrs.modalOpen.split(';');
            scope._click = () => {
                var config = {
                    animation: true,
                    templateUrl: tmpl,
                    size: size
                };
                // не обязательные поля
                if(attrs.modalCtrl) {
                    [config.controller,config.controllerAs] = attrs.modalCtrl.split(';');
                }
                if(attrs.windowTopClass) {
                    config.windowTopClass = attrs.windowTopClass;
                }
                if(scope.value) {
                    config.resolve = {
                        value: function () {
                            return scope.value;
                        }
                    };
                    config.controller = function (value) {
                        'ngInject';// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                        this.value = value;
                    };

                    config.controllerAs = scope.value.controllerAs || '$ctrl'
                }

                $uibModal.open(config);

            };

            el.on('click', scope._click);

            scope.$on('$destroy',  ()=> {
                el.off('click', scope._click);
            })

        }
    }
}
/*this.openM = function (size='sm') {

 var modalInstance = $uibModal.open({
 animation: true,
 template: `
 <div class="">
 <button type="button" class="close" ng-click="m.close()"><span aria-hidden="true">&times;</span></button>
 <div class="modal-header text-center">
 <div class="title">Выбрать область</div>
 </div>
 <div class="modal-body">
 {{ue.u.foto}}
 <div foto-editor
 data-modal-parent-id="{{ue.idCroppedImg}}"
 data-foto-pref-w='160'
 data-foto-pref-h='160'
 data-is-array="false"></div>
 </div>
 </div>

 `,

 size: size,
 bindToController: true,
 controllerAs: 'ue'
 });
 };*/