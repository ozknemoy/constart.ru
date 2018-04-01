/**
 * Created by ozknemoy on 23.11.2016.
 */
angular.module('app',[])
.directive("owlCarousel", function() {
    return {
        scope: {
            owlOptions: '<'
        },
        restrict: 'E',
        controller: function ($scope,$element) {
            $element.addClass('owl-carousel');
            // init carousel
            this.initCarousel = function() {
                $($element).owlCarousel($scope.owlOptions);
            };
        }
    };
})
    .directive('owlItem', [function() {
        return {
            //scope: {},
            restrict: 'E',
            require:'^owlCarousel',
            link: function(scope, element, attrs, ctrl) {
                if(scope.$last) ctrl.initCarousel();
            }
        };
    }])