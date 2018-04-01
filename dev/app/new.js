/**
 * Created by ozknemoy on 05.11.2016.
 */

angular.module('new',[])
    .run(function () {
        console.log("new");

    })
    .directive('tagInput', tagInput);

/** @ngInject */
function tagInput() {
    return {
        restrict: 'A',
        link: function( $scope, elem, attr) {
            $(elem).tagsinput({
                tagClass:  'label label-' + attr.tagInput
            });
        }
    };
}
module.exports = 'new';