/**
 * Created by ozknemoy on 20.10.2016.
 *
 * webdriver-manager start
 *
 */
exports.config = {
    // The address of a running selenium server.
    seleniumAddress: 'http://localhost:4444/wd/hub',

    // каждый раз перезапускает браузер. но можно прицельно browser.restart()
    //'restartBrowserBetweenTests': true ,
    // Capabilities to be passed to the webdriver  instance.
    // restartBrowserBetweenTests: true
    capabilities: {
        'browserName': 'chrome'
    },
    //baseUrl: 'http://localhost:8000',
    // Spec patterns are relative to the current working directly when
    // protractor is called.
    specs: [
        //'tests/ui/home.js',
        //'tests/ui/buy-free-reward.js',
        'tests/ui/buy-reward.js',// вручную запускать отдельные тесты



    ],

    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    }
};
/*seleniumAddress	адрес запущенного селениум сервера (обычно http://localhost:4444/wd/hub)	null
    allScriptsTimeout	таймаут для выполнения всех сценариев	11000
specs	пути к файлам сценариев тестов (относительно конфига)	[‘spec/*_spec.js’]
 exclude	исключения для предыдущего пункта	[]
 capabilities	выбор браузера с параметрами. Более подробно тут	{‘browserName’: ‘chrome’}
 multiCapabilities	предыдущая опция для запуска тестов в нескольких браузерах	[]
 baseUrl	стартовая страница приложения	http://localhost:8000
 rootElement	элемент на котором иницилизированно приложение (ng-app)	body
 onPrepare	колбэк который будет выполнен, когда протрактор готов к работе, но тесты еще не начали выполняться	function() {}
 params	параметры, которые будут внедрены в среду выполнения тестов (но не сами тесты)	{login: { user: ‘Jane’, password: ‘1234’}},
 framework	фреймворк для тесто. возможные варианты: jasmine, cucumber, mocha	jasmine
 onCleanUp	колбэк, когда тесты завершены	function(){}

*/