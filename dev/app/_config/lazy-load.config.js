/**
 * Created by ozknemoy on 08.12.2016.
 */
export function ocLazyLoadConfig($ocLazyLoadProvider) {
    'ngInject';
    $ocLazyLoadProvider.config({
        //debug: true,
        serie: true,
        modules: [
            {
                name: 'ngCkeditor',
                files: [
                    'assets/js/deferred/angular-ckeditor/var/ckeditor.js',
                    'assets/js/deferred/angular-ckeditor/angular-ckeditor.min.js',
                    'assets/js/deferred/angular-ckeditor/var/contents.css'
                ],
                serie: true
            },{
                name: 'ngCkeditorExt',
                files: [
                    'assets/js/deferred/angular-ckeditor/extend/ckeditor.js',
                    'assets/js/deferred/angular-ckeditor/angular-ckeditor.min.js',
                    'assets/js/deferred/angular-ckeditor/extend/contents.css'
                ],
                serie: true
            },{
                name: 'ngTiny',
                files: [
                    'assets/js/deferred/tinymce.custom.ru.js',
                    'assets/js/deferred/tinymce.angular.defered.js'
                ],
                serie: true
            }

        ]
    });
}