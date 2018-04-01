"use strict";
require("babel-polyfill");
// config
import {satConfig} from './_config/satellizer.config';
import {routerConfig} from './_config/router.config';
import {interceptorsConfig} from './_config/interceptors.config';
import {commonConfig} from './_config/common.config';
import {ocLazyLoadConfig} from './_config/lazy-load.config';
import {xdLocalstorage} from './_config/xd-localstorage.config';
import {cookieAuth} from './_config/cookie-auth.config';

// run
import {indexRun} from './_config/index.run';
import {cacheRun} from './_config/cache.run';
import {runGoogleMetrics} from './_config/googleMetrics.run';

//import { uiTinymceConfig } from './_config/tinymce.config';

// Controller
import {MainController} from './main.controller';
import {HomeController} from './home/home.controller';
import {ProjectsController} from './projects/projects.controller';
import {ProjectController} from './project/project.controller';
import {AstronautsController} from './astronauts/astronauts';
import {ProjectEditorController} from './projectEdit/projectEditor.controller';
import {UsersController} from './users/users.controller';
import {UserController} from './user/user.controller';
import {UserEditorController} from './userEdit/userEditor.ctrl';
import {MailVerifyController} from './mailVerify/mailVerify.controller';
import {ExpertsController} from './experts/experts.controller';
import {ExpertController} from './expert/expert.controller';
import {agreeTeamController} from './agreeTeam/agreeTeam.controller';
import {helpController} from './help/help.controller';

// Factories
import {userFactory} from './_common/factory/user.factory';
import {httpFactory} from './_common/factory/http.factory';
import {metadataService} from './_common/factory/metadata.service';
import {fotoResponseFactory} from './_common/factory/fotoResponse.factory';
const handleDataFactory = require('./_common/factory/handleData.factory');
const countFactory = require('./_common/factory/count.factory');
const dictFactory = require('./_common/factory/dictionaries.factory');
import {localStorageFactory} from './_common/factory/localStorage.factory';
import {userAgentFactory} from './_common/factory/userAgent.factory';
import {canvasFactory} from './_common/factory/canvas.factory';
import {scrollToF} from './_common/factory/scrollTo.factory';
const checkBuyingFactory = require('./_common/factory/checkBuying.factory');

//Model
import {userModel} from './user/user.model.js';
import {usersModel} from './users/users.model.js';
import {userEditorModel} from './userEdit/userEditor.model.js';


import components from './index.component';

//filters
let MyRoundFilter = require('./_common/filters/myround.filter');
let getNounFilter = require('./_common/filters/getNoun.filter');
import {diffDateFilter,diffDatesFilter,diffDateFromNowFilter,datePlusNDaysFilter} from './_common/filters/diffDate.filter';
import {rangeSliderFilter} from './_common/filters/rangeSlider.filter';
let fromDateToDateFilter = require('./_common/filters/fromDateToDate.filter');
let dateEnToRu = require('./_common/filters/dateEnToRu.filter');
let thousandFilter = require('./_common/filters/1000');
let deleteEmptyValue = require('./_common/filters/deleteEmptyValue.filter');
let checkboxFilter = require('./_common/filters/checkbox.filter');


angular
    .module('constart', [
        'angularGrid',
        //require('./new'),
        //'new2',
        //require('../../node_modules/angular-ui-bootstrap/index.js'),
        'ngToast',
        'afkl.lazyImage',
        'ui.router',
        'ui-rangeSlider',
        'ngAnimate',
        'ngTouch',
        'ui.bootstrap',
        'ui.event',
        'ngSanitize',
        'bootstrapLightbox',
        'videosharing-embed',
        'angularUtils.directives.dirPagination',
        'ngImgCrop',
        'oc.lazyLoad',
        'ngMask',
        'ui.mask',
        'ngLocale',
        'ui.select',
        'ngCookies',
        'satellizer',
        'ngStorage',
        'vcRecaptcha',
        'ngFileUpload',
        'yandex-metrika',
        'dynamicNumber',
        components.name,

        //deferred
//'angular-owl-carousel',
        //'https://www.google.com/recaptcha/api.js?onload=vcRecaptchaApiLoaded&render=explicit&hl=ru'
        //'ui.tinymce',
        //'ckeditor',
    ])

    .constant('baseUrl', 'http://beta.constart.ru:81/')//for gulp http://localhost:8888/
    .constant('roboTax', 1.029)//1.04058 Math.round(10000000/96.1)/100000
    .constant('PROJECT_TAX', 700)
    //.constant('DOMEN',location.host)
    .constant("TYPE","all")// 'all'==constart 'air' == fdbfnjhs
    //.constant('FRONT_URL', 'http://localhost:8000/')
    .config(routerConfig)

    .config(commonConfig)
    .config(interceptorsConfig)
    .config(ocLazyLoadConfig)
    .config(satConfig)

    .run(runGoogleMetrics)
    .run(cacheRun)
    .run(indexRun)
    //.run(xdLocalstorage)
    .run(cookieAuth)

    .factory('userFactory', userFactory)
    .factory('httpFactory', httpFactory)
    .factory('countFactory', countFactory)
    .factory('dictFactory', dictFactory)
    .factory('handleDataFactory', handleDataFactory)
    .factory('localStorageFactory', localStorageFactory)
    .factory('userAgentF', userAgentFactory)
    .factory('scrollTo', scrollToF)
    .factory('canvasF', canvasFactory)
    .factory('checkBuyingFactory', checkBuyingFactory)
    // models
    .service('userModel', userModel)
    .service('usersModel', usersModel)
    .service('userEditorModel', userEditorModel)
    //.service('fotoResponseFactory', fotoResponseFactory)
    .service('metadataService', metadataService)


    .controller('MainController', MainController)
    .controller('HomeController', HomeController)
    .controller('UsersController', UsersController)
    .controller('UserController', UserController)
    .controller('UserEditorController', UserEditorController)
    .controller('ProjectsController', ProjectsController)
    .controller('ProjectController', ProjectController)
    .controller('AstronautsController', AstronautsController)
    .controller('ProjectEditorController', ProjectEditorController)
    .controller('MailVerifyController', MailVerifyController)
    .controller('ExpertsController', ExpertsController)
    .controller('ExpertController', ExpertController)
    .controller('agreeTeamController', agreeTeamController)
    .controller('helpController', helpController)


    .filter('myround', MyRoundFilter)
    .filter('getNoun', getNounFilter)
    .filter('thousand', thousandFilter)
    .filter('diffDate', diffDateFilter)
    .filter('diffDates', diffDatesFilter)
    .filter('datePlusNDays', datePlusNDaysFilter)
    .filter('diffDateFromNow', diffDateFromNowFilter)
    .filter('rangeSlider', rangeSliderFilter)
    .filter('fromDateToDate', fromDateToDateFilter)
    .filter('dateEnToRu', dateEnToRu)
    .filter('deleteEmpty', deleteEmptyValue)
    .filter('checkbox', checkboxFilter)


;
angular.module('new2', [])
    .directive('tagInput', tagInput);


function tagInput() {
    return {
        restrict: 'A',
        link: function ($scope, elem, attr) {
            'ngInject';
            $(elem).tagsinput({
                tagClass: 'label label-' + attr.tagInput
            });
        }
    };
}
