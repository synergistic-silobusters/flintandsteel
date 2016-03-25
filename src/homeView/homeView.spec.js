/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global spyOn */

describe('HomeViewCtrl', function() {
    "use strict";

    var $rootScope, scope, ctrl, $controller, $state, ideaSvcMock, mockWindow, sseSvcMock;

    beforeEach(module('flintAndSteel'));
    beforeEach(module('ui.router'));
    beforeEach(module('homeView/homeView.tpl.html'));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$state_, _ideaSvcMock_, _sseSvcMock_) {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $controller = _$controller_;
        $state = _$state_;
        ideaSvcMock = _ideaSvcMock_;
        sseSvcMock = _sseSvcMock_;

        mockWindow = { navigator: { } };
    }));

    function createController() {
        return $controller('HomeViewCtrl', {
            $scope: scope,
            $state: $state,
            ideaSvc: ideaSvcMock,
            $window: mockWindow,
            sseSvc: sseSvcMock
        });
    }

    beforeEach(function() {
        scope.$digest();
    });

    it('should exist', function() {
        ctrl = createController();
        expect(ctrl).toBeDefined();
    });

    describe('$scope.browserVersion', function() {

        it('detects IE 11', function() {
            mockWindow.navigator = {
                userAgent: 'MSIE 11.0',
                appName: 'Microsoft Internet Explorer'
            };
            ctrl = createController();
            expect(scope.browserVersion).toBe(11);
        });

        it('detects unknown IE version', function() {
            mockWindow.navigator = {
                userAgent: '',
                appName: 'Microsoft Internet Explorer'
            };
            ctrl = createController();
            expect(scope.browserVersion).toBe(-1);
        });

        it('detects trident v 1.0', function() {
            mockWindow.navigator = {
                userAgent: 'Trident rv:1.0',
                appName: 'Netscape'
            };
            ctrl = createController();
            expect(scope.browserVersion).toBe(-1);
        });

    });

    describe('navToBrowse()', function() {
        beforeEach(function() {
            ctrl = createController();
            spyOn($state, 'go');
        });

        it('should go to ideabrowse state', function() {
            scope.navToBrowse();
            expect($state.go).toHaveBeenCalledWith('ideabrowse');
        });
    });

    describe('receiving a server-sent event', function() {
        beforeEach(function() {
            spyOn(scope, '$apply').and.callThrough();
            ctrl = createController();
        });

        it('should set $scope.topIdeas to data from event', function() {
            expect(scope.topIdeas).not.toBe(null);
            sseSvcMock.simulate(null);
            expect(scope.$apply).toHaveBeenCalled();
        });
    });

    describe('$scope.$on(newIdeaAdded)', function() {

        beforeEach(function() {
            spyOn(ideaSvcMock, 'getIdeaHeaders').and.callThrough();
            ctrl = createController();
        });

        it('should catch the newIdeaAdded event', function() {
            $rootScope.$emit('newIdeaAdded');

            expect(ideaSvcMock.getIdeaHeaders).toHaveBeenCalled();
            expect(scope.topIdeas).not.toBe(null);
        });
    });

});
