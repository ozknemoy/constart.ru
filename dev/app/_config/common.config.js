/**
 * Created by дима on 29.08.2016.
 */
export function commonConfig ($compileProvider,$httpProvider,ngToastProvider,$logProvider,
                              $qProvider,$metrikaProvider,uiSelectConfig,$animateProvider, LightboxProvider,baseUrl) {
    'ngInject';
    $logProvider.debugEnabled(/localhost/.test(location.href));

    //$qProvider.errorOnUnhandledRejections(/localhost/.test(location.href));//for fix 4 errors in angular 1.6
    $compileProvider.commentDirectivesEnabled(false);//for angular 1.6
    $compileProvider.cssClassDirectivesEnabled(false);// надо сначала удалить директиву ui-view в классе
    $compileProvider.debugInfoEnabled(false);
    $compileProvider.preAssignBindingsEnabled(true); // for angular 1.6
    $httpProvider.useApplyAsync(true);

    LightboxProvider.templateUrl = 'app/_common/tmpl/ekkoLightbox.html';//ekko-lightbox-with-sidebar
    LightboxProvider.fullScreenMode = true;

    // initialise yandex analytics
    //if(baseUrl=='http://service.constart.ru/') {//
        $metrikaProvider.configureCounter({id: 40097510, webvisor: true},{id: 40097511, webvisor: false},{id: 40097511, webvisor: false});

    //}

    // select
    uiSelectConfig.theme = 'bootstrap';
    //uiSelectConfig.resetSearchInput = true;
    uiSelectConfig.appendToBody = true;
    // ограничил класс для анимации
    $animateProvider.classNameFilter('ui-view-anim');
    //$animateProvider.enabled('ui-select', false);

    // for more info: http://tameraydin.github.io/ngToast/
    ngToastProvider.configure({
        animation: 'slide', // or 'fade'
        additionalClasses: 'toast',
        //horizontalPosition: 'center'
    });
}