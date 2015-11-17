/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global spyOn */

describe('IdeasViewCtrl', function() {
    "use strict";

    var scope, ctrl, $stateParams, $mdDialog, ideaSvcMock, loginSvcMock, $state, toastSvc;

    beforeEach(module('flintAndSteel'));

    beforeEach(inject(function($rootScope, $controller, _$stateParams_, _$mdDialog_, _ideaSvcMock_, _loginSvcMock_, _$state_, _toastSvc_) {
        scope = $rootScope.$new();
        $stateParams = _$stateParams_;
        $mdDialog = _$mdDialog_;
        ideaSvcMock = _ideaSvcMock_;
        loginSvcMock = _loginSvcMock_;
        $state = _$state_;
        toastSvc = _toastSvc_;

        ctrl = $controller('IdeasViewCtrl', {
            $scope: scope,
            $stateParams: $stateParams,
            $mdDialog: $mdDialog,
            ideaSvc: ideaSvcMock,
            loginSvc: loginSvcMock,
            $state: $state,
            toastSvc: toastSvc
        });
    }));

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });

    describe('$scope.addNewInteraction()', function() {
        var content, commentsLength, backsLength;

        beforeEach(function() {
            content = '';
            commentsLength = scope.idea.comments.length;
            backsLength = scope.idea.backs.length;
        });

        it('should add a new comment when comment is selected', function() {
            ctrl.newComment = 'This is a test comment!';

            scope.addNewInteraction('comments');

            expect(scope.idea.comments.length).toBe(commentsLength + 1);
            expect(scope.idea.comments[commentsLength].text).toBe('This is a test comment!');
        });

        it('should add a new back with no tags', function() {
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
    });

    describe('$scope.likeIdea()', function() {
        var ideaLikes;

        beforeEach(function() {
            ideaLikes = scope.idea.likes.length;

            spyOn(loginSvcMock, 'likeIdea').and.callFake(function() {
            });
        });

        it('should like an idea', function() {
            scope.likeIdea();

            expect(scope.idea.likes.length).toBe(ideaLikes + 1);
            expect(loginSvcMock.likeIdea).toHaveBeenCalledWith(scope.idea._id);
        });
    });

    describe('$scope.unlikeIdea()', function() {
        var ideaLikes;

        beforeEach(function() {
            spyOn(loginSvcMock, 'likeIdea').and.callFake(function() {
            });
            spyOn(loginSvcMock, 'unlikeIdea').and.callFake(function() {
            });

            scope.likeIdea();
            ideaLikes = scope.idea.likes.length;
        });

        it('should unlike an idea', function() {
            scope.unlikeIdea();

            expect(scope.idea.likes.length).toBe(ideaLikes - 1);
            expect(loginSvcMock.unlikeIdea).toHaveBeenCalledWith(scope.idea._id);
        });
    });

    describe('$scope.isUserLiked()', function() {

        beforeEach(function() {
            scope.idea._id = 'mock_idea';
        });

        it('should return true for a liked idea', function() {
            expect(scope.isUserLiked()).toBeTruthy();
        });

        it('should return false for other ideas', function() {
            scope.idea._id = 'not_mock_idea';
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

    describe('$scope.openLikes()', function() {

        beforeEach(function() {
            spyOn($mdDialog, 'show').and.callFake(function() {
            });
        });

        it('should open a dialog when clicked', function() {
            scope.openLikes({name: 'clickEvent'}, ['User 1', 'User 2']);

            expect($mdDialog.show).toHaveBeenCalled();
        });
    });

    describe('editing the idea', function() {
        var authorAccount = {
            id: 1,
            username: 'MainManDarth',
            name: 'Darth Vader',
            likedIdeas: [ 'mock_idea' ]
        };

        var nonAuthorAccount = {
            id: 2,
            username: 'SonOfDarth',
            name: 'Luke Skywalker',
            likedIdeas: [ 'mock_idea' ]
        };
        var mockIdea;

        beforeEach(function() {
            loginSvcMock.checkLogin(authorAccount);
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });
            spyOn(ideaSvcMock, 'updateIdea').and.callThrough();
        });

        it('should allow the author to edit the idea', function() {
            loginSvcMock.checkLogin(authorAccount);
            expect(ctrl.isUserAuthor()).toBe(true);
            ctrl.editIdea(mockIdea.title, mockIdea.description);
            expect(ideaSvcMock.updateIdea).toHaveBeenCalled();
        });

        it('should not allow someone other than the author to edit the idea', function() {
            loginSvcMock.checkLogin(nonAuthorAccount);
            expect(ctrl.isUserAuthor()).toBe(false);
            ctrl.editIdea(mockIdea.title, mockIdea.description);
            expect(ideaSvcMock.updateIdea).not.toHaveBeenCalled();
        });

        it('should allow the author to add text to the idea description', function() {
            var description = mockIdea.description;
            ctrl.editIdea(mockIdea.title, mockIdea.description + " Booyah!");
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });
            expect(mockIdea.description).toBe(description + " Booyah!");
        });

        it('should allow the author to delete text to the idea description', function() {
            var description = mockIdea.description;
            ctrl.editIdea(mockIdea.title, mockIdea.description.substr(0, 4));
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });
            expect(mockIdea.description).toBe(description.substr(0, 4));
        });

        it('should allow the author to overwrite the old idea title', function() {
            var title = mockIdea.title;
            ctrl.editIdea("New Title", mockIdea.description);
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });
            expect(mockIdea.title).not.toBe(title);
            expect(mockIdea.title).toBe("New Title");
        });

        it('should save the last edited date/time', function() {
            var now = (new Date()).toISOString();
            ctrl.editIdea(mockIdea.title, mockIdea.description);
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });
            expect(mockIdea.editedOn.substr(-7,6)).toBeCloseTo(now.substr(-7,6), 1);
        });

        it('should refresh $scope.idea with the new idea data', function() {
            ctrl.editIdea(mockIdea.title, mockIdea.description);
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });
            expect(scope.idea).toBe(mockIdea);
        });
    });

    describe('deleting the idea', function() {
        var authorAccount = {
            id: 1,
            username: 'MainManDarth',
            name: 'Darth Vader',
            likedIdeas: [ 'mock_idea' ]
        };

        var nonAuthorAccount = {
            id: 2,
            username: 'SonOfDarth',
            name: 'Luke Skywalker',
            likedIdeas: [ 'mock_idea' ]
        };
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

    describe('deleting a comment', function() {
        var authorAccount = {
            id: 1,
            username: 'MainManDarth',
            name: 'Darth Vader',
            likedIdeas: [ 'mock_idea' ]
        };

        var nonAuthorAccount = {
            id: 2,
            username: 'SonOfDarth',
            name: 'Luke Skywalker',
            likedIdeas: [ 'mock_idea' ]
        };

        var commentIndex = 0;
        var originalLength = 0;

        beforeEach(function() {
            ctrl.newComment = 'This is a test comment!';
            scope.addNewInteraction('comments');
            spyOn(ideaSvcMock, 'updateIdea').and.callThrough();
            commentIndex = scope.idea.comments.length - 1;
            originalLength = scope.idea.comments.length;
        });

        it('should allow the author to delete it', function() {
            loginSvcMock.checkLogin(authorAccount);
            expect(loginSvcMock.isUserLoggedIn()).toBe(true);
            ctrl.deleteComment(commentIndex);
            expect(ideaSvcMock.updateIdea).toHaveBeenCalled();
            expect(scope.idea.comments.length).toBe(originalLength);
            expect(scope.idea.comments[commentIndex].text).toBe("This comment was deleted");
            expect(scope.idea.comments[commentIndex].deleted).toBe(true);
        });

        it('should not allow someone other than the author to delete the idea', function() {
            loginSvcMock.checkLogin(nonAuthorAccount);
            ctrl.deleteComment(commentIndex);
            expect(ideaSvcMock.updateIdea).not.toHaveBeenCalled();
            expect(scope.idea.comments.length).toBe(originalLength);
            expect(scope.idea.comments[commentIndex].deleted).not.toBe(true);
        });
    });

    describe('forming a team', function() {
        var authorAccount = {
            id: 1,
            username: 'SciGuy',
            name: 'Rick',
            likedIdeas: [ 'mock_idea' ]
        };

        var teamLength = 0;
        var mockIdea;

        beforeEach(function() {
            loginSvcMock.checkLogin(authorAccount);
            ideaSvcMock.getIdea(null, function(idea) {
                mockIdea = idea;
            });
            // Zero out the array
            scope.idea.team = [];
            teamLength = scope.idea.team.length;
        });

        it('Should not display a team when no team exists', function() {
            expect(scope.idea.team.length).toBe(0);
        });

        it('Should allow additions and deletions of team members', function() {
            // Add backer, check team length is 0
            ctrl.newBack = 'Rick backs this idea!'; //how to add author to back?
            scope.addNewInteraction('backs');
            scope.idea.backs[teamLength].authorId = 1;

            expect(scope.idea.team.length).toBe(teamLength);
            // Add backer to team, check team length is 1
            // & Check backer's name matches the team member name
            scope.idea.backs[teamLength].isInTeam = true;
            ctrl.updateTeam();

            expect(scope.idea.team.length).toBe(teamLength + 1);
            expect(scope.idea.team[teamLength].memberId).toBe(1);
            // Remove backer from team, check team length is 0
            scope.idea.backs[teamLength].isInTeam = false;
            ctrl.updateTeam();

            expect(scope.idea.team.length).toBe(0);
        });

        it('Should correctly update the switches', function() {
            //add backer, check switch isInTeam is false
            ctrl.newBack = 'Rick backs this idea!';
            scope.addNewInteraction('backs');
            ctrl.refreshIdea();
            ctrl.updateTeam();
            ctrl.refreshTeam();

            expect(scope.idea.backs[teamLength].isInTeam).not.toBe(true);
            //add backer to team, check isInTeam is true
            scope.idea.backs[teamLength].isInTeam = true;
            ctrl.updateTeam();
            ctrl.refreshTeam();

            expect(scope.idea.backs[teamLength].isInTeam).toBe(true);
            //remove backer from team, check isInTeam is false
            scope.idea.backs[teamLength].isInTeam = false;
            ctrl.updateTeam();
            ctrl.refreshTeam();

            expect(scope.idea.backs[teamLength].isInTeam).toBe(false);
        });
    });
});
