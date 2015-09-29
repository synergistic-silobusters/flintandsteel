/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global spyOn */

describe('LoginViewCtrl', function() {
    "use strict";

    var scope, ctrl, $state, $stateParams, $mdToast, loginSvcMock;

    beforeEach(module('flintAndSteel'));
    beforeEach(module('ui.router'));

    beforeEach(inject(function($rootScope, $controller, _$state_, _$stateParams_, _$mdToast_, _loginSvcMock_) {
        scope = $rootScope.$new();
        $state = _$state_;
        $stateParams = _$stateParams_;
        $mdToast = _$mdToast_;
        loginSvcMock = _loginSvcMock_;

        $stateParams.retState = '';

        spyOn($state, 'go');
        spyOn($mdToast, 'show');

        ctrl = $controller('LoginViewCtrl', {
            $scope: scope,
            $state: $state,
            $stateParams: $stateParams,
            $mdToast: $mdToast,
            loginSvc: loginSvcMock
        });
    }));

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });

    describe('$scope.loginUser', function() {

        it('should log in a user with valid credentials', function() {
            spyOn(loginSvcMock, 'checkLogin').and.callFake(function(account, successCb) {
                successCb({
                    status: 'AUTH_OK',
                    name: account.name
                });
            });

            $state.current.name = 'home';

            scope.loginUser({ name: 'Guybrush Threepwood' });

            expect($mdToast.show).toHaveBeenCalled();
            expect($state.go).toHaveBeenCalledWith('home');
        });

        it('should deny logon for a user with incorrect credentials', function() {
            spyOn(loginSvcMock, 'checkLogin').and.callFake(function(account, successCb) {
                successCb({
                    status: 'AUTH_ERROR'
                });
            });

            scope.loginUser({ name: 'Guybrush Threepwood' });

            expect($mdToast.show).toHaveBeenCalled();
            expect($state.go).not.toHaveBeenCalled();
        });

        it('should deny logon for an unregistered user', function() {
            spyOn(loginSvcMock, 'checkLogin').and.callFake(function(account, successCb) {
                successCb({
                    status: 'USER_NOT_FOUND'
                });
            });

            scope.loginUser({ name: 'Guybrush Threepwood' });

            expect($mdToast.show).toHaveBeenCalled();
            expect($state.go).not.toHaveBeenCalled();
        });
    });

    describe('$scope.signUpUser', function() {

        it('should navigate to the signup view', function() {
            scope.signUpUser({ name: 'Guybrush Threepwood' });

            expect($state.go).toHaveBeenCalled();
        });
    });
});
