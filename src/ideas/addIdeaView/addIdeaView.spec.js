/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global spyOn */

describe('AddIdeaViewCtrl', function() {
    "use strict";

    var scope, ctrl, toastSvc, $state, ideaSvcMock, userSvcMock;

    beforeEach(module('flintAndSteel'));
    beforeEach(module('ui.router'));

    beforeEach(inject(function($rootScope, $controller, _toastSvc_, _$state_, _ideaSvcMock_, _userSvcMock_) {
        scope = $rootScope.$new();
        toastSvc = _toastSvc_;
        $state = _$state_;
        ideaSvcMock = _ideaSvcMock_;
        userSvcMock = _userSvcMock_;

        spyOn($state, 'go');
        spyOn(ideaSvcMock, 'postIdea').and.callThrough();

        ctrl = $controller('AddIdeaViewCtrl', {
            $scope: scope,
            $state: $state,
            toastSvc: toastSvc,
            ideaSvc: ideaSvcMock,
            userSvc: userSvcMock
        });
    }));

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });

    describe('scope.addNewIdea', function() {

        it('should add a new idea', function() {
            var idea = {
                title: 'Test Title',
                description: 'This is a test idea.',
                tags: ['TestTag1', 'TestTag2']
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
                tags: ['TestTag1', 'TestTag2']
            };
            scope.addNewIdea(idea);

            expect(idea.authorId).not.toBe(3);
            expect(idea.authorId).toBe(1);
        });
    });

    describe('scope.addTag', function() {

        it('should add tag', function() {
            scope.idea = {
                title: 'Test Title',
                authorId: 3,
                description: 'This is a test idea.',
                tags: ['TestTag1', 'TestTag2']
            };
            scope.addTag('testTag3');

            expect(scope.idea.tags.length).not.toBe(2);
            expect(scope.idea.tags.length).toBe(3);
            scope.idea = {};
        });

        it('should not add duplicate tags', function() {
            scope.idea = {
                title: 'Test Title',
                authorId: 3,
                description: 'This is a test idea.',
                tags: ['TestTag1', 'TestTag2']
            };
            scope.addTag('TestTag2');

            expect(scope.idea.tags.length).not.toBe(3);
            expect(scope.idea.tags.length).toBe(2);
        });

        it('should not add more than 5 tags', function() {
            scope.idea = {
                title: 'Test Title',
                authorId: 3,
                description: 'This is a test idea.',
                tags: ['TestTag1', 'TestTag2', 'TestTag3', 'TestTag4', 'TestTag5']
            };
            scope.addTag('TestTag6');

            expect(scope.idea.tags.length).not.toBe(6);
            expect(scope.idea.tags.length).toBe(5);
        });

        it('should not add a blank tag', function() {
            scope.idea = {
                title: 'Test Title',
                authorId: 3,
                description: 'This is a test idea.',
                tags: ['TestTag1', 'TestTag2']
            };
            scope.addTag('');

            expect(scope.idea.tags.length).not.toBe(3);
            expect(scope.idea.tags.length).toBe(2);
        });

        it('should remove special characters from tags', function() {
            scope.idea = {
                title: 'Test Title',
                authorId: 3,
                description: 'This is a test idea.',
                tags: ['TestTag1', 'TestTag2']
            };
            scope.addTag('hello!@world&*@');

            expect(scope.idea.tags.length).toBe(3);
            expect(scope.doesTagExist('hello!@world&*@')).toBe(false);
            expect(scope.doesTagExist('HelloWorld')).toBe(true);
        });

        it('should use CamelCase for tags', function() {
            scope.idea = {
                title: 'Test Title',
                authorId: 3,
                description: 'This is a test idea.',
                tags: ['TestTag1', 'TestTag2']
            };
            scope.addTag('This is a tag');

            expect(scope.idea.tags.length).toBe(3);
            expect(scope.doesTagExist('This is a tag')).toBe(false);
            expect(scope.doesTagExist('ThisIsATag')).toBe(true);
        });
    });

    describe('scope.deleteTag', function() {
        it('should delete tag', function() {
            scope.idea = {
                title: 'Test Title',
                authorId: 3,
                description: 'This is a test idea.',
                tags: ['TestTag1', 'TestTag2']
            };
            scope.removeTag('TestTag2');

            expect(scope.idea.tags.length).not.toBe(2);
            expect(scope.idea.tags.length).toBe(1);
            scope.idea = {};
        });
    });
});
