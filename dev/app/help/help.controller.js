/**
 * Created by ozknemoy on 05.11.2016.
 */
export function helpController($stateParams,$filter,TYPE,metadataService,scrollTo,PROJECT_TAX) {
    'ngInject';
    var id = $stateParams.id,
        _w  = angular.element(window).width();
        this.PROJECT_TAX = $filter('thousand')(PROJECT_TAX) + ' ';
    metadataService._setMetaTags('help');

    this.isOdvf = TYPE==='air';
    this.scrollTo = function (id) {

        var p = angular.element('#'+id).position().top;
        if(_w<767) {
            angular.element('.panel-collapse.in').collapse('hide');
            p = p-80;
        }
        console.log(p);
        p = Math.max(p,1);
        scrollTo(p, 800);
    };

    if(id) setTimeout(()=> {
        this.scrollTo(id)
    },10);

}