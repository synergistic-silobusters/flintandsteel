/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global spyOn */

describe('AddIdeaViewCtrl', function() {
    "use strict";

    var scope, rootScope, $q, ctrl, toastSvc, $state, ideaSvcMock, userSvcMock, eventSvcMock, $window;

    beforeEach(module('flintAndSteel'));
    beforeEach(module('ui.router'));
    // needed because $state takes us to home by default
    beforeEach(module('homeView/homeView.tpl.html'));

    beforeEach(inject(function($rootScope, _$q_, $controller, _toastSvc_, _$state_, _ideaSvcMock_, _userSvcMock_, _eventSvcMock_) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        $q = _$q_;
        toastSvc = _toastSvc_;
        $state = _$state_;
        ideaSvcMock = _ideaSvcMock_;
        userSvcMock = _userSvcMock_;
        eventSvcMock = _eventSvcMock_;

        $window = {
            ga: function() {} // Google Analytics
        };

        spyOn($state, 'go');

        ctrl = $controller('AddIdeaViewCtrl', {
            $scope: scope,
            $state: $state,
            toastSvc: toastSvc,
            ideaSvc: ideaSvcMock,
            userSvc: userSvcMock,
            eventSvc: eventSvcMock,
            $window: $window
        });

        scope.idea = {
            title: 'Test Title',
            eventId: 0,
            description: 'This is a test idea.',
            tags: ['TestTag1', 'TestTag2'],
            rolesreq: []
        };
    }));

    afterEach(function() {
        scope.$digest();
    });

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });

    describe('scope.addNewIdea', function() {

        it('should add a new idea', function() {
            spyOn(ideaSvcMock, 'postIdea').and.callThrough();

            scope.addNewIdea(scope.idea);

            expect(ideaSvcMock.postIdea).toHaveBeenCalled();
            expect(scope.idea.rolesreq.length).toBe(0);
        });

        it('should use the user\'s _id as the authorId', function() {
            scope.idea.authorId = 3;

            scope.addNewIdea(scope.idea);

            expect(scope.idea.authorId).not.toBe(3);
            expect(scope.idea.authorId).toBe(1);
        });

        it('should log an error if the idea cannot be created', function() {
            spyOn(ideaSvcMock, 'postIdea').and.callFake(function() {
                return $q.reject('FAIL');
            });
            spyOn(console, 'log').and.callFake(function() {});

            scope.addNewIdea(scope.idea);

            scope.$digest();

            expect(ideaSvcMock.postIdea).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith('FAIL');
        });
    });
});
