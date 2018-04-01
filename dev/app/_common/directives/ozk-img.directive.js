/**
 * Created by ozknemoy on 15.10.2016.
 * подключае изображение только когда приходят данные для фото
 * ozkImg
 * base
 * src мужская фотка
 * f-src женская фотка
 * sex
 */
export function ozkImgDirective() {
    return {
        restrict: 'A',
        scope: {
            ozkImg: '@',
            base: '@',
            sex: '@?'
        },
        link: (scope, element, attr) => {
            //если фото не зависит от пола
            if (typeof attr.sex === 'undefined') {
                var f = () => {
                    if (scope.ozkImg && scope.ozkImg != null && scope.ozkImg.length > 4) {
                        element[0].src = scope.base + scope.ozkImg;

                        // уничтожаю вотчер
                        setTimeout(function () {
                            w()
                        }, 100);
                    }
                };
                var w = scope.$watch('ozkImg', f);
                kill();
            } else {//если зависит от пола
                var sex = () => {
                    // сначала scope.sex это undefined
                    // когда данные пришли с сервера то scope.sex это string(null если пол не выбран)
                    // scope.ozkImg всегда string = ''
                    if (typeof scope.sex === 'string' && (scope.ozkImg || scope.ozkImg=='' )) {

                        // если есть фото
                        if (scope.ozkImg && scope.ozkImg.length > 15) {
                            element[0].src = scope.base + scope.ozkImg;
                            // уничтожаю вотчер
                            kill(100);
                            // если женщина без фотки
                        } else if (scope.sex == 1) {
                            element[0].src = attr.fSrc;
                            // уничтожаю вотчер
                            kill(100);
                        }
                    }
                };
                var w = scope.$watch('sex', sex);
                var _w = scope.$watch('ozkImg', sex);
                // даю время на ответ с сервера и убиваю
                kill();

            }
            function kill(time=8e3) {
                setTimeout(function () {
                    if(_w) _w();
                    w()
                }, time);
            }

        }
    };
}