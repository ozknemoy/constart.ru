/**
 * Created by ozknemoy on 20.12.2016.
 */
module.exports =  function($state,$location,ngToast,httpFactory,$localStorage) {
    'ngInject';
    let checkBuying = {};

    function noParams() {
        return !$location.$$url.includes('?')
    }

    checkBuying.successToast = function(content) {
        ngToast.success({
            content,
            dismissButton: true,
            timeout: 20e3
        })
    };

    checkBuying.failToast = function(content) {
        ngToast.danger({
            content,
            dismissButton: true,
            timeout: 20e3
        })
    };

    /*function getMsg() {
        return {
            ERR001: 'Время на совершение платежа истекло, пожалуйста, повторите оплату снова.',
            ERR002: 'Произошла какая-то ошибка - оплата не прошла, пожалуйста, повторите платеж.',
            INF001: 'Информация обновляется. Пожалуйста, обновите страницу позже, чтобы увидеть изменения.',
            INF002: 'Ваш личный счет успешно пополнен.',
            //INF003: 'Информация обновляется. Пожалуйста, обновите страницу позже, чтобы увидеть изменения.',
            INF004: 'Спасибо за поддержку нашего проекта! Если проект будет успешным, мы свяжемся с Вами и расскажем, как Вы получите вознаграждение (информация о покупке отображается в Вашем личном кабинете). Следите за новостями проекта.'
        }
    }*/
    checkBuying._getMsg = function (hasName) {
        if(hasName) var name = ', ' + $localStorage.name;

        return {
            ERR001: 'Время на совершение платежа истекло, пожалуйста, повторите оплату снова.',
            ERR002: 'Произошла какая-то ошибка - оплата не прошла, пожалуйста, повторите платеж.',
            INF001: 'Информация обновляется. Пожалуйста, обновите страницу позже, чтобы увидеть изменения.',
            deposit_INF002: 'Ваш личный счет успешно пополнен.',
            //INF003: 'Информация обновляется. Пожалуйста, обновите страницу позже, чтобы увидеть изменения.',
            project_INF002: `Спасибо за поддержку нашего проекта${name}! Если проект будет успешным, мы свяжемся с Вами и расскажем, как Вы получите вознаграждение (информация о покупке отображается в Вашем личном кабинете). Следите за новостями проекта.`
        }
    };

    // проверка пополнения счета type=deposit
    checkBuying.check = (type) => {
        if(noParams()) return;
        const success = $location.search()['successBuy'];
        const fail = $location.search()['failBuy'];
        //console.log('success',success,fail);
        
        if(success && success.length) {
            httpFactory.get('outer-payment/check-user-payment-by-id?id=' + success)
            .then(d => {checkBuying.successToast(checkBuying._getMsg()[type + '_INF002'])},
                e => {checkBuying.successToast(checkBuying._getMsg().INF001)})
        }

        if(fail && fail.length) {
            httpFactory.get('outer-payment/check-user-payment-by-id?id=' + fail)
                .then(d => {checkBuying.failToast(checkBuying._getMsg().ERR002)},
                    e => {checkBuying.failToast(checkBuying._getMsg().ERR002)})
        }
    };

    return checkBuying
};