/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global spyOn */

describe('AccountViewCtrl', function() {
    "use strict";

    var rootScope, scope, ctrl, $state, toastSvc, userSvcMock, ideaSvcMock;

    beforeEach(module('flintAndSteel'));
    beforeEach(module('ui.router'));
    // needed because $state takes us to home by default
    beforeEach(module('homeView/homeView.tpl.html'));

    describe('visiting when not logged in', function() {
        beforeEach(inject(function($rootScope, $controller, _$state_, _toastSvc_, _userSvcMock_, _ideaSvcMock_) {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            $state = _$state_;
            toastSvc = _toastSvc_;
            userSvcMock = _userSvcMock_;
            ideaSvcMock = _ideaSvcMock_;

            spyOn($state, 'go');
            spyOn(userSvcMock, 'isUserLoggedIn').and.callFake(function() {
                return false;
            });

            ctrl = $controller('AccountViewCtrl', {
                $scope: scope,
                $state: $state,
                toastSvc: toastSvc,
                userSvc: userSvcMock,
                ideaSvc: ideaSvcMock
            });
        }));

        afterEach(function() {
            scope.$digest();
        });

        it('should exist', function() {
            expect(ctrl).toBeDefined();
        });

        it('should navigate to home if no user is logged in', function() {
            expect($state.go).toHaveBeenCalledWith('home');
        });
    });

    describe('visiting when logged in', function() {
        beforeEach(inject(function($rootScope, $controller, _$state_, _toastSvc_, _userSvcMock_, _ideaSvcMock_) {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            $state = _$state_;
            toastSvc = _toastSvc_;
            userSvcMock = _userSvcMock_;
            ideaSvcMock = _ideaSvcMock_;

            spyOn($state, 'go');
            spyOn(userSvcMock, 'isUserLoggedIn').and.callFake(function() {
                return true;
            });

            ctrl = $controller('AccountViewCtrl', {
                $scope: scope,
                $state: $state,
                toastSvc: toastSvc,
                userSvc: userSvcMock,
                ideaSvc: ideaSvcMock
            });

            scope.$digest();
        }));

        it('should exist', function() {
            expect(ctrl).toBeDefined();
        });

        it('should populate user ideas', function() {
            expect(scope.userIdeas.length).toBe(1);
        });

        it('should populate user backs', function() {
            expect(scope.userBacks.length).toBe(1);
        });

        it('should populate user teams', function() {
            expect(scope.userTeams.length).toBe(1);
        });
    });
});
