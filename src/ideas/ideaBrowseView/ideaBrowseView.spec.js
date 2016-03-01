/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */

describe('IdeaBrowseViewCtrl', function() {
    "use strict";

    var ctrl, scope, ideaSvcMock, sseSvcMock, $state;

    beforeEach(module('flintAndSteel'));
    beforeEach(module('ui.router'));
    // needed because $state takes us to home by default
    beforeEach(module('homeView/homeView.tpl.html'));

    beforeEach(inject(function($rootScope, $controller, _ideaSvcMock_, _sseSvcMock_, _$state_) {
        scope = $rootScope.$new();
        ideaSvcMock = _ideaSvcMock_;
        sseSvcMock = _sseSvcMock_;
        $state = _$state_;

        ctrl = $controller('IdeaBrowseViewCtrl', {
            $scope: scope,
            ideaSvc: ideaSvcMock,
            sseSvc: sseSvcMock
        });
    }));

    beforeEach(function() {
        scope.$digest();
    });

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });

    describe('receiving a server-sent event', function() {

        it('should set $scope.topIdeas to data from event', function() {
            expect(scope.topIdeas).not.toBe(null);
            sseSvcMock.simulate(null);
            expect(scope.topIdeas).toBe(null);
        });
    });

    describe('leaving the page', function() {
        it('should destroy the server-sent event listener', function() {
            expect(sseSvcMock.isActive()).toBe(true);
            $state.go('home');
            expect(sseSvcMock.isActive()).toBe(false);
        });
    });
});
