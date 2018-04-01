/**
 * Created by ozknemoy on 03.10.2016.
 */

export function sendEmailDirective () {
    return  {
        link: function(scope, element, attrs) {

        },
        controller: function($scope,$timeout,httpFactory,dictFactory) {
            'ngInject';



            $scope.sendMessageFromUnknown = function(email,message) {
                console.log(email,message);
                $scope.emailIsSend =1;
                $scope.emailIsNotSend = 1;
            }
        },
        controllerAs: 'iu',
        templateUrl: 'app/_common/directives/send-email/send-email.html'
    }
}