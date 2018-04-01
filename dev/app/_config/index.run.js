/**
 * Created by ozknemoy on 03.11.2016.
 */

export function indexRun($rootScope, $location, $window) {
    'ngInject';

    var local = /localhost/i.test(location.href);
    $rootScope.$on('$stateChangeSuccess', function (event) {
        // google metrics track pageview on state change
        $window.ga('send', 'pageview', $location.path());
        // скролл на верх всегда
        document.body.scrollTop = document.documentElement.scrollTop = 0;

    });
}