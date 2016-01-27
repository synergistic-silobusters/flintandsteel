/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global spyOn */

describe('ToolbarCtrl', function() {
    "use strict";

    var scope, ctrl, $state, $stateParams, $mdSidenav, userSvcMock, $mdDialog, toastSvc, $q;

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

    beforeEach(inject(function($rootScope, _$q_, $controller, _$state_, _$stateParams_, _$mdSidenav_, _userSvcMock_, _$mdDialog_, _toastSvc_) {
        scope = $rootScope.$new();
        $q = _$q_;
        $state = _$state_;
        $stateParams = _$stateParams_;
        $mdSidenav = _$mdSidenav_;
        userSvcMock = _userSvcMock_;
        $mdDialog = _$mdDialog_;
        toastSvc = _toastSvc_;

        ctrl = $controller('ToolbarCtrl', {
            $scope: scope,
            $state: $state,
            $stateParams: $stateParams,
            userSvc: userSvcMock,
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
            spyOn(userSvcMock, 'isUserLoggedIn').and.callFake(function() {
                return false;
            });

            scope.accountClick();

            expect(userSvcMock.isUserLoggedIn).toHaveBeenCalled();
            expect($state.go).toHaveBeenCalledWith('home');
        });

        it('should navigate to account if user is logged in', function() {
            spyOn(userSvcMock, 'isUserLoggedIn').and.callFake(function() {
                return true;
            });

            scope.accountClick();

            expect(userSvcMock.isUserLoggedIn).toHaveBeenCalled();
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
            userSvcMock.checkLogin(authorAccount);
            userLogged = scope.isUserLoggedIn();

            expect(userLogged).toBe(true);
        });

        it('checks with bad login', function() {
            userSvcMock.checkLogin(nonAuthorAccount);
            userLogged = scope.isUserLoggedIn();

            expect(userLogged).toBe(false);
        });
    });

    describe('$scope.getUsername()', function() {
        var username;

        it('should get the username if user is logged in', function() {
            userSvcMock.checkLogin(authorAccount);
            username = scope.getUsername();
            expect(username).toBe('MainManDarth');
        });

        it('should not get the username if user is logged out', function() {
            userSvcMock.logout();
            expect(userSvcMock.isUserLoggedIn()).toBe(false);
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
        var account;

        beforeEach(function() {
            spyOn(toastSvc, 'show').and.callThrough();
        });

        it('should toast successful login', function() {
            spyOn(userSvcMock, 'checkLogin').and.callThrough();

            userSvcMock.switchLogin(1);
            scope.loginUser(authorAccount);
            userSvcMock.checkLogin(authorAccount).then(function() {
                expect(toastSvc.show).toHaveBeenCalled();
            });
            scope.$digest();
        });

        it('should toast authentication error', function() {
            account = {
                _id: 10,
                username: 'LostInJakku',
                name: 'BB8'
            };

            spyOn(userSvcMock, 'checkLogin').and.callThrough();

            userSvcMock.switchLogin(2);
            scope.loginUser(account);
            userSvcMock.checkLogin(authorAccount).then(function() {
                expect(toastSvc.show).toHaveBeenCalled();
            });
            scope.$digest();
        });

        it('should toast user not found', function() {
            account = {
                _id: 10,
                username: 'LostInJakku',
                name: 'BB8'
            };

            spyOn(userSvcMock, 'checkLogin').and.callThrough();

            userSvcMock.switchLogin(1);
            scope.loginUser(account);
            userSvcMock.checkLogin(authorAccount).then(function() {
                expect(toastSvc.show).toHaveBeenCalled();
            });
            scope.$digest();
        });

        /*I'm not sure this is working properly*/
        it('should console log for error', function() {
            //setup
            account = {
                _id: 10,
                username: 'LostInJakku',
                name: 'BB8'
            };
            spyOn(userSvcMock, 'checkLogin').and.callFake(function() {
                return $q.reject();
            });
            spyOn(console, 'log').and.callFake(function() {});

            //function call
            scope.loginUser(account);
            scope.$digest();
            //looking for console.log
            expect(userSvcMock.checkLogin).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalled();
        });
    });

    describe('$scope.logout', function() {
        beforeEach(function() {
            spyOn($state, 'go').and.callThrough();
            spyOn($state, 'reload').and.callFake(function() {
                return;
            });
            spyOn(userSvcMock, 'logout').and.callThrough();
        });

        it('should logout user', function() {
            scope.logout();
            expect(userSvcMock.logout).toHaveBeenCalled();
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
