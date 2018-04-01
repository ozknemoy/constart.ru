/**
 * Created by ozknemoy on 20.10.2016.
 */
{
    const vars = require('./vars');
    var path = require('path');
    var helpers = require('protractor-helpers');

    const EC = protractor.ExpectedConditions;

    jasmine.getEnv().addReporter(vars.standartReporter);
    /*xdescribe('angularjs homepage', function () {
        it('should greet the named user', function () {
            browser.get('http://www.angularjs.org');
            element(by.model('yourName')).sendKeys('Julie');
            var greeting = element(by.binding('yourame'));
            expect(greeting.getText()).toEqual('Hello Julie!');
        });
        xit('todo', function () {
            browser.get(vars.baseUrl + 'users');

            element(by.css('.btn.btn-success.btn-block')).click();

            /!* var todoList = element.all(by.repeater('todo in todoList.todos'));
             expect(todoList.count()).toEqual(3);
             expect(todoList.get(2).getText()).toEqual('write first protractor test');

             // You wrote your first test, cross it off the list
             todoList.get(2).element(by.css('input')).click();
             var completedAmount = element.all(by.css('.done-true'));
             expect (completedAmount.count()).toEqual(2);*!/
        });
    });*/

    xdescribe('common test', ()=> {

        xit('reg valid', function() {
            browser.get(vars.baseUrl+'user' );
            let regButton = element(by.dataHook('reg')),
                reg_email = $('#register_email');


            $('.nav_profile a.btn').click();
            regButton.click();
            //console.log(element(by.model('lg.register_email')).getText());
            reg_email.sendKeys('ozk.nemoy@mail.ru',protractor.Key.TAB);
            //console.log(element(by.model('lg.register_email')).getText());
            //expect(element(by.binding('emailBlured')).getText()).toBe(1);
            //expect(element(by.model('lg.register_email')).getText()).toBe('');


            //element(by.css('#login-form button')).click();
           /* expect(browser.getCurrentUrl()).toBe(vars.baseUrl + 'user/45/about');
            $('.btn-danger').click();
            expect(browser.getCurrentUrl()).toBe(vars.baseUrl + 'userEditor/45/about');
            browser.manage().logs().get('browser').then(d=> {
                expect(d.length).toEqual(0)
            })*/


        });

        it('логин и просмотр своего профиля', function() {

            var fileToUpload = 'test.png',
                absolutePath = path.resolve(__dirname,fileToUpload);// or __dirname==process.cwd()
            //expect(element(by.binding('home.videoOpened'))).toBe(undefined);

            browser.get(vars.baseUrl );
            $('login-button').click();
            //console.log($('.login-modal li:last-child'));
            $('#login_username').sendKeys(vars.userName);
            $('#login_password').sendKeys(vars.password,protractor.Key.ENTER);
            //element(by.css('#login-form button')).click();

            //helpers.not(helpers.not($('.btn_menu--img').isDisplayed()));
            browser.isElementPresent($('.btn_menu--img'));
            browser.isElementPresent($('login-button'));
            //expect(browser.getCurrentUrl()).toBe(vars.baseUrl + 'user/45/about');
            //$('.btn-danger').click();
            //expect(browser.getCurrentUrl()).toBe(vars.baseUrl + 'userEditor/45/about');

            //element(by.css('.fa-camera')).click().sendKeys(vars.baseUrl,protractor.Key.ESCAPE);
            //element(by.css('.profile--image--edit')).click();
            // Find the file input element
            browser.manage().logs().get('browser').then(d=> {
                expect(d.length).toEqual(4)
            })
            //expect(helpers.getFilteredConsoleErrors().length).toBe(0);

            //var fileElem = element(by.css('.fotoeditor input[type="file"]'));
            //fileElem.sendKeys(absolutePath);
            //expect(browser.isElementPresent(by.css('.fotoeditor canvas'))).toBe(true);


        });

    });
    xdescribe('home', function () {
        beforeEach(function () {
            browser.get(vars.baseUrl);
        });
        it('есть 8 направлений', function () {
            $('.ui-select-placeholder.text-muted').click();
            expect(element.all(by.repeater('o in $select.items')).count()).toBe(8);
            $('.ui-select-bootstrap .ui-select-choices-row.active>a').click();
            $('.input-group-btn').click();
            expect(browser.getCurrentUrl()).toBe(vars.baseUrl + 'projects?category=130');
        });
        it('есть проекты', function () {
            expect(browser.isElementPresent(by.css('.elem_list--item--wrap'))).toBe(true);
            expect(browser.isElementPresent(by.css('.elem_list--descr--footer'))).toBe(true);
        });
        it('есть видео', function () {
            expect(browser.isElementPresent(by.css('video'))).toBe(true);
        });

    });
    xdescribe('home мобилка', function () {
        beforeEach(function () {
            helpers.maximizeWindow(500, 500);
            browser.get(vars.baseUrl);
        });
        //var treeProj = element.all(by.repeater('i in cpd.value track by i.id'));
        var masonry = element.all(by.repeater('m in home.masonry'));

        it('masonry 8',function () {
            expect(masonry.count()).toEqual(8);
        });

        it('нет видео на мобиле', function () {
            expect(browser.isElementPresent(by.css('video'))).toBe(false);
        });

    });


}

/*
 browser.manage().logs()
 .get('browser').then(function(browserLog) {
 console.log('log: ' +
 require('util').inspect(browserLog));
 });

browser.get(targetUrl) – переход на указанный URL
 element(by.css(‘.error’)) – выбор элемента по css
 element(by.model(‘emailTwo’)) – выбор элемента по модели
 element(by.binding(‘variableName’)) – выбор элемента по баиндингу (ng-bind или {{variableName}})
 element.all(by.repeater(‘item in items’)); – выбор списка элементов из ngRepeat
 element(by.model(‘modelName’)).getText() – получение текстового значения
 element(by.model(‘modelName’)).getAttribute(‘id’) – получение значение аттрибута
 element(by.model(‘modelName’)).sendKeys(‘Some text’) – задание значения
 element.all(by.repeater(‘item in items’)).count() – получение количества элементов в списке
 element.all(by.repeater(‘item in items’)).get(1) – получение одного элемента из списка
 element.all(by.repeater(‘item in items’)).first() – получение первого элемента из списка
 element.all(by.repeater(‘item in items’)).last() – получение последнего элемента из списка
 element.all(by.repeater(‘item in items’)).row(1).column(‘title’) – получение значение title из 2й строки
 browser.isElementPresent(by.model(‘modelName’)) – проверка наличия элемента
 $(‘.info’) – короткий алиас к element(by.css(‘.info’))   !Внимание: не путать с jQuery.
 $$(‘option’) – короткий алиас к element.all(by.css(‘option’))


 Helpers

 not - Returns the negative value of a Promise.
 helpers.not($('.some-element').isDisplayed());
 translate - Returns the translated key with translation values.
 expect($('.some-element').getText()).toEqual(helpers.translate('SOME_TRANSLATION_KEY'));
 safeGet - Navigates to a URL, maximizing the window and resetting the mouse position.
 helpers.safeGet('./SomeUrl');
 maximizeWindow - Maximizes the window to a given size or a default size.
 helpers.maximizeWindow(500, 500);
 resetPosition - Resets the mouse position.
 helpers.resetPosition();
 displayHover - Displays an element that appears only on hover state.
 helpers.displayHover($('.some-element'));
 waitForElement - Waits for an element to be shown.
 helpers.waitForElement($('.some-element'), timeout);
 waitForElementToDisappear - Waits for an element not to be shown.
 helpers.waitForElementToDisappear($('.some-element'), timeout);

 selectOptionByText - Selects an element from a selection box.
 helpers.selectOptionByText($('select'), 'options-to-select');
 selectOptionByIndex - Selects an element from a selection box.
 helpers.selectOptionByIndex($('select'), 0);
 selectOption - Selects a given option.
 helpers.selectOption($$('select option').first());

 createMessage - Creates a matchers message with {{locator}}, {{not}}, and {{actual}} as placeholders.
 helpers.createMessage(this, 'Expected {{locator}}{{not}}to have image') + '.');

 clearAndSetValue - Allows setting a new value to an input field .
 helpers.clearAndSetValue(inputField, 'text to populate');
 getFilteredConsoleErrors - Returns console error messages resulting from the test run.
 Ignores livereload error (since it is not loaded in CI mode), messages with warn and below severity, and a known Firefox bug (https://bugzilla.mozilla.org/show_bug.cgi?id=1127577).
 Can be used to validate that there are no console errors.
 expect(helpers.getFilteredConsoleErrors().length).toBe(0);
 hasClass - Checks whether an element has a class.
 helpers.hasClass(element, 'class-name');

 example (choosing a date from a calendar):
 $$('.calendar').getByText('27').click();
 element(by.dataHook('first')).click() - click on the first data hook

 Matchers
 toBePresent - Checks whether an element is present (exists in the DOM).
 expect($('.some-element')).toBePresent();
 toBeDisplayed - Checks whether an element is displayed (visible in the DOM).
 expect($('.some-element')).toBeDisplayed();
 toHaveText - Checks whether an element contains text.
 expect($('.some-element')).toHaveText(expectedText);
 toMatchRegex - Checks whether an element's text fits a regex.
 expect($('.some-element')).toMatchRegex(expectedPattern);
 toHaveValue - Checks whether an element's value attribute fits the expectedValue.
 expect($('.some-element')).toHaveValue(expectedValue);
 toHaveClass - Checks whether an element has a specific class name.
 expect($('.some-element')).toHaveClass(className);
 toBeDisabled - Checks whether an element is disabled.
 expect($('.some-element')).toBeDisabled();
 toBeChecked - Checks whether an element checkbox is checked.
 expect($('.some-element')).toBeChecked();
 toBeValid - Checks whether a form element is valid (using the ng-valid class name).
 expect($('.some-element')).toBeValid();
 toBeInvalid - Checks whether a form element is invalid (using the ng-invalid class name).
 expect($('.some-element')).toBeInvalid();
 toBeInvalidRequired - Checks whether a form element is invalid and required (using the ng-invalid-required class name).
 expect($('.some-element')).toBeInvalidRequired();
 toMatchTranslated - Checks whether an element contains a translation value.
 expect($('.some-element')).toMatchTranslated(key, values);

 */