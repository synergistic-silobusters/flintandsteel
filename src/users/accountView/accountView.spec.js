/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global spyOn */

describe('AccountViewCtrl', function() {
    "use strict";

    var scope, ctrl, $state, $mdToast, loginSvcMock;

    beforeEach(module('flintAndSteel'));
    beforeEach(module('ui.router'));

    beforeEach(inject(function($rootScope, $controller, _$state_, _$mdToast_, _loginSvcMock_) {
        scope = $rootScope.$new();
        $state = _$state_;
        $mdToast = _$mdToast_;
        loginSvcMock = _loginSvcMock_;

        spyOn($state, 'go');
        spyOn(loginSvcMock, 'isUserLoggedIn').and.callFake(function() {
            return false;
        });

        ctrl = $controller('AccountViewCtrl', {
            $scope: scope,
            $state: $state,
            $mdToast: $mdToast,
            loginSvc: loginSvcMock
        });
    }));

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });

    it('should navigate to home if no user is logged in', function() {
        expect($state.go).toHaveBeenCalledWith('home');
    });

    describe('$scope.logout', function() {
        
        beforeEach(function() {
            spyOn(loginSvcMock, 'logout').and.callFake(function() { });
            spyOn($mdToast, 'show');
        });

        it('should log out the user', function() {
            scope.logout();

            expect(loginSvcMock.logout).toHaveBeenCalled();
            expect($mdToast.show).toHaveBeenCalled();
            expect($state.go).toHaveBeenCalledWith('home');
        });
    });
});