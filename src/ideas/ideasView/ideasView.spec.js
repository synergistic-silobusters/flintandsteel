/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global spyOn */

describe('IdeasViewCtrl', function() {
    "use strict";

    var scope, ctrl, $stateParams, $mdDialog, ideaSvcMock, loginSvcMock, $state, toastSvc, sseSvcMock;

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

    var fakeWindow = {
        location: {
            href: ''
        }
    };

    beforeEach(module('flintAndSteel'));

    beforeEach(inject(function($rootScope, $controller, _$stateParams_, _$mdDialog_, _ideaSvcMock_, _loginSvcMock_, _$state_, _toastSvc_, _sseSvcMock_) {
        scope = $rootScope.$new();
        $stateParams = _$stateParams_;
        $mdDialog = _$mdDialog_;
        ideaSvcMock = _ideaSvcMock_;
        loginSvcMock = _loginSvcMock_;
        $state = _$state_;
        toastSvc = _toastSvc_;
        sseSvcMock = _sseSvcMock_;

        ctrl = $controller('IdeasViewCtrl', {
            $scope: scope,
            $stateParams: $stateParams,
            $mdDialog: $mdDialog,
            ideaSvc: ideaSvcMock,
            loginSvc: loginSvcMock,
            $state: $state,
            toastSvc: toastSvc,
            sseSvc: sseSvcMock,
            $window: fakeWindow
        });
    }));

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });

    describe('ctrl.refreshTeam()', function() {
        var mockIdea;

        beforeEach(function() {
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });
        });

        it('should update back as in team if member added to team', function() {
            loginSvcMock.checkLogin(authorAccount);
            ctrl.refreshTeam();
            expect(scope.idea.backs[0].isInTeam).toBe(true);
        });

        it('should remove team from back if member no longer in team', function() {
            scope.idea.team = [];

            ctrl.refreshTeam();
            expect(scope.idea.backs[0].isInTeam).not.toBe(true);
        });
    });

    describe('ctrl.refreshIdea()', function() {
        var mockIdea;

        beforeEach(function() {
            spyOn($state, 'go').and.callThrough();
            spyOn(toastSvc, 'show').and.callThrough();
        });

        it('should refresh idea and team if idea is found', function() {
            spyOn(ideaSvcMock, 'getIdea').and.callThrough();
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });

            $stateParams.ideaId = mockIdea.id;
            ctrl.refreshIdea();

            expect(ideaSvcMock.getIdea).toHaveBeenCalled();
            expect(toastSvc.show).not.toHaveBeenCalled();
            expect($state.go).not.toHaveBeenCalled();
        }); 

        it('should notify if idea is not found', function() {
            spyOn(ideaSvcMock, 'getIdea').and.callFake(function getIdea(ideaId, successCb) {
                successCb('IDEA_NOT_FOUND');
            });

            ctrl.refreshIdea();
            expect(ideaSvcMock.getIdea).toHaveBeenCalled();
            expect(toastSvc.show).toHaveBeenCalled();
            expect($state.go).toHaveBeenCalled();
        });

        it('should output a console log if an idea error', function() {
            spyOn(ideaSvcMock, 'getIdea').and.callFake(function getIdea(ideaId, successCb, errorCb) {
                errorCb('IDEA_NOT_FOUND');
            });
            spyOn(console, 'log').and.callThrough();

            ctrl.refreshIdea();
            expect(ideaSvcMock.getIdea).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalled();
        });
    });

    describe('$scope.momentizeTime', function() {
        var time;

        it('should return the time formatted', function() {
            time = scope.momentizeTime("2015-11-29T22:28:48.475Z");
            expect(time).toBe('11/29/2015');
        });
    });

    describe('$scope.momentizeModifiedTime', function() {
        var time;

        it('should return the modified time formatted', function() {
            time = scope.momentizeModifiedTime("2015-11-29T22:28:48.475Z");
            expect(time).toBe('Modified 11/29/2015');
        });
    });

    describe('$scope.addNewInteraction()', function() {
        var content, ideaLikes, commentsLength, backsLength, updatesLength;

        beforeEach(function() {
            content = '';
            ideaLikes = scope.idea.likes.length;
            commentsLength = scope.idea.comments.length;
            backsLength = scope.idea.backs.length;
            updatesLength = scope.idea.updates.length;
        });

        it('should add a new like when the heart outline is clicked', function() {
            scope.addNewInteraction('likes');

            expect(scope.idea.likes.length).toBe(ideaLikes + 1);
        });

        it('should add a new comment when comment is selected', function() {
            ctrl.newComment = 'This is a test comment!';

            scope.addNewInteraction('comments');

            expect(scope.idea.comments.length).toBe(commentsLength + 1);
            expect(scope.idea.comments[commentsLength].text).toBe('This is a test comment!');
        });

        it('should give a console error if a problem adding comment', function() {
            spyOn(ideaSvcMock, 'postComment').and.callFake(function postComment(parentId, text, authorId, successCb, errorCb) {
                errorCb('Posted');
            });
            spyOn(console, 'log').and.callThrough();

            scope.addNewInteraction('comments');
            expect(ideaSvcMock.postComment).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalled();
        });

        it('should add a new back with no tags', function() {
            // Technically should not be allowed - blocked on addition before it gets to this function
            ctrl.newBack = 'This is a test back!';

            scope.addNewInteraction('backs');

            expect(scope.idea.backs.length).toBe(backsLength + 1);
            expect(scope.idea.backs[backsLength].text).toBe('This is a test back!');
            expect(scope.idea.backs[backsLength].types.length).toBe(0);
        });

        it('should add a new back with two tags', function() {
            ctrl.newBack = 'This is a test back!';
            scope.selectedTypes = [{ name: 'Experience' }, { name: 'Funding' }];

            scope.addNewInteraction('backs');

            expect(scope.idea.backs.length).toBe(backsLength + 1);
            expect(scope.idea.backs[backsLength].text).toBe('This is a test back!');
            expect(scope.idea.backs[backsLength].types.length).toBe(2);
            expect(scope.idea.backs[backsLength].types[0].name).toBe('Experience');
            expect(scope.idea.backs[backsLength].types[1].name).toBe('Funding');
        });

        it('should add a new update when update is selected', function() {
            ctrl.newUpdate = 'This is a test update!';

            scope.addNewInteraction('updates');

            expect(scope.idea.updates.length).toBe(updatesLength + 1);
            expect(scope.idea.updates[updatesLength].text).toBe('This is a test update!');
        });

        it('should output a console log if problem adding update', function() {
            spyOn(ideaSvcMock, 'addInteraction').and.callFake(function addInteraction(ideaId, type, object, successCb, errorCb) {
                errorCb('NOPE');
            });
            spyOn(console, 'log').and.callThrough();

            scope.addNewInteraction('updates');

            expect(ideaSvcMock.addInteraction).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalled();
        });
    });

    describe('$scope.removeInteraction()', function() {
        var ideaLikes, commentsLength, backsLength, updatesLength;

        beforeEach(function() {
            loginSvcMock.checkLogin(authorAccount);

            scope.addNewInteraction('likes');
            ideaLikes = scope.idea.likes.length;

            ctrl.newComment = 'This is a test comment!';
            scope.addNewInteraction('comments');
            commentsLength = scope.idea.comments.length;

            ctrl.newBack = 'This is a test back!';
            scope.selectedTypes = [{ name: 'Experience' }, { name: 'Funding' }];
            scope.addNewInteraction('backs');
            backsLength = scope.idea.backs.length;

            ctrl.newUpdate = 'This is a test update!';
            scope.addNewInteraction('updates');
            updatesLength = scope.idea.updates.length;
        });

        it('should remove a new like when the solid heart is clicked', function() {
            scope.removeInteraction('likes');
            expect(scope.idea.likes.length).toBe(ideaLikes - 1);
        });

        it('should remove a specific comment the author posted', function() {
            scope.removeInteraction('comments', scope.idea.comments[commentsLength - 1]);

            expect(scope.idea.comments.length).toBe(commentsLength - 1);
        });

        it('should remove a specific back the author posted', function() {
            scope.removeInteraction('backs', scope.idea.backs[backsLength - 1]);

            expect(scope.idea.backs.length).toBe(backsLength - 1);
        });

        it('should remove a specific update the author posted', function() {
            scope.removeInteraction('updates', scope.idea.updates[updatesLength - 1]);

            expect(scope.idea.updates.length).toBe(updatesLength - 1);
        });

        it('should output a console log if problem removing like', function() {
            spyOn(ideaSvcMock, 'removeInteraction').and.callFake(function removeInteraction(ideaId, type, object, successCb, errorCb) {
                errorCb('NOPE');
            });
            spyOn(console, 'log').and.callThrough();

            scope.removeInteraction('likes');
            expect(ideaSvcMock.removeInteraction).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalled();
        });

        it('should output a console log if problem removing comment', function() {
            spyOn(ideaSvcMock, 'deleteComment').and.callFake(function deleteComment(commentId, successCb, errorCb) {
                errorCb('NOPE');
            });
            spyOn(console, 'log').and.callThrough();

            scope.removeInteraction('comments', scope.idea.comments[commentsLength - 1]);
            expect(ideaSvcMock.deleteComment).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalled();
        });

        it('should output a console log if problem removing back', function() {
            spyOn(ideaSvcMock, 'removeInteraction').and.callFake(function removeInteraction(ideaId, type, object, successCb, errorCb) {
                errorCb('NOPE');
            });
            spyOn(console, 'log').and.callThrough();

            scope.removeInteraction('backs', scope.idea.backs[backsLength - 1]);
            expect(ideaSvcMock.removeInteraction).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalled();
        });
    });

    describe('$scope.isUserLiked()', function() {

        beforeEach(function() {
            scope.idea.likes = [{userId: 1}];
        });

        it('should return true for a liked idea', function() {
            expect(scope.isUserLiked()).toBeTruthy();
        });

        it('should return false for other ideas', function() {
            scope.idea.likes = [{userId: 2}];
            expect(scope.isUserLiked()).not.toBeTruthy();
        });
    });

    describe('$scope.querySearch()', function() {
        var results;

        beforeEach(function() {
            results = undefined;
            scope.typeChips = ideaSvcMock.getBackTypeChips();
        });

        it('should return an all possible chips for an empty search', function() {
            results = scope.querySearch();
            expect(results.length).toBe(scope.typeChips.length);
        });

        it('should return an array with length 1 when searched for "K"', function() {
            results = scope.querySearch('K');
            expect(results.length).toBe(1);
            expect(results[0].name).toBe('Knowledge');
        });

        it('should return an array with length 2 when searched for "T"', function() {
            results = scope.querySearch('T');
            expect(results.length).toBe(2);
            expect(results[0].name).toBe('Time');
            expect(results[1].name).toBe('Test Chip');
        });

        it('should work with lowercase searches', function() {
            results = scope.querySearch('fund');
            expect(results.length).toBe(1);
            expect(results[0].name).toBe('Funding');
        });

        it('should return nothing for unacceptable back types', function() {
            results = scope.querySearch('technology');
            expect(results.length).toBe(0);
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

    describe('$scope.ideaHasImage', function() {
        var hasImage, mockIdea;

        beforeEach(function() {
            loginSvcMock.checkLogin(authorAccount);
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });
        });

        it('should return true if idea has image', function() {
            hasImage = scope.ideaHasImage();

            expect(hasImage).toBe(true);
        });

        it('should return false if idea does not have image', function() {
            mockIdea.image = undefined;
            hasImage = scope.ideaHasImage();

            expect(hasImage).toBe(false);
        });
    });

    describe('ctrl.editIdea() negative test', function() {
        var mockIdea;

        beforeEach(function() {
            loginSvcMock.checkLogin(authorAccount);
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });
        });

        it('should show a console log if error', function() {
            spyOn(ideaSvcMock, 'editIdea').and.callFake(function editIdea(ideaId, title, description, tags, rolesreq, successCb, errorCb) {
                errorCb('NOPE');
            });
            spyOn(console, 'log').and.callThrough();

            ctrl.editIdea(mockIdea.title, mockIdea.description, mockIdea.tags);
            expect(ideaSvcMock.editIdea).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalled();
        });
    });

    describe('ctrl.editIdea()', function() {
        var mockIdea;

        beforeEach(function() {
            loginSvcMock.checkLogin(authorAccount);
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });
            spyOn(ideaSvcMock, 'editIdea').and.callThrough();
        });

        it('should allow the author to edit the idea', function() {
            loginSvcMock.checkLogin(authorAccount);
            expect(ctrl.isUserAuthor()).toBe(true);
            ctrl.editIdea(mockIdea.title, mockIdea.description, mockIdea.tags);
            expect(ideaSvcMock.editIdea).toHaveBeenCalled();
        });

        it('should not allow someone other than the author to edit the idea', function() {
            loginSvcMock.checkLogin(nonAuthorAccount);
            expect(ctrl.isUserAuthor()).toBe(false);
            ctrl.editIdea(mockIdea.title, mockIdea.description, mockIdea.tags);
            expect(ideaSvcMock.editIdea).not.toHaveBeenCalled();
        });

        it('should allow the author to add text to the idea description', function() {
            var description = mockIdea.description;
            ctrl.editIdea(mockIdea.title, mockIdea.description + " Booyah!", mockIdea.tags);
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });
            expect(mockIdea.description).toBe(description + " Booyah!");
        });

        it('should allow the author to delete text to the idea description', function() {
            var description = mockIdea.description;
            ctrl.editIdea(mockIdea.title, mockIdea.description.substr(0, 4), mockIdea.tags);
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });
            expect(mockIdea.description).toBe(description.substr(0, 4));
        });

        it('should allow the author to overwrite the old idea title', function() {
            var title = mockIdea.title;
            ctrl.editIdea("New Title", mockIdea.description, mockIdea.tags);
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });
            expect(mockIdea.title).not.toBe(title);
            expect(mockIdea.title).toBe("New Title");
        });

        it('should allow the author to add a tag', function() {
            scope.idea = {
                title: 'Test Title',
                authorId: 3,
                description: 'This is a test idea.',
                tags: ['TestTag1', 'TestTag2']
            };
            ctrl.addTag('TestTag3');

            expect(scope.idea.tags.length).not.toBe(2);
            expect(scope.idea.tags.length).toBe(3);
            scope.idea = {};
        });

        it('should allow the author to remove a tag', function() {
            scope.idea = {
                title: 'Test Title',
                authorId: 3,
                description: 'This is a test idea.',
                tags: ['TestTag1', 'TestTag2']
            };
            ctrl.removeTag('TestTag2');

            expect(scope.idea.tags.length).not.toBe(2);
            expect(scope.idea.tags.length).toBe(1);
            scope.idea = {};
        });
        
        it('should not add duplicate tags', function() {
            scope.idea = {
                title: 'Test Title',
                authorId: 3,
                description: 'This is a test idea.',
                tags: ['TestTag1', 'TestTag2']
            };
            ctrl.addTag('TestTag2');

            expect(scope.idea.tags.length).not.toBe(3);
            expect(scope.idea.tags.length).toBe(2);
            scope.idea = {};
        });

        it('should not add more than 5 tags', function() {
            scope.idea = {
                title: 'Test Title',
                authorId: 3,
                description: 'This is a test idea.',
                tags: ['TestTag1', 'TestTag2', 'TestTag3', 'TestTag4', 'TestTag5']
            };
            ctrl.addTag('TestTag6');

            expect(scope.idea.tags.length).not.toBe(6);
            expect(scope.idea.tags.length).toBe(5);
            scope.idea = {};
        });

        it('should not add a blank tag', function() {
            scope.idea = {
                title: 'Test Title',
                authorId: 3,
                description: 'This is a test idea.',
                tags: ['TestTag1', 'TestTag2']
            };
            ctrl.addTag('');

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
            ctrl.addTag('hello!@world&*@');

            expect(scope.idea.tags.length).toBe(3);
            expect(ctrl.doesTagExist('hello!@world&*@')).toBe(false);
            expect(ctrl.doesTagExist('HelloWorld')).toBe(true);
        });

        it('should use CamelCase for tags', function() {
            scope.idea = {
                title: 'Test Title',
                authorId: 3,
                description: 'This is a test idea.',
                tags: ['TestTag1', 'TestTag2']
            };
            ctrl.addTag('This is a tag');

            expect(scope.idea.tags.length).toBe(3);
            expect(ctrl.doesTagExist('This is a tag')).toBe(false);
            expect(ctrl.doesTagExist('ThisIsATag')).toBe(true);
        });

        it('should save the last edited date/time', function() {
            var now = (new Date()).toISOString();
            ctrl.editIdea(mockIdea.title, mockIdea.description, mockIdea.tags);
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });
            expect(mockIdea.timeModified.substr(-7,6)).toBeCloseTo(now.substr(-7,6), 1);
        });

        it('should refresh $scope.idea with the new idea data', function() {
            ctrl.editIdea(mockIdea.title, mockIdea.description, mockIdea.tags);
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });
            expect(scope.idea).toBe(mockIdea);
        });
    });

    describe('ctrl.deleteIdea()', function() {
        var mockIdea;

        beforeEach(function() {
            loginSvcMock.checkLogin(authorAccount);
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });
            spyOn(ideaSvcMock, 'deleteIdea').and.callThrough();
        });

        it('should allow the author to delete the idea', function() {
            loginSvcMock.checkLogin(authorAccount);
            expect(loginSvcMock.isUserLoggedIn()).toBe(true);
            ctrl.deleteIdea();
            expect(ideaSvcMock.deleteIdea).toHaveBeenCalled();
        });

        it('should not allow someone other than the author to delete the idea', function() {
            loginSvcMock.checkLogin(nonAuthorAccount);
            ctrl.deleteIdea();
            expect(ideaSvcMock.deleteIdea).not.toHaveBeenCalled();
        });
    });

    describe('ctrl.deleteIdea() negative test', function() {
        var mockIdea;

        beforeEach(function() {
            loginSvcMock.checkLogin(authorAccount);
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });
        });

        it('should show a console log if error', function() {
            spyOn(ideaSvcMock, 'deleteIdea').and.callFake(function deleteIdea(ideaId, successCb, errorCb) {
                errorCb('NOPE');
            });
            spyOn(console, 'log').and.callThrough();

            ctrl.deleteIdea();
            expect(ideaSvcMock.deleteIdea).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalled();
        });
    });

    describe('ctrl.confirmDeleteIdea', function() {
        var mockIdea;

        beforeEach(function() {
            loginSvcMock.checkLogin(authorAccount);
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });
            spyOn($mdDialog, 'show').and.callThrough();
            spyOn($mdDialog, 'confirm').and.callThrough();
            spyOn(ideaSvcMock, 'deleteIdea').and.callThrough();
        });

        it('expect to show dialog window when deleting idea', function() {
            ctrl.confirmDeleteIdea();

            expect($mdDialog.show).toHaveBeenCalled();
        });
    });

    describe('ctrl.isUserAuthor', function() {
        var mockIdea, isAuthor;

        beforeEach(function() {
            loginSvcMock.checkLogin(authorAccount);
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });
        });

        it('should expect to return true if author of idea', function() {
            isAuthor = ctrl.isUserAuthor();

            expect(isAuthor).toBe(true);
        });

        it('should expect to return false if not author of idea', function() {
            loginSvcMock.checkLogin(nonAuthorAccount);
            isAuthor = ctrl.isUserAuthor();

            expect(isAuthor).toBe(false);
        });
    });

    describe('$scope.focusTeam', function() {
        it('should expect to focus on tab 3', function() {
            scope.focusTeam();

            expect(scope.selectedTab).toBe(3);
        });
    });

    describe('ctrl.updateTeam', function() {
        var mockIdea, numTeam;

        beforeEach(function() {
            loginSvcMock.checkLogin(authorAccount);
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });
            spyOn(toastSvc, 'show').and.callThrough();
            numTeam = mockIdea.team.length;
        });

        it('should expect to update the team in the idea', function() {
            spyOn(ideaSvcMock, 'updateIdea').and.callThrough();

            // Add one to team
            mockIdea.backs[1].isInTeam = true;
            ctrl.updateTeam();

            expect(mockIdea.team.length).toBe(numTeam + 1);
            expect(mockIdea.team[numTeam].memberId).toBe(4);
            expect(ideaSvcMock.updateIdea).toHaveBeenCalled();
            expect(toastSvc.show).toHaveBeenCalled();
        });

        it('should expect an error to trigger a console log', function() {
            spyOn(ideaSvcMock, 'updateIdea').and.callFake(function updateIdea(ideaId, property, data, successCb, errorCb) {
                errorCb('NOPE');
            });
            spyOn(console, 'log').and.callThrough();

            ctrl.updateTeam();
            expect(ideaSvcMock.updateIdea).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalled();
        });
    });

    describe('ctrl.editTeam', function() {

        beforeEach(function() {
            loginSvcMock.checkLogin(authorAccount);
            spyOn($mdDialog, 'show').and.callThrough();
        });

        it('should expect to show dialog to edit', function() {
            ctrl.editTeam();
            expect($mdDialog.show).toHaveBeenCalled();
        });
    });

    describe('ctrl.removeSelfFromTeam', function() {
        var numTeam, numBacks;

        beforeEach(function() {
            loginSvcMock.checkLogin(authorAccount);
            numTeam = scope.idea.team.length;
            numBacks = scope.idea.backs.length;
            spyOn($mdDialog, 'show').and.callThrough();
        });

        it('expect to show dialog to remove from Team', function() {
            // Add back
            ctrl.newBack = 'This is a test back!';
            scope.selectedTypes = [{ name: 'Experience' }, { name: 'Funding' }];
            scope.addNewInteraction('backs');
            expect(scope.idea.backs.length).toBe(numBacks + 1);

            // Add to team
            scope.idea.backs[scope.idea.backs.length - 1].isInTeam = true;
            ctrl.updateTeam();
            expect(scope.idea.team.length).toBe(numTeam + 1);

            // Test remove from team
            ctrl.removeSelfFromTeam();
            expect($mdDialog.show).toHaveBeenCalled();
            ctrl.removeUserFromTeam(scope.userBack);
            scope.removeInteraction('backs', scope.userBack);
            expect(scope.idea.team.length).toBe(numTeam);
            expect(scope.idea.backs.length).toBe(numBacks);
        });

        it('expect dialog not to be called if not on Team', function() {
            // Add back
            loginSvcMock.checkLogin(nonAuthorAccount);
            ctrl.newBack = 'This is a test back!';
            scope.selectedTypes = [{ name: 'Experience' }, { name: 'Funding' }];
            scope.addNewInteraction('backs');

            // Test remove from team without backing
            ctrl.removeSelfFromTeam();
            expect($mdDialog.show).not.toHaveBeenCalled();
        });
    });

    describe('ctrl.isUserMemberOfTeam', function() {
        var isMember;

        it('show return true if member of team', function() {
            loginSvcMock.checkLogin(authorAccount);
            isMember = ctrl.isUserMemberOfTeam();

            expect(isMember).toBe(true);
        });

        it('show return false if not member of team', function() {
            loginSvcMock.checkLogin(nonAuthorAccount);
            isMember = ctrl.isUserMemberOfTeam();

            expect(isMember).toBe(false);
        });

    });

    describe('ctrl.isUserExactMemberOfTeam', function() {
        var isExactMember;

        it('should return true if exact member of team', function() {
            loginSvcMock.checkLogin(authorAccount);
            isExactMember = ctrl.isUserExactMemberOfTeam(0);

            expect(isExactMember).toBe(true);
        });

        it('should return false if not exact member of team', function() {
            loginSvcMock.checkLogin(nonAuthorAccount);
            isExactMember = ctrl.isUserExactMemberOfTeam(0);

            expect(isExactMember).toBe(false);
        });
    });

    describe('ctrl.removeUserFromTeam', function() {
        var numTeam, testBack;

        beforeEach(function() {
            numTeam = scope.idea.team.length;
        });

        it('should remove user from team if in team', function() {
            //Login as owner
            loginSvcMock.switchLogin(1);
            loginSvcMock.checkLogin(authorAccount);
            expect(loginSvcMock.getProperty('_id')).toBe(1);
            expect(ctrl.isUserMemberOfTeam()).toBe(true);

            //Get back
            scope.loadEditBack();
            expect(scope.userBack).not.toBe('');

            //Test function
            ctrl.removeUserFromTeam(scope.userBack);
            expect(scope.userBack.isInTeam).toBe(false);
            expect(scope.idea.team.length).toBe(numTeam - 1);
        });

        it('should not remove user from team if user has not backed', function() {
            //Login as non-owner
            loginSvcMock.switchLogin(2);
            loginSvcMock.checkLogin(nonAuthorAccount);
            expect(loginSvcMock.getProperty('_id')).toBe(2);

            //Get back
            scope.loadEditBack();
            expect(scope.userBack).toBe('');

            //Test function
            ctrl.removeUserFromTeam(scope.userBack);
            expect(scope.idea.team.length).toBe(numTeam);
        });

        it('should not remove user from team if user has backed but not in team', function() {
            //Login as non-owner
            loginSvcMock.switchLogin(2);
            loginSvcMock.checkLogin(nonAuthorAccount);

            //Test back
            testBack = {
                text: '',
                authorId: 1,
                timeCreated: new Date().toISOString(),
                timeModified: new Date().toISOString(),
                types: [{ name: 'Time' }]
            };

            //Test function
            ctrl.removeUserFromTeam(testBack);
            expect(scope.idea.team.length).toBe(numTeam);
        });
    });

    describe('ctrl.isUserAuthorOfInteraction', function() {
        var authorOfInt, testBack;

        beforeEach(function() {
            //setup test back as author
            testBack = {
                text: '',
                authorId: 1,
                timeCreated: new Date().toISOString(),
                timeModified: new Date().toISOString(),
                types: [{ name: 'Time' }]
            };
        });

        it('should return true if author of back', function() {
            //login as author
            loginSvcMock.switchLogin(1);
            expect(loginSvcMock.getProperty('_id')).toBe(1);
            loginSvcMock.checkLogin(authorAccount);

            //test function as author
            authorOfInt = ctrl.isUserAuthorOfInteraction(testBack);
            expect(authorOfInt).toBe(true);
        });

        it('should return false if not author of back', function() {
            //login as not author
            loginSvcMock.switchLogin(2);
            expect(loginSvcMock.getProperty('_id')).toBe(2);
            loginSvcMock.checkLogin(nonAuthorAccount);

            //test function as non-author
            authorOfInt = ctrl.isUserAuthorOfInteraction(testBack);
            expect(authorOfInt).toBe(false);
        });
    });

    describe('$scope.focusBack', function() {
        it('should focus on the back tab', function() {
            scope.focusBack();
            expect(scope.selectedTab).toBe(2);
        });
    });

    describe('ctrl.showAddBack', function() {
        var mockIdea;

        beforeEach(function() {
            spyOn($mdDialog, 'show').and.callThrough();
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });
            scope.idea = mockIdea;
        });

        it('should call $mdShow if logged in', function() {
            loginSvcMock.checkLogin(authorAccount);
            ctrl.showAddBack();

            expect($mdDialog.show).toHaveBeenCalled();
        });

        it('should not call $mdShow if not logged in', function() {
            loginSvcMock.logout();

            ctrl.showAddBack();
            expect($mdDialog.show).not.toHaveBeenCalled();
        });

        it('should call edit back if user has backed', function() {
            //Login as user
            loginSvcMock.switchLogin(1);
            loginSvcMock.checkLogin(authorAccount);
            ctrl.showAddBack();

            //Expect to show edit back template
            expect($mdDialog.show).toHaveBeenCalled();
            expect(scope.hasUserBacked()).toBe(true);
        });

        it('should call add back if user has not backed', function() {
            //Login as non-user
            loginSvcMock.switchLogin(2);
            loginSvcMock.checkLogin(nonAuthorAccount);
            ctrl.showAddBack();

            //Expect to show add back template
            expect($mdDialog.show).toHaveBeenCalled();
            expect(scope.hasUserBacked()).not.toBe(true);
        });
    });

    describe('ctrl.editBack', function() {
        var testBack, time;

        beforeEach(function() {
            //Login as author
            loginSvcMock.switchLogin(1);
            loginSvcMock.checkLogin(authorAccount);

            spyOn(ideaSvcMock, 'editBack').and.callThrough();

            time = '2015-11-29T22:28:48.475Z';
            testBack = {
                text: '',
                authorId: 1,
                timeCreated: '2015-10-29T22:28:48.475Z',
                timeModified: time,
                types: [{ name: 'Time' }]
            };
        });

        it('should edit the back if user is the author', function() {
            ctrl.editBack(testBack);
            expect(ideaSvcMock.editBack).toHaveBeenCalled();

            scope.loadEditBack();
            expect(scope.userBack.timeModified).not.toBe(time);
        });

        it('should not edit the back if the dialog was canceled', function() {
            scope.status = 'You canceled the dialog.';
            ctrl.editBack(testBack);
            expect(ideaSvcMock.editBack).toHaveBeenCalled();

            scope.loadEditBack();
            expect(scope.userBack.timeModified).toBe(time);
        });

        it('should not edit the back if user is not the author', function() {
            //Login as not author
            loginSvcMock.switchLogin(2);
            loginSvcMock.checkLogin(nonAuthorAccount);

            ctrl.editBack(testBack);
            expect(ideaSvcMock.editBack).not.toHaveBeenCalled();
        });
    });

    describe('ctrl.editBack negative', function() {
        var testBack;

        beforeEach(function() {
            loginSvcMock.switchLogin(1);
            loginSvcMock.checkLogin(authorAccount);

            testBack = {
                text: '',
                authorId: 1,
                timeCreated: '2015-11-29T22:28:48.475Z',
                timeModified: '2015-11-29T22:28:48.475Z',
                types: [{ name: 'Time' }]
            };

            spyOn(ideaSvcMock, 'editBack').and.callFake(function editBack(ideaId, backAuthorId, newBack, successCb, errorCb) {
                errorCb('NOPE');
            });
            spyOn(console, 'log').and.callThrough();
        });

        it('should through a console log if errored', function() {
            ctrl.editBack(testBack);

            expect(ideaSvcMock.editBack).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalled();
        });
    });

    describe('ctrl.removeBack', function() {
        var testBack, backLength, teamLength;

        beforeEach(function() {
            //Login as author
            loginSvcMock.switchLogin(1);
            loginSvcMock.checkLogin(authorAccount);

            backLength = scope.idea.backs.length;
            teamLength = scope.idea.team.length;

            testBack = {
                text: '',
                authorId: 1,
                timeCreated: '2015-10-29T22:28:48.475Z',
                timeModified: '2015-11-29T22:28:48.475Z',
                types: [{ name: 'Time' }]
            };

            spyOn($mdDialog, 'show').and.callThrough();
        });

        it('should remove back if author and from team if member of team', function() {

            //Dialog is opened
            scope.removeBack();
            expect($mdDialog.show).toHaveBeenCalled();

            //execute confirm code
            scope.removeInteraction('backs', scope.userBack);
            if (ctrl.isUserMemberOfTeam()) {
                ctrl.removeUserFromTeam(scope.userBack);
            }

            //expect back and team to be removed
            expect(scope.idea.backs.length).toBe(backLength - 1);
            expect(scope.idea.team.length).toBe(teamLength - 1);
        });

        it('should not remove back if not author', function() {
            //Login as non-user
            loginSvcMock.switchLogin(2);
            loginSvcMock.checkLogin(nonAuthorAccount);

            scope.removeBack();
            expect($mdDialog.show).not.toHaveBeenCalled();
        });
    });

    describe('ctrl.hasUserBacked', function() {
        var hasBacked;

        it('should return true if user has backed', function() {
            loginSvcMock.checkLogin(authorAccount);
            hasBacked = scope.hasUserBacked();

            expect(hasBacked).toBe(true);
        });

        it('should return false if user has not backed', function() {
            hasBacked = scope.hasUserBacked();

            expect(hasBacked).toBe(false);
        });
    });

    describe('ctrl.hasBackBeenEdited', function() {
        var hasEditedBack, testBack;

        it('should return true if user has editted back', function() {
            //new back object since author has already backed
            testBack = {
                text: '',
                authorId: loginSvcMock.getProperty('_id'),
                timeCreated: new Date().toISOString(),
                timeModified: new Date().toISOString(),
                types: [{ name: 'Time' }]
            };

            //modified back should return true
            hasEditedBack = scope.hasBackBeenEdited(testBack);
            expect(hasEditedBack).toBe(true);
        });

        it('should return false if user has not edited back', function() {
            //new back object since author has already backed
            testBack = {
                text: '',
                authorId: loginSvcMock.getProperty('_id'),
                timeCreated: new Date().toISOString(),
                timeModified: '',
                types: [{ name: 'Time' }]
            };
            
            //unmodified back should return false
            hasEditedBack = scope.hasBackBeenEdited(testBack);
            expect(hasEditedBack).toBe(false);
        });
    });

    describe('scope.loadEditBack', function() {
        var hasBacked;

        it('should update scope.userBack object if user has backed', function() {
            //Check user has backed
            loginSvcMock.checkLogin(authorAccount);
            hasBacked = scope.hasUserBacked();
            expect(hasBacked).toBe(true);

            //Test loading
            scope.loadEditBack();
            expect(scope.userBack).not.toBe('');
        });

        it('should not update scope.userBack object if user has not backed', function() {
            //Check user has not backed
            loginSvcMock.switchLogin(2);
            expect(loginSvcMock.getProperty('_id')).toBe(2);
            hasBacked = scope.hasUserBacked();
            expect(hasBacked).toBe(false);

            //Test loading
            scope.loadEditBack();
            expect(scope.userBack).toBe('');
        });
    });

    describe('scope.loadEditBack', function() {

        it('should not load a back if author has not backed', function() {
            //Login as user
            loginSvcMock.switchLogin(1);
            loginSvcMock.isUserLoggedIn();

            //test function
            scope.loadEditBack();
            expect(scope.userBack).not.toBe('');
        });

        it('should load a back if author has backed', function() {
            //Login as non-user
            loginSvcMock.switchLogin(2);
            loginSvcMock.isUserLoggedIn();

            //test function
            scope.loadEditBack();
            expect(scope.userBack).toBe('');
        });
    });

    describe('ctrl.doesTagExist', function() {

        it('should return true if tag exists', function() {
            expect(ctrl.doesTagExist(scope.idea.tags[0])).toBe(true);
        });

        it('should return false if tag does not exist', function() {
            expect(ctrl.doesTagExist('noneOfTheTags')).toBe(false);
        });
    });

    describe('ctrl.addTag', function() {
        var tagLength, expectLength;

        beforeEach(function() {
            tagLength = scope.idea.tags.length;
        });

        it('should increase the tag size if tag does not exist', function() {
            expectLength = tagLength + 1;
            ctrl.addTag('this is a new tag');
            expect(scope.idea.tags.length).toBe(expectLength);
        });

        it('should not increase the tag size if tag does exist', function() {
            expectLength = tagLength + 1;
            ctrl.addTag('1');
            expect(scope.idea.tags.length).toBe(expectLength);
            ctrl.addTag('1');
            expect(scope.idea.tags.length).toBe(expectLength);
        });

        it('should not increase the tag size if there are already 5 tags', function() {
            ctrl.addTag('3');
            ctrl.addTag('4');
            ctrl.addTag('5');
            expect(scope.idea.tags.length).toBe(5);
            ctrl.addTag('6');
            expect(scope.idea.tags.length).toBe(5);
        });

        it('should not increase the tag size if tag is empty', function() {
            ctrl.addTag('');
            expect(scope.idea.tags.length).toBe(tagLength);
        });
    });

    describe('ctrl.tagKeyEvent', function() {
        var keyEvent, tagLength, expectLength;

        beforeEach(function() {
            scope.tagInput = 'a tag';
            keyEvent = {
                keyCode: 13
            };
            tagLength = scope.idea.tags.length;
        });

        it('should call add Tag if enter is pushed', function() {
            expectLength = tagLength + 1;
            ctrl.tagKeyEvent(keyEvent);
            expect(scope.tagInput).toBe("");
            expect(scope.idea.tags.length).toBe(expectLength);
        });

        it('should not call add Tag if a key other than enter is pushed', function() {
            keyEvent.keyCode = 14;
            ctrl.tagKeyEvent(keyEvent);
            expect(scope.tagInput).toBe('a tag');
            expect(scope.idea.tags.length).toBe(tagLength);
        });
    });

    describe('ctrl.removeTag', function() {
        var tagLength, expectLength;

        beforeEach(function() {
            tagLength = scope.idea.tags.length;

        });

        it('should remove a tag if the tag exists', function() {
            expectLength = tagLength - 1;
            ctrl.removeTag('thisIsATag');
            expect(scope.idea.tags.length).toBe(expectLength);
        });

        it('should not remove a tag if the tag does not exist', function() {
            ctrl.removeTag('thisIsNotATag');
            expect(scope.idea.tags.length).toBe(tagLength);
        });
    });

    describe('ctrl.parseTeamEmail', function() {

        it('should add one person to email if one person in team', function() {
            ctrl.parseTeamEmail();
            expect(scope.emailString).toBe('mailto:dvader@gmail.com;');
        });
    });
});
