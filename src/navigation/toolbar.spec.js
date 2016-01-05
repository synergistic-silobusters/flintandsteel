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

    var authorAccount = {
        id: 1,
        username: 'MainManDarth',
        name: 'Darth Vader'
    };

    var nonAuthorAccount = {
        id: 2,
        username: 'SonOfDarth',
        name: 'Luke Skywalker'
    };

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

    describe('$scope.displayOverflow', function() {
        it('should return false', function() {
            expect(scope.displayOverflow).toBe(false);
        });
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

    describe('$scope.stateIsHome', function() {
        var stateHome;

        it('should return true if state is at home', function() {
            spyOn($state, 'is').and.callFake(function() {
                return true;
            });

            stateHome = scope.stateIsHome();
            expect(stateHome).toBe(true);
        });

        it('should return false if state is not at home', function() {
            spyOn($state, 'is').and.callFake(function() {
                return false;
            });

            stateHome = scope.stateIsHome();
            expect(stateHome).toBe(false);
        });
    });

    describe('$scope.isUserLoggedIn', function() {
        var userLogged;

        it('checks with real login', function() {
            loginSvcMock.checkLogin(authorAccount);
            userLogged = scope.isUserLoggedIn();

            expect(userLogged).toBe(true);
        });

        it('checks with bad login', function() {
            loginSvcMock.checkLogin(nonAuthorAccount);
            userLogged = scope.isUserLoggedIn();

            expect(userLogged).toBe(false);
        });
    });

    describe('$scope.getUsername()', function() {
        var username;

        it('should get the username if user is logged in', function() {
            loginSvcMock.checkLogin(authorAccount);
            username = scope.getUsername();
            expect(username).toBe('MainManDarth');
        });

        it('should not get the username if user is logged out', function() {
            loginSvcMock.logout();
            expect(loginSvcMock.isUserLoggedIn()).toBe(false);
            username = scope.getUsername();
            expect(username).toBe(null);

        });
    });

    describe('$scope.showLogin', function() {
        beforeEach(function() {
            spyOn($mdDialog, 'show').and.callThrough();
        });

        it('should show a dialog window when called', function() {
            scope.showLogin();
            expect($mdDialog.show).toHaveBeenCalled();
        });
    });

    describe('$scope.loginUser', function() {
        beforeEach(function() {
            spyOn(toastSvc, 'show').and.callThrough();
        });

        it('should toast successful login', function() {
            spyOn(loginSvcMock, 'checkLogin').and.callFake(function checkLogin(account, successCb) {
                successCb({status: 'AUTH_OK', name: authorAccount.name});
            });

            scope.loginUser(authorAccount);
            expect(loginSvcMock.checkLogin).toHaveBeenCalled();
            expect(toastSvc.show).toHaveBeenCalled();
        });

        it('should toast authentication error', function() {
            spyOn(loginSvcMock, 'checkLogin').and.callFake(function checkLogin(account, successCb) {
                successCb({status: 'AUTH_ERROR', name: authorAccount.name});
            });

            scope.loginUser(authorAccount);
            expect(loginSvcMock.checkLogin).toHaveBeenCalled();
            expect(toastSvc.show).toHaveBeenCalled();
        });

        it('should toast user not found', function() {
            spyOn(loginSvcMock, 'checkLogin').and.callFake(function checkLogin(account, successCb) {
                successCb({status: 'USER_NOT_FOUND', name: authorAccount.name});
            });

            scope.loginUser(authorAccount);
            expect(loginSvcMock.checkLogin).toHaveBeenCalled();
            expect(toastSvc.show).toHaveBeenCalled();
        });

        it('should console log for error', function() {
            spyOn(loginSvcMock, 'checkLogin').and.callFake(function checkLogin(account, successCb, errorCb) {
                errorCb('NOPE');
            });
            spyOn(console, 'log').and.callThrough();

            scope.loginUser(authorAccount);
            expect(loginSvcMock.checkLogin).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalled();
        });
    });

    describe('$scope.logout', function() {
        beforeEach(function() {
            spyOn($state, 'go').and.callThrough();
            spyOn($state, 'reload').and.callFake(function() {
                return;
            });
            spyOn(loginSvcMock, 'logout').and.callThrough();
        });

        it('should logout user', function() {
            scope.logout();
            expect(loginSvcMock.logout).toHaveBeenCalled();
        });

        it('should reload if in idea', function() {
            spyOn($state, 'includes').and.callFake(function() {
                return true;
            });
            $state.go('idea');

            scope.logout();
            expect($state.reload).toHaveBeenCalled();
        });

        it('should go home if in add idea', function() {
            spyOn($state, 'includes').and.callFake(function(data) {
                if (data === 'addidea') {
                    return true;
                }
                else {
                    return false;
                }
            });

            scope.logout();
            expect($state.go).toHaveBeenCalledWith('home');
        });
    });

    describe('$scope.settings', function() {
        beforeEach(function() {
            spyOn($state, 'go').and.callThrough();
        });

        it('should go to account', function() {
            scope.settings();
        });
    });
});
