/**
 * Created by ozknemoy on 20.10.2016.
 */
const JasmineConsoleReporter = require('jasmine-console-reporter');
const fs = require('fs');
exports.userName = 'ozk.nemoy@mail.ru';
exports.userNameG = 'ozk.nemoy@gmail.com';
exports.password = '15646qQ';
exports.baseUrl = 'http://localhost:8000/';//http://constart.ru/
exports.local_url = 'project/84//fin';
exports.local_url_reward = 'project/84//reward/91';
exports.consoleReporter = new JasmineConsoleReporter({
    colors: 1,           // (0|false)|(1|true)|2
    cleanStack: 0,       // (0|false)|(1|true)|2|3
    verbosity: 1,        // (0|false)|1|2|(3|true)|4
    listStyle: 'indent', // "flat"|"indent"
    activity: false
});

//http://jasmine.github.io/2.3/custom_reporter.html
exports.standartReporter = new function() {
    // после каждого теста
    this.specDone = function(result) {
        if (result.failedExpectations.length > 0) {
            browser.takeScreenshot().then(function (png) {
                writeScreenShot(png, `tests/img/${result.description+Date.now()}.png`);
            });
        } else {
            //consoleLog()
        }
    };
};

function consoleLog() {
    browser.manage().logs().get('browser').then(d=> {
        expect(d.length).toEqual(0)
    })
}

function writeScreenShot(data, filename) {
    var stream = fs.createWriteStream(filename);
    stream.write(new Buffer(data, 'base64'));
    stream.end();
}