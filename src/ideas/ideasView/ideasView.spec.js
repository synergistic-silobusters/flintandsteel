/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global spyOn */

describe('IdeasViewCtrl', function() {
    "use strict";

    var scope, ctrl, $rootScope, $stateParams, $mdDialog, ideaSvcMock, userSvcMock, $state, toastSvc, sseSvcMock;

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

    beforeEach(inject(function(_$rootScope_, $controller, _$stateParams_, _$mdDialog_, _ideaSvcMock_, _userSvcMock_, _$state_, _toastSvc_, _sseSvcMock_) {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $stateParams = _$stateParams_;
        $mdDialog = _$mdDialog_;
        ideaSvcMock = _ideaSvcMock_;
        userSvcMock = _userSvcMock_;
        $state = _$state_;
        toastSvc = _toastSvc_;
        sseSvcMock = _sseSvcMock_;

        ctrl = $controller('IdeasViewCtrl', {
            $scope: scope,
            $stateParams: $stateParams,
            $mdDialog: $mdDialog,
            ideaSvc: ideaSvcMock,
            userSvc: userSvcMock,
            $state: $state,
            toastSvc: toastSvc,
            sseSvc: sseSvcMock
        });
    }));

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });

    describe('$scope.addNewInteraction()', function() {
        var content, ideaLikes, commentsLength, backsLength, updatesLength;

        beforeEach(function() {
            content = '';
            ideaLikes = 7;
            commentsLength = 3;
            backsLength = 2;
            updatesLength = 2;
        });

        it('should add a new like when the heart outline is clicked', function() {
            
            scope.addNewInteraction('likes');
            ideaSvcMock.getIdea().then(function(response) {
                expect(response.data.likes.length).toBe(ideaLikes + 1);
            });
            scope.$digest();
        });

        it('should add a new comment when comment is selected', function() {
            ctrl.newComment = 'This is a test comment!';

            scope.addNewInteraction('comments');

            ideaSvcMock.getIdea().then(function(response) {
                expect(response.data.comments.length).toBe(commentsLength + 1);
                expect(response.data.comments[commentsLength].text).toBe('This is a test comment!');
            });
            scope.$digest();
        });

        it('should add a new back with no tags', function() {
            ctrl.newBack = 'This is a test back!';

            scope.addNewInteraction('backs');

            ideaSvcMock.getIdea().then(function(response) {
                expect(response.data.backs.length).toBe(backsLength + 1);
                expect(response.data.backs[backsLength].text).toBe('This is a test back!');
                expect(response.data.backs[backsLength].types.length).toBe(0);
            });
            scope.$digest();
        });

        it('should add a new back with two tags', function() {
            ctrl.newBack = 'This is a test back!';
            scope.selectedTypes = [{ name: 'Experience' }, { name: 'Funding' }];

            scope.addNewInteraction('backs');

            ideaSvcMock.getIdea().then(function(response) {
                expect(response.data.backs.length).toBe(backsLength + 1);
                expect(response.data.backs[backsLength].text).toBe('This is a test back!');
                expect(response.data.backs[backsLength].types.length).toBe(2);
                expect(response.data.backs[backsLength].types[0].name).toBe('Experience');
                expect(response.data.backs[backsLength].types[1].name).toBe('Funding');
            });
            scope.$digest();
        });

        it('should add a new update when update is selected', function() {
            ctrl.newUpdate = 'This is a test update!';

            scope.addNewInteraction('updates');

            ideaSvcMock.getIdea().then(function(response) {
                expect(response.data.updates.length).toBe(updatesLength + 1);
                expect(response.data.updates[updatesLength].text).toBe('This is a test update!');
            });
            scope.$digest();
        });
    });

    describe('$scope.removeInteraction()', function() {
        var ideaLikes, commentsLength, backsLength, updatesLength;

        beforeEach(function() {
            userSvcMock.checkLogin(authorAccount);

            scope.addNewInteraction('likes');
            ideaLikes = 7;

            ctrl.newComment = 'This is a test comment!';
            scope.addNewInteraction('comments');
            commentsLength = 3;

            ctrl.newBack = 'This is a test back!';
            scope.selectedTypes = [{ name: 'Experience' }, { name: 'Funding' }];
            scope.addNewInteraction('backs');
            backsLength = 2;

            ctrl.newUpdate = 'This is a test update!';
            scope.addNewInteraction('updates');
            updatesLength = 2;
        });

        it('should remove a new like when the solid heart is clicked', function() {
            scope.removeInteraction('likes');

            ideaSvcMock.getIdea().then(function(response) {
                expect(response.data.likes.length).toBe(ideaLikes);
            });
            scope.$digest();
        });

        it('should remove a specific comment the author posted', function() {
            scope.removeInteraction('comments', ideaSvcMock.mockData.comments[commentsLength]);

            ideaSvcMock.getIdea().then(function(response) {
                expect(response.data.comments.length).toBe(commentsLength);
            });
            scope.$digest();
        });

        it('should remove a specific back the author posted', function() {
            scope.removeInteraction('backs', ideaSvcMock.mockData.backs[backsLength]);

            ideaSvcMock.getIdea().then(function(response) {
                expect(response.data.backs.length).toBe(backsLength);
            });
            scope.$digest();
        });

        it('should remove a specific update the author posted', function() {
            scope.removeInteraction('updates', ideaSvcMock.mockData.updates[updatesLength]);
            ideaSvcMock.getIdea().then(function(response) {
                expect(response.data.updates.length).toBe(updatesLength);
            });
            scope.$digest();
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

    describe('editing the idea', function() {
        var mockIdea;

        beforeEach(function() {
            userSvcMock.checkLogin(authorAccount);
            ideaSvcMock.getIdea().then(function(idea) {
                mockIdea = idea;
            });
            scope.$digest();
            spyOn(ideaSvcMock, 'editIdea').and.callThrough();
        });

        it('should allow the author to edit the idea', function() {
            userSvcMock.checkLogin(authorAccount);
            expect(ctrl.isUserAuthor()).toBe(true);
            ctrl.editIdea(mockIdea.title, mockIdea.description, mockIdea.tags);
            expect(ideaSvcMock.editIdea).toHaveBeenCalled();
        });

        it('should not allow someone other than the author to edit the idea', function() {
            userSvcMock.checkLogin(nonAuthorAccount);
            expect(ctrl.isUserAuthor()).toBe(false);
            ctrl.editIdea(mockIdea.title, mockIdea.description, mockIdea.tags);
            expect(ideaSvcMock.editIdea).not.toHaveBeenCalled();
        });

        it('should allow the author to add text to the idea description', function() {
            var description = mockIdea.description;
            ctrl.editIdea(mockIdea.title, mockIdea.description + " Booyah!", mockIdea.tags);
            ideaSvcMock.getIdea().then(function(idea) {
                expect(idea.description).toBe(description + " Booyah!");
            });
        });

        it('should allow the author to delete text to the idea description', function() {
            var description = mockIdea.description;
            ctrl.editIdea(mockIdea.title, ideaSvcMock.mockData.description.substr(0, 4), mockIdea.tags);
            ideaSvcMock.getIdea().then(function(idea) {
                expect(idea.description).toBe(description.substr(0, 4));
            });
        });

        it('should allow the author to overwrite the old idea title', function() {
            var title = mockIdea.title;
            ctrl.editIdea("New Title", mockIdea.description, mockIdea.tags);
            ideaSvcMock.getIdea().then(function(idea) {
                expect(idea.title).not.toBe(title);
                expect(idea.title).toBe("New Title");
            });
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
            ideaSvcMock.getIdea().then(function(idea) {
                expect(idea.timeModified.substr(-7,6)).toBeCloseTo(now.substr(-7,6), 1);
            });
        });

        it('should refresh $scope.idea with the new idea data', function() {
            ctrl.editIdea(mockIdea.title, mockIdea.description, mockIdea.tags);
            ideaSvcMock.getIdea().then(function(idea) {
                expect(idea).toBe(mockIdea);
            });
        });
    });

    describe('deleting the idea', function() {
        var mockIdea;

        beforeEach(function() {
            userSvcMock.checkLogin(authorAccount);
            ideaSvcMock.getIdea().then(function(idea) {
                mockIdea = idea;
            });
            scope.$digest();
            spyOn(ideaSvcMock, 'deleteIdea').and.callThrough();
        });

        it('should allow the author to delete the idea', function() {
            userSvcMock.checkLogin(authorAccount);
            expect(userSvcMock.isUserLoggedIn()).toBe(true);
            ctrl.deleteIdea();
            expect(ideaSvcMock.deleteIdea).toHaveBeenCalled();
        });

        it('should not allow someone other than the author to delete the idea', function() {
            userSvcMock.checkLogin(nonAuthorAccount);
            ctrl.deleteIdea();
            expect(ideaSvcMock.deleteIdea).not.toHaveBeenCalled();
        });
    });

    describe('deleting a comment', function() {
        var commentIndex = 0;
        var originalLength = 0;

        beforeEach(function() {
            ctrl.newComment = 'This is a test comment!';
            scope.addNewInteraction('comments');
            spyOn(ideaSvcMock, 'deleteComment').and.callThrough();
            commentIndex = 3;
            originalLength = 4;
        });

        it('should allow the author to delete it', function() {
            userSvcMock.checkLogin(authorAccount);
            expect(userSvcMock.isUserLoggedIn()).toBe(true);
            scope.removeInteraction("comments", ideaSvcMock.mockData.comments[commentIndex]);
            expect(ideaSvcMock.deleteComment).toHaveBeenCalled();
            ideaSvcMock.getIdea().then(function(response) {
                expect(response.data.comments.length).toBe(originalLength - 1);
            });
            scope.$digest();
        });

        it('should not allow someone other than the author to delete the idea', function() {
            userSvcMock.checkLogin(nonAuthorAccount);
            scope.removeInteraction("comments", ideaSvcMock.mockData.comments[commentIndex]);
            expect(ideaSvcMock.deleteComment).not.toHaveBeenCalled();
            ideaSvcMock.getIdea().then(function(response) {
                expect(response.data.comments.length).toBe(originalLength);
            });
            scope.$digest();
        });
    });

    describe('deleting an update', function() {
        var updateIndex = 0;
        var originalLength = 0;
        var mockIdea;

        beforeEach(function() {
            ctrl.newUpdate = 'This is a test update!';
            scope.addNewInteraction('updates');
            spyOn(ideaSvcMock, 'removeInteraction').and.callThrough();
            ideaSvcMock.getIdea().then(function(idea) {
                mockIdea = idea;
            });
            scope.$digest();
            updateIndex = 2;
            originalLength = 3;
        });

        it('should allow the author to delete it', function() {
            userSvcMock.checkLogin(authorAccount);
            scope.removeInteraction('updates', ideaSvcMock.mockData.updates[updateIndex]);
            expect(ideaSvcMock.removeInteraction).toHaveBeenCalled();
            expect(scope.idea.updates.length).toBe(updateIndex);
        });

        it('should not allow someone other than the author to delete the udpate', function() {
            userSvcMock.checkLogin(nonAuthorAccount);
            scope.removeInteraction('updates', ideaSvcMock.mockData.updates[updateIndex]);
            expect(ideaSvcMock.removeInteraction).not.toHaveBeenCalled();
            ideaSvcMock.getIdea().then(function(response) {
                expect(response.data.updates.length).toBe(originalLength);
            });
        });
    });

    describe('editing a back', function() {
        var backIndex = 0;

        beforeEach(function() {
            ctrl.newBack = 'This is a test back!';
            scope.addNewInteraction('backs');
            spyOn(ideaSvcMock, 'editBack').and.callThrough();
            backIndex = 2;
        });

        it('should allow the author to edit it', function() {
            userSvcMock.checkLogin(authorAccount);
            expect(userSvcMock.isUserLoggedIn()).toBe(true);
            ctrl.editBackText = "This back was edited!";
            ctrl.editBack(ideaSvcMock.mockData.backs[backIndex]);
            expect(ideaSvcMock.editBack).toHaveBeenCalled();
            ideaSvcMock.getIdea().then(function(response) {
                expect(response.data.backs[backIndex].text).toBe("This back was edited!");
            });
            scope.$digest();
        });

        it('should not allow someone other than the author to edit the back', function() {
            userSvcMock.checkLogin(nonAuthorAccount);
            ctrl.editBack(ideaSvcMock.mockData.backs[backIndex]);
            expect(ideaSvcMock.editBack).not.toHaveBeenCalled();
        });
    });

    describe('deleting a back', function() {
        var backIndex = 0;
        var mockIdea;

        beforeEach(function() {
            ctrl.newBack = 'This is a test back!';
            scope.addNewInteraction('backs');
            spyOn(ideaSvcMock, 'removeInteraction').and.callThrough();
            spyOn($mdDialog, 'show').and.callThrough();
            ideaSvcMock.getIdea().then(function(idea) {
                mockIdea = idea;
            });
            scope.$digest();
            backIndex = 2;
        });

        it('should allow the author to delete the back', function() {
            userSvcMock.checkLogin(authorAccount);
            scope.removeInteraction('backs', scope.idea.backs[backIndex]);
            expect(ideaSvcMock.removeInteraction).toHaveBeenCalled();
            expect(scope.idea.backs.length).toBe(backIndex);
        });

        it('should not allow someone other than the author to delete the back', function() {
            userSvcMock.checkLogin(nonAuthorAccount);
            scope.removeInteraction('backs', scope.idea.updates[backIndex]);
            expect(ideaSvcMock.removeInteraction).not.toHaveBeenCalled();
            expect(scope.idea.backs.length).toBe(backIndex + 1);
        });

        it('show ask for confirmation', function() {
            userSvcMock.checkLogin(authorAccount);
            scope.removeBack();
            expect($mdDialog.show).toHaveBeenCalled();
        });
    });

    describe('forming a team', function() {
        var teamLength = 0;
        var mockIdea;

        beforeEach(function() {
            userSvcMock.checkLogin(authorAccount);
            ideaSvcMock.getIdea(null).then(function(idea) {
                mockIdea = idea;
            });
            scope.$digest();
            // Zero out the array
            scope.idea.team = [];
            teamLength = scope.idea.team.length;
            spyOn(ideaSvcMock, 'removeInteraction').and.callThrough();
            spyOn($mdDialog, 'show').and.callThrough();
            spyOn(userSvcMock, 'checkLogin').and.callThrough();
        });

        it('Should not display a team when no team exists', function() {
            expect(scope.idea.team.length).toBe(0);
        });

        it('Should allow additions and deletions of team members', function() {
            // Add backer, check team length is 0
            ctrl.newBack = 'Rick backs this idea!';
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

        it('Should return the correct user highlighted', function() {
            // Track the number of backs
            var backLength = scope.idea.backs.length;
            //Set up first adding a single user to the team
            ctrl.newBack = 'Rick backs this idea!';
            scope.addNewInteraction('backs');
            scope.idea.backs[backLength].authorId = 1;
            scope.idea.backs[backLength].isInTeam = true;
            ctrl.updateTeam();
            expect(scope.idea.backs[backLength].isInTeam).toBe(true);

            // Up the back length
            backLength++;
            // Variable to reference a member in the team
            var index = 0;
            //pass in index and verify it is the user we want
            expect(ctrl.isUserExactMemberOfTeam(index)).toBe(true);

            // Increment index
            index++;
            ctrl.newBack = 'Rick backs this idea!';
            scope.addNewInteraction('backs');
            scope.idea.backs[backLength].authorId = 2;
            scope.idea.backs[backLength].isInTeam = true;

            backLength++;

            ctrl.updateTeam();
            //pass in a second index and verify it is not our user
            expect(ctrl.isUserExactMemberOfTeam(index)).toBe(false);
        });

        it('Should warn about removing back', function() {
            ctrl.newBack = 'Rick backs this idea!';
            scope.addNewInteraction('backs');
            scope.idea.backs[teamLength].isInTeam = true;
            ctrl.updateTeam();

            // Should be one member on the team
            expect(scope.idea.team.length).toBe(1);

            // Notify that a warning was given before removing back
            ctrl.removeSelfFromTeam();
            expect($mdDialog.show).toHaveBeenCalled();
        });

        it('Should delete back when removing from team', function() {
            ctrl.newBack = 'Rick backs this idea!';
            scope.addNewInteraction('backs');
            scope.idea.backs[teamLength].isInTeam = true;
            ctrl.updateTeam();
            var backLength = scope.idea.backs.length;

            // Should be one member on the team
            expect(scope.idea.team.length).toBe(1);

            // Remove user from the team and verify the team is empty
            userSvcMock.checkLogin(authorAccount);
            ctrl.removeSelfFromTeam();
            expect($mdDialog.show).toHaveBeenCalled();
            scope.removeInteraction('backs', scope.idea.backs[backLength - 1]);
            ctrl.removeUserFromTeam(scope.idea.backs[teamLength]);
            expect(scope.idea.team.length).toBe(0);
            expect(scope.idea.backs.length).toBe(backLength - 1);
        });

        it('Should not work if not author of idea', function() {
            ctrl.newBack = 'Rick backs this idea!';
            scope.addNewInteraction('backs');
            scope.idea.backs[teamLength].isInTeam = true;
            ctrl.updateTeam();
            var backLength = scope.idea.backs.length;

            // Should be one member on the team
            expect(scope.idea.team.length).toBe(1);

            // Remove user from the team and verify the team is not empty
            userSvcMock.checkLogin(nonAuthorAccount);
            ctrl.removeSelfFromTeam();
            expect($mdDialog.show).not.toHaveBeenCalled();
            expect(scope.idea.team.length).toBe(1);
            expect(scope.idea.backs.length).toBe(backLength);
        });
    });
});
