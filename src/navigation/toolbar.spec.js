/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global spyOn */

describe('ToolbarCtrl', function() {
    "use strict";

    var scope, ctrl, $state, $stateParams, $mdSidenav, loginSvcMock, $mdDialog, toastSvc;

    beforeEach(module('flintAndSteel'));
    beforeEach(module('ui.router'));

    beforeEach(inject(function($rootScope, $controller, _$state_, _$stateParams_, _$mdSidenav_, _loginSvcMock_, _$mdDialog_, _toastSvc_) {
        scope = $rootScope.$new();
        $state = _$state_;
        $stateParams = _$stateParams_;
        $mdSidenav = _$mdSidenav_;
        loginSvcMock = _loginSvcMock_;
        $mdDialog = _$mdDialog_;
        toastSvc = _toastSvc_;

        ctrl = $controller('ToolbarCtrl', {
            $scope: scope,
            $state: $state,
            $stateParams: $stateParams,
            $mdSidenav: $mdSidenav,
            loginSvc: loginSvcMock,
            $mdDialog: $mdDialog,
            toastSvc: toastSvc
        });
    }));

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });

    describe('$scope.accountClick', function() {

        beforeEach(function() {
            spyOn($state, 'go');
        });

        it('should navigate to login if no user is logged in', function() {
            spyOn(loginSvcMock, 'isUserLoggedIn').and.callFake(function() {
                return false;
            });

            scope.accountClick();

            expect(loginSvcMock.isUserLoggedIn).toHaveBeenCalled();
            expect($state.go).toHaveBeenCalledWith('home');
        });

        it('should navigate to account if user is logged in', function() {
            spyOn(loginSvcMock, 'isUserLoggedIn').and.callFake(function() {
                return true;
            });

            scope.accountClick();

            expect(loginSvcMock.isUserLoggedIn).toHaveBeenCalled();
            expect($state.go).toHaveBeenCalledWith('account');
        });
    });
});
