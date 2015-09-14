describe('IdeasViewCtrl', function() {
	var scope, ctrl, $stateParams, $mdDialog, ideaSvcMock, loginSvcMock;

	beforeEach(module('flintAndSteel'));

	beforeEach(inject(function ($rootScope, $controller, _$stateParams_, _$mdDialog_, _ideaSvcMock_, _loginSvcMock_) {
		scope = $rootScope.$new();
		$stateParams = _$stateParams_;
		$mdDialog = _$mdDialog_;
		ideaSvcMock = _ideaSvcMock_;
		loginSvcMock = _loginSvcMock_;

		ctrl = $controller('IdeasViewCtrl', {
			$scope: scope,
			$stateParams: $stateParams,
			$mdDialog: $mdDialog,
			ideaSvc: ideaSvcMock,
			loginSvc: loginSvcMock
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
			expect(loginSvcMock.likeIdea).toHaveBeenCalledWith(scope.idea.id);
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
			expect(loginSvcMock.unlikeIdea).toHaveBeenCalledWith(scope.idea.id);
		});
	});

	describe('$scope.isUserLiked()', function() {

		beforeEach(function() {
			scope.idea.id = 'mock_idea';
		});

		it('should return true for a liked idea', function() {
			expect(scope.isUserLiked()).toBeTruthy();
		});

		it('should return false for other ideas', function() {
			scope.idea.id = 'not_mock_idea';
			expect(scope.isUserLiked()).not.toBeTruthy();
		});
	});

	describe('$scope.querySearch()', function() {
		var results;

		beforeEach(function() {
			results = undefined;
			scope.typeChips = ideaSvcMock.getBackTypeChips();
		});

		it('should return an empty array for an empty search', function() {
			results = scope.querySearch();
			expect(results.length).toBe(0);
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

});
