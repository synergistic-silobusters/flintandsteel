/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global spyOn */
/* global angular */

describe('WhirlCtrl', function() {
    "use strict";

    var scope, ctrl, compile, $document, $state, userSvc;

    beforeEach(module('flintAndSteel'));

    beforeEach(
        inject(function($rootScope, $controller, $compile, _$document_, _$state_, _userSvc_) {
            scope = $rootScope.$new();
            compile = $compile;
            $document = _$document_;
            $state = _$state_;
            userSvc = _userSvc_;

            spyOn($state, 'go');
            spyOn(userSvc, 'isUserLoggedIn').and.callFake(function() {
                return true;
            });

            ctrl = $controller('WhirlCtrl', {
                $scope: scope
            });
        })
    );

    // Add dummy html
    $document = angular.element(document);
    $document.find('body').append('<div class="whirligig-container">' +
      '<ol><li>Thing</li><li>Another Thing</li> ' +
      '<li>Last Thing</li></ol></div>');

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });

    describe('$scope.load', function() {
        it('should call $scope.control()', function() {
            spyOn(scope, 'control').and.callFake(function() {});
            scope.load();
            expect(scope.control).toHaveBeenCalled();
        });
    });

    describe('$scope.increment', function() {
        it('should call $scope.navigate()', function() {
            spyOn(scope, 'navigate').and.callFake(function() {});
            scope.increment();
            expect(scope.navigate).toHaveBeenCalled();
        });
    });

    describe('$scope.control', function() {
        it('should configure slides', function() {
            scope.control();
            expect(ctrl.current).not.toBe(null);
        });
    });

    describe('$scope.navigate', function() {
        it('should move forward one slide', function() {
            // setup
            scope.control();

            // navigate forward
            scope.navigate(1);
            expect(ctrl.counter).toBe(0);
        });

        it('should move backward one slide', function() {
            // setup
            scope.control();
            ctrl.counter = 0;

            // navigate backward
            scope.navigate(-1);
            expect(ctrl.counter).toBe(2);
        });

        it('should not move', function() {
            // setup
            scope.control();
            ctrl.counter = 0;

            // navigate backward
            scope.navigate(0);
            expect(ctrl.counter).toBe(0);
        });
    });

    describe('$scope.gotoAccount', function() {
        it('should go to account when logged in', function() {
            scope.gotoAccount();
            expect($state.go).toHaveBeenCalledWith('account');
        });
    });
});
