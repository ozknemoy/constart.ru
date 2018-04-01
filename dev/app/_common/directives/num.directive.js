/**
 * Created by дима on 07.08.2016.
 * в ozk-number стоит blur on enter
 * есть проверка значений атрибутов min max . работает только если type=text
 * <input type="text" ozk-number="float" ng-model="numm">
   <input type="text" ozk-number ng-model="nummm">
 <input type="text" ozk-enter ng-model="nummm">
 //
 //
 *
 */

export function ozkNumberDirective () {
    return {
        require: '?ngModel',
        link: function(scope, el, attrs, ngModelCtrl) {
            if(!ngModelCtrl)  return;


            // тут цифры это строки и надо об этом постоянно помнить
            ngModelCtrl.$parsers.push(function(val) {
                var newV;
                if (attrs.ozkNumber=='float') {
                    newV = val.replace(/[^0-9.,]+/g, '');
                    newV = newV.replace(',', '.');
                    //если точка последняя в строке то отключаю parseFloat чтобы не убирать её
                    //if a dot is last, then turn off parseFloat for save it
                    if (newV.indexOf('.') !== newV.length - 1) {
                        newV = '' + parseFloat(newV);
                    }
                } else {
                    newV = val.replace( /[^0-9]+/g, '');
                }

                // проверка значений min max
                newV = (+newV<+attrs.min)?attrs.min:newV;
                newV = (+newV>+attrs.max)?attrs.max:newV;

                if (val !== newV) {
                    ngModelCtrl.$setViewValue(newV);
                    ngModelCtrl.$render();
                }
                
                return newV;
            });

            scope._click = (event) => {
                if(event.keyCode === 13) { // 32 пробел
                    event.preventDefault();
                    event.target.blur();
                }
            };

            el.on('keypress', scope._click);

            scope.$on('$destroy',  ()=> {
                el.off('click', scope._click);
            })
        }
    }
}

export function ozkEnterDirective () {
    return {
        require: '?ngModel',
        link: function(scope, el, attrs, ngModelCtrl) {
            if(!ngModelCtrl) {
                return;
            }

            scope._click = (event) => {
                if(event.keyCode === 13) {
                    event.preventDefault();
                    event.target.blur();
                }
            };

            el.on('keypress', scope._click);

            scope.$on('$destroy',  ()=> {
                el.off('click', scope._click);
            })
        }
    }
}

// чистит инпут . если ozkClean==='deep' то глубокая чистка через фабрику иначе просто чистка  < и >
export function ozkCleanDirective (handleDataFactory) {
    'ngInject';
    return {
        require: '?ngModel',
        link: function(scope, el, attrs, ngModelCtrl) {
            if(!ngModelCtrl)  return;


            // тут цифры это string и надо об этом постоянно помнить
            ngModelCtrl.$parsers.push(function(val) {
                var newV;
                if (attrs.ozkClean==='deep') {
                    newV = handleDataFactory.cleanHTML(newV)
                } else {
                    newV = val.replace( /(<|>)/g, '');
                }

                if (val !== newV) {
                    ngModelCtrl.$setViewValue(newV);
                    ngModelCtrl.$render();
                }

                return newV;
            });

            scope._click = (event) => {
                if(event.keyCode === 13) { // 32 пробел
                    event.preventDefault();
                    event.target.blur();
                }
            };

            el.on('keypress', scope._click);

            scope.$on('$destroy',  ()=> {
                el.off('click', scope._click);
            })
        }
    }
}
// для переноса строки по нажатию enter
export function enterForBreakDirective () {
    return {
        require: '?ngModel',
        link: function(scope, el, attrs, ngModelCtrl) {

            el.bind('keypress', function(event) {
                if(event.keyCode === 13) {

                    console.log(el);
                    /*if(!ngModelCtrl) {
                        return;
                    }
                    //event.preventDefault();
                    /!*var newV;
                     $modelValue
                     :

                     newV = val + '<br>';*!/
                    ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue + '<br>');
                    ngModelCtrl.$render();*/
                }
            });
            ngModelCtrl.$parsers.push(function(val,t,r) {
                console.log(val,t,r);


                //ngModelCtrl.$setViewValue(newV);

                //ngModelCtrl.$render();

                return val;
            });
        }
    }
}