/**
 * Created by ozknemoy on 21.11.2016.
 * вешается на ссылки
 * если авторизован то проходит по ней
 * если нет то вылетает модалка авторизации
 * если авторизован и id = 0 то тостик
 * <a try-to-see-user="{{project.proj.owner.id}}" href >
 * tryToSeeUser=idUser isAuth=auth
 */
export function tryToSeeUserDirective ($state,$uibModal,$auth,ngToast,$timeout) {
    'ngInject';
    return {
        //scope: {}, не вижу смысла изолировать
        link: function (scope,elem,attrs) {
            scope._click = () => {
                
                const auth = $auth.isAuthenticated();
                if(auth && attrs.tryToSeeUser!=0) {

                    $state.go('user.about', {id: attrs.tryToSeeUser})
                } else if(auth && attrs.tryToSeeUser==0) {
                    $timeout(()=>{
                        ngToast.info({dismissButton: true,content:'Пользователь пока не зарегистрирован на нашем сайте',timeout:5e3})

                    },10)

                } else {
                    const config = {
                        animation: true,
                        templateUrl: 'app/_common/directives/try-to-see-user/try-to-see-user.modal.html'
                    };
                    $uibModal.open(config);
                }

            };

            elem.on('click', scope._click);

            scope.$on('$destroy', ()=> {
                elem.off('click', scope._click);
            })
        }
    }
}