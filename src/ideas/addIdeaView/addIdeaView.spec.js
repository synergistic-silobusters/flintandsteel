/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global spyOn */

describe('AddIdeaViewCtrl', function() {
    "use strict";

    var scope, ctrl, toastSvc, $state, ideaSvcMock, loginSvcMock;

    beforeEach(module('flintAndSteel'));
    beforeEach(module('ui.router'));

    beforeEach(inject(function($rootScope, $controller, _toastSvc_, _$state_, _ideaSvcMock_, _loginSvcMock_) {
        scope = $rootScope.$new();
        toastSvc = _toastSvc_;
        $state = _$state_;
        ideaSvcMock = _ideaSvcMock_;
        loginSvcMock = _loginSvcMock_;

        spyOn($state, 'go');
        spyOn(ideaSvcMock, 'postIdea');

        ctrl = $controller('AddIdeaViewCtrl', {
            $scope: scope,
            $state: $state,
            toastSvc: toastSvc,
            ideaSvc: ideaSvcMock,
            loginSvc: loginSvcMock
        });
    }));

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });

    it('should add a new idea', function() {
        var idea = {
            title: 'Test Title',
            description: 'This is a test idea.',
            tags: ['testTag1', 'testTag2']
        };
        scope.addNewIdea(idea);

        expect(ideaSvcMock.postIdea).toHaveBeenCalled();
        expect(idea.eventId).toBe("");
        expect(idea.rolesreq.length).toBe(0);
    });

    it('should use the user\'s _id as the authorId', function() {
        var idea = {
            title: 'Test Title',
            authorId: 3,
            description: 'This is a test idea.',
            tags: ['testTag1', 'testTag2']
        };
        scope.addNewIdea(idea);

        expect(idea.authorId).not.toBe(3);
        expect(idea.authorId).toBe(1);
    });

    it('should add tag', function() {
        scope.idea = {
            title: 'Test Title',
            authorId: 3,
            description: 'This is a test idea.',
            tags: ['testTag1', 'testTag2']
        };
        scope.addTag('testTag3');

        expect(scope.idea.tags.length).not.toBe(2);
        expect(scope.idea.tags.length).toBe(3);
        scope.idea = {};
    });

    it('should delete tag', function() {
        scope.idea = {
            title: 'Test Title',
            authorId: 3,
            description: 'This is a test idea.',
            tags: ['testTag1', 'testTag2']
        };
        scope.removeTag('testTag2');

        expect(scope.idea.tags.length).not.toBe(2);
        expect(scope.idea.tags.length).toBe(1);
        scope.idea = {};
    });

    it('should not add duplicate tags', function() {
        scope.idea = {
            title: 'Test Title',
            authorId: 3,
            description: 'This is a test idea.',
            tags: ['testTag1', 'testTag2']
        };
        scope.addTag('testTag2');

        expect(scope.idea.tags.length).not.toBe(3);
        expect(scope.idea.tags.length).toBe(2);
    });

    it('should not add more than 5 tags', function() {
        scope.idea = {
            title: 'Test Title',
            authorId: 3,
            description: 'This is a test idea.',
            tags: ['testTag1', 'testTag2', 'testTag3', 'testTag4', 'testTag5']
        };
        scope.addTag('testTag6');

        expect(scope.idea.tags.length).not.toBe(6);
        expect(scope.idea.tags.length).toBe(5);
    });

    it('should not add a blank tag', function() {
        scope.idea = {
            title: 'Test Title',
            authorId: 3,
            description: 'This is a test idea.',
            tags: ['testTag1', 'testTag2']
        };
        scope.addTag('');

        expect(scope.idea.tags.length).not.toBe(3);
        expect(scope.idea.tags.length).toBe(2);
    });
});
