/**
 * Created by ozknemoy on 03.12.2016.
 */
var AngularHomepage = function() {
    var nameInput = element(by.model('yourName'));
    var greeting = element(by.binding('yourName'));

    this.get = function() {
        browser.get('http://www.angularjs.org');
    };

    this.setName = function(name) {
        nameInput.sendKeys(name);
    };

    this.getGreeting = function() {
        return greeting.getText();
    };
};

describe('angularjs homepage', function() {
    it('should greet the named user', function() {
        browser.get('http://www.angularjs.org');
        element(by.model('yourName')).sendKeys('Julie');
        var greeting = element(by.binding('yourName'));
        expect(greeting.getText()).toEqual('Hello Julie!');
    });
});

describe('angularjs homepage', function() {
    it('should greet the named user', function() {
        var angularHomepage = new AngularHomepage();
        angularHomepage.get();

        angularHomepage.setName('Julie');

        expect(angularHomepage.getGreeting()).toEqual('Hello Julie!');
    });
});