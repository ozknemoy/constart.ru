/**
 * Created by ozknemoy on 04.11.2016.
 */
export var scrollUpComponent = {
    controller: function ($element,scrollTo) {
        'ngInject';
        $element.bind('click', function () {
            scrollTo('body', 800);
            //angular.element.scrollTo(0, 800);
        })
    }
};