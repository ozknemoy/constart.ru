/**
 * Created by ozknemoy on 15.04.2017.
 */

export function cookieAuth(localStorageFactory) {
    'ngInject';

    localStorageFactory.checkCookieAuth();//,{domain:'mydomain.com'}
    //localStorageFactory.setCookie('domain','constart.ru');
    //localStorageFactory.deleteCookieAuth();



}