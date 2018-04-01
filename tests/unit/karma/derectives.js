/**
 * Created by ozknemoy on 30.12.2016.
 */
var app = angular.module('myApp', []);


app.directive('aGreatEye', function () {
    return {
        restrict: 'E',
        replace: true,

        template: '<h1>lidless, wreathed in flame, {{2 + 0}} times</h1>'
    };
});

describe('Unit testing great quotes', function() {
    var $compile,
        $rootScope;

    // Load the myApp module, which contains the directive
    beforeEach(module('myApp'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('Replaces the element with the appropriate content', function() {
        // Compile a piece of HTML containing the directive
        var element = $compile("<a-great-eye></a-great-eye>")($rootScope);
        
        // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
        $rootScope.$digest();
        //console.log(element);
        // Check that the compiled element contains the templated content
        expect(element.html()).toContain("lidless, wreathed in flame, 2 times");
    });
});

angular.module('_app', [])
    .controller('PasswordController', function PasswordController($scope) {
        $scope.password = '';
        $scope.grade = function() {
            var size = $scope.password.length;
            if (size > 8) {
                $scope.strength = 'strong';
            } else if (size > 3) {
                $scope.strength = 'medium';
            } else {
                $scope.strength = 'weak';
            }
        };
    });

describe('PasswordController', function() {
    beforeEach(module('_app'));

    var $controller;

    beforeEach(inject(function(_$controller_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    describe('$scope.grade', function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller('PasswordController', { $scope: $scope });
        });

        it('sets the strength to "strong" if the password length is >8 chars', function() {
            $scope.password = 'longerthaneightchars';
            $scope.grade();
            expect($scope.strength).toEqual('strong');
        });

        it('sets the strength to "weak" if the password length <3 chars', function() {
            $scope.password = 'a';
            $scope.grade();
            expect($scope.strength).toEqual('weak');
        });
    });
});
//const emailToUserComponent = require('./_common/directives/email-to-user/email-to-user.component');
angular.module('_a', [])
    .controller('_PasswordController', function PasswordController($scope) {
        $scope.password = '';
        $scope.grade = function() {
            var size = $scope.password.length;
            if (size > 8) {
                $scope.strength = 'strong';
            } else if (size > 3) {
                $scope.strength = 'medium';
            } else {
                $scope.strength = 'weak';
            }
        };
        this.ret = 'ret';
    });

xdescribe('_PasswordController', function() {
    beforeEach(module('_a','dev/app/_common/directives/email-to-user/email-to-user.html'));

    var $controller,scope,_this,template;

    beforeEach(inject(function($templateCache,_$compile_,_$rootScope_,_$controller_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        scope = _$rootScope_.$new();
        _this = $controller('_PasswordController', { $scope: scope });
        template = $templateCache.get('dev/app/_common/directives/email-to-user/email-to-user.html');
        $templateCache.put('email-to-user.html',template);
        console.log(template);
        
    }));

    describe('$scope.grade', function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = {};
            controller = $controller('_PasswordController', { $scope: $scope });
        });

        it('sets the strength to "strong" if the password length is >8 chars', function() {
            $scope.password = 'longerthaneightchars';
            $scope.grade();
            expect($scope.strength).toEqual('strong');
        });

    });

    afterEach(function() {
        scope.$destroy();
    });
});

const regLightComponent = {
    templateUrl: 'email-to-user.html',
    controller: regLightController,
    controllerAs: 'rl',
    bindings: {callback:'&'}
};

function regLightController($http) {

    this.myTitle = 'это я пробросил в контроллере';
    this.check = () => {
        if (this.email != this.emailTwo && this.form.emailTwo.$touched && this.form.email.$touched) {
            this.emailNotEqual = 1;
            this.allOk = 0;
            this.callback({email:null})
        } else if(this.email == this.emailTwo && this.form.$valid){
            this.emailNotEqual = 0;
            this.allOk = 1;
            this.callback({email:this.email})
        }
    }
}

angular.module('__a', [])
    .component('regLight', regLightComponent);

describe('reg-light', function() {
    beforeEach(module('__a','dev/app/_common/directives/registration-light/_reg-light.html'));

    var _this,template,$rootScope,$compile,$componentController,ctrl;

    beforeEach(inject(function($templateCache,_$compile_,_$rootScope_,_$componentController_){
        // либо инстанс создать
        _this = _$rootScope_.$new();
        // либо рут (без разницы)
        $rootScope = _$rootScope_;

        // эт не понятно зачем но можно создать котроллер компонента
        // его нельзя пробросить в компилятор вьюшки
        $componentController = _$componentController_;
        // Here we are passing actual bindings to the component
        var bindings = {myTitle: 'Wolverine'};
        ctrl = $componentController('regLight', null, bindings);
        // тут не инжектятся во вью, только из контроллера берутся даннные:
        Object.assign(_this,bindings);
        Object.assign($rootScope,bindings);

        $compile = _$compile_;
        //_this = $controller('_PasswordController', { $scope: scope });
        // тут $templateCache создаю для templateUrl: email-to-user.html
        template = $templateCache.get('dev/app/_common/directives/registration-light/_reg-light.html');
        $templateCache.put('email-to-user.html',template);
    }));

    it("проброс в контроллере ", function() {
        // компилирую
        var tmpl = $compile('<reg-light callback="ret()"></reg-light>')(_this);
        // и обновляю
        _this.$apply();
        expect(tmpl.html()).toContain("это я пробросил в контроллере");
    })
});