/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global spyOn */

describe('AddIdeaViewCtrl', function() {
    "use strict";

    var scope, ctrl, $mdToast, $state, ideaSvcMock, loginSvcMock;

    beforeEach(module('flintAndSteel'));
    beforeEach(module('ui.router'));

    beforeEach(inject(function($rootScope, $controller, _$mdToast_, _$state_, _ideaSvcMock_, _loginSvcMock_) {
        scope = $rootScope.$new();
        $mdToast = _$mdToast_;
        $state = _$state_;
        ideaSvcMock = _ideaSvcMock_;
        loginSvcMock = _loginSvcMock_;

        spyOn($state, 'go');
        spyOn(ideaSvcMock, 'postIdea');

        ctrl = $controller('AddIdeaViewCtrl', {
            $scope: scope,
            $state: $state,
            $mdToast: $mdToast,
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
            description: 'This is a test idea.'
        };
        scope.addNewIdea(idea);

        expect(ideaSvcMock.postIdea).toHaveBeenCalled();
        expect(idea.eventId).toBe("");
        expect(idea.tags.length).toBe(0);
        expect(idea.rolesreq.length).toBe(0);
    });

    it('should use the user\'s _id as the authorId', function() {
        var idea = {
            title: 'Test Title',
            authorId: 3,
            description: 'This is a test idea.'
        };
        scope.addNewIdea(idea);

        expect(idea.authorId).not.toBe(3);
        expect(idea.authorId).toBe(1);
    });
});
